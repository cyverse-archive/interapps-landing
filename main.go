package main

import (
	"bytes"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path"
	"strings"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/pkg/errors"
	"github.com/yhat/wsutil"
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
	casBase      string // base URL for the CAS server
	casValidate  string // The path to the validation endpoint on the CAS server.
	frontendURL  string // The URL placed into service query param for CAS.
	backendURL   string // The backend URL to forward to.
	wsbackendURL string
	cookies      *sessions.CookieStore
	maxAge       int
}

// NewCASProxy returns a newly instantiated *CASProxy.
func NewCASProxy(casBase, casValidate, frontendURL, backendURL, wsbackendURL string, maxAge int) *CASProxy {
	return &CASProxy{
		casBase:      casBase,
		casValidate:  casValidate,
		frontendURL:  frontendURL,
		backendURL:   backendURL,
		wsbackendURL: wsbackendURL,
		maxAge:       maxAge,
		cookies:      sessions.NewCookieStore([]byte("omgsekretz")), // TODO: replace
	}
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
	svcURL, err := url.Parse(c.frontendURL)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse the frontend URL %s", c.frontendURL)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Make sure the serivce path and the query params are set to the incoming
	// requests values for those fields.
	svcURL.Path = r.URL.Path
	sq := r.URL.Query()
	sq.Del("ticket") // Remove the ticket from the service URL. Redirection loops occur otherwise.
	svcURL.RawQuery = sq.Encode()

	// The request URL for cas validation needs to have the service and ticket in
	// it.
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
	// HTTP status code will be in the 200 range regardless if the validation
	// status.
	if bytes.Equal(b, []byte("no\n\n")) {
		err = fmt.Errorf("ticket validation response body was %s", b)
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	// Store a session, hopefully to short circuit the CAS redirect dance in later
	// requests. The max age of the cookie should be less than the lifetime of
	// the CAS ticket, which is around 10+ hours. This means that we'll be hitting
	// the CAS server fairly often, but it shouldn't be an issue.
	session, err := c.cookies.Get(r, sessionName)
	if err != nil {
		err = errors.Wrapf(err, "failed get session %s", sessionName)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values[sessionKey] = 1
	session.Options.MaxAge = c.maxAge
	c.cookies.Save(r, w, session)

	http.Redirect(w, r, svcURL.String(), http.StatusTemporaryRedirect)
}

// Session implements the mux.Matcher interface so that requests can be routed
// based on cookie existence.
func (c *CASProxy) Session(r *http.Request, m *mux.RouteMatch) bool {
	var (
		val interface{}
		ok  bool
	)
	session, err := c.cookies.Get(r, sessionName)
	if err != nil {
		return true
	}
	if val, ok = session.Values[sessionKey]; !ok {
		log.Infof("key %s was not in the session", sessionKey)
		return true
	}
	if val.(int) != 1 {
		log.Infof("session value was %d instead of 1", val.(int))
		return true
	}
	return false
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
	svcURL, err := url.Parse(c.frontendURL)
	if err != nil {
		err = errors.Wrapf(err, "failed to parse the frontend URL %s", c.frontendURL)
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
	http.Redirect(w, r, casURL.String(), http.StatusTemporaryRedirect)
}

// ReverseProxy returns a proxy that forwards requests to the configured
// backend URL. It can act as a http.Handler.
func (c *CASProxy) ReverseProxy() (*httputil.ReverseProxy, error) {
	backend, err := url.Parse(c.backendURL)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to parse %s", c.backendURL)
	}
	return httputil.NewSingleHostReverseProxy(backend), nil
}

// WSReverseProxy returns a proxy that forwards websocket request to the
// configured backend URL. It can act as a http.Handler.
func (c *CASProxy) WSReverseProxy() (*wsutil.ReverseProxy, error) {
	w, err := url.Parse(c.wsbackendURL)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to parse the websocket backend URL %s", c.wsbackendURL)
	}
	return wsutil.NewSingleHostReverseProxy(w), nil
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
	if strings.ToLower(connectionHeader) == "upgrade" {
		if len(r.Header["Upgrade"]) > 0 {
			upgrade = (strings.ToLower(r.Header["Upgrade"][0]) == "websocket")
		}
	}
	return upgrade
}

// Proxy returns a handler that can support both websockets and http requests.
func (c *CASProxy) Proxy() (http.Handler, error) {
	ws, err := c.WSReverseProxy()
	if err != nil {
		return nil, err
	}

	rp, err := c.ReverseProxy()
	if err != nil {
		return nil, err
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if c.isWebsocket(r) {
			ws.ServeHTTP(w, r)
			return
		}
		rp.ServeHTTP(w, r)
	}), nil
}

func main() {
	var (
		backendURL   = flag.String("backend-url", "http://localhost:60000", "The hostname and port to proxy requests to.")
		wsbackendURL = flag.String("ws-backend-url", "", "The backend URL for the handling websocket requests. Defaults to the value of --backend-url with a scheme of ws://")
		frontendURL  = flag.String("frontend-url", "", "The URL for the frontend server. Might be different from the hostname and listen port.")
		listenAddr   = flag.String("listen-addr", "0.0.0.0:8080", "The listen port number.")
		casBase      = flag.String("cas-base-url", "", "The base URL to the CAS host.")
		casValidate  = flag.String("cas-validate", "validate", "The CAS URL endpoint for validating tickets.")
		maxAge       = flag.Int("max-age", 30, "The number of seconds that the session cookie is valid for.")
	)

	flag.Parse()

	if *casBase == "" {
		log.Fatal("--cas-base-url must be set.")
	}

	if *frontendURL == "" {
		log.Fatal("--frontend-url must be set.")
	}

	if *wsbackendURL == "" {
		w, err := url.Parse(*backendURL)
		if err != nil {
			log.Fatal(err)
		}
		w.Scheme = "ws"
		*wsbackendURL = w.String()
	}

	log.Infof("backend URL is %s", *backendURL)
	log.Infof("websocket backend URL is %s", *wsbackendURL)
	log.Infof("frontend URL is %s", *frontendURL)
	log.Infof("listen address is %s", *listenAddr)
	log.Infof("CAS base URL is %s", *casBase)
	log.Infof("CAS ticket validator endpoint is %s", *casValidate)

	p := NewCASProxy(*casBase, *casValidate, *frontendURL, *backendURL, *wsbackendURL, *maxAge)

	proxy, err := p.Proxy()
	if err != nil {
		log.Fatal(err)
	}

	r := mux.NewRouter()

	// If the query containes a ticket in the query params, then it needs to be
	// validated.
	r.PathPrefix("/").Queries("ticket", "").Handler(http.HandlerFunc(p.ValidateTicket))
	r.PathPrefix("/").MatcherFunc(p.Session).Handler(http.HandlerFunc(p.RedirectToCAS))

	// Only accept http and https for the this reverse proxy handler. Websocket
	// requests should have a scheme of 'ws'.
	r.PathPrefix("/").Handler(proxy)

	server := &http.Server{
		Handler: r,
		Addr:    *listenAddr,
	}
	log.Fatal(server.ListenAndServe())

}
