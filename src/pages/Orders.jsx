import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";

import { useOrders } from "../context/OrderContext";
import { useBrand } from "../context/BrandContext";
import { useContact } from "../context/ContactContext";



function Orders() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { brand } = useBrand();
  const { contact } = useContact();

  const statuses = [
  "Nowe",
  "Oczekuje na płatność",
  "Opłacone",
  "W realizacji",
  "Gotowe do wysyłki",
  "Wysłane",
  "Zakończone",
  "Anulowane"
];

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
                { text: `Status: ${order.status}` }
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
              ["Imię i nazwisko", order.customer.name],
              ["Firma", order.customer.company || "Brak"],
              ["Telefon", order.customer.phone],
              ["E-mail", order.customer.email],
              ["Adres", order.customer.address],
              ["Uwagi", order.customer.notes || "Brak"]
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
            },
            hLineColor: function () {
              return "#dddddd";
            },
            vLineColor: function () {
              return "#dddddd";
            }
          },
          margin: [0, 0, 0, 25]
        },

        {
          text: `Razem: ${Number(order.total).toFixed(2)} zł`,
          style: "total",
          alignment: "right"
        },

        {
          text: "Dziękujemy za złożenie zamówienia.",
          style: "footer",
          margin: [0, 40, 0, 0]
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
        },
        footer: {
          fontSize: 10,
          color: "#777777",
          alignment: "center"
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
      <h1>Historia zamówień</h1>

      {orders.length === 0 ? (
        <p>Brak zamówień.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h2>Zamówienie #{order.id}</h2>

            <p><b>Data:</b> {order.date}</p>

            <p>
              <b>Status:</b>{" "}
             <span className={`status-badge status-${order.status?.toLowerCase().replaceAll(" ", "-")}`}>
  {order.status}
</span>
            </p>

            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <h3>Dane klienta</h3>
            <p><b>Imię i nazwisko:</b> {order.customer.name}</p>
            <p><b>Firma:</b> {order.customer.company || "Brak"}</p>
            <p><b>Telefon:</b> {order.customer.phone}</p>
            <p><b>E-mail:</b> {order.customer.email}</p>
            <p><b>Adres:</b> {order.customer.address}</p>
            <p><b>Uwagi:</b> {order.customer.notes || "Brak"}</p>

            <h3>Produkty</h3>

            {order.products.map((product, index) => (
  <p key={index}>
    {product.name} — {product.quantity || 1} szt. × {Number(product.price).toFixed(2)} zł
  </p>
))}

            <h2>Razem: {order.total.toFixed(2)} zł</h2>

            <button onClick={() => generatePDF(order)}>
              📄 Pobierz PDF
            </button>

            <button onClick={() => deleteOrder(order.id)}>
              Usuń zamówienie
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;