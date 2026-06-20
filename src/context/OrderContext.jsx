import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  function showNewOrderAlert(order) {
  setNewOrderAlert(order);

  if (window.noklerElectron) {
    window.noklerElectron.showOrderNotification(order);
  }

  setTimeout(() => {
    setNewOrderAlert(null);
  }, 6000);
}

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Błąd pobierania zamówień:", error);
      setOrders([]);
      return;
    }

    setOrders(data || []);
  }

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new;

          showNewOrderAlert(order);
          loadOrders();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => {
          loadOrders();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addOrder(order) {
    const newOrder = {
  ...order,
  id: order.id || Date.now(),
  date: new Date().toLocaleString(),
  status: order.status || "Nowe"
};

    const { error } = await supabase.from("orders").insert([newOrder]);

    if (error) {
      console.error("Błąd dodawania zamówienia:", error);
      alert("Nie udało się złożyć zamówienia.");
      return;
    }

    showNewOrderAlert(newOrder);
    await loadOrders();
  }

  async function updateOrderStatus(id, status) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Błąd zmiany statusu:", error);
      alert("Nie udało się zmienić statusu.");
      return;
    }

    await loadOrders();
  }

  async function deleteOrder(id) {
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      console.error("Błąd usuwania zamówienia:", error);
      alert("Nie udało się usunąć zamówienia.");
      return;
    }

    await loadOrders();
  }

  function clearNewOrderAlert() {
    setNewOrderAlert(null);
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        newOrderAlert,
        clearNewOrderAlert
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}