/* eslint-disable no-undef */
const {assert} = require('chai');

describe('Testing frontpage', () => {
  beforeEach(() => {
    browser.url('/');
    browser.pause(200);
  });

  it('Should render frontpage', () => {
    const text = browser.getText('body');
    const expected = 'Tanterne';
    assert.include(text, expected);
  });
});
