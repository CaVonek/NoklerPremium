import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const BrandContext = createContext();

const defaultBrand = {
  logo: "",
  pdfLogo: "",
  companyName: "NOKLER"
};

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(defaultBrand);

  async function loadBrand() {
    const { data, error } = await supabase
      .from("brand")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Błąd pobierania marki:", error);
      return;
    }

    if (data) {
      setBrand({
        logo: data.logo || "",
        pdfLogo: data.pdfLogo || "",
        companyName: data.companyName || "NOKLER"
      });
    }
  }

  useEffect(() => {
    loadBrand();

    const channel = supabase
      .channel("brand-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "brand" },
        () => {
          loadBrand();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateBrand(newBrand) {
    const { error } = await supabase
      .from("brand")
      .update({
        logo: newBrand.logo || "",
        pdfLogo: newBrand.pdfLogo || "",
        companyName: newBrand.companyName || "NOKLER"
      })
      .eq("id", 1);

    if (error) {
      console.error("Błąd zapisu marki:", error);
      alert("Nie udało się zapisać ustawień marki.");
      return;
    }

    await loadBrand();
  }

  return (
    <BrandContext.Provider value={{ brand, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}