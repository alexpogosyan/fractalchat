"use client";

import { useStore } from "@/store/useStore";
import { useThreadUIStore } from "@/store/useThreadUIStore";
import { ChevronRight, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
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
  const router = useRouter();
  const currentThreadId = pathname.startsWith("/t/")
    ? pathname.split("/").slice(2).at(-1)
    : null;

  const { expandAncestorPath } = useThreadUIStore();
  const createThread = useStore((s) => s.createThread);

  // Auto-expand ancestor path when currentThreadId changes
  React.useEffect(() => {
    if (currentThreadId && threadTree.length > 0) {
      expandAncestorPath(threadTree, currentThreadId);
    }
  }, [currentThreadId, threadTree, expandAncestorPath]);

  const handleNewThread = async () => {
    try {
      const newThreadId = await createThread(null); // null = root thread
      router.push(`/t/${newThreadId}`);
    } catch (error) {
      console.error("Failed to create new thread:", error);
    }
  };

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
          <SidebarGroupContent>
            <div className="p-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleNewThread}
              >
                <Plus className="h-4 w-4" />
                Start a new thread
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {threadTree.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Threads</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {threadTree.map((thread) => (
                  <ThreadTreeItem
                    key={thread.id}
                    thread={thread}
                    currentThreadId={currentThreadId}
                    isRootLevel={true}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function ThreadTreeItem({
  thread,
  currentThreadId,
  isRootLevel = false,
}: {
  thread: ThreadTreeNode;
  currentThreadId: string | null | undefined;
  isRootLevel?: boolean;
}) {
  const { isExpanded, toggleExpanded } = useThreadUIStore();
  const expanded = isExpanded(thread.id);
  const hasChildren = thread.children.length > 0;
  const threadTitle = thread.title || "New Thread";
  const isActive = thread.id === currentThreadId;

  const [isRenaming, setIsRenaming] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState(threadTitle);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const updateThreadTitle = useStore((s) => s.updateThreadTitle);
  const deleteThread = useStore((s) => s.deleteThread);

  // Update tempTitle when threadTitle changes
  React.useEffect(() => {
    setTempTitle(threadTitle);
  }, [threadTitle]);

  const handleToggle = () => {
    toggleExpanded(thread.id);
  };

  const handleRename = isRootLevel ? () => setIsRenaming(true) : undefined;

  const handleDelete = isRootLevel
    ? () => {
        setShowDeleteDialog(true);
      }
    : undefined;

  const confirmDelete = async () => {
    await deleteThread(thread.id);
    setShowDeleteDialog(false);
  };

  const handleRenameSubmit = async () => {
    if (tempTitle.trim() && tempTitle !== threadTitle) {
      await updateThreadTitle(thread.id, tempTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setTempTitle(threadTitle);
    setIsRenaming(false);
  };

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="pl-8" isActive={isActive}>
          <Link href={`/t/${thread.id}`}>
            {isRootLevel && isRenaming ? (
              <input
                ref={inputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={(e) => {
                  // Only submit if we're not clicking on the dropdown menu
                  if (
                    !e.relatedTarget ||
                    !e.relatedTarget.closest('[role="menu"]')
                  ) {
                    handleRenameSubmit();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") handleRenameCancel();
                }}
                className="bg-transparent border-none outline-none truncate"
              />
            ) : (
              <span className="truncate">{threadTitle}</span>
            )}
          </Link>
        </SidebarMenuButton>
        {isRootLevel && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" side="right" align="start">
              <DropdownMenuItem onClick={handleRename}>
                <Edit className="text-muted-foreground" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} variant="destructive">
                <Trash2 />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isRootLevel && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Thread</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {threadTitle}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
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
                className={`transition-transform ${
                  expanded ? "rotate-90" : ""
                }`}
              />
              {isRootLevel && isRenaming ? (
                <input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") handleRenameCancel();
                  }}
                  className="bg-transparent border-none outline-none truncate"
                />
              ) : (
                <span className="truncate">{threadTitle}</span>
              )}
            </Link>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {isRootLevel && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" side="right" align="start">
              <DropdownMenuItem onClick={handleRename}>
                <Edit className="text-muted-foreground" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="text-destructive" color="red" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {thread.children.map((childThread) => (
              <ThreadTreeItem
                key={childThread.id}
                thread={childThread}
                currentThreadId={currentThreadId}
                isRootLevel={false}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      {isRootLevel && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Thread</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {threadTitle}? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SidebarMenuItem>
  );
}
