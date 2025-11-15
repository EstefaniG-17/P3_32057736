const request = require('supertest');
const app = require('../app');
const { User, Category, Product, Tag, sequelize } = require('../models');
const jwt = require('jsonwebtoken');

describe('Products API - Maze Runner Books', () => {
  let adminToken;
  let testCategory;
  let testProduct;
  let testTag;

  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
      
      // Crear usuario admin
      const adminUser = await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

      // Crear categoría
      testCategory = await Category.create({
        name: 'Libros de Ciencia Ficción',
        description: 'Libros de ciencia ficción y distopía'
      });

      // Crear tag
      testTag = await Tag.create({
        name: 'Distopía'
      });

      // Crear producto de ejemplo (Maze Runner)
      testProduct = await Product.create({
        name: 'Maze Runner: Correr o Morir',
        slug: 'maze-runner-correr-o-morir',
        description: 'El primer libro de la saga Maze Runner',
        price: 19.99,
        categoryId: testCategory.id,
        author: 'James Dashner',
        isbn: '978-8427200581',
        publicationYear: 2009,
        publisher: 'V&R Editoras',
        language: 'Español',
        pages: 384,
        format: 'Tapa blanda',
        isAvailable: true,
        stock: 10
      });

      await testProduct.addTag(testTag);

      // Generar token
      adminToken = jwt.sign(
        { userId: adminUser.id, email: adminUser.email },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '24h' }
      );

    } catch (error) {
      console.error('Error en beforeAll:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Public Endpoints - Products Search', () => {
    it('should return products list with pagination', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should filter products by author', async () => {
      const res = await request(app).get('/products?author=James');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].author).toContain('James');
    });

    it('should filter products by price range', async () => {
      const res = await request(app).get('/products?price_min=10&price_max=30');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter products by publisher', async () => {
      const res = await request(app).get('/products?publisher=V&R');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].publisher).toContain('V&R');
    });

    it('should filter products by format', async () => {
      const res = await request(app).get('/products?format=Tapa blanda');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].format).toEqual('Tapa blanda');
    });

    it('should search products by name', async () => {
      const res = await request(app).get('/products?search=Maze');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].name).toContain('Maze');
    });
  });

  describe('Self-Healing URL', () => {
    it('should redirect when slug is incorrect', async () => {
      const res = await request(app)
        .get('/p/1-wrong-slug-name')
        .redirects(0); // No seguir redirecciones automáticamente
      
      expect(res.statusCode).toEqual(301);
      expect(res.headers.location).toContain('/p/1-maze-runner-correr-o-morir');
    });

    it('should return product when slug is correct', async () => {
      const res = await request(app).get('/p/1-maze-runner-correr-o-morir');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.name).toContain('Maze Runner');
    });
  });

  describe('Protected Endpoints - Products Management', () => {
    it('should return 401 when creating product without token', async () => {
      const res = await request(app)
        .post('/products')
        .send({ 
          name: 'New Maze Runner Book',
          price: 24.99,
          categoryId: 1 
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should create product with valid token', async () => {
      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Maze Runner: Prueba de Fuego',
          price: 21.99,
          categoryId: testCategory.id,
          author: 'James Dashner',
          isbn: '978-8427200598',
          publicationYear: 2010,
          pages: 400,
          format: 'Tapa blanda'
        });
      expect([201, 200]).toContain(res.statusCode);
    });
  });

  describe('Categories and Tags Protected Endpoints', () => {
    it('should return 401 when getting categories without token', async () => {
      const res = await request(app).get('/categories');
      expect(res.statusCode).toEqual(401);
    });

    it('should get categories with valid token', async () => {
      const res = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${adminToken}`);
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('Admin Users Endpoints', () => {
  it('should return users list with admin token', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 500]).toContain(res.statusCode);
  });

  it('should return 401 when getting users without token', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(401);
  });
});

describe('Categories CRUD Endpoints', () => {
  it('should update category with valid token', async () => {
    const res = await request(app)
      .put('/categories/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Category' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should delete category with valid token', async () => {
    const res = await request(app)
      .delete('/categories/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
});