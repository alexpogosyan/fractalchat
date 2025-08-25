"use client";

import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useThreadUIStore } from "@/store/useThreadUIStore";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ThreadTreeNode } from "@fractalchat/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  threadTree: ThreadTreeNode[];
}

export function AppSidebar({ threadTree, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const currentThreadId = pathname.startsWith("/t/")
    ? pathname.split("/")[2]
    : null;
  
  const { expandAncestorPath } = useThreadUIStore();
  
  // Auto-expand ancestor path when currentThreadId changes
  React.useEffect(() => {
    if (currentThreadId && threadTree.length > 0) {
      expandAncestorPath(threadTree, currentThreadId);
    }
  }, [currentThreadId, threadTree, expandAncestorPath]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex p-2">
          <Link href="/" className="flex gap-1 items-center">
            <Image
              src="/logo.svg"
              alt="Fractalchat Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xl">Fractalchat</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {}}
              >
                <Plus className="h-4 w-4" />
                New Thread
              </Button>
            </div>
            <SidebarMenu>
              {threadTree.map((thread) => (
                <ThreadTreeItem
                  key={thread.id}
                  thread={thread}
                  currentThreadId={currentThreadId}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function ThreadTreeItem({
  thread,
  currentThreadId,
}: {
  thread: ThreadTreeNode;
  currentThreadId: string | null;
}) {
  const { isExpanded, toggleExpanded } = useThreadUIStore();
  const expanded = isExpanded(thread.id);
  const hasChildren = thread.children.length > 0;
  const threadTitle = thread.title || `Thread ${thread.id.slice(0, 8)}`;
  const isActive = thread.id === currentThreadId;

  const handleToggle = () => {
    toggleExpanded(thread.id);
  };

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="pl-8" isActive={isActive}>
          <Link href={`/t/${thread.id}`}>
            <span className="truncate">{threadTitle}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible open={expanded} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href={`/t/${thread.id}`}>
              <ChevronRight
                className={`transition-transform ${expanded ? "rotate-90" : ""}`}
              />
              <span className="truncate">{threadTitle}</span>
            </Link>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {thread.children.map((childThread) => (
              <ThreadTreeItem
                key={childThread.id}
                thread={childThread}
                currentThreadId={currentThreadId}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
