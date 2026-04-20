"use client"

import { useStore, Order } from "@/app/context/StoreContext"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Clock, ChefHat } from "lucide-react"

export default function KitchenPage() {
  const { orders, markOrderDone, menuItems } = useStore()
  
  const preparingOrders = orders.filter(o => o.status === "preparing")

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kitchen Queue
        </h1>
        <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold dark:bg-orange-500/20 dark:text-orange-400">
          {preparingOrders.length} Preparing
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start pb-12">
        <AnimatePresence>
          {preparingOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-fit"
            >
              {/* Card Header */}
              <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Table {order.tableId}
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {Math.floor((new Date().getTime() - order.createdAt.getTime()) / 60000)}m ago
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 flex-1 flex flex-col gap-4">
                {order.items.map((orderItem, idx) => {
                  const menuItem = menuItems.find(m => m.id === orderItem.menuItemId)
                  if (!menuItem) return null
                  
                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={menuItem.image} 
                          alt={menuItem.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{menuItem.name}</div>
                        <div className="text-sm text-zinc-500 font-medium">Qty: {orderItem.qty}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => markOrderDone(order.id)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                >
                  <Check className="w-5 h-5" />
                  Mark as Done
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {preparingOrders.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
            <ChefHat className="w-16 h-16 mb-4 text-zinc-300 dark:text-zinc-700" />
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">All caught up!</h3>
            <p>No orders are currently waiting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
