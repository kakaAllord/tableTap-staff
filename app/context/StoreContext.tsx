"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MENU_ITEMS } from "@/lib/mock-data";

export type OrderStatus = "preparing" | "ready" | "served";
export type PaymentStatus = "pending" | "paid";

export interface OrderItem {
  menuItemId: string;
  qty: number;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}

export interface PaymentRequest {
  id: string;
  tableId: number;
  orderIds: string[];
  totalAmount: number;
  status: PaymentStatus;
  createdAt: Date;
}

interface StoreContextType {
  menuItems: typeof MENU_ITEMS;
  inventoryState: Record<string, boolean>; // menuId -> isAbsent
  toggleMealAvailability: (id: string) => void;
  
  orders: Order[];
  markOrderDone: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;

  paymentRequests: PaymentRequest[];
  confirmPayment: (paymentId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Generate some mock initial data
const initialOrders: Order[] = [
  {
    id: "ORD-001",
    tableId: 4,
    items: [
      { menuItemId: "m1", qty: 2 },
      { menuItemId: "m3", qty: 1 },
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 5 * 60000), // 5 mins ago
  },
  {
    id: "ORD-002",
    tableId: 12,
    items: [
      { menuItemId: "m2", qty: 1 },
      { menuItemId: "m4", qty: 2 },
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "ORD-003",
    tableId: 7,
    items: [
      { menuItemId: "m6", qty: 1 },
      { menuItemId: "m7", qty: 2 },
    ],
    status: "ready", // Already done by kitchen
    createdAt: new Date(Date.now() - 15 * 60000),
  }
];

const initialPayments: PaymentRequest[] = [
  {
    id: "PAY-001",
    tableId: 9,
    orderIds: ["ORD-PREV-9"],
    totalAmount: 45.50,
    status: "pending",
    createdAt: new Date(),
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inventoryState, setInventoryState] = useState<Record<string, boolean>>({
    m3: true, // Example: Fries are absent
  });
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(initialPayments);

  const toggleMealAvailability = (id: string) => {
    setInventoryState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markOrderDone = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "ready" } : o));
  };
  
  const markOrderServed = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "served" } : o));
  };

  const confirmPayment = (paymentId: string) => {
    setPaymentRequests(prev => prev.filter(p => p.id !== paymentId));
  };

  return (
    <StoreContext.Provider value={{
      menuItems: MENU_ITEMS,
      inventoryState,
      toggleMealAvailability,
      orders,
      markOrderDone,
      markOrderServed,
      paymentRequests,
      confirmPayment
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
