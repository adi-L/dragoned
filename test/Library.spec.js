const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const jsdom = require('jsdom');
const containerStack = require('../src/containerStack');
const Dragoned = require('../src/index');
const getParent = require('../src/scripts/getParent');
const { expect } = chai;

global.window = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
}).window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

chai.should();
chai.use(sinonChai);

describe('create new instace of library with null container', function () {
  it('should return error', function () {
    expect(new Dragoned.default(null)).to.be.an('error');
  });
});


describe('use getParent function', function () {
  it('should return the parent node', function () {
    const container = window.document.createElement('div');
    const element = window.document.createElement('div');
    container.appendChild(element);
    expect(getParent.default(element)).to.be.equal(container);
  });
});

describe('empty container stack', function () {
  it('should return empty array from containerStack', function () {
    sinon.assert.match(containerStack.default, []);
  });
});
