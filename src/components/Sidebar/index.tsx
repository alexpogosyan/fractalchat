import { getRootThreads } from "@/lib/db/server";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const roots = await getRootThreads();
  return <SidebarClient initial={roots} />;
}
