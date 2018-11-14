const args_landing = [
  'run',
  'main.go',
  'cas.go',
  'permissions.go',
  `--cas-base-url=${process.env.NPM_CONFIG_CAS_URL}`,
  `--graphql=http://${process.env.NPM_CONFIG_GRAPHQL_HOSTNAME}:${process.env.NPM_CONFIG_GRAPHQL_PORT}/v1alpha1/graphql`,
  `--ingress-url=${process.env.NPM_CONFIG_INGRESS_URL}`,
  `--listen-addr=${process.env.NPM_CONFIG_LANDING_API_HOST}`,
  `--vice-base-url=${process.env.NPM_CONFIG_VICE_URL}`,
  `--disable-custom-header-match`,
  `--mode=landing`
];

const args_loading = [
  'run',
  'main.go',
  'cas.go',
  'permissions.go',
  `--cas-base-url=${process.env.NPM_CONFIG_CAS_URL}`,
  `--graphql=http://${process.env.NPM_CONFIG_GRAPHQL_HOSTNAME}:${process.env.NPM_CONFIG_GRAPHQL_PORT}/v1alpha1/graphql`,
  `--ingress-url=${process.env.NPM_CONFIG_INGRESS_URL}`,
  `--listen-addr=${process.env.NPM_CONFIG_LOADING_API_HOST}`,
  `--vice-base-url=${process.env.NPM_CONFIG_VICE_URL}`,
  `--disable-custom-header-match`,
  `--mode=loading`
];

const opts = {
  stdio: 'inherit',
  shell: true
};

require('child_process').spawn('go', args_landing, opts);
require('child_process').spawn('go', args_loading, opts);
