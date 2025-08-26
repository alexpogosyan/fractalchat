"use client";
import { LogOut, User } from "lucide-react";
import { signout } from "@/app/auth/actions";
import { useStore } from "@/store/useStore";
import { useThreadUIStore } from "@/store/useThreadUIStore";
import { Avatar, AvatarFallback } from "./ui/avatar-with-fallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function AvatarMenu({ email }: { email: string }) {
  const initial = (email?.[0] ?? "?").toUpperCase();
  const resetStore = useStore(s => s.resetStore);
  const clearExpanded = useThreadUIStore(s => s.clearExpanded);

  const handleSignout = async () => {
    // Reset both stores before signing out
    resetStore();
    clearExpanded();
    // Call server action to sign out
    await signout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{email || "Anonymous"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}