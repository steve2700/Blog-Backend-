import request from 'supertest';
import server from '../server.js'; // Ensure this path is correct

describe('Server', () => {
  it('should return Hello World on the root path', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});

