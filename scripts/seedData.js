// scripts/seedData.js
const { Product, Category, Tag } = require('../models');

const seedData = async () => {
  try {
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

    // Datos completos de todos los libros de Maze Runner
    const mazeRunnerBooks = [
      // Serie principal
      {
        name: "The Maze Runner",
        description: "When Thomas wakes up in the lift, the only thing he can remember is his name. He's surrounded by strangers—boys whose memories are also gone. Outside the towering stone walls that surround them is a limitless, ever-changing maze. It's the only way out—and no one's ever made it through alive.",
        price: 12.99,
        stock: 50,
        isbn: "978-0385737951",
        publicationYear: 2009,
        publisher: "Delacorte Press",
        edition: "First Edition",
        language: "English",
        pageCount: 384,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[4].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Scorch Trials",
        description: "The Scorch Trials picks up where The Maze Runner left off. The Gladers have escaped the Maze, but now they face an even more treacherous challenge on the open roads of a devastated planet.",
        price: 13.99,
        stock: 45,
        isbn: "978-0385738750",
        publicationYear: 2010,
        publisher: "Delacorte Press",
        edition: "First Edition",
        language: "English",
        pageCount: 361,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Death Cure",
        description: "The third book in the Maze Runner series. Thomas knows that Wicked can't be trusted, but they say the time for lies is over, that they've collected all they can from the Trials and now must rely on the Gladers, with full memories restored, to help them with their ultimate mission.",
        price: 14.99,
        stock: 40,
        isbn: "978-0385738781",
        publicationYear: 2011,
        publisher: "Delacorte Press",
        edition: "First Edition",
        language: "English",
        pageCount: 325,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id]
      },
      {
        name: "The Kill Order",
        description: "The prequel to the Maze Runner series. Set thirteen years before the events of The Maze Runner, this novel tells the story of the sun flares that hit Earth and began the slow destruction of the world, and the outbreak of the deadly disease known as the Flare.",
        price: 15.99,
        stock: 35,
        isbn: "978-0385742887",
        publicationYear: 2012,
        publisher: "Delacorte Press",
        edition: "Prequel Edition",
        language: "English",
        pageCount: 327,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[3].id, tags[5].id, tags[6].id, tags[7].id, tags[8].id]
      },
      {
        name: "The Fever Code",
        description: "The fifth book in the Maze Runner series. This prequel novel reveals the story of how Thomas and Wicked built the Maze, and what happened before Thomas entered the Glade.",
        price: 16.99,
        stock: 30,
        isbn: "978-0553513138",
        publicationYear: 2016,
        publisher: "Delacorte Press",
        edition: "Prequel Edition",
        language: "English",
        pageCount: 368,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[3].id, tags[4].id, tags[6].id, tags[7].id, tags[8].id]
      },
      
      // Libros complementarios
      {
        name: "The Maze Runner Files",
        description: "A companion book to the Maze Runner series featuring classified documents, blueprints of the Maze, and profiles of key characters from WICKED.",
        price: 9.99,
        stock: 25,
        isbn: "978-0553536816",
        publicationYear: 2013,
        publisher: "Delacorte Press",
        edition: "Companion Guide",
        language: "English",
        pageCount: 192,
        coverType: "Paperback",
        genre: "Companion Guide",
        ageRange: "12-18",
        categoryId: categories[3].id,
        tagIds: [tags[8].id, tags[4].id]
      },
      {
        name: "Crank Palace",
        description: "A new story set in the Maze Runner universe, telling the story of Newt like never before, from inside his own mind, as he navigates the Crank Palace.",
        price: 11.99,
        stock: 28,
        isbn: "978-1984815952",
        publicationYear: 2020,
        publisher: "Delacorte Press",
        edition: "Special Edition",
        language: "English",
        pageCount: 288,
        coverType: "Paperback",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[8].id, tags[5].id, tags[6].id]
      },
      
      // Ediciones especiales
      {
        name: "The Maze Runner Series Box Set",
        description: "Complete box set containing all five main novels of the Maze Runner series in a beautiful collector's edition.",
        price: 59.99,
        stock: 20,
        isbn: "978-1984815969",
        publicationYear: 2020,
        publisher: "Delacorte Press",
        edition: "Box Set",
        language: "English",
        pageCount: 1765,
        coverType: "Hardcover",
        genre: "Young Adult Science Fiction",
        ageRange: "14-18",
        categoryId: categories[0].id,
        tagIds: [tags[0].id, tags[1].id, tags[8].id, tags[9].id]
      },
      {
        name: "The Maze Runner: The Graphic Novel",
        description: "The first book in the Maze Runner series adapted into a stunning graphic novel format.",
        price: 18.99,
        stock: 22,
        isbn: "978-1984894605",
        publicationYear: 2018,
        publisher: "Viz Media",
        edition: "Graphic Novel",
        language: "English",
        pageCount: 224,
        coverType: "Paperback",
        genre: "Graphic Novel",
        ageRange: "12-18",
        categoryId: categories[0].id,
        tagIds: [tags[2].id, tags[8].id, tags[3].id]
      }
    ];

    // Crear productos
    for (const bookData of mazeRunnerBooks) {
      const { tagIds, ...productData } = bookData;
      
      // Generar slug
      const slug = require('slugify')(productData.name, { 
        lower: true, 
        strict: true 
      });
      
      const product = await Product.create({
        ...productData,
        slug
      });
      
      if (tagIds && tagIds.length > 0) {
        await product.setTags(tagIds);
      }
      
      console.log(`Created: ${product.name}`);
    }

    console.log('Maze Runner books seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;