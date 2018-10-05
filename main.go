package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/Sirupsen/logrus"
	"github.com/cyverse-de/configurate"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/machinebox/graphql"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

var log = logrus.WithFields(logrus.Fields{
	"service": "cas-proxy",
	"art-id":  "cas-proxy",
	"group":   "org.cyverse",
})

func init() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
}

const sessionName = "proxy-session"
const sessionKey = "proxy-session-key"

// CASProxy contains the application logic that handles authentication, session
// validations, ticket validation, and request proxying.
type CASProxy struct {
	casBase                  string // base URL for the CAS server
	casValidate              string // The path to the validation endpoint on the CAS server.
	resourceType             string // The resource type for analysis.
	resourceName             string // The UUID of the analysis.
	subjectType              string // The subject type for a user.
	ingressURL               string // The URL to the cluster ingress.
	appExposerHeader         string // The Host header for hitting the app-exposer service.
	accessHeader             string // The Host header for checking resource access perms.
	analysisHeader           string // The Host header for getting the analysis ID.
	viceDomain               string // The domain for VICE apps.
	sessionStore             *sessions.CookieStore
	refreshEnabled           bool   // Whether or not to look up information through the graphql server.
	graphqlBase              string // The base URL to the graphql server.
	disableCustomHeaderMatch bool   // Disables matching domains based on the X-Frontend-Url header. Host header is used instead.

}

// Analysis contains the ID for the Analysis, which gets used as the resource
// name when checking permissions.
type Analysis struct {
	ID string `json:"id"` // Literally all we care about here.
}

// Analyses is a list of analyses returned by the apps service.
type Analyses struct {
	Analyses []Analysis `json:"analyses"`
}

func (c *CASProxy) getResourceName(externalID string) (string, error) {
	bodymap := map[string]string{}
	bodymap["external_id"] = externalID

	body, err := json.Marshal(bodymap)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, c.ingressURL, bytes.NewReader(body))
	if err != nil {
		return "", err
	}

	req.Host = c.analysisHeader

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	analysis := &Analysis{}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if err = json.Unmarshal(b, analysis); err != nil {
		return "", err
	}

	if analysis.ID == "" {
		return "", errors.New("no analyses found")
	}

	return analysis.ID, nil
}

// Resource is an item that can have permissions attached to it in the
// permissions service.
type Resource struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Type string `json:"resource_type"`
}

// Subject is an item that accesses resources contained in the permissions
// service.
type Subject struct {
	ID        string `json:"id"`
	SubjectID string `json:"subject_id"`
	SourceID  string `json:"subject_source_id"`
	Type      string `json:"subject_type"`
}

// Permission is an entry from the permissions service that tells what access
// a subject has to a resource.
type Permission struct {
	ID       string   `json:"id"`
	Level    string   `json:"permission_level"`
	Resource Resource `json:"resource"`
	Subject  Subject  `json:"subject"`
}

// PermissionList contains a list of permissions returned by the permissions
// service.
type PermissionList struct {
	Permissions []Permission `json:"permissions"`
}

// IsAllowed will return true if the user is allowed to access the running app
// and false if they're not. An error might be returned as well. Access should
// be denied if an error is returned, even if the boolean return value is true.
func (c *CASProxy) IsAllowed(user, resource string) (bool, error) {
	bodymap := map[string]string{
		"subject":  user,
		"resource": resource,
	}

	body, err := json.Marshal(bodymap)
	if err != nil {
		return false, err
	}

	request, err := http.NewRequest(http.MethodPost, c.ingressURL, bytes.NewReader(body))
	if err != nil {
		return false, err
	}

	request.Host = c.accessHeader

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return false, err
	}

	l := &PermissionList{
		Permissions: []Permission{},
	}

	if err = json.Unmarshal(b, l); err != nil {
		return false, err
	}

	if len(l.Permissions) > 0 {
		if l.Permissions[0].Level != "" {
			return true, nil
		}
	}

	return false, nil
}

// FrontendAddress returns the appropriate host[:port] to use for various
// operations. If the --disable-custom-header-match flag is true, then the Host
// header in the request is returned. If it's false, the custom X-Frontend-Url
// header is returned.
func (c *CASProxy) FrontendAddress(r *http.Request) string {
	if c.disableCustomHeaderMatch {
		u := &url.URL{}
		if r.TLS != nil {
			u.Scheme = "https"
		} else {
			u.Scheme = "http"
		}
		u.Host = r.Host
		u.Path = r.URL.Path
		u.RawQuery = r.URL.RawQuery
		return u.String()
	}
	return r.Header.Get("X-Frontend-Url")
}

