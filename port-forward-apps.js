const args = [
  "port-forward",
  "service/apps",
  '31323:80'
];

const opts = {
  stdio: 'inherit',
  shell: true
};

require('child_process').spawn('kubectl', args, opts);
