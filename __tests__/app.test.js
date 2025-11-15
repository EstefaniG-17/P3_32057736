const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');

describe('Basic Endpoints', () => {
  beforeAll(async () => {
    // Esperar a que la BD se inicialice
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /ping', () => {
    it('should return 200', async () => {
      const response = await request(app).get('/ping');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /about', () => {
    it('should return developer info', async () => {
      const response = await request(app).get('/about');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('nombreCompleto');
      expect(response.body.data).toHaveProperty('cedula');
      expect(response.body.data).toHaveProperty('seccion');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  // ... pruebas existentes ...

describe('Categories API', () => {
  let token;

  beforeAll(async () => {
    // Login para obtener token
    const res = await request(app)
      .post('/api/users/login')
      .send({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
    token = res.body.data.token;
  });

  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: 'Video Games', 
        description: 'All video games' 
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.name).toEqual('Video Games');
  });

  it('should not create category without auth', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'Test' });
    expect(res.statusCode).toEqual(401);
  });
});

describe('Products API', () => {
  it('should get public products', async () => {
    const res = await request(app)
      .get('/api/products');
    expect(res.statusCode).toEqual(200);
  });

  it('should filter products by platform', async () => {
    const res = await request(app)
      .get('/api/products?platform=PS5');
    expect(res.statusCode).toEqual(200);
  });
});
});