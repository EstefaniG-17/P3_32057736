// scripts/seedData.js - semillas para libros Maze Runner
const { sequelize, Category, Tag, Product } = require('../models');

const seedData = async () => {
  try {
    // Para desarrollo queremos partir de una base conocida
    await sequelize.sync({ force: true });

    // Crear categorías (aseguramos al menos 4, porque el dataset usa categories[3])
    const categoriesData = [
      { name: 'Books', description: 'Libros y novelas' },
      { name: 'Comics', description: 'Cómics y novelas gráficas' },
      { name: 'Box Sets', description: 'Ediciones en caja' },
      { name: 'Companion', description: 'Libros complementarios y guías' }
    ];
    const categories = await Category.bulkCreate(categoriesData);

    // Crear tags en el orden esperado por los índices usados en el dataset
    const tagsData = [
      'dystopian', // 0
      'young-adult', // 1
      'graphic-novel', // 2
      'companion', // 3
      'collector', // 4
      'ebook', // 5
      'special-edition', // 6
      'box-set', // 7
      'paperback', // 8
      'hardcover' // 9
    ].map(name => ({ name }));
    const tags = await Tag.bulkCreate(tagsData);

    // Arreglo de libros (usamos índices de tags, luego los convertimos a ids)
    const mazeRunnerBooks = [
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
        tagIndices: [0,1,2,3,4,6,7]
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
        tagIndices: [0,1,2,3,5,6,7]
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
        tagIndices: [0,1,2,3,5,6,7]
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
        tagIndices: [0,3,5,6,7,8]
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
        tagIndices: [0,3,4,6,7,8]
      },
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
        tagIndices: [8,4]
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
        tagIndices: [0,8,5,6]
      },
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
        tagIndices: [0,1,8,9]
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
        tagIndices: [2,8,3]
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
        tagIndices: [0,2]
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
        tagIndices: [0,2]
      }
    ];

    // Crear productos y asociar tags
    for (const pb of mazeRunnerBooks) {
      const tagIds = (pb.tagIndices || []).map(i => tags[i].id).filter(Boolean);
      const data = {
        name: pb.name,
        slug: pb.slug,
        description: pb.description,
        price: pb.price,
        stock: pb.stock,
        author: pb.author,
        isbn: pb.isbn,
        publicationYear: pb.publicationYear,
        publisher: pb.publisher,
        language: pb.language,
        pages: pb.pages,
        format: pb.format,
        isAvailable: pb.isAvailable,
        CategoryId: pb.categoryId
      };
      const prod = await Product.create(data);
      if (tagIds.length) await prod.setTags(tagIds);
    }

    console.log('✅ Maze Runner seed completed');
  } catch (error) {
    console.error('❌ Seed error:', error && error.stack ? error.stack : error);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;