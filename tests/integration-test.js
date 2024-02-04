const supertest = require('supertest');
const app = require('../src/app'); // Update with the correct path to your app file
const assert = require('assert');

describe('Integration Tests', () => {
  it('should return a JSON response from /hello endpoint', async () => {
    const response = await supertest(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /json/);

    assert.deepStrictEqual(response.body, { message: 'Hello, World!' });
    // Add more assertions as needed
  });
});
