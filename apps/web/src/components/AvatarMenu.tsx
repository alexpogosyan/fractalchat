"use client";
import { signout } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Dropdown from "./ui/Dropdown";

export default function AvatarMenu({ email }: { email: string }) {
  const initial = (email?.[0] ?? "?").toUpperCase();

  return (
    <Dropdown
      trigger={
        <Avatar>
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      }
    >
      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
        {email || "Anonymous"}
      </div>
      <form action={signout}>
        <button
          type="submit"
          className="cursor-pointer w-full min-w-24 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </form>
    </Dropdown>
  );
}
