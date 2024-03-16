import request from "supertest";
import app from './server.js';

describe('Inventory API Tests', () => {
    // Test case for /api/products/product
    test('GET /api/products/product returns 200 OK status', async () => {
      const response = await request(app).get('/api/products/product');
      expect(response.status).toBe(200);
    });
  
    // Test case for /api/products/product/:id
    test('GET /api/products/product/:id returns 200 OK status', async () => {
      const productId = '65f30ef9dc7fae3a5bab5241';
      const response = await request(app).get(`/api/products/product/${productId}`);
      expect(response.status).toBe(200);
    });
  });