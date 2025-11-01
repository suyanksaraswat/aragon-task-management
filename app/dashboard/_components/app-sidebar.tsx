"use client";

import * as React from "react";
import { LayoutDashboard, Layers, Plus } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

const data = {
  navMain: [
    {
      title: "Platform Launch",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Marketing Plan",
      url: "/dashboard/marketing-plan",
      icon: LayoutDashboard,
    },
    {
      title: "Roadmap",
      url: "/dashboard/roadmap",
      icon: LayoutDashboard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isLoaded, user } = useUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a className="flex items-center gap-2 m-2" href="/dashboard">
              <Layers className="!size-5" />
              <span className="text-base font-semibold">Kanban</span>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2">
          <span className="text-sm text-muted-foreground">All boards (8)</span>
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />

        {isLoaded ? (
          <NavUser
            user={{
              name: user?.fullName || "Unknown",
              email: user?.primaryEmailAddress?.emailAddress || "Unknown",
              avatar: "",
            }}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
