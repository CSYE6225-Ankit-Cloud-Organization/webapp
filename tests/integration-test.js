const app = require('../src/app'); // Update with the correct path to your app file
const supertest = require('supertest');
const assert = require('assert');
const sequelize = require('../src/config/dbConnection');
const User = require('../src/models/User');

// Run sequelize.sync() before starting the tests
before(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});

describe('User API Integration Tests', () => {
  let userId;

  it('Create a user and check if it exists', async () => {
    const createUserResponse = await supertest(app)
      .post('/v1/user')
      .send({
        "first_name": "Jane",
        "last_name": "Doe",
        "password": "abcd",
        "username": "jane.doe@example.com"
      });

    assert.strictEqual(createUserResponse.status, 201);
    userId = createUserResponse.body.id;

    // Test to retrieve the created user
    const getUserResponse = await supertest(app)
      .get(`/v1/user/self`)
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd').toString('base64')}`); // Mocking basic auth headers
    assert.strictEqual(getUserResponse.status, 200);
    assert.strictEqual(getUserResponse.body.id, userId);
  });

  it('Update user details and validate it was updated', async () => {
    // Update the user created in the previous test
    const updateUserResponse = await supertest(app)
      .put('/v1/user/self')
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd').toString('base64')}`) // Mocking basic auth headers
      .send({
        "first_name": "JaneUpdated",
        "last_name": "Doe",
        "password": "abcd1"
      });
    assert.strictEqual(updateUserResponse.status, 204);

    // Test to retrieve the user after updates
    const getUserResponse = await supertest(app)
      .get(`/v1/user/self`)
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd1').toString('base64')}`); // Mocking basic auth headers
    assert.strictEqual(getUserResponse.status, 200);
    assert.strictEqual(getUserResponse.body.id, userId);
  });
});

 // Run sequelize.close() after finishing the tests
 after(async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});