const args = [
  "port-forward",
  "service/graphql-de",
  `${process.env.NPM_CONFIG_GRAPHQL_PORT}:80`
];

const opts = {
  stdio: 'inherit',
  shell: true
};

require('child_process').spawn('kubectl', args, opts);
