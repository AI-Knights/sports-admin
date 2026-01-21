"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  BarChart2,
  Bell,
  LogOut,
  Newspaper,
  Settings,
  TrendingUp,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type SidebarProps = {
  variant?: "desktop" | "mobile"
}
import image from "@/public/fotboll.png"
import Image from "next/image"

export default function Sidebar({ variant = "desktop" }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const activeClass = (href: string) =>
    isActive(href) ? "bg-gray-800 text-orange-500" : ""

  return (
    <div
      className={`
        bg-gray-900 text-white relative  justify-between grid-rows-12 p-4 space-y-4 h-full overflow-y-auto
        ${variant === "desktop" ? "hidden md:block" : "block"}
      `}
    >
      {/* Logo */}
      <div className="h-fit row-span-10">
        <div className="flex items-center space-x-2">
          <Avatar>
            <Image className="p-2 border" height={100} width={100} alt="kdsjfjka" src={image} />
            {/* <AvatarFallback className="bg-transparent border" >FA</AvatarFallback> */}
          </Avatar>
          <span>Football Admin Panel</span>
        </div>

        {/* Admin Info */}

        
        <div className="flex items-center rounded-md pl-2 bg-gray-800 py-2 my-8 space-x-2">
          <Avatar className="h-8 bg-yellow-950 w-8">
            <AvatarFallback className="bg-transparent">JA</AvatarFallback>
          </Avatar>
          <div>
            <p>John Anderson</p>
            <p className="text-xs">Super Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 h-full flex flex-col ">
          <div>
            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start ${activeClass("/")}`}
            >
              <Link href="/">
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start ${activeClass("/news")}`}
            >
              <Link href="/news">
                <Newspaper className="mr-2 h-4 w-4" />
                News Management
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start ${activeClass("/notifications")}`}
            >
              <Link href="/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start ${activeClass("/users")}`}
            >
              <Link href="/users">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`w-full justify-start ${activeClass("/performance")}`}
            >
              <Link href="/performance">
                <TrendingUp className="mr-2 h-4 w-4" />
                Performance
              </Link>
            </Button>
          </div>


        </nav>
      </div>
      <div className="items-end row-span-2 md:absolute bottom-0 left-0 flex-">
        <hr />

        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start ${activeClass("/profile")}`}
        >
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start ${activeClass("/settings")}`}
        >
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-red-500"
        >
          <Link href="/sign-in">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  )
}
