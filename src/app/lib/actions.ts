"use server";
import { sql } from "./data";
import { generateLocalizedDateMetadata, generateSlug } from "./utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const lang = formData.get("lang");
  if (typeof lang !== "string") throw new Error("lang must be a string");

  const programming = formData.get("programming") === "true";

  const title = formData.get("title");
  if (typeof title !== "string") throw new Error("title must be a string");

  const slug = generateSlug(title); // assuming `generateSlug` expects a string

  const otherPageTitle = formData.get("other-page-title");
  if (typeof otherPageTitle !== "string")
    throw new Error("otherPageSlug must be a string");

  const otherPageSlug = formData.get("other-page-slug");
  if (typeof otherPageSlug !== "string")
    throw new Error("otherPageSlug must be a string");

  const dateMetaData = generateLocalizedDateMetadata(); // types are in the function

  const image = formData.get("image");
  if (typeof image !== "string") throw new Error("image must be a string");

  const excerpt = formData.get("excerpt");
  if (typeof excerpt !== "string") throw new Error("excerpt must be a string");

  const content = formData.get("content");
  if (typeof content !== "string") throw new Error("content must be a string");

  const rawTags = formData.get("tags");
  if (typeof rawTags !== "string") throw new Error("tags must be a string");

  const tags = rawTags
    .split("/")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const postTable = lang === "en" ? "enposts" : "faposts";
  const tagTable = lang === "en" ? "entags" : "fatags";
  const postTagsTable = lang === "en" ? "enpoststags" : "fapoststags";

  try {
    await sql.begin(async (tx) => {
      const insertedPost = await tx<{ id: number }[]>`
      INSERT INTO ${sql(postTable)} (
        lang, programming, title, slug, otherpagetitle, otherpageslug,
        createdAt, lastModified,
        formattedCreatedAt, formattedCreatedAtMonthDay,
        faFormattedCreatedAt, faFormattedCreatedAtMonthDay,
        formattedLastModified, faFormattedLastModified,
        year, faYear, fadigityear,
        image, excerpt, content
      ) VALUES (
        ${lang}, ${programming}, ${title}, ${slug},${otherPageTitle}, ${otherPageSlug},
        ${dateMetaData.createdat}, ${dateMetaData.lastmodified},
        ${dateMetaData.formattedcreatedat}, ${
        dateMetaData.formattedcreatedatmonthday
      },
        ${dateMetaData.faFormattedcreatedat}, ${
        dateMetaData.faformattedcreatedatmonthday
      },
        ${dateMetaData.formattedlastmodified}, ${
        dateMetaData.faformattedlastmodified
      },
        ${dateMetaData.year}, ${dateMetaData.fayear}, ${
        dateMetaData.fadigityear
      },
        ${image}, ${excerpt}, ${content}
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `;

      const postId = insertedPost[0]?.id;
      if (!postId) throw new Error("Post already exists or insert failed");

      for (const tag of tags) {
        const tagInsert = await tx<{ id: number }[]>`
        INSERT INTO ${sql(tagTable)} (name)
        VALUES (${tag})
        ON CONFLICT (name) DO NOTHING
        RETURNING id;
      `;

        const tagId =
          tagInsert[0]?.id ??
          (
            await tx<{ id: number }[]>`
          SELECT id FROM ${sql(tagTable)} WHERE name = ${tag}
        `
          )[0]?.id;

        if (tagId) {
          await tx`
          INSERT INTO ${sql(postTagsTable)} (post_id, tag_id)
          VALUES (${postId}, ${tagId})
          ON CONFLICT DO NOTHING;
        `;
        }
      }
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
  // Calling revalidatePath to clear the client cache and make a new server request.
  // Calling redirect to redirect the user to the invoice's page.
}

export async function updatePost(postId: number, formData: FormData) {
  const lang = formData.get("lang");
  if (typeof lang !== "string") throw new Error("lang must be a string");

  const programming = formData.get("programming") === "true";

  const title = formData.get("title");
  if (typeof title !== "string") throw new Error("title must be a string");

  const slug = generateSlug(title);

  const otherPageTitle = formData.get("other-page-title");
  if (typeof otherPageTitle !== "string")
    throw new Error("otherPageSlug must be a string");

  const otherPageSlug = formData.get("other-page-slug");
  if (typeof otherPageSlug !== "string")
    throw new Error("otherPageSlug must be a string");

  const image = formData.get("image");
  if (typeof image !== "string") throw new Error("image must be a string");

  const excerpt = formData.get("excerpt");
  if (typeof excerpt !== "string") throw new Error("excerpt must be a string");

  const content = formData.get("content");
  if (typeof content !== "string") throw new Error("content must be a string");

  const rawTags = formData.get("tags");
  if (typeof rawTags !== "string") throw new Error("tags must be a string");

  const tags = rawTags
    .split("/")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const postTable = lang === "en" ? "enposts" : "faposts";
  const tagTable = lang === "en" ? "entags" : "fatags";
  const postTagsTable = lang === "en" ? "enpoststags" : "fapoststags";

  try {
    await sql.begin(async (tx) => {
      // ✅ Update the post
      await tx`
      UPDATE ${sql(postTable)}
      SET
        programming = ${programming},
        title = ${title},
        slug = ${slug},
        otherpagetitle = ${otherPageTitle},
        otherpageslug = ${otherPageSlug},
        image = ${image},
        excerpt = ${excerpt},
        content = ${content},
        lastModified = ${generateLocalizedDateMetadata().lastmodified},
        formattedLastModified = ${
          generateLocalizedDateMetadata().formattedlastmodified
        },
        faFormattedLastModified = ${
          generateLocalizedDateMetadata().faformattedlastmodified
        }
      WHERE id = ${postId};
    `;

      // ✅ Upsert tags
      // postgres.js expects an array of arrays for multi-row inserts.
      // we could also do it like create post, but used a different method here
      await tx`
      INSERT INTO ${sql(tagTable)} (name)
      VALUES ${sql(tags.map((name) => [name]))}
      ON CONFLICT (name) DO NOTHING;
    `;

      // ✅ Get tag IDs
      const tagRows = await tx<{ id: number; name: string }[]>`
      SELECT id FROM ${sql(tagTable)} WHERE name = ANY(${sql.array(tags)});
    `;

      // ✅ Clear existing tag links
      await tx`
      DELETE FROM ${sql(postTagsTable)} WHERE post_id = ${postId};
    `;

      // ✅ Insert new tag links
      await tx`
      INSERT INTO ${sql(postTagsTable)} (post_id, tag_id)
      VALUES ${sql(tagRows.map((tag) => [postId, tag.id]))};
    `;
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePost(postId: number, formData: FormData) {
  const lang = formData.get("lang");
  if (typeof lang !== "string") throw new Error("lang must be a string");
  const postTable = lang === "en" ? "enposts" : "faposts";
  const tagTable = lang === "en" ? "entags" : "fatags";
  const postTagsTable = lang === "en" ? "enpoststags" : "fapoststags";
  try {
    const existingPost = await sql`SELECT id FROM ${sql(
      postTable
    )} WHERE id = ${postId}`;
    if (existingPost.length === 0) throw new Error("Post not found");
    // may change the code for a large system, but for my usecase it is the best.
    await sql.begin(async (tx) => {
      await tx`
      DELETE FROM ${sql(postTable)} WHERE id = ${postId};
    `;

      await tx`
      DELETE FROM ${sql(tagTable)}
      WHERE id NOT IN (SELECT tag_id FROM ${sql(postTagsTable)})
    `;
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// By adding the 'use server', you mark all the exported functions within the file as Server Actions.
// These server functions can then be imported and used in Client and Server components.
// Any functions included in this file that are not used will be automatically removed from the final application bundle.
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action.
// But for this course, we'll keep them all organized in a separate file.
// // We recommend having a separate file for your actions.
// Good to know: In HTML, you'd pass a URL to the action attribute. This URL would be the destination where your form data should be submitted (usually an API endpoint).

// However, in React, the action attribute is considered a special prop - meaning React builds on top of it to allow actions to be invoked.

// Behind the scenes, Server Actions create a POST API endpoint. This is why you don't need to create API endpoints manually when using Server Actions.
