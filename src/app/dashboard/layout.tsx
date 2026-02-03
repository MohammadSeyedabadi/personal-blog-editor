import Image from "next/image";
import Link from "next/link";
import { PowerIcon } from "@heroicons/react/24/outline";
import NavLinks from "./nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-rose-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 h-full text-white md:w-40 mx-auto flex items-center justify-center active:scale-95">
          <Image
            src="/images/mandala-flower.png"
            alt="LOGO"
            width={100}
            height={100}
            className="h-full w-auto object-contain"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
        <form>
          <button disabled className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 md:flex-none md:justify-start md:p-2 md:px-3 cursor-not-allowed">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
