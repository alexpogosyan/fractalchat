import { getRootThreads } from "@/lib/db/server";
import { AppSidebar } from "./app-sidebar";

export default async function Sidebar() {
  const roots = await getRootThreads();
  // return <AppSidebar initial={roots} />;
  return <AppSidebar />;
}
