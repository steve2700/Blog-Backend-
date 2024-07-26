const request = require('supertest');
const app = require('../server'); // Assuming the server file is named `server.js`
const mongoose = require('mongoose');
const User = require('../models/user.model');

beforeAll(async () => {
  // Connect to a test database
  const url = `mongodb+srv://nyaruwatastewart27:gogochuchu27@cluster0.z3279ia.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Clean up the database and close the connection
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  // Test signup functionality
  describe('POST /auth/signup', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/auth/signup').send({
        username: 'stewart27',
        email: 'nyaruwatastewart27@gmail.com',
        password: 'Gogochuchu27@!'
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User registered successfully. Check your email for verification.');
    });

    it('should return an error for missing fields', async () => {
      const response = await request(app).post('/auth/signup').send({
        username: 'testuser',
        password: 'Test@1234'
      });
      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Username, password, and email are required.');
    });

    it('should return an error for weak password', async () => {
      const response = await request(app).post('/auth/signup').send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'weak'
      });
      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Password must have 8 or more characters, at least one uppercase letter, one lowercase letter, one digit, and one special character.');
    });

    it('should return an error for already taken username or email', async () => {
      // First, create a user to ensure username/email is taken
      await User.create({
        username: 'stewart27',
        email: 'nyaruwatastewart@gmail.com',
        password: 'Test@1234'
      });

      // Test for username taken
      const responseUsername = await request(app).post('/auth/signup').send({
        username: 'stewart27',
        email: 'newuser@example.com',
        password: 'Test@1234'
      });
      expect(responseUsername.status).toBe(422);
      expect(responseUsername.body.error).toBe('Username or email is already taken.');

      // Test for email taken
      const responseEmail = await request(app).post('/auth/signup').send({
        username: 'newuser',
        email: 'nyaruwatastewart27@gmail.com',
        password: 'Test@1234'
      });
      expect(responseEmail.status).toBe(422);
      expect(responseEmail.body.error).toBe('Username or email is already taken.');
    });
  });
});
i
