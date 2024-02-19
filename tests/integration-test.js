const app = require('../src/app');
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

describe('User API Integration Test', () => {
  let userId;

  // Test 1 - Create an account, and using the GET call, validate account exists.
  it('Test 1 - Create an account, and using the GET call, validate account exists', async () => {
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
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd').toString('base64')}`);
    assert.strictEqual(getUserResponse.status, 200);
    assert.strictEqual(getUserResponse.body.id, userId);
  });

  //Test 2 - Update the account and using the GET call, validate the account was updated.
  it('Test 2 - Update the account and using the GET call, validate the account was updated', async () => {
    // Update the user created in the previous test
    // Updating first_name and password in this step
    const updateUserResponse = await supertest(app)
      .put('/v1/user/self')
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd').toString('base64')}`)
      .send({
        "first_name": "JaneUpdated",
        "last_name": "Doe",
        "password": "abcd1"
      });
    assert.strictEqual(updateUserResponse.status, 204);

    // Test to retrieve the user after updates
    // checking if the authorization works with the updated password and for the same user.
    const getUserResponse = await supertest(app)
      .get(`/v1/user/self`)
      .set('Authorization', `Basic ${Buffer.from('jane.doe@example.com:abcd1').toString('base64')}`);
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