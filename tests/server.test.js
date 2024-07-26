const request = require('supertest');
const app = require('../server'); // Import the app

describe('Server', () => {
  it('should return Hello World on the root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the API!');
  });
});

