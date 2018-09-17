package main

import "testing"

func TestExtractSubdomain(t *testing.T) {
	table := map[string]string{
		"http://example.org":             "",
		"http://foo.example.org":         "foo",
		"http://foo.bar.example.org":     "foo.bar",
		"http://foo.bar.baz.example.org": "foo.bar.baz",
	}

	for k, v := range table {
		t.Run(k, func(t *testing.T) {
			actual, err := extractSubdomain(k)
			if err != nil {
				t.Error(err)
			}
			if actual != v {
				t.Errorf("subdomain was '%s', not '%s'", actual, v)
			}
		})
	}
}
