const args = [
  'install'
];

const opts = {
  stdio: 'inherit',
  cwd: 'client-landing',
  shell: true
};

require('child_process').spawn('npm', args, opts);
