"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { getBreadcrumbPath, getThreadTitle } from "@/lib/breadcrumbs";
import AvatarMenu from "@/components/AvatarMenu";
import { useStore } from "@/store/useStore";
import type { ThreadTreeNode } from "@fractalchat/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  threadTree: ThreadTreeNode[]; // Server-side initial data
  threadId?: string | null;
  userEmail?: string;
}

export default function AppLayout({ children, threadTree: initialThreadTree, threadId, userEmail }: AppLayoutProps) {
  const pathname = usePathname();
  const currentThreadId = threadId || (pathname.startsWith('/t/') ? pathname.split('/').slice(2).at(-1) : null);
  
  const threadTree = useStore(s => s.threadTree);
  const setThreadTree = useStore(s => s.setThreadTree);
  
  // Initialize store tree from server data
  React.useEffect(() => {
    if (initialThreadTree.length > 0 && threadTree.length === 0) {
      setThreadTree(initialThreadTree);
    }
  }, [initialThreadTree, threadTree.length, setThreadTree]);
  
  // Use store tree or fallback to server tree
  const activeThreadTree = threadTree.length > 0 ? threadTree : initialThreadTree;
  const breadcrumbPath = getBreadcrumbPath(activeThreadTree, currentThreadId);

  return (
    <SidebarProvider>
      <AppSidebar threadTree={activeThreadTree} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumbPath.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbPath.map((thread, index) => {
                    const isLast = index === breadcrumbPath.length - 1;
                    const title = getThreadTitle(thread);
                    
                    return (
                      <React.Fragment key={thread.id}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={`/t/${thread.id}`}>
                              {title}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <AvatarMenu email={userEmail || ""} />
        </header>
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}