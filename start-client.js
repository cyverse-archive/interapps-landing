const args = [
  'start'
];

const opts = {
  stdio: 'inherit',
  cwd: 'ui',
  shell: true
};

require('child_process').spawn('npm', args, opts);
