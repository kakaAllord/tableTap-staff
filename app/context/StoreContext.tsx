"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@/lib/config";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}



export type OrderStatus = "payment_pending" | "preparing" | "ready" | "served";
export type PaymentStatus = "pending" | "paid";

export interface OrderItem {
  menuItemId: string;
  qty: number;
  name?: string;
  price?: number;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string | Date;
  totalAmount?: number;
}

export interface PaymentRequest {
  id: string;
  tableId: number;
  orderIds: string[];
  totalAmount: number;
  status: PaymentStatus;
  createdAt: string | Date;
  items: OrderItem[];
}

interface StoreContextType {
  menuItems: MenuItem[];
  inventoryState: Record<string, boolean>; // menuId -> isAbsent
  toggleMealAvailability: (id: string) => void;
  
  orders: Order[];
  markOrderDone: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;

  paymentRequests: PaymentRequest[];
  confirmPayment: (paymentId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inventoryState, setInventoryState] = useState<Record<string, boolean>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(config.apiUrl);

    setSocket(s);

    s.on("initial_state", (data) => {
      setInventoryState(data.inventoryState || {});
      setOrders(data.orders || []);
      setMenuItems(data.menu || []);
    });

    s.on("inventory_update", (data) => {
      setInventoryState(data);
    });

    s.on("orders_update", (ordersData) => {
      setOrders(ordersData);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Compute paymentRequests from orders with "payment_pending" status
  const paymentRequests: PaymentRequest[] = orders
    .filter(o => o.status === "payment_pending")
    .map(o => ({
      id: o.id,
      tableId: o.tableId,
      orderIds: [o.id],
      totalAmount: o.totalAmount || 0,
      status: "pending" as PaymentStatus,
      createdAt: o.createdAt,
      items: o.items || [],
    }));

  const toggleMealAvailability = (id: string) => {
    if (socket) {
      socket.emit("toggle_inventory", id);
    }
  };

  const markOrderDone = (orderId: string) => {
    if (socket) {
      socket.emit("mark_order_ready", orderId);
    }
  };
  
  const markOrderServed = (orderId: string) => {
    if (socket) {
      socket.emit("mark_order_served", orderId);
    }
  };

  const confirmPayment = (paymentId: string) => {
    if (socket) {
      socket.emit("confirm_payment", paymentId); // In our model, paymentId is the same as orderId
    }
  };

  return (
    <StoreContext.Provider value={{
      menuItems,
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
