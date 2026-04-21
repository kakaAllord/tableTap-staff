"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, Utensils, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function Sidebar() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Kitchen",
      href: "/kitchen",
      icon: ChefHat,
    },
    {
      name: "Waiter",
      href: "/waiter",
      icon: Utensils,
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: ClipboardList,
    },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-20 flex-col border-r border-zinc-200 bg-white sm:w-64 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-zinc-200 px-4 sm:justify-start dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Logo wrapped in a circle */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-indigo-500/30 shadow-md overflow-hidden p-1">
          <Image
            src="/Logo.png"
            alt="TableTap"
            width={36}
            height={36}
            unoptimized
            className="w-9 h-9 object-cover rounded-full"
          />
          </div>
          <div className="hidden sm:flex sm:flex-col sm:leading-tight">
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-50">TableTap</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Staff Portal</span>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-y-2 overflow-y-auto px-3 py-6">
        <ul className="flex flex-1 flex-col gap-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname.startsWith(tab.href)
            
            return (
              <li key={tab.name}>
                <Link
                  href={tab.href}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-indigo-400"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 shrink-0 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    )}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