// ValidateTicket will validate a CAS ticket against the configured CAS server.
func (c *CASProxy) ValidateTicket(w http.ResponseWriter, r *http.Request) {
	casURL, err := url.Parse(c.casBase)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse CAS base URL %s", c.casBase)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Make sure the path in the CAS params is the same as the one that was
	// requested.
	frontendURL := c.FrontendAddress(r)
	svcURL, err := url.Parse(frontendURL)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse the frontend URL %s", frontendURL)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Ensure that the service path and the query params are set to the incoming
	// request's values for those fields.
	svcURL.Path = r.URL.Path
	sq := r.URL.Query()
	sq.Del("ticket") // Remove the ticket from the service URL. Redirection loops occur otherwise.
	svcURL.RawQuery = sq.Encode()

	// The request URL for CAS ticket validation needs to have the service and
	// ticket in it.
	casURL.Path = path.Join(casURL.Path, c.casValidate)
	q := casURL.Query()
	q.Add("service", svcURL.String())
	q.Add("ticket", r.URL.Query().Get("ticket"))
	casURL.RawQuery = q.Encode()

	// Actually validate the ticket.
	resp, err := http.Get(casURL.String())
	if err != nil {
		err = errors.Wrap(err, "ticket validation error")
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	// If this happens then something went wrong on the CAS side of things. Doesn't
	// mean the ticket is invalid, just that the CAS server is in a state where
	// we can't trust the response.
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		err = errors.Wrapf(err, "ticket validation status code was %d", resp.StatusCode)
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		err = errors.Wrap(err, "error reading body of CAS response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// This is where the actual ticket validation happens. If the CAS server
	// returns 'no\n\n' in the body, then the validation was not successful. The
	// HTTP status code will be in the 200 range regardless of the validation
	// status.
	if bytes.Equal(b, []byte("no\n\n")) {
		err = fmt.Errorf("ticket validation response body was %s", b)
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	fields := bytes.Fields(b)
	if len(fields) < 2 {
		err = errors.New("not enough fields in ticket validation response body")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	username := string(fields[1])

	// Store a session, hopefully to short-circuit the CAS redirect dance in later
	// requests. The max age of the cookie should be less than the lifetime of
	// the CAS ticket, which is around 10+ hours. This means that we'll be hitting
	// the CAS server fairly often. Adjust the max age to rate limit requests to
	// CAS.
	var s *sessions.Session
	s, err = c.sessionStore.Get(r, sessionName)
	if err != nil {
		err = errors.Wrap(err, "error getting session")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	s.Values[sessionKey] = username
	s.Save(r, w)

	http.Redirect(w, r, svcURL.String(), http.StatusFound)
}

// ResetSessionExpiration should reset the session expiration time.
func (c *CASProxy) ResetSessionExpiration(w http.ResponseWriter, r *http.Request) error {
	session, err := c.sessionStore.Get(r, sessionName)
	if err != nil {
		return err
	}

	msg, ok := session.Values[sessionKey]
	if !ok {
		return errors.New("session value not found")
	}

	session.Values[sessionKey] = msg.(string)
	session.Save(r, w)
	return nil
}

// NeedsSession implements the mux.Matcher interface so that requests can be routed
// based on cookie existence.
func (c *CASProxy) NeedsSession(r *http.Request, m *mux.RouteMatch) bool {
	session, err := c.sessionStore.Get(r, sessionName)
	if err != nil {
		return true
	}

	sessionValue, ok := session.Values[sessionKey]
	if !ok {
		return true
	}
	msg := sessionValue.(string)
	if msg == "" {
		log.Infof("session value was empty instead of a username")
		return true
	}

	return false
}

// URLMatches returns true if the given URL is a subdomain of the configured
// VICE domain.
func (c *CASProxy) URLMatches(url string) (bool, error) {
	r := fmt.Sprintf("(a.*\\.)?\\Q%s\\E(:[0-9]+)?", c.viceDomain)
	matched, err := regexp.MatchString(r, url)
	if err != nil {
		return false, err
	}
	return matched, nil
}

// ViceSubdomain returns true if the provided URL is a subdomain in the
// configured VICE domain.
func (c *CASProxy) ViceSubdomain(url string) (bool, error) {
	matched, err := c.URLMatches(url)
	if err != nil {
		return false, err
	}
	return matched, nil
}

// extractSubdomain returns the subdomain part of the URL.
func extractSubdomain(jobURL string) (string, error) {
	u, err := url.Parse(jobURL)
	if err != nil {
		return "", err
	}
	fields := strings.Split(u.Hostname(), ".")
	if len(fields) < 2 {
		return "", nil
	}
	if len(fields) == 2 {
		if fields[0] == "www" {
			return "", nil
		}
		return fields[0], nil
	}
	return strings.Join(fields[:len(fields)-2], "."), nil
}

// IngressExists uses the app-exposer service to figure out if the provided
// subdomain exists as an Ingress in the K8s cluster.
func (c *CASProxy) IngressExists(subdomain string) (bool, error) {
	ingressURL, err := url.Parse(c.ingressURL)
	if err != nil {
		return false, err
	}
	ingressURL.Path = filepath.Join(ingressURL.Path, fmt.Sprintf("/ingress/%s", subdomain))

	request, err := http.NewRequest(http.MethodGet, ingressURL.String(), nil)
	if err != nil {
		return false, err
	}

	request.Host = c.appExposerHeader

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		return false, nil
	}
	return true, nil
}

// Endpoint contains endpoint data for a VICE app.
type Endpoint struct {
	IP   string
	Port int
}

// EndpointConfig uses the app-exposer service to get the IP address and port
// for the VICE app.
func (c *CASProxy) EndpointConfig(subdomain string) (*Endpoint, error) {
	ingressURL, err := url.Parse(c.ingressURL)
	if err != nil {
		return nil, err
	}
	ingressURL.Path = filepath.Join(ingressURL.Path, fmt.Sprintf("/endpoint/%s", subdomain))

	request, err := http.NewRequest(http.MethodGet, ingressURL.String(), nil)
	if err != nil {
		return nil, err
	}

	request.Host = c.appExposerHeader

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		err = errors.Wrap(err, "error reading body of endpoint response")
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		log.Errorf("Status code %d error from app-exposer /endpoint/%s: %s", resp.StatusCode, subdomain, string(b))
		return nil, fmt.Errorf("non-2XX status code returned: %d", resp.StatusCode)
	}

	ept := &Endpoint{}
	if err = json.Unmarshal(b, ept); err != nil {
		return nil, errors.Wrapf(err, "error unmarshalling endpoint data for %s", subdomain)
	}

	return ept, nil
}

const lookupExternalUUIDQuery = `
query ExternalID($subdomain: String) {
	jobs(where: {subdomain: {_eq: $subdomain}}) {
		steps: jobStepssByjobId {
			external_id
		}
	}
}
`

// lookupExternalUUID returns the external job UUID associated with the
// subdomain.
func (c *CASProxy) lookupExternalUUID(subdomain string) (string, error) {
	var (
		err error
		ok  bool
	)

	client := graphql.NewClient(c.graphqlBase)
	req := graphql.NewRequest(lookupExternalUUIDQuery)
	req.Var("subdomain", subdomain)

	data := map[string][]map[string][]map[string]string{}

	if err = client.Run(context.Background(), req, &data); err != nil {
		return "", nil
	}

	if _, ok = data["jobs"]; !ok {
		return "", fmt.Errorf("missing jobs field for subdomain %s", subdomain)
	}

	if len(data["jobs"]) < 1 {
		return "", fmt.Errorf("no jobs returned")
	}

	if _, ok = data["jobs"][0]["steps"][0]["external_id"]; !ok {
		return "", fmt.Errorf("missing external_id for job with subdomain '%s'; data => '%+v'", subdomain, data)
	}
	return data["jobs"][0]["steps"][0]["external_id"], nil
}

const lookupJobStatusUpdatesQuery = `
query StatusUpdates($external_id: String) {
  job_status_updates(
    where: {
      external_id: {_eq: $external_id}
    },
    order_by: sent_on_desc
  ) {
    id
    status
    message
    sentOn: sent_on
  }
}
`

// JobStatusUpdate contains the fields we need/want from a job status update.
type JobStatusUpdate struct {
	Status  string `json:"status"`
	SentOn  int64  `json:"sentOn"`
	UUID    string `json:"id"`
	Message string `json:"message"`
}

// LookupJobStatusUpdates returns the list of job status updates in reverse
// chronological order.
func (c *CASProxy) LookupJobStatusUpdates(w http.ResponseWriter, r *http.Request) {
	u := r.FormValue("url")

	valid, err := c.ViceSubdomain(u)
	if err != nil {
		http.Error(w, fmt.Sprintf("error validating URL %s: %s", u, err.Error()), http.StatusInternalServerError)
		return
	}
	if !valid {
		http.Error(w, fmt.Sprintf("URL %s is not a valid domain", u), http.StatusBadRequest)
		return
	}

	subdomain, err := extractSubdomain(u)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting subdomain for URL %s", u), http.StatusInternalServerError)
		return
	}
	if subdomain == "" {
		http.Error(w, fmt.Sprintf("empty subdomain for URL '%s'", u), http.StatusBadRequest)
		return
	}

	externalID, err := c.lookupExternalUUID(subdomain)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting external UUID for subdomain %s", subdomain), http.StatusInternalServerError)
		return
	}
	if externalID == "" {
		http.Error(w, fmt.Sprintf("empty external UUID for subdomain %s", subdomain), http.StatusInternalServerError)
		return
	}

	client := graphql.NewClient(c.graphqlBase)
	req := graphql.NewRequest(lookupJobStatusUpdatesQuery)
	req.Var("external_id", externalID)

	data := map[string][]JobStatusUpdate{}

	if err = client.Run(context.Background(), req, &data); err != nil {
		http.Error(w, fmt.Sprintf("error from job status updates query for subdomain %s: %s", subdomain, err), http.StatusInternalServerError)
		return
	}

	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, fmt.Sprintf("error marshalling response from job status updates query for subdomain %s: %s", subdomain, err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, string(js))
}

// URLIsReady returns true if the Ingress for the provided URL exists and if a
// connection attempt to the Endpoint for the Ingress succeeds.
func (c *CASProxy) URLIsReady(w http.ResponseWriter, r *http.Request) {
	u := r.FormValue("url")
	fmt.Println(u)

	valid, err := c.ViceSubdomain(u)
	if err != nil {
		http.Error(w, fmt.Sprintf("error validating URL %s: %s", u, err.Error()), http.StatusInternalServerError)
		return
	}
	if !valid {
		http.Error(w, fmt.Sprintf("URL %s is not a valid domain", u), http.StatusBadRequest)
		return
	}

	subdomain, err := extractSubdomain(u)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting subdomain for URL %s", u), http.StatusBadRequest)
		return
	}
	if subdomain == "" {
		http.Error(w, fmt.Sprintf("empty subdomain for URL '%s'", u), http.StatusBadRequest)
		return
	}

	var ready bool
	ready, err = c.IngressExists(subdomain)
	if err != nil {
		http.Error(w, fmt.Sprintf("error checking ingress %s existence: %s", subdomain, err.Error()), http.StatusInternalServerError)
		return
	}

	var ept *Endpoint
	if ready {
		ept, err = c.EndpointConfig(subdomain)
		if err != nil {
			log.Error(err)
			ready = false
		}
	}

	if ready {
		var conn net.Conn
		conn, err = net.Dial("tcp", fmt.Sprintf("%s:%d", ept.IP, ept.Port))
		if err != nil {
			ready = false
		}
		conn.Close()
		defer conn.Close()
	}

	if ready {
		httpclient := &http.Client{
			CheckRedirect: func(r *http.Request, via []*http.Request) error {
				return http.ErrUseLastResponse
			},
		}
		var resp *http.Response
		resp, err = httpclient.Get(u)
		if err != nil {
			ready = false
		}
		if resp.StatusCode < 200 && resp.StatusCode > 399 {
			ready = false
		}
	}

	responseData := map[string]bool{
		"ready": ready,
	}
	js, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, fmt.Sprintf("error marshalling json: %s", err.Error()), http.StatusInternalServerError)
		return
	}
	fmt.Fprintln(w, string(js))
}

