"use client"

import { useStore } from "@/app/context/StoreContext"
import { motion } from "framer-motion"
import { Archive, Search } from "lucide-react"
import { useState } from "react"

export default function InventoryPage() {
  const { menuItems, inventoryState, toggleMealAvailability } = useStore()
  const [search, setSearch] = useState("")

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Archive className="text-indigo-500" />
          Inventory Status
        </h1>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search meals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredItems.map((item) => {
            const isAbsent = inventoryState[item.id] === true
            
            return (
              <motion.li 
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                  isAbsent ? "bg-red-50/50 dark:bg-red-950/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-opacity ${isAbsent ? "opacity-40 grayscale" : "opacity-100"}`}
                    />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isAbsent ? "text-zinc-400 dark:text-zinc-500 line-through" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {item.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    {isAbsent ? (
                      <span className="inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Absent
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Available
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleMealAvailability(item.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                      isAbsent ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    role="switch"
                    aria-checked={!isAbsent}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAbsent ? "translate-x-0" : "translate-x-5"
                      }`}
                    />
                  </button>
                </div>
              </motion.li>
            )
          })}
        </ul>
        
        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-zinc-500">
            No items found matching "{search}"
          </div>
        )}
      </div>
    </div>
  )
}
