const request = require('supertest');
const app = require('../src/app');
const { Product, Category, Tag } = require('../src/models');

describe('Product Self-Healing URLs', () => {
  it('should redirect to correct slug when slug is incorrect', async () => {
    const product = await Product.create({
      name: 'Iron Man Mark L Funko Pop',
      price: 34.99,
      slug: 'iron-man-mark-l-funko-pop'
    });

    await request(app)
      .get(`/products/p/${product.id}-wrong-slug`)
      .expect(301)
      .expect('Location', `/products/p/${product.id}-iron-man-mark-l-funko-pop`);
  });
});


describe('Products API', () => {
  let token;
  let categoryId;
  let tagId;
  let productId;

  beforeAll(async () => {
    // Sincronizar base de datos de prueba
    await sequelize.sync({ force: true });
    
    // Crear token JWT de prueba (simulado)
    token = 'test-jwt-token';
  });

  describe('POST /categories (Protected)', () => {
    it('should create a category with valid token', async () => {
      const response = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Avengers',
          description: 'Avengers movie collection'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('Avengers');
      categoryId = response.body.data.id;
    });

    it('should reject without token', async () => {
      const response = await request(app)
        .post('/categories')
        .send({
          name: 'Test Category',
          description: 'Test description'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /tags (Protected)', () => {
    it('should create a tag with valid token', async () => {
      const response = await request(app)
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'limited-edition'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe('limited-edition');
      tagId = response.body.data.id;
    });
  });

  describe('POST /products (Protected)', () => {
    it('should create a product with valid token', async () => {
    const productData = {
      name: "The Maze Runner",
      description: "When Thomas wakes up in the lift...",
      price: 12.99,
      stock: 50,
      sku: "BK001",
      author: "James Dashner",
      isbn: "978-0385737951",
      publicationYear: 2009,
      publisher: "Delacorte Press",
      language: "English",
      pages: 384,
      format: "Tapa dura",
      isAvailable: true,
      CategoryId: categoryId,
      tags: [tagId]
    };

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);
    expect(response.body.data.name).toBe('The Maze Runner');
    expect(response.body.data.author).toBe('James Dashner');
    expect(response.body.data.isbn).toBe('978-0385737951');
    // Guardar el id creado para pruebas posteriores
    productId = response.body.data.id;
  });
});

  describe('GET /products (Public)', () => {
    it('should return products with pagination', async () => {
      const response = await request(app)
        .get('/products')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.products).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
    });

    it('should filter products by publisher', async () => {
      const response = await request(app)
        .get('/products')
        .query({ publisher: 'Delacorte' });

      expect(response.status).toBe(200);
      expect(response.body.data.products.length).toBeGreaterThan(0);
    });

    it('should filter products by author', async () => {
      const response = await request(app)
        .get('/products')
        .query({ author: 'James Dashner' });

      expect(response.status).toBe(200);
      expect(response.body.data.products[0].author).toBe('James Dashner');
    });
  });

  describe('GET /p/:id-:slug (Public - Self-healing)', () => {
    it('should return product with correct slug', async () => {
      const response = await request(app)
        .get(`/p/${productId}-the-maze-runner-bk001`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(productId);
    });

    it('should redirect with 301 when slug is incorrect', async () => {
      const response = await request(app)
        .get(`/p/${productId}-wrong-slug-name`)
        .redirects(0); // Prevenir redirección automática

      expect(response.status).toBe(301);
      expect(response.header.location).toContain(`/p/${productId}-the-maze-runner-bk001`);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});