// RedirectToCAS redirects the request to CAS, setting the service query
// parameter to the value in frontendURL.
func (c *CASProxy) RedirectToCAS(w http.ResponseWriter, r *http.Request) {
	casURL, err := url.Parse(c.casBase)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse CAS base URL %s", c.casBase)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Make sure the path in the CAS params is the same as the one that was
	// requested.
	frontendURL := c.FrontendAddress(r)
	svcURL, err := url.Parse(frontendURL)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse the frontend URL %s", frontendURL)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Make sure the serivce path and the query params are set to the incoming
	// requests values for those fields.
	svcURL.Path = r.URL.Path
	svcURL.RawQuery = r.URL.RawQuery

	//set the service query param in the casURL.
	q := casURL.Query()
	q.Add("service", svcURL.String())
	casURL.RawQuery = q.Encode()
	casURL.Path = path.Join(casURL.Path, "login")

	// perform the redirect
	http.Redirect(w, r, casURL.String(), http.StatusPermanentRedirect)
}

// SiteHandler is a basic handler for testing CAS support
func (c *CASProxy) SiteHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "This is a site.")
}

// isWebsocket returns true if the connection is a websocket request. Adapted
// from the code at https://groups.google.com/d/msg/golang-nuts/KBx9pDlvFOc/0tR1gBRfFVMJ.
func (c *CASProxy) isWebsocket(r *http.Request) bool {
	connectionHeader := ""
	allHeaders := r.Header["Connection"]
	if len(allHeaders) > 0 {
		connectionHeader = allHeaders[0]
	}

	upgrade := false
	if strings.Contains(strings.ToLower(connectionHeader), "upgrade") {
		if len(r.Header["Upgrade"]) > 0 {
			upgrade = (strings.ToLower(r.Header["Upgrade"][0]) == "websocket")
		}
	}
	return upgrade
}

