const supertest = require('supertest');
// const app = require('../src/app'); // Update with the correct path to your app file
const assert = require('assert');
describe('Simple CI test', () => {
  it('should compare two string', () => {
    const req = {message: 'Hello World'};
    // Check the result
    assert.deepStrictEqual(req.message, { message: 'Hello World' });
  });
});
