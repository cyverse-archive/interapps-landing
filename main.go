package main

import (
	"flag"

	"github.com/Sirupsen/logrus"
)

var log = logrus.WithFields(logrus.Fields{
	"service": "cas-proxy",
	"art-id":  "cas-proxy",
	"group":   "org.cyverse",
})

func init() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
}

func main() {
	var (
		backendURL   = flag.String("--backend-url", "http://localhost:60000", "The hostname and port to proxy requests to.")
		frontendURL  = flag.String("--frontend-url", "", "The URL for the frontend server. Might be different from the hostname and listen port.")
		listenAddr   = flag.String("--listen-addr", "0.0.0.0:8080", "The listen port number.")
		casBase      = flag.String("--cas-base-url", "", "The base URL to the CAS host.")
		casValidator = flag.String("--cas-validator", "validate", "The CAS URL endpoint for validating tickets.")
	)

	if *casBase == "" {
		log.Fatal("--cas-base-url must be set.")
	}

	if *frontendURL == "" {
		log.Fatal("--frontend-url must be set.")
	}

	log.Infof("backend URL is %s", *backendURL)
	log.Infof("frontend URL is %s", *frontendURL)
	log.Infof("listen address is %s", *listenAddr)
	log.Infof("CAS base URL is %s", *casBase)
	log.Infof("CAS ticket validator endpoint is %s", *casValidator)
}