const defaultConfig = `
k8s:
	app-exposer:
		base: http://localhost
		header: app-exposer
	get-analysis-id:
		header: get-analysis-id
	check-resource-access:
		header: check-resource-access

`

func main() {
	var (
		err                      error
		cfg                      *viper.Viper
		viceDomain               string
		configPath               = flag.String("config", "/etc/iplant/de/jobservices.yml", "The path to the config file.")
		listenAddr               = flag.String("listen-addr", "0.0.0.0:60000", "The listen port number.")
		casBase                  = flag.String("cas-base-url", "", "The base URL to the CAS host.")
		casValidate              = flag.String("cas-validate", "validate", "The CAS URL endpoint for validating tickets.")
		maxAge                   = flag.Int("max-age", 0, "The idle timeout for session, in seconds.")
		sslCert                  = flag.String("ssl-cert", "", "Path to the SSL .crt file.")
		sslKey                   = flag.String("ssl-key", "", "Path to the SSL .key file.")
		ingressURL               = flag.String("ingress-url", "", "The URL to the cluster ingress.")
		analysisHeader           = flag.String("analysis-header", "", "The Host header for the ingress service that gets the analysis ID.")
		appExposerHeader         = flag.String("app-exposer-header", "", "The Host header value for the app-exposer service.")
		accessHeader             = flag.String("access-header", "", "The Host header for the ingress service that checks analysis access.")
		viceBaseURL              = flag.String("vice-base-url", "", "The domain for the VICE apps.")
		disableAutoRefresh       = flag.Bool("disable-auto-refresh", false, "Turns off the auto-refresh feature on the loading page, which avoids hitting the graphql server.")
		graphqlBase              = flag.String("graphql", "http://graphql-de/v1alpha1/graphql", "The base URL for the graphql provider.")
		staticFilePath           = flag.String("static-file-path", "./build", "Path to static file assets.")
		disableCustomHeaderMatch = flag.Bool("disable-custom-header-match", false, "Disables usage of the X-Frontend-Url header for subdomain matching. Use Host header instead. Useful during development.")
	)

	flag.Parse()

	// make sure the configuration object has sane defaults.
	if cfg, err = configurate.InitDefaults(*configPath, defaultConfig); err != nil {
		log.Fatal(err)
	}

	casBaseCfg := cfg.GetString("cas.base")
	if *casBase == "" && casBaseCfg == "" {
		log.Fatal("--cas-base-url or cas.base must be set.")
	}
	if *casBase == "" && casBaseCfg != "" {
		*casBase = casBaseCfg
	}

	ingressURLCfg := cfg.GetString("k8s.app-exposer.base")
	if *ingressURL == "" && ingressURLCfg == "" {
		log.Fatal("--ingress-url or k8s.app-exposer.base must be set.")
	}
	if *ingressURL == "" && ingressURLCfg != "" {
		*ingressURL = ingressURLCfg
	}

	appExposerHeaderCfg := cfg.GetString("k8s.app-exposer.header")
	if *appExposerHeader == "" && appExposerHeaderCfg == "" {
		log.Fatal("--app-exposer-header or k8s.app-exposer.header must be set.")
	}
	if *appExposerHeader == "" && appExposerHeaderCfg != "" {
		*appExposerHeader = appExposerHeaderCfg
	}

	analysisHeaderCfg := cfg.GetString("k8s.get-analysis-id.header")
	if *analysisHeader == "" && analysisHeaderCfg == "" {
		log.Fatal("--analysis-header or k8s.get-analysis-id.header must be set.")
	}
	if *analysisHeader == "" && analysisHeaderCfg != "" {
		*analysisHeader = analysisHeaderCfg
	}

	accessHeaderCfg := cfg.GetString("k8s.check-resource-access.header")
	if *accessHeader == "" && accessHeaderCfg == "" {
		log.Fatal("--access-header or k8s.check-resource-access.header must be set.")
	}
	if *accessHeader == "" && accessHeaderCfg != "" {
		*accessHeader = accessHeaderCfg
	}

	viceBaseURLCfg := cfg.GetString("k8s.frontend.base")
	if *viceBaseURL == "" && viceBaseURLCfg == "" {
		log.Fatal("--vice-base-url or k8s.frontend.base must be set.")
	}
	if *viceBaseURL == "" && viceBaseURLCfg != "" {
		*viceBaseURL = viceBaseURLCfg
	}
	vu, err := url.Parse(*viceBaseURL)
	if err != nil {
		log.Fatal(err)
	}
	viceDomain = vu.Host

	useSSL := false
	if *sslCert != "" || *sslKey != "" {
		if *sslCert == "" {
			log.Fatal("--ssl-cert is required with --ssl-key.")
		}

		if *sslKey == "" {
			log.Fatal("--ssl-key is required with --ssl-cert.")
		}
		useSSL = true
	}

	log.Infof("listen address is %s", *listenAddr)
	log.Infof("CAS base URL is %s", *casBase)
	log.Infof("CAS ticket validator endpoint is %s", *casValidate)
	log.Infof("VICE domain is %s", viceDomain)

	authkey := make([]byte, 64)
	_, err = rand.Read(authkey)
	if err != nil {
		log.Fatal(err)
	}

	sessionStore := sessions.NewCookieStore(authkey)
	sessionStore.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   *maxAge,
		HttpOnly: true,
	}

	p := &CASProxy{
		casBase:                  *casBase,
		casValidate:              *casValidate,
		ingressURL:               *ingressURL,
		appExposerHeader:         *appExposerHeader,
		accessHeader:             *accessHeader,
		analysisHeader:           *analysisHeader,
		sessionStore:             sessionStore,
		viceDomain:               viceDomain,
		refreshEnabled:           !*disableAutoRefresh,
		graphqlBase:              *graphqlBase,
		disableCustomHeaderMatch: *disableCustomHeaderMatch,
	}

	r := mux.NewRouter()
	api := r.PathPrefix("/api/").Subrouter()
	api.Path("/url-ready").Queries("url", "").HandlerFunc(p.URLIsReady)

	jobs := api.PathPrefix("/jobs/").Subrouter()
	jobs.Path("/status-updates").Queries("url", "").HandlerFunc(p.LookupJobStatusUpdates)

	// If the query contains a ticket in the query params, then it needs to be
	// validated.
	r.PathPrefix("/healthz").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "I'm healthy.")
	})
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join(*staticFilePath, "static")))))
	r.PathPrefix("/").Queries("url", "").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(*staticFilePath, "index.html"))
	})

	// r.PathPrefix("/").Queries("ticket", "").Handler(http.HandlerFunc(p.ValidateTicket))
	//r.PathPrefix("/").MatcherFunc(p.NeedsSession).Handler(http.HandlerFunc(p.RedirectToCAS))
	// r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, filepath.Join(*staticFilePath, "index.html"))
	// })

	server := &http.Server{
		Handler: r,
		Addr:    *listenAddr,
	}
	if useSSL {
		err = server.ListenAndServeTLS(*sslCert, *sslKey)
	} else {
		err = server.ListenAndServe()
	}
	log.Fatal(err)
}
