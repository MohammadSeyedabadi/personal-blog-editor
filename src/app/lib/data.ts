import postgres from "postgres";
import { Post } from "./definitions";

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getPostWithTags(
  postId: number,
  lang: "en" | "fa"
): Promise<{ post: Post; tags: string[] }> {
  const postTable = lang === "en" ? "enposts" : "faposts";
  const tagTable = lang === "en" ? "entags" : "fatags";
  const postTagsTable = lang === "en" ? "enpoststags" : "fapoststags";

  const post = await sql`
    SELECT * FROM ${sql(postTable)} WHERE id = ${postId};
  `;

  const tags = await sql`
    SELECT t.name
    FROM ${sql(tagTable)} t
    JOIN ${sql(postTagsTable)} pt ON pt.tag_id = t.id
    WHERE pt.post_id = ${postId};
  `;

  return {
    post: post[0] as Post,
    tags: tags.map((tag) => tag.name),
  };
}
