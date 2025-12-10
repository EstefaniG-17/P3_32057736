const request = require('supertest');
const app = require('../app');

describe('Product Filters', () => {
  describe('GET /products with filters', () => {
    it('should filter by publisher', async () => {
      const response = await request(app)
        .get('/products')
        .query({ publisher: 'Delacorte' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      // Todos los productos deben ser del publisher Delacorte (o contener esa palabra)
      response.body.data.products.forEach(product => {
        expect(product.publisher).toMatch(/Delacorte/i);
      });
    });

    it('should filter by author', async () => {
      const response = await request(app)
        .get('/products')
        .query({ author: 'James Dashner' });

      expect(response.status).toBe(200);
      response.body.data.products.forEach(product => {
        expect(product.author).toMatch(/James Dashner/i);
      });
    });

    it('should filter by format', async () => {
      const response = await request(app)
        .get('/products')
        .query({ format: 'Tapa blanda' });

      expect(response.status).toBe(200);
      response.body.data.products.forEach(product => {
        expect(product.format).toBe('Tapa blanda');
      });
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/products')
        .query({ price_min: 20, price_max: 30 });

      expect(response.status).toBe(200);
      response.body.data.products.forEach(product => {
        expect(parseFloat(product.price)).toBeGreaterThanOrEqual(20);
        expect(parseFloat(product.price)).toBeLessThanOrEqual(30);
      });
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/products')
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.products.length).toBeLessThanOrEqual(2);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 2);
    });
  });
});