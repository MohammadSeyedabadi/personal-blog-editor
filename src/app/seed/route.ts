import bcrypt from "bcryptjs";
import { sql } from "../lib/data";
import {
  invoices,
  customers,
  revenue,
  users,
  enPosts,
  faPosts,
} from "../lib/placeholder-data";

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );

  return insertedRevenue;
}

async function seedEnPosts() {
  await sql`
    CREATE TABLE IF NOT EXISTS enPosts (
      id SERIAL PRIMARY KEY,
      programming BOOLEAN NOT NULL,
      title TEXT NOT NULL UNIQUE,
      otherpagetitle TEXT NOT NULL UNIQUE DEFAULT 'Untitled',
      slug TEXT NOT NULL UNIQUE,
      lang TEXT NOT NULL,
      otherPageSlug TEXT NOT NULL UNIQUE,
      createdAt DATE NOT NULL,
      lastModified DATE NOT NULL,
      year INT NOT NULL,
      faYear INT NOT NULL,
      formattedCreatedAt TEXT NOT NULL,
      formattedCreatedAtMonthDay TEXT NOT NULL,
      faFormattedCreatedAt TEXT NOT NULL,
      faFormattedCreatedAtMonthDay TEXT NOT NULL,
      formattedLastModified TEXT NOT NULL,
      faFormattedLastModified TEXT NOT NULL,
      image TEXT,
      excerpt TEXT,
      content TEXT,
      fadigityear varchar(10)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enTags (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enPostsTags (
      post_id INTEGER REFERENCES enPosts(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES enTags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );
  `;
  // start from here
  for (const post of enPosts) {
    // await new Promise (r=>setTimeout(r,1500))
    const insertedPost = await sql`
      INSERT INTO enPosts (
      programming,
      lang,
      title,
      otherpagetitle,
      slug,
      otherPageSlug,
      createdAt,
      lastModified,
      year,
      faYear,
      formattedCreatedAt,
      formattedCreatedAtMonthDay,
      faFormattedCreatedAt,
      faFormattedCreatedAtMonthDay,
      formattedLastModified,
      faFormattedLastModified,
      image,
      excerpt,
      content)
      VALUES (
      ${post.programming}, 
      ${post.lang}, 
      ${post.title}, 
      ${post.slug}, 
      ${post.otherPageSlug}, 
      ${post.createdAt}, 
      ${post.lastModified}, 
      ${post.year},
      ${post.faYear}, 
      ${post.formattedCreatedAt}, 
      ${post.formattedCreatedAtMonthDay},
      ${post.faFormattedCreatedAt},
      ${post.faFormattedCreatedAtMonthDay},
      ${post.formattedLastModified},
      ${post.faFormattedLastModified},
      ${post.image},
      ${post.excerpt},
      ${post.content}
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `;

    const postId = insertedPost[0]?.id;

    if (postId) {
      for (const tag of post.tags) {
        const normalizedTag = tag.trim().toLowerCase();
        const tagInsert = await sql`
          INSERT INTO enTags (name)
          VALUES (${normalizedTag})
          ON CONFLICT (name) DO NOTHING
          RETURNING id;
        `;

        const tagId =
          tagInsert[0]?.id ??
          (await sql`SELECT id FROM enTags WHERE name = ${normalizedTag}`)
            [0]?.id;

        if (tagId) {
          await sql`
            INSERT INTO enPostsTags (post_id, tag_id)
            VALUES (${postId}, ${tagId})
            ON CONFLICT DO NOTHING;
          `;
        }
        ////////////////////
      }
    }
  }
}

async function seedFaPosts() {
  await sql`
    CREATE TABLE IF NOT EXISTS faPosts (
      id SERIAL PRIMARY KEY,
      programming BOOLEAN NOT NULL,
      title TEXT NOT NULL UNIQUE,
      otherpagetitle TEXT NOT NULL UNIQUE DEFAULT 'Untitled',
      slug TEXT NOT NULL UNIQUE,
      lang TEXT NOT NULL,
      otherPageSlug TEXT NOT NULL UNIQUE,
      createdAt DATE NOT NULL,
      lastModified DATE NOT NULL,
      year INT NOT NULL,
      faYear INT NOT NULL,
      formattedCreatedAt TEXT NOT NULL,
      formattedCreatedAtMonthDay TEXT NOT NULL,
      faFormattedCreatedAt TEXT NOT NULL,
      faFormattedCreatedAtMonthDay TEXT NOT NULL,
      formattedLastModified TEXT NOT NULL,
      faFormattedLastModified TEXT NOT NULL,
      image TEXT,
      excerpt TEXT,
      content TEXT,
      fadigityear varchar(10)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS faTags (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS faPostsTags (
      post_id INTEGER REFERENCES faPosts(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES faTags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );
  `;
  // start from here
  for (const post of faPosts) {
    await new Promise((r) => setTimeout(r, 150));
    const insertedPost = await sql`
      INSERT INTO faPosts (
      programming,
      lang,
      title,
      otherpagetitle,
      slug,
      otherPageSlug,
      createdAt,
      lastModified,
      year,
      faYear,
      formattedCreatedAt,
      formattedCreatedAtMonthDay,
      faFormattedCreatedAt,
      faFormattedCreatedAtMonthDay,
      formattedLastModified,
      faFormattedLastModified,
      image,
      excerpt,
      content)
      VALUES (
      ${post.programming}, 
      ${post.lang}, 
      ${post.title}, 
      ${post.slug}, 
      ${post.otherPageSlug}, 
      ${post.createdAt}, 
      ${post.lastModified}, 
      ${post.year},
      ${post.faYear}, 
      ${post.formattedCreatedAt}, 
      ${post.formattedCreatedAtMonthDay},
      ${post.faFormattedCreatedAt},
      ${post.faFormattedCreatedAtMonthDay},
      ${post.formattedLastModified},
      ${post.faFormattedLastModified},
      ${post.image},
      ${post.excerpt},
      ${post.content}
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `;

    const postId = insertedPost[0]?.id;

    if (postId) {
      for (const tag of post.tags) {
        await new Promise((r) => setTimeout(r, 150));

        const normalizedTag = tag.trim().toLowerCase();
        const tagInsert = await sql`
          INSERT INTO faTags (name)
          VALUES (${normalizedTag})
          ON CONFLICT (name) DO NOTHING
          RETURNING id;
        `;

        const tagId =
          tagInsert[0]?.id ??
          (await sql`SELECT id FROM faTags WHERE name = ${normalizedTag}`)
            [0]?.id;

        if (tagId) {
          await sql`
            INSERT INTO faPostsTags (post_id, tag_id)
            VALUES (${postId}, ${tagId})
            ON CONFLICT DO NOTHING;
          `;
        }
        ////////////////////
      }
    }
  }
}

export async function GET() {
  // return Response.json({
  //   message:
  //     "Uncomment this file and remove this line. You can delete this file when you are finished.",
  // });
  try {
    // const result = await sql.begin((sql) => [
      // await seedUsers();
      // await seedCustomers();
      // await seedInvoices();
      // await seedRevenue();
      // await seedEnPosts();
      // await seedFaPosts();
    // ]);

    // const allPosts = await sql`
    //   SELECT faPosts.title FROM faPosts
    // `;
    // console.log(allPosts, "aaaaaaaaaaaaa");
    // await sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    // await sql`ROLLBACK`;

    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ message: "Unknown error", error }, { status: 500 });
  }
}

// ✔ This ensures that the same post can't be linked to the same tag more than once.
// ✔ The combination of post_id + tag_id must be unique.
