import { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

import { supabase } from "../lib/supabase";
import { getClientId } from "../lib/clientId";
import { useBrand } from "../context/BrandContext";
import { useContact } from "../context/ContactContext";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { brand } = useBrand();
  const { contact } = useContact();

  async function loadMyOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clientId", getClientId())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Błąd pobierania moich zamówień:", error);
      return;
    }

    setOrders(data || []);
  }

  useEffect(() => {
    loadMyOrders();

    const channel = supabase
      .channel("my-orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadMyOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function generatePDF(order) {
    const productsTable = [
      [
        { text: "Lp.", bold: true },
        { text: "Produkt", bold: true },
        { text: "Ilość", bold: true },
        { text: "Cena", bold: true },
        { text: "Wartość", bold: true }
      ],
      ...order.products.map((product, index) => [
        index + 1,
        product.name,
        `${product.quantity || 1} szt.`,
        `${Number(product.price).toFixed(2)} zł`,
        `${(Number(product.price) * Number(product.quantity || 1)).toFixed(2)} zł`
      ])
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],

      content: [
        {
          columns: [
            brand.pdfLogo || brand.logo
              ? {
                  image: brand.pdfLogo || brand.logo,
                  width: 120,
                  margin: [0, 0, 0, 10]
                }
              : {
                  text: brand.companyName || "NOKLER",
                  style: "logoText"
                },
            {
              text: "ZAMÓWIENIE",
              style: "documentTitle",
              alignment: "right"
            }
          ]
        },

        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: 515,
              y2: 5,
              lineWidth: 1,
              lineColor: "#ff9800"
            }
          ],
          margin: [0, 10, 0, 20]
        },

        {
          columns: [
            {
              width: "50%",
              stack: [
                { text: "Dane firmy", style: "sectionTitle" },
                { text: brand.companyName || "NOKLER" },
                { text: `Telefon: ${contact.phone}` },
                { text: `E-mail: ${contact.email}` },
                { text: `Adres: ${contact.address}` }
              ]
            },
            {
              width: "50%",
              stack: [
                { text: "Dane zamówienia", style: "sectionTitle" },
                { text: `Numer: #${order.id}` },
                { text: `Data: ${order.date}` },
                { text: `Status: ${order.status}` },
                { text: `Płatność: ${order.paymentMethod || "Brak danych"}` }
              ]
            }
          ],
          columnGap: 20,
          margin: [0, 0, 0, 25]
        },

        { text: "Dane klienta", style: "sectionTitle" },

        {
          table: {
            widths: ["35%", "65%"],
            body: [
              ["Imię i nazwisko", order.customer?.name || ""],
              ["Firma", order.customer?.company || "Brak"],
              ["Telefon", order.customer?.phone || ""],
              ["E-mail", order.customer?.email || ""],
              ["Adres", order.customer?.address || ""],
              ["Uwagi", order.customer?.notes || "Brak"]
            ]
          },
          layout: "lightHorizontalLines",
          margin: [0, 0, 0, 25]
        },

        { text: "Produkty", style: "sectionTitle" },

        {
          table: {
            headerRows: 1,
            widths: ["8%", "42%", "15%", "17%", "18%"],
            body: productsTable
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? "#ff9800" : null;
            }
          },
          margin: [0, 0, 0, 25]
        },

        {
          text: `Razem: ${Number(order.total).toFixed(2)} zł`,
          style: "total",
          alignment: "right"
        }
      ],

      styles: {
        logoText: {
          fontSize: 24,
          bold: true,
          color: "#ff9800"
        },
        documentTitle: {
          fontSize: 22,
          bold: true,
          color: "#111111"
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: "#ff9800",
          margin: [0, 0, 0, 8]
        },
        total: {
          fontSize: 18,
          bold: true,
          color: "#111111"
        }
      },

      defaultStyle: {
        fontSize: 11
      }
    };

    pdfMake.createPdf(docDefinition).download(`Nokler_Zamowienie_${order.id}.pdf`);
  }

  return (
    <div>
      <h1>Moje zamówienia</h1>

      {orders.length === 0 ? (
        <p>Nie masz jeszcze zamówień w tej przeglądarce.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Zamówienie #{order.id}</h2>

            <p><b>Data:</b> {order.date}</p>
            <p><b>Status:</b> <span className="status-badge">{order.status}</span></p>
            <p><b>Płatność:</b> {order.paymentMethod || "Brak danych"}</p>
            <p><b>Status płatności:</b> {order.paymentStatus || "Brak danych"}</p>
            <p><b>Razem:</b> {Number(order.total).toFixed(2)} zł</p>

            <button onClick={() => generatePDF(order)}>
              📄 Pobierz PDF
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;