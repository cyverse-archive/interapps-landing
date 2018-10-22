const args = [
  'start'
];

const opts = {
  stdio: 'inherit',
  cwd: 'project-ui-landing',
  shell: true
};

require('child_process').spawn('npm', args, opts);
