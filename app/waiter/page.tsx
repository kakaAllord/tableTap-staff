"use client"

import { useStore } from "@/app/context/StoreContext"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Receipt, CheckCircle, CreditCard } from "lucide-react"

export default function WaiterPage() {
  const { orders, markOrderServed, paymentRequests, confirmPayment, menuItems } = useStore()
  
  const readyOrders = orders.filter(o => o.status === "ready")
  const pendingPayments = paymentRequests.filter(p => p.status === "pending")

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto pb-12">
      
      {/* -------------------- ORDERS TO SERVE -------------------- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Utensils className="text-indigo-500" />
            Orders to Serve
          </h2>
          {readyOrders.length > 0 && (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold dark:bg-emerald-500/20 dark:text-emerald-400">
              {readyOrders.length} New
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {readyOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                  <div className="font-bold text-lg">Table {order.tableId}</div>
                  <div className="text-sm font-medium opacity-90">{order.id}</div>
                </div>
                <div className="p-4 flex-1">
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => {
                      const menuItem = menuItems.find(m => m.id === item.menuItemId)
                      return (
                        <li key={idx} className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                          <span className="text-zinc-700 dark:text-zinc-300">{menuItem?.name || 'Unknown'}</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">x{item.qty}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30">
                  <button
                    onClick={() => markOrderServed(order.id)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-3 px-4 rounded-xl transition-transform active:scale-95"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Served
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {readyOrders.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500">
              <Utensils className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
              <p>No orders currently waiting to be served.</p>
            </div>
          )}
        </div>
      </section>


      {/* -------------------- PAYMENT REQUESTS -------------------- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Receipt className="text-amber-500" />
            Payment Requests
          </h2>
          {pendingPayments.length > 0 && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold dark:bg-amber-500/20 dark:text-amber-400">
              {pendingPayments.length} Pending
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pendingPayments.map((payment) => (
              <motion.div
                key={payment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col relative"
              >
                {/* Decorative background shape */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <CreditCard className="w-32 h-32" />
                </div>

                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">Table {payment.tableId}</h3>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {payment.id}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                    ${payment.totalAmount.toFixed(2)}
                  </div>
                </div>
                
                <div className="p-5 flex-1 bg-zinc-50/50 dark:bg-zinc-800/10 z-10">
                  <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Order Summary</div>
                  <div className="space-y-2 text-sm">
                    {payment.items && payment.items.length > 0 ? (
                      payment.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-700 dark:text-zinc-300 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                          <span>{item.name || "Item"} x{item.qty}</span>
                          <span>${((item.price || 0) * item.qty).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between text-zinc-700 dark:text-zinc-300 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                        <span>Various Items</span>
                        <span>${payment.totalAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 z-10">
                  <button
                    onClick={() => confirmPayment(payment.id)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 hover:-translate-y-0.5"
                  >
                    <CreditCard className="w-5 h-5" />
                    Confirm Payment
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pendingPayments.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500">
              <Receipt className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
              <p>No pending payment requests.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
