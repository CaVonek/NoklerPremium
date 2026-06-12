import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ContactContext = createContext();

const defaultContact = {
  phone: "+48 000 000 000",
  email: "biuro@nokler.pl",
  address: "Wpisz adres firmy",
  hours: "Pon-Pt 8:00-16:00",
  facebook: "",
  instagram: "",
  website: ""
};

export function ContactProvider({ children }) {
  const [contact, setContact] = useState(defaultContact);

  async function loadContact() {
    const { data, error } = await supabase
      .from("contact")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Błąd pobierania kontaktu:", error);
      return;
    }

    if (data) {
      setContact({
        phone: data.phone || defaultContact.phone,
        email: data.email || defaultContact.email,
        address: data.address || defaultContact.address,
        hours: data.hours || defaultContact.hours,
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        website: data.website || ""
      });
    }
  }

  useEffect(() => {
    loadContact();

    const channel = supabase
      .channel("contact-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact" },
        () => {
          loadContact();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateContact(newContact) {
    const { error } = await supabase
      .from("contact")
      .update({
        phone: newContact.phone || defaultContact.phone,
        email: newContact.email || defaultContact.email,
        address: newContact.address || defaultContact.address,
        hours: newContact.hours || defaultContact.hours,
        facebook: newContact.facebook || "",
        instagram: newContact.instagram || "",
        website: newContact.website || ""
      })
      .eq("id", 1);

    if (error) {
      console.error("Błąd zapisu kontaktu:", error);
      alert("Nie udało się zapisać danych kontaktowych.");
      return;
    }

    await loadContact();
  }

  return (
    <ContactContext.Provider value={{ contact, updateContact }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}