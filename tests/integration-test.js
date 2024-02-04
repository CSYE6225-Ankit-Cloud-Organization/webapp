const supertest = require('supertest');
const app = require('../src/app');

describe('Running the integration test', () => {
  it('GET /healthz endpoint to check database status', async () => {
    const response = await supertest(app)
      .get('/healthz')
      .expect(200);

    if (response.error) {
      throw new Error(response.error);
    }
  });
});
