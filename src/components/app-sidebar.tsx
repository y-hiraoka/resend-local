"use client";

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
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="font-extrabold px-2 text-lg">Resend Local</h1>
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
