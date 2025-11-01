"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const siteHeader = () => {
    switch (pathname) {
      case "/dashboard":
        return "Platform Launch";
      case "/dashboard/create-task":
        return "Create Task";
      default:
        return "";
    }
  };

  const siteActions = () => {
    switch (pathname) {
      case "/dashboard":
        return (
          <div>
            <Button>
              <Plus />
              Create Task
            </Button>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-4 lg:px-6 bg-sidebar">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">{siteHeader()}</h1>
      </div>
      <div className="flex items-center gap-2">{siteActions()}</div>
    </header>
  );
}
