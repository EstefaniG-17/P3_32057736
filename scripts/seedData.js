// scripts/seedData.js
const { Product, Category, Tag } = require('../models');

const seedData = async () => {
  try {
    console.log('=== INICIANDO SEED DE DATOS ===\n');

    // Crear categorías
    const categories = await Category.bulkCreate([
      {
        name: "Young Adult Fiction",
        description: "Books targeted at teenagers and young adults"
      },
      {
        name: "Science Fiction",
        description: "Fiction based on imagined future scientific or technological advances"
      },
      {
        name: "Dystopian",
        description: "Fiction set in a society that is undesirable or frightening"
      },
      {
        name: "Action & Adventure",
        description: "Fast-paced stories with exciting adventures"
      }
    ], { ignoreDuplicates: true });

    console.log('✓ Categorías creadas');

    // Crear tags
    const tags = await Tag.bulkCreate([
      { name: "Bestseller" },
      { name: "Trilogy" },
      { name: "Movie Adaptation" },
      { name: "Adventure" },
      { name: "Mystery" },
      { name: "Thriller" },
      { name: "Post-Apocalyptic" },
      { name: "Survival" },
      { name: "Series" },
      { name: "Award Winning" }
    ], { ignoreDuplicates: true });

    console.log('✓ Tags creados');

    // Datos CORREGIDOS - usando los campos exactos del modelo Product.js
    const mazeRunnerBooks = [
      // Serie principal
      {
        name: "The Maze Runner",
        slug: "the-maze-runner",
        description: "When Thomas wakes up in the lift, the only thing he can remember is his name. He's surrounded by strangers—boys whose memories are also gone. Outside the towering stone walls that surround them is a limitless, ever-changing maze. It's the only way out—and no one's ever made it through alive.",
        price: 12.99,
        categoryId: categories[0].id,
        stock: 50,
        author: "James Dashner",
        isbn: "978-0385737951",
        publicationYear: 2009,
        publisher: "Delacorte Press",
        language: "English",
        pages: 384,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[4].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Scorch Trials",
        slug: "the-scorch-trials",
        description: "The Scorch Trials picks up where The Maze Runner left off. The Gladers have escaped the Maze, but now they face an even more treacherous challenge on the open roads of a devastated planet.",
        price: 13.99,
        categoryId: categories[0].id,
        stock: 45,
        author: "James Dashner",
        isbn: "978-0385738750",
        publicationYear: 2010,
        publisher: "Delacorte Press",
        language: "English",
        pages: 361,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Death Cure",
        slug: "the-death-cure",
        description: "The third book in the Maze Runner series. Thomas knows that Wicked can't be trusted, but they say the time for lies is over, that they've collected all they can from the Trials and now must rely on the Gladers, with full memories restored, to help them with their ultimate mission.",
        price: 14.99,
        categoryId: categories[0].id,
        stock: 40,
        author: "James Dashner",
        isbn: "978-0385738781",
        publicationYear: 2011,
        publisher: "Delacorte Press",
        language: "English",
        pages: 325,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Kill Order",
        slug: "the-kill-order",
        description: "The prequel to the Maze Runner series. Set thirteen years before the events of The Maze Runner, this novel tells the story of the sun flares that hit Earth and began the slow destruction of the world, and the outbreak of the deadly disease known as the Flare.",
        price: 15.99,
        categoryId: categories[0].id,
        stock: 35,
        author: "James Dashner",
        isbn: "978-0385742887",
        publicationYear: 2012,
        publisher: "Delacorte Press",
        language: "English",
        pages: 327,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id, tags[8].id]
      },
      {
        name: "The Fever Code",
        slug: "the-fever-code",
        description: "The fifth book in the Maze Runner series. This prequel novel reveals the story of how Thomas and Wicked built the Maze, and what happened before Thomas entered the Glade.",
        price: 16.99,
        categoryId: categories[0].id,
        stock: 30,
        author: "James Dashner",
        isbn: "978-0553513138",
        publicationYear: 2016,
        publisher: "Delacorte Press",
        language: "English",
        pages: 368,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[3].id, tags[4].id, tags[6].id, tags[7].id, tags[8].id]
      },
      
      // Libros complementarios
      {
        name: "The Maze Runner Files",
        slug: "the-maze-runner-files",
        description: "A companion book to the Maze Runner series featuring classified documents, blueprints of the Maze, and profiles of key characters from WICKED.",
        price: 9.99,
        categoryId: categories[3].id,
        stock: 25,
        author: "James Dashner",
        isbn: "978-0553536816",
        publicationYear: 2013,
        publisher: "Delacorte Press",
        language: "English",
        pages: 192,
        format: "Tapa blanda",
        isAvailable: true,
        tagIds: [tags[8].id, tags[4].id]
      },
      {
        name: "Crank Palace",
        slug: "crank-palace",
        description: "A new story set in the Maze Runner universe, telling the story of Newt like never before, from inside his own mind, as he navigates the Crank Palace.",
        price: 11.99,
        categoryId: categories[0].id,
        stock: 28,
        author: "James Dashner",
        isbn: "978-1984815952",
        publicationYear: 2020,
        publisher: "Delacorte Press",
        language: "English",
        pages: 288,
        format: "Tapa blanda",
        isAvailable: true,
        tagIds: [tags[0].id, tags[8].id, tags[5].id, tags[6].id]
      },
      
      // Ediciones especiales
      {
        name: "The Maze Runner Series Box Set",
        slug: "the-maze-runner-series-box-set",
        description: "Complete box set containing all five main novels of the Maze Runner series in a beautiful collector's edition.",
        price: 59.99,
        categoryId: categories[0].id,
        stock: 20,
        author: "James Dashner",
        isbn: "978-1984815969",
        publicationYear: 2020,
        publisher: "Delacorte Press",
        language: "English",
        pages: 1765,
        format: "Tapa dura",
        isAvailable: true,
        tagIds: [tags[0].id, tags[1].id, tags[8].id, tags[9].id]
      },
      {
        name: "The Maze Runner: The Graphic Novel",
        slug: "the-maze-runner-the-graphic-novel",
        description: "The first book in the Maze Runner series adapted into a stunning graphic novel format.",
        price: 18.99,
        categoryId: categories[0].id,
        stock: 22,
        author: "James Dashner",
        isbn: "978-1984894605",
        publicationYear: 2018,
        publisher: "Viz Media",
        language: "English",
        pages: 224,
        format: "Tapa blanda",
        isAvailable: true,
        tagIds: [tags[2].id, tags[8].id, tags[3].id]
      },
      {
        name: "Maze Runner: E-book Edition",
        slug: "maze-runner-e-book-edition",
        description: "Digital edition of The Maze Runner for e-readers and tablets.",
        price: 8.99,
        categoryId: categories[0].id,
        stock: 100,
        author: "James Dashner",
        isbn: "978-0385737951-ebook",
        publicationYear: 2009,
        publisher: "Delacorte Press",
        language: "English",
        pages: 384,
        format: "E-book",
        isAvailable: true,
        tagIds: [tags[0].id, tags[2].id]
      },
      {
        name: "The Maze Runner (Spanish Edition)",
        slug: "the-maze-runner-spanish-edition",
        description: "Edición en español de The Maze Runner.",
        price: 11.99,
        categoryId: categories[0].id,
        stock: 15,
        author: "James Dashner",
        isbn: "978-6073134321",
        publicationYear: 2014,
        publisher: "V&R Editoras",
        language: "Español",
        pages: 400,
        format: "Tapa blanda",
        isAvailable: true,
        tagIds: [tags[0].id, tags[2].id]
      }
    ];

    console.log('\n✓ Creando productos...\n');

    // Crear productos
    for (const bookData of mazeRunnerBooks) {
      const { tagIds, ...productData } = bookData;
      
      // El slug ya está definido en cada objeto, pero si no, se genera automáticamente por el hook
      const product = await Product.create(productData);
      
      if (tagIds && tagIds.length > 0) {
        await product.setTags(tagIds);
      }
      
      console.log(`✓ Creado: ${product.name} (Slug: ${product.slug})`);
    }

    console.log('\n=== VERIFICACIÓN FINAL ===');
    
    // Contar productos
    const totalProducts = await Product.count();
    console.log(`✓ Total de productos creados: ${totalProducts}`);
    
    // Verificar algunos productos
    const sampleProducts = await Product.findAll({
      limit: 3,
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });
    
    console.log('\n✓ Muestra de productos:');
    sampleProducts.forEach(p => {
      console.log(`  - ${p.name} (${p.category.name}) - $${p.price} - Stock: ${p.stock}`);
      console.log(`    Tags: ${p.tags.map(t => t.name).join(', ')}`);
    });

    console.log('\n✅ SEED COMPLETADO EXITOSAMENTE!');
    console.log('\nPara probar el endpoint:');
    console.log('1. curl http://localhost:8080/products');
    console.log('2. curl "http://localhost:8080/products?page=1&limit=5"');
    console.log('3. curl "http://localhost:8080/products?category=1"');
    console.log('4. curl "http://localhost:8080/products?author=James"');
    
  } catch (error) {
    console.error('\n❌ Error en el seed:', error.message);
    console.error('Stack:', error.stack);
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  seedData().then(() => {
    console.log('\nProceso terminado.');
    process.exit(0);
  }).catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = seedData;