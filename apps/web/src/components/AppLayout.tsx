"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { getBreadcrumbPath, getThreadTitle } from "@/lib/breadcrumbs";
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
  threadTree: ThreadTreeNode[];
  threadId?: string | null;
}

export default function AppLayout({ children, threadTree, threadId }: AppLayoutProps) {
  const pathname = usePathname();
  const currentThreadId = threadId || (pathname.startsWith('/t/') ? pathname.split('/')[2] : null);
  const breadcrumbPath = getBreadcrumbPath(threadTree, currentThreadId);

  return (
    <SidebarProvider>
      <AppSidebar threadTree={threadTree} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
        </header>
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}