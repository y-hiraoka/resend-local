"use client";

import { GlobeIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center">
        <h1 className="font-extrabold px-2 text-xl">Resend Local</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/emails")}
              >
                <Link href="/dashboard/emails">
                  <MailIcon />
                  <span>Emails</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/domains")}
              >
                <Link href="/dashboard/domains">
                  <GlobeIcon />
                  <span>Domains</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
