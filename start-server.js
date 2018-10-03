const args = [
  'run',
  'main.go',
  `--cas-base-url=${process.env.NPM_CONFIG_CAS_URL}`,
  '--disable-custom-header-match',
  `--graphql=http://${process.env.NPM_CONFIG_GRAPHQL_HOSTNAME}:${process.env.NPM_CONFIG_GRAPHQL_PORT}/v1alpha1/graphql`,
  `--ingress-url=${process.env.NPM_CONFIG_INGRESS_URL}`,
  `--listen-addr=${process.env.NPM_CONFIG_API_HOST}`,
  `--vice-domain=localhost:3000`
];

const opts = {
  stdio: 'inherit',
  shell: true
};

require('child_process').spawn('go', args, opts);
