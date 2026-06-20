const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const statusDescriptions: Record<string, string> = {
  "Nowe": "Twoje zamówienie zostało przyjęte i czeka na obsługę.",
  "Oczekuje na płatność": "Czekamy na zaksięgowanie płatności za Twoje zamówienie.",
  "Opłacone": "Płatność została potwierdzona. Zamówienie przechodzi do realizacji.",
  "W realizacji": "Kompletujemy Twoje zamówienie.",
  "Gotowe do wysyłki": "Twoje zamówienie jest przygotowane do wysyłki.",
  "Wysłane": "Twoje zamówienie zostało przekazane do wysyłki.",
  "Zakończone": "Zamówienie zostało zakończone. Dziękujemy za zakupy.",
  "Anulowane": "Zamówienie zostało anulowane."
};

Deno.serve(async (req) => {
  try {
    const order = await req.json();

    const customerEmail = order.customer?.email;

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: "Brak adresu e-mail klienta." }),
        { status: 400 }
      );
    }

    const productsHtml = (order.products || [])
      .map((product: any) => {
        const quantity = product.quantity || 1;
        const price = Number(product.price || 0).toFixed(2);
        return `<li>${product.name} — ${quantity} szt. × ${price} zł</li>`;
      })
      .join("");

    const statusText =
      statusDescriptions[order.status] || "Status Twojego zamówienia został zaktualizowany.";

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2 style="color:#ff9800;">Aktualizacja zamówienia #${order.id}</h2>

        <p>Dzień dobry ${order.customer?.name || ""},</p>

        <p>Status Twojego zamówienia został zmieniony na:</p>

        <h3 style="background:#ff9800; color:#111; padding:10px; border-radius:8px;">
          ${order.status}
        </h3>

        <p>${statusText}</p>

        <h3>Produkty:</h3>
        <ul>
          ${productsHtml}
        </ul>

        <p><b>Wartość zamówienia:</b> ${Number(order.total || 0).toFixed(2)} zł</p>
        <p><b>Metoda płatności:</b> ${order.paymentMethod || "Brak danych"}</p>
        <p><b>Status płatności:</b> ${order.paymentStatus || "Brak danych"}</p>

        <hr />

        <p style="color:#777;">
          Wiadomość została wysłana automatycznie przez sklep NOKLER.
        </p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "NOKLER <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Aktualizacja zamówienia #${order.id} — ${order.status}`,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(result), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500
    });
  }
});