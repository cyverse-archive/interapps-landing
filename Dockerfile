FROM golang:1.10.2

COPY . /go/src/github.com/cyverse-de/cas-server
RUN go install github.com/cyverse-de/cas-server

ENTRYPOINT ["cas-server"]
CMD ["--help"]

ARG git_commit=unknown
ARG version="2.9.0"
ARG descriptive_version=unknown

LABEL org.cyverse.git-ref="$git_commit"
LABEL org.cyverse.version="$version"
LABEL org.cyverse.descriptive-version="$descriptive_version"
LABEL org.label-schema.vcs-ref="$git_commit"
LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/cas-server"
LABEL org.label-schema.version="$descriptive_version"
