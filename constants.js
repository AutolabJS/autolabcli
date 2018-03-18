const supportedLanguages = [
  'java',
  'c',
  'cpp',
  'cpp14',
  'python2',
  'python3'
];

const defaultLang = 'java';

const defaultMainServer = {
  host: 'autolab.bits-goa.ac.in',
  port: '9000'
};

const defaultGitlab = {
  host: 'autolab.bits-goa.ac.in'
}

module.exports = {
  supportedLanguages,
  defaultLang,
  defaultMainServer,
  defaultGitlab
}
