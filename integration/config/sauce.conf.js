module.exports = {
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      platform: 'OS X 10.11',
      version: 'latest',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER
    }
  ]
};
