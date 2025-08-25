import { getThreadTree } from "@/lib/db/server";
import { AppSidebar } from "./app-sidebar";

export default async function SidebarWithData() {
  const threadTree = await getThreadTree();
  return <AppSidebar threadTree={threadTree} />;
}
