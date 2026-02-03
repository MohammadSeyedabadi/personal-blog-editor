"use client";
import { generateSlug } from "@/app/lib/utils";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Post } from "@/app/lib/definitions";
import { updatePost, deletePost } from "@/app/lib/actions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UpdateForm({
  post,
  tags,
}: {
  post: Post;
  tags: string[];
}) {
  const [content, setContent] = useState(post.content);
  const [slug, setSlug] = useState(post.slug);
  const [otherPageSlug, setOtherPageSlug] = useState(post.otherpageslug);
  const updatePostWithId = updatePost.bind(null, post.id); // creates a new function that, when called, will automatically pass post.id as the first argument to updatePost.
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const deletePostWithId = deletePost.bind(null, post.id);
  return (
    <>
      <form action={updatePostWithId} className="mb-2">
        <div>
          <div className="LANGUAGE mb-4">
            <span className="font-bold">Language : </span>
            <label htmlFor="english">English </label>
            <input
              type="radio"
              name="lang"
              id="english"
              value="en"
              defaultChecked={post.lang === "en"}
              className="me-5"
            />
            <label htmlFor="farsi">Farsi </label>
            <input
              type="radio"
              name="lang"
              id="farsi"
              value="fa"
              defaultChecked={post.lang === "fa"}
            />
          </div>
          <div className="PROGRAMMING mb-4">
            <span className="font-bold">Programming : </span>
            <label htmlFor="programming-true">True </label>
            <input
              type="radio"
              name="programming"
              id="programming-true"
              value="true"
              defaultChecked={post.programming}
              className="me-5"
            />
            <label htmlFor="programming-false">False </label>
            <input
              type="radio"
              name="programming"
              id="programming-false"
              value="false"
              defaultChecked={!post.programming}
            />
          </div>
          <div className="TITLE mb-4">
            <div>
              <label htmlFor="title" className="font-bold block">
                Title :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="title"
                id="title"
                defaultValue={post.title}
                required
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
                onChange={(e) => setSlug(generateSlug(e.target.value))}
              />
            </div>
          </div>
          <div className="SLUG mb-4">
            <div>
              <div className="font-bold">Slug :</div>
            </div>
            <div>
              <input
                type="text"
                name="slug"
                required
                readOnly
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none cursor-not-allowed"
                defaultValue={post.slug}
              />
            </div>
          </div>
          <div className="OTHER-PAGE-TITLE mb-4">
            <div>
              <label htmlFor="other-page-title" className="font-bold block">
                Other page title :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="other-page-title"
                id="other-page-title"
                required
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
                defaultValue={post.otherpagetitle}
                onChange={(e) => setOtherPageSlug(generateSlug(e.target.value))}
              />
            </div>
          </div>
          <div className="OTHER-PAGE-SLUG mb-4">
            <div>
              <label htmlFor="other-page-slug" className="font-bold block">
                Other page slug :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="other-page-slug"
                id="other-page-slug"
                required
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none cursor-not-allowed"
                readOnly
                value={otherPageSlug}
              />
            </div>
          </div>
          <div className="IMAGE mb-4">
            <div>
              <label htmlFor="image" className="font-bold block">
                Image (optional) :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="image"
                id="image"
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
                defaultValue={post.image}
              />
            </div>
          </div>
          <div className="EXCERPT mb-4">
            <div>
              <label htmlFor="excerpt" className="font-bold block">
                Excerpt :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="excerpt"
                id="excerpt"
                required
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
                defaultValue={post.excerpt}
              />
            </div>
          </div>
          <div className="TAGS mb-4">
            <div>
              <label htmlFor="tags" className="font-bold block">
                Tags :
              </label>
            </div>
            <div>
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="e.g. tag1/tag2/tags3"
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
                defaultValue={tags.join("/")}
              />
            </div>
          </div>
        </div>
        <div className="CONTENT mb-4">
          <MDEditor value={content} onChange={(val) => setContent(val ?? "")} />
          {/* <MDEditor.Markdown
          source={content}
          style={{ whiteSpace: "pre-wrap" }}
        /> */}
        </div>
        <input type="hidden" name="content" value={content} />
        <button
          type="submit"
          className="flex gap-1 items-center bg-gray-50 hover:bg-rose-100 text-sm font-medium hover:text-rose-600 py-2 px-4 border border-rose-100 hover:border-transparent rounded-md cursor-pointer active:scale-95"
        >
          <div className="uppercase">Submit</div> <PencilIcon className="w-4" />
        </button>
      </form>

      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="flex gap-1 items-center bg-gray-50 hover:bg-rose-100 text-sm font-medium hover:text-rose-600 py-2 px-4 border border-rose-100 hover:border-transparent rounded-md cursor-pointer active:scale-95"
      >
        <div className="uppercase">Delete</div> <TrashIcon className="w-4" />
      </button>

      {showDialog && (
        <form action={deletePostWithId} className="mt-4 bg-white p-4 rounded">
          <input type="hidden" name="lang" value={post.lang} />
          <p className="mb-2">
            Type <strong className="text-red-600">{post.title}</strong> to
            confirm deletion:
          </p>

          <input
            type="text"
            name="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:border-rose-500"
          />

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={confirmationText !== post.title}
              className={`px-4 py-2 text-white text-sm font-semibold rounded uppercase ${
                confirmationText === post.title
                  ? "bg-red-600 hover:bg-red-700 cursor-pointer active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm Delete
            </button>

            <button
              type="button"
              onClick={() => setShowDialog(false)}
              className="bg-gray-50 hover:bg-rose-100 text-sm font-medium hover:text-rose-600 py-2 px-4 border border-rose-100 hover:border-transparent rounded-md cursor-pointer active:scale-95 uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}
