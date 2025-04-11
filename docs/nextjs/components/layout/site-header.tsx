"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="inline-block font-bold">Mixcore</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/admin/dashboard"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname === "/admin/dashboard" && "text-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/post/list"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname?.startsWith("/admin/post") && "text-foreground"
              )}
            >
              Posts
            </Link>
            <Link
              href="/admin/page/list"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname?.startsWith("/admin/page") && "text-foreground"
              )}
            >
              Pages
            </Link>
            <Link
              href="/admin/media/list"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname?.startsWith("/admin/media") && "text-foreground"
              )}
            >
              Media
            </Link>
            <Link
              href="/admin/user/list"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname?.startsWith("/admin/user") && "text-foreground"
              )}
            >
              Users
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Icons.settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.logout className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 