import type { Metadata } from "next";
import { sql } from "../lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create post | Home",
};

// export const dynamic = "force-static";

type Post = {
  id: number;
  title: string;
  slug: string;
  formattedcreatedatmonthday?: string;
  faformattedcreatedatmonthday?: string;
  year?: number;
  fayear?: number;
  fadigityear?: string;
};

export default async function Page() {
  try {
    const enposts = await sql<
      Post[]
    >`SELECT id, title, slug, formattedcreatedatmonthday, year
                FROM enPosts
                ORDER BY year DESC, createdAt DESC;
                `;
    const sortedEnPosts = sortPosts(enposts, "year");
    const faPosts = await sql<
      Post[]
    >`SELECT id, title, slug, faformattedcreatedatmonthday, fayear, fadigityear
                FROM faPosts
                ORDER BY fayear DESC, createdAt DESC;
                `;
    const sortedFaPosts = sortPosts(faPosts, "fayear");
    return (
      <div className="md:flex md:justify-between bg-white/90 p-4 rounded md:max-h-full md:overflow-auto h-full">
        <div>
          <h1 className="text-2xl font-bold mb-6">📅 English posts</h1>

          {sortedEnPosts.map((group) => (
            <section key={group.year} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {group.year}
              </h2>
              <ul className="space-y-1">
                {group.posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/dashboard/update/en/${post.id}`}
                      className="text-blue-600 hover:underline flex active:scale-95"
                    >
                      {post.formattedcreatedatmonthday} — {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div dir="rtl">
          <h1 className="text-2xl font-bold mb-6">📅 پست های فارسی</h1>

          {sortedFaPosts.map((group) => (
            
            <section key={group.year} className="mb-8">
             
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {group.posts[0].fadigityear}
              </h2>
              <ul className="space-y-1">
                {group.posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/dashboard/update/fa/${post.id}`}
                      className="text-blue-600 hover:underline flex active:scale-95"
                    >
                      {post.faformattedcreatedatmonthday} — {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts data.");
  }
}

function sortPosts(posts: Post[], groupBy: "year" | "fayear") {
  // Group posts by year
  const grouped = posts.reduce((acc, post) => {
    const key = groupBy === "year" ? post.year : post.fayear;
    if (typeof key !== "number") {
      console.log("Skip posts without a valid year");
      return acc;
    }
    if (!acc[key]) acc[key] = []; // create year group if not exist
    acc[key].push(post); // add the post into the group
    return acc;
  }, {} as Record<number, Post[]>);

  // Turn grouped object into a sorted array
  const years = Object.entries(grouped)
    .map(([year, posts]) => ({
      year: Number(year), //Because Object.entries() always returns the keys of an object as strings, even if the original keys were numbers.
      posts,
    }))
    .sort((a, b) => b.year - a.year); // newest year first

  return years;
}

// array.reduce((accumulator, currentItem) => {
//   // update the accumulator
//   return accumulator;
// }, initialValue of the accumulator);

// const grouped = {};

// for (const post of posts) {
//   if (!grouped[post.year]) {
//     grouped[post.year] = [];
//   }
//   grouped[post.year].push(post);
// }

// ### 🧁 So to answer directly:
// Yes — `enposts` is *already an array-like result*, but not typed correctly.
// Adding `<Post[]>` doesn’t convert it into an array — it just **tells TypeScript** to treat it like one, so you get autocomplete, type safety, and cleaner dev experience.

// Let me know if you want a little type-checking trick to make sure all your queries return safe, expected shapes. You’re doing fantastic at catching the details that elevate your code from working to robust.
