import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    category: product.category || "Akcesoria",
    images: product.images || [product.image].filter(Boolean),
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    isNew: Boolean(product.isNew)
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Błąd pobierania produktów:", error);
      setProducts([]);
    } else {
      setProducts((data || []).map(normalizeProduct));
    }

    setLoadingProducts(false);
  }

  useEffect(() => {
    loadProducts();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addProduct(product) {
    const newProduct = normalizeProduct({
      ...product,
      id: Date.now()
    });

    const { error } = await supabase.from("products").insert([newProduct]);

    if (error) {
      console.error("Błąd dodawania produktu:", error);
      alert("Nie udało się dodać produktu.");
      return;
    }

    await loadProducts();
  }

  async function updateProduct(updatedProduct) {
    const normalized = normalizeProduct(updatedProduct);

    const { error } = await supabase
      .from("products")
      .update(normalized)
      .eq("id", normalized.id);

    if (error) {
      console.error("Błąd edycji produktu:", error);
      alert("Nie udało się zapisać zmian produktu.");
      return;
    }

    await loadProducts();
  }

  async function deleteProduct(id) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Błąd usuwania produktu:", error);
      alert("Nie udało się usunąć produktu.");
      return;
    }

    await loadProducts();
  }

  async function decreaseStock(productId, quantity = 1) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStock = Math.max(0, Number(product.stock || 0) - Number(quantity || 1));

    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);

    if (error) {
      console.error("Błąd aktualizacji magazynu:", error);
      return;
    }

    await loadProducts();
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loadingProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        decreaseStock
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}