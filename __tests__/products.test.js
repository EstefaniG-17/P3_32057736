// __tests__/products.test.js
const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Products API', () => {
  let adminToken;

  beforeAll(async () => {
    // Limpiar y crear usuario de prueba
    await User.destroy({ where: {} });
    
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123'
    });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    adminToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  describe('Categories Endpoints', () => {
    it('should return 401 when getting categories without token', async () => {
      const res = await request(app).get('/categories');
      expect(res.statusCode).toEqual(401);
    });

    it('should get categories with valid token', async () => {
      const res = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Products Endpoints', () => {
    it('should return products list publicly', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
    });

    it('should return 401 when creating product without token', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Test' });
      expect(res.statusCode).toEqual(401);
    });
  });
});