import type { Metadata } from "next";
import CreateForm from "./create-form";

export const metadata: Metadata = {
  title: "Create post | Write",
};

export default function Page() {
  return <CreateForm />;
}
