"use client";

import { HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import clsx from "clsx";

export default function NavLinks() {
  const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
      name: "Create",
      href: "/dashboard/create",
      icon: DocumentDuplicateIcon,
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`${
              pathname === link.href
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-50"
            } flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 md:flex-none md:justify-start md:p-2 md:px-3 active:scale-95`}
            // className={clsx(
            //   "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 md:flex-none md:justify-start md:p-2 md:px-3 active:scale-95",
            //   {
            //     "bg-rose-100 text-rose-600": pathname === link.href,
            //   }
            // )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
