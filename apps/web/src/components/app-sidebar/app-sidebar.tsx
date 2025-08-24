import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarContent></SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
