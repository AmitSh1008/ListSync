const { Client } = require('pg');

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

async function createTables() {
  try {
    // Query to create the 'users' table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Query to create the 'lists' table
    const createListsTable = `
      CREATE TABLE IF NOT EXISTS public.lists (
        id SERIAL PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id)
          REFERENCES public.users (id)
          ON UPDATE NO ACTION
          ON DELETE CASCADE
      );
    `;

    // Query to create the 'items' table
    const createItemsTable = `
      CREATE TABLE IF NOT EXISTS public.items (
        id SERIAL PRIMARY KEY,
        list_id INT,
        name VARCHAR(255) NOT NULL,
        status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_list FOREIGN KEY (list_id)
          REFERENCES public.lists (id)
          ON UPDATE NO ACTION
          ON DELETE CASCADE
      );
    `;

    // Query to create the 'list_partners' table
    const createListPartnersTable = `
      CREATE TABLE IF NOT EXISTS public.list_partners (
        id SERIAL PRIMARY KEY,
        list_id INT,
        partner_email VARCHAR(255) NOT NULL,
        CONSTRAINT fk_list_partner FOREIGN KEY (list_id)
          REFERENCES public.lists (id)
          ON UPDATE NO ACTION
          ON DELETE CASCADE
      );
    `;

    // Execute the table creation queries
    await db.query(createUsersTable);
    await db.query(createListsTable);
    await db.query(createItemsTable);
    await db.query(createListPartnersTable);

    console.log("Tables created successfully (if they didn't already exist)");

  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

module.exports = db;