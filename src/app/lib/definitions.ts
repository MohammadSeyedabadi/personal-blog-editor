export type DateMetaData = {
  createdat: string;
  lastmodified: string;
  year: number;
  fayear: number;
  formattedcreatedat: string;
  formattedcreatedatmonthday: string;
  faFormattedcreatedat: string;
  faformattedcreatedatmonthday: string;
  formattedlastmodified: string;
  faformattedlastmodified: string;
  fadigityear: string;
};

export type Post = {
  id: number;
  programming: boolean;
  title: string;
  otherpagetitle: string;
  slug: string;
  lang: "en" | "fa";
  otherpageslug: string;
  image?: string;
  excerpt: string;
  content: string;
} & DateMetaData;
