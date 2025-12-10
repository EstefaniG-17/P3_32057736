const request = require('supertest');
const app = require('../app');
const { Product } = require('../models');
const { sequelize } = require('../models/index');

describe('Self-Healing URL', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should redirect to correct slug when slug is wrong', async () => {
    // Crear producto de prueba (libro)
    const product = await Product.create({
      name: 'The Maze Runner - SelfHealing',
      price: 12.99,
      stock: 1,
      sku: 'SH001',
      author: 'James Dashner',
      isbn: '978-0385737951'
    });

    await request(app)
      .get(`/p/${product.id}-wrong-slug`)
      .expect(301)
      .expect('Location', `/p/${product.id}-${product.slug}`);
  });

  it('should return product when slug is correct', async () => {
    const product = await Product.create({
      name: 'Crank Palace',
      price: 11.99,
      stock: 1,
      sku: 'SH002',
      author: 'James Dashner',
      isbn: '978-1984815952'
    });

    await request(app)
      .get(`/p/${product.id}-${product.slug}`)
      .expect(200);
  });
});