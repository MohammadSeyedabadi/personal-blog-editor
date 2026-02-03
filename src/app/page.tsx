import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-rose-500 p-4 md:h-52">
        <div className=" flex h-full items-center gap-4">
          <Image
            src="/images/mandala-flower.png"
            alt="LOGO"
            width={100}
            height={100}
            className="h-full w-auto object-contain"
          />
          <div className="text-rose-50 font-black text-2xl uppercase">
            Create post
          </div>
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`$ text-lg text-gray-800 ltr:first-line:uppercase ltr:first-line:tracking-widest ltr:first-letter:text-7xl ltr:first-letter:font-bold ltr:first-letter:mr-3 ltr:first-letter:float-left`}
          >
            <strong>Welcome to Create post.</strong> In here you will create some
            posts.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-400 md:text-base"
          >
            <span>Start</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          {/* <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          /> */}
        </div>
      </div>
    </main>
  );
}
