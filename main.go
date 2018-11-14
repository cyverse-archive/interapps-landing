package main

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
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

// API contains the application logic that handles authentication, session
// validations, ticket validation, and request proxying.
type API struct {
	ingressURL       string // The URL to the cluster ingress.
	appExposerHeader string // The Host header for hitting the app-exposer service.
	viceDomain       string // The domain for VICE apps.
	refreshEnabled   bool   // Whether or not to look up information through the graphql server.
	graphqlBase      string // The base URL to the graphql server.

}

// URLMatches returns true if the given URL is a subdomain of the configured
// VICE domain.
func (a *API) URLMatches(url string) (bool, error) {
	r := fmt.Sprintf("(a.*\\.)?\\Q%s\\E(:[0-9]+)?", a.viceDomain)
	matched, err := regexp.MatchString(r, url)
	if err != nil {
		return false, err
	}
	return matched, nil
}

// ViceSubdomain returns true if the provided URL is a subdomain in the
// configured VICE domain.
func (a *API) ViceSubdomain(url string) (bool, error) {
	matched, err := a.URLMatches(url)
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
func (a *API) IngressExists(subdomain string) (bool, error) {
	ingressURL, err := url.Parse(a.ingressURL)
	if err != nil {
		return false, err
	}
	ingressURL.Path = filepath.Join(ingressURL.Path, fmt.Sprintf("/ingress/%s", subdomain))

	request, err := http.NewRequest(http.MethodGet, ingressURL.String(), nil)
	if err != nil {
		return false, err
	}

	request.Host = a.appExposerHeader

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
func (a *API) EndpointConfig(subdomain string) (*Endpoint, error) {
	ingressURL, err := url.Parse(a.ingressURL)
	if err != nil {
		return nil, err
	}
	ingressURL.Path = filepath.Join(ingressURL.Path, fmt.Sprintf("/endpoint/%s", subdomain))

	request, err := http.NewRequest(http.MethodGet, ingressURL.String(), nil)
	if err != nil {
		return nil, err
	}

	request.Host = a.appExposerHeader

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

// ViceAnalysis contains the information about a VICE specific analysis stored
// in the database.
type ViceAnalysis struct {
	ID               string  `json:"id"`
	JobName          string  `json:"job_name"`
	JobDescription   string  `json:"job_description"`
	ResultFolderPath string  `json:"result_folder_path"`
	Status           string  `json:"status"`
	Subdomain        string  `json:"subdomain"`
	StartDate        string  `json:"start_date"`
	EndDate          string  `json:"end_date"`
	PlannedEndDate   string  `json:"planned_end_date"`
	UserID           string  `json:"user_id"`
	Username         string  `json:"username"`
	AppID            string  `json:"app_id"`
	AppName          string  `json:"app_name"`
	AppDescription   string  `json:"app_description"`
	AppEditedDate    string  `json:"app_edited_date"`
	ToolID           string  `json:"tool_id"`
	ToolName         string  `json:"tool_name"`
	ToolDescription  string  `json:"tool_description"`
	ToolVersion      string  `json:"tool_version"`
	WorkingDirectory string  `json:"working_directory"`
	EntryPoint       string  `json:"entry_point"`
	UID              int     `json:"uid"`
	MinCPUCores      float32 `json:"min_cpu_cores"`
	MaxCPUCores      float32 `json:"max_cpu_cores"`
	PIDsLimit        float32 `json:"pids_limit"`
	SkipTMPMount     bool    `json:"skip_tmp_mount"`
	Port             int     `json:"container_port"`
	ImageID          string  `json:"image_id"`
	ImageName        string  `json:"image_name"`
	ImageTag         string  `json:"image_tag"`
	ImageURL         string  `json:"image_url"`
	Step             int     `json:"step"`
}

const lookupViceAnalyses = `
query ViceAnalyses($username: String) {
  vice_analyses(
    where: {
      username: {_eq: $username}
    }
  ) {
    id
    job_name
    job_description
    result_folder_path
    status
    subdomain
    start_date
    end_date
    planned_end_date
    user_id
    username
    app_id
    app_name
    app_description
    app_edited_date
    tool_id
    tool_name
    tool_description
    tool_version
    working_directory
    entrypoint
    uid
    min_cpu_cores
    max_cpu_cores
    pids_limit
    skip_tmp_mount
    container_port
    image_id
    image_name
    image_tag
    image_url
    step
  }
}
`

// ViceAnalyses is a http handler that returns the results of a query against
// the graphql server for a list of analyses that the user can access.
func (a *API) ViceAnalyses(w http.ResponseWriter, r *http.Request) {
	var (
		ok  bool
		err error
	)

	u := r.FormValue("user")

	client := graphql.NewClient(a.graphqlBase)
	req := graphql.NewRequest(lookupViceAnalyses)
	req.Var("username", u)

	data := map[string][]ViceAnalysis{}

	if err = client.Run(context.Background(), req, &data); err != nil {
		http.Error(w, fmt.Sprintf("error from vice analyses query for user %s: %s", u, err), http.StatusInternalServerError)
		return
	}

	if _, ok = data["vice_analyses"]; !ok {
		http.Error(w, fmt.Sprintf("missing vice_analyses field for user %s", u), http.StatusInternalServerError)
		return
	}

	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, fmt.Sprintf("error marshalling response from vice analyses query for user %s: %s", u, err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, string(js))
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
func (a *API) lookupExternalUUID(subdomain string) (string, error) {
	var (
		err error
		ok  bool
	)

	client := graphql.NewClient(a.graphqlBase)
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
func (a *API) LookupJobStatusUpdates(w http.ResponseWriter, r *http.Request) {
	u := r.FormValue("url")

	valid, err := a.ViceSubdomain(u)
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

	externalID, err := a.lookupExternalUUID(subdomain)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting external UUID for subdomain %s", subdomain), http.StatusInternalServerError)
		return
	}
	if externalID == "" {
		http.Error(w, fmt.Sprintf("empty external UUID for subdomain %s", subdomain), http.StatusInternalServerError)
		return
	}

	client := graphql.NewClient(a.graphqlBase)
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
func (a *API) URLIsReady(w http.ResponseWriter, r *http.Request) {
	u := r.FormValue("url")

	valid, err := a.ViceSubdomain(u)
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
	ready, err = a.IngressExists(subdomain)
	if err != nil {
		http.Error(w, fmt.Sprintf("error checking ingress %s existence: %s", subdomain, err.Error()), http.StatusInternalServerError)
		return
	}

	var ept *Endpoint
	if ready {
		ept, err = a.EndpointConfig(subdomain)
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
			log.Printf("error checking HTTP status: %s\n", err.Error())
			ready = false
		} else {
			if resp.StatusCode < 200 && resp.StatusCode > 399 {
				ready = false
			}
		}
	}

	if ready {
		ready = endpointIsReady(ept.IP, ept.Port)
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

func endpointIsReady(eptIP string, eptPort int) bool {
	var ready bool
	httpclient := &http.Client{
		CheckRedirect: func(r *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	var resp *http.Response
	resp, err := httpclient.Get(fmt.Sprintf("http://%s:%d/url-ready", eptIP, eptPort))
	if err != nil {
		log.Printf("error checking HTTP status: %s\n", err.Error())
		if resp != nil {
			resp.Body.Close()
		}
		return false
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Errorf("error reading response body: %s", err)
		return false
	}

	data := map[string]bool{}
	if err = json.Unmarshal(body, &data); err != nil {
		log.Errorf("error unmarshalling body: %s", err)
		return false
	}

	if _, ok := data["ready"]; ok {
		ready = data["ready"]
	}

	return ready
}

// isWebsocket returns true if the connection is a websocket request. Adapted
// from the code at https://groups.google.com/d/msg/golang-nuts/KBx9pDlvFOc/0tR1gBRfFVMJ.
func (a *API) isWebsocket(r *http.Request) bool {
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

const defaultConfig = `k8s:
  app-exposer:
    base: "http://localhost"
    header: app-exposer
  get-analysis-id:
    header: get-analysis-id
  check-resource-access:
    header: check-resource-access`

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
		loadingUIPath            = flag.String("loading-ui-path", "./ui-loading", "Path to the loading UI build.")
		landingUIPath            = flag.String("landing-ui-path", "./ui-landing", "Path to the landing UI build.")
		disableCustomHeaderMatch = flag.Bool("disable-custom-header-match", false, "Disables usage of the X-Frontend-Url header for subdomain matching. Use Host header instead. Useful during development.")
		mode                     = flag.String("mode", "loading", "Which mode to run in. Valid values are 'landing' and 'loading', without the quotes.")
	)

	const landing = "landing"
	const loading = "loading"

	flag.Parse()

	// make sure the configuration object has sane defaults.
	if cfg, err = configurate.InitDefaults(*configPath, defaultConfig); err != nil {
		log.Fatal(err)
	}

	if *mode != loading && *mode != landing {
		log.Fatal("--mode must be either 'landing' or 'loading', without the quotes")
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

	p := &API{
		ingressURL:       *ingressURL,
		appExposerHeader: *appExposerHeader,
		viceDomain:       viceDomain,
		refreshEnabled:   !*disableAutoRefresh,
		graphqlBase:      *graphqlBase,
	}

	c := &CAS{
		casBase:                  *casBase,
		casValidate:              *casValidate,
		disableCustomHeaderMatch: *disableCustomHeaderMatch,
		sessionStore:             sessionStore,
	}

	r := mux.NewRouter()

	r.PathPrefix("/healthz").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "I'm healthy.")
	})

	api := r.PathPrefix("/api").Subrouter()
	api.Path("/url-ready").Queries("url", "").HandlerFunc(p.URLIsReady)
	api.Path("/analyses").Queries("user", "").HandlerFunc(p.ViceAnalyses)

	jobs := api.PathPrefix("/jobs/").Subrouter()
	jobs.Path("/status-updates").Queries("url", "").HandlerFunc(p.LookupJobStatusUpdates)

	// Loading page routes
	if *mode == loading {
		//loading := r.PathPrefix("/").Subrouter()
		r.Path("/static").Handler(
			http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join(*loadingUIPath, "static")))),
		)
		r.Path("/").
			Queries("url", "").
			HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				http.ServeFile(w, r, filepath.Join(*loadingUIPath, "index.html"))
			})

	}

	// landing page routes
	if *mode == landing {
		//landing := r.PathPrefix("/landing/").Subrouter()
		r.PathPrefix("/").Queries("ticket", "").Handler(http.HandlerFunc(c.ValidateTicket))
		r.PathPrefix("/").MatcherFunc(c.NeedsSession).Handler(http.HandlerFunc(c.RedirectToCAS))
		r.Path("/static").Handler(
			http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join(*landingUIPath, "static")))),
		)
		r.Path("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, filepath.Join(*landingUIPath, "index.html"))
		})
	}

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
