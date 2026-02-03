import type { Metadata } from "next";
import { getPostWithTags } from "@/app/lib/data";
import UpdateForm from "./update-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Create post | Update",
};

export default async function Page(props: {
  params: Promise<{ lang: "en" | "fa"; id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);
  const lang: "en" | "fa" = params.lang;
  if (lang !== "en" && lang !== "fa") {
    notFound();
  }

  const { post, tags } = await getPostWithTags(id, lang);
  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white/90 p-4 rounded md:max-h-full md:overflow-auto">
      <UpdateForm post={post} tags={tags} />
    </main>
  );
}
