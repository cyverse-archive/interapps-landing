const args = [
  "port-forward",
  "service/redis",
  '6379:6379'
];

const opts = {
  stdio: 'inherit',
  shell: true
};

require('child_process').spawn('kubectl', args, opts);
