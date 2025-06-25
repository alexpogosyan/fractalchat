"use client";
import { signout } from "@/app/auth/actions";
import Avatar from "./Avatar";
import Dropdown from "./Dropdown";

export default function AvatarMenu({ email }: { email: string }) {
  const initial = (email?.[0] ?? "?").toUpperCase();

  return (
    <Dropdown trigger={<Avatar initial={initial} />}>
      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
        {email}
      </div>
      <form action={signout}>
        <button
          type="submit"
          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </form>
    </Dropdown>
  );
}
