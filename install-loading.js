const args = [
  'install'
];

const opts = {
  stdio: 'inherit',
  cwd: 'client-loading',
  shell: true
};

require('child_process').spawn('npm', args, opts);
