"use client"
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { createPost } from "@/app/lib/actions";
import { generateSlug } from "@/app/lib/utils";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function CreateForm() {
  const [content, setContent] = useState("**Hello world!!!**");
  const [slug, setSlug] = useState("");
  const [otherPageSlug, setOtherPageSlug] = useState("");
  // throw new Error("TESTING THE ERROR FILE");
  return (
    <form
      action={createPost}
      className="container bg-white/90 p-4 rounded md:max-h-full md:overflow-auto"
    >
      <div>
        <div className="LANGUAGE mb-4">
          <span className="font-bold">Language : </span>
          <label htmlFor="english">English </label>
          <input
            type="radio"
            name="lang"
            id="english"
            value="en"
            defaultChecked
            className="me-5"
          />
          <label htmlFor="farsi">Farsi </label>
          <input type="radio" name="lang" id="farsi" value="fa" />
        </div>
        <div className="PROGRAMMING mb-4">
          <span className="font-bold">Programming : </span>
          <label htmlFor="programming-true">True </label>
          <input
            type="radio"
            name="programming"
            id="programming-true"
            value="true"
            defaultChecked
            className="me-5"
          />
          <label htmlFor="programming-false">False </label>
          <input
            type="radio"
            name="programming"
            id="programming-false"
            value="false"
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
              value={slug}
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
  );
}
