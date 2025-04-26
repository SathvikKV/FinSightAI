"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Brain,
  Bookmark,
  BookOpen,
  Settings,
  User,
  Home,
  Menu,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Query Assistant",
    icon: Search,
    href: "/query",
  },
  {
    title: "Filings Explorer",
    icon: FileText,
    href: "/filings",
  },
  {
    title: "AI Insights",
    icon: Brain,
    href: "/insights",
  },
  {
    title: "Saved Reports",
    icon: Bookmark,
    href: "/reports",
  },
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/docs",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar className="border-r border-border/40 h-full">
          <SidebarHeader className="py-4">
            <Link href="/" className="flex items-center px-2">
              <span className="text-2xl font-bold gradient-text">
                FinSight AI
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border/40">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/login"}
                  tooltip="Login"
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/register"}
                  tooltip="Register"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-4 flex justify-center">
              <ModeToggle />
            </div>
          </div>
          <SidebarRail />
        </Sidebar>
      </div>
    </>
  );
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
