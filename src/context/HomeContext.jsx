import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const HomeContext = createContext();

const defaultHome = {
  title: "NOKLER",
  subtitle: "Profesjonalne akcesoria meblowe",
  description:
    "Twój nowoczesny sklep z uchwytami, zawiasami, prowadnicami i akcesoriami do mebli.",
  bannerText: "Jakość, funkcjonalność i styl w jednym miejscu",
  buttonText: "Przejdź do sklepu"
};

export function HomeProvider({ children }) {
  const [home, setHome] = useState(defaultHome);

  async function loadHome() {
    const { data, error } = await supabase
      .from("home")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Błąd pobierania strony głównej:", error);
      return;
    }

    if (data) {
      setHome({
        title: data.title || defaultHome.title,
        subtitle: data.subtitle || defaultHome.subtitle,
        description: data.description || defaultHome.description,
        bannerText: data.bannerText || defaultHome.bannerText,
        buttonText: data.buttonText || defaultHome.buttonText
      });
    }
  }

  useEffect(() => {
    loadHome();

    const channel = supabase
      .channel("home-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "home" },
        () => {
          loadHome();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateHome(newHome) {
    const { error } = await supabase
      .from("home")
      .update({
        title: newHome.title || defaultHome.title,
        subtitle: newHome.subtitle || defaultHome.subtitle,
        description: newHome.description || defaultHome.description,
        bannerText: newHome.bannerText || defaultHome.bannerText,
        buttonText: newHome.buttonText || defaultHome.buttonText
      })
      .eq("id", 1);

    if (error) {
      console.error("Błąd zapisu strony głównej:", error);
      alert("Nie udało się zapisać strony głównej.");
      return;
    }

    await loadHome();
  }

  return (
    <HomeContext.Provider value={{ home, updateHome }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  return useContext(HomeContext);
}