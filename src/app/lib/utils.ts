import { DateMetaData } from "./definitions";
// import postgres from "postgres"; //This avoids opening a new connection on every request.

// export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export function generateLocalizedDateMetadata(date = new Date()): DateMetaData {
  const isoDate = date.toISOString().slice(0, 10); // "2023-11-19" // Slightly faster (no array creation, fewer operations) compare to this:new Date().toISOString().split('T')[0];
  const year = date.getFullYear().toString(); // "2023"

  // English full date: "November 19, 2023"
  const formattedEnFull = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // English month/day only: "November 19"
  const formattedEnMonthDay = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // Persian full date: "۲۸ آبان ۱۴۰۲"
  const formattedFaFull = date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const faParts = formattedFaFull.split(" "); // ["۲۸", "آبان", "۱۴۰۲"]
  const faFormattedMonthDay = `${faParts[0]} ${faParts[1]}`; // "۲۸ آبان"
  // const faFormattedFull = formattedFaFull; // "۲۸ آبان ۱۴۰۲"
  const faYear = faParts[2]; // "۱۴۰۲"

  return {
    createdat: isoDate,
    lastmodified: isoDate,
    formattedcreatedat: formattedEnFull,
    formattedcreatedatmonthday: formattedEnMonthDay,
    faFormattedcreatedat: formattedFaFull,
    faformattedcreatedatmonthday: faFormattedMonthDay,
    formattedlastmodified: formattedEnFull,
    faformattedlastmodified: formattedFaFull,
    year: Number(year),
    fayear: convertPersianToEnglishDigits(faYear),
    fadigityear: faYear,
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Make lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "") // Remove punctuation (supports Persian too)
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export function convertPersianToEnglishDigits(input: string): number {
  const persianMap: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  return Number(input.replace(/[۰-۹]/g, (char) => persianMap[char] || char));
}
