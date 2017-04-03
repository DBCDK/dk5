/* eslint-disable no-undef */
const chai = require('chai');
const assert = chai.assert;
chai.should();

describe('Testing Hierarchy', () => {
  it('Should render hierarchy', () => {
    browser.url('/#!/hierarchy/40-49');
    browser.pause(200);

    const text = browser.getText('.selected .dk5')[0];
    assert.equal(text, '40-49', 'title is present');

    const level = browser.getText('.selected .hierarchy-level')[0];
    assert.include(level, 'Andre verdensdele', 'sublevel is present');
  });

  it('Click on sublevel', () => {
    browser.url('/#!/hierarchy/40-49');
    browser.pause(200);
    browser.click('[href="#!/hierarchy/40"]');
    browser.pause(200);

    const text = browser.getText('.selected h2 .dk5')[0];
    assert.equal(text, '40', 'title is present');

    const topics = browser.getText('.selected .hierarchy-topics');
    assert.include(topics[0], 'Flyveulykker', 'first topic is present');
  });

  it('Click between levels', () => {
    browser.url('/#!/hierarchy/40-49');
    browser.pause(200);
    assert.equal(browser.getText('.selected .dk5')[0], '40-49', 'toplevel is selected');

    browser.click('[href="#!/hierarchy/40"]');
    browser.pause(200);
    assert.equal(browser.getText('.selected .dk5')[0], '40', '2. level is selected');

    browser.click('[href="#!/hierarchy/40.6"]');
    browser.pause(200);
    assert.equal(browser.getText('.selected .dk5'), '40.6', '3. level is selected');

    browser.click('[href="#!/hierarchy/40-49"]');
    browser.pause(200);
    assert.equal(browser.getText('.selected .dk5')[0], '40-49', 'toplevel is selected');
  });

  it('Should display the first five aspects only', () => {
    browser.url('/#!/hierarchy/40');

    const topics = browser.getText('.selected .hierarchy-topics');

    assert.include(topics[0], 'Lokalhistorie');
    assert.lengthOf(topics[0].split('\n'), 5);
    assert.notInclude(topics[0], 'Topografi');
  });

  it('Should display all aspects when "Vis Flere" is clicked', () => {
    browser.url('/#!/hierarchy/40');

    let topics = browser.getText('.selected .hierarchy-topics');
    assert.lengthOf(topics[0].split('\n'), 5);
    assert.lengthOf(browser.getText('.selected .hidden .hierarchy-topics'), 0);

    browser.click('.toggle-button');

    topics = browser.getText('.selected .hierarchy-topics');
    assert.lengthOf(topics[0].split('\n'), 5);
    assert.lengthOf(topics[1].split('\n'), 6);
    assert.isTrue(browser.isExisting('.selected .show .hierarchy-topics'));
  });

  it('Should hide all but 5 aspects when "Vis Flere" is clicked twice', () => {
    browser.url('/#!/hierarchy/40');

    browser.click('.toggle-button');

    let topics = browser.getText('.selected .hierarchy-topics');
    assert.lengthOf(topics[0].split('\n'), 5);
    assert.lengthOf(topics[1].split('\n'), 6);
    assert.isTrue(browser.isExisting('.selected .show .hierarchy-topics'));

    browser.click('.toggle-button');

    topics = browser.getText('.selected .hierarchy-topics');
    assert.lengthOf(topics[0].split('\n'), 5);
    assert.lengthOf(browser.getText('.selected .hidden .hierarchy-topics'), 0);
  });
});