import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useProducts } from "../context/ProductContext";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { decreaseStock } = useProducts();

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("Przelew tradycyjny");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Oczekuje na płatność");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function submitOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Koszyk jest pusty.");
      return;
    }

    const number = Date.now();

    let status = "Oczekuje na płatność";
    let payment = "Oczekuje na płatność";

    if (paymentMethod === "Płatność przy odbiorze") {
      status = "Nowe";
      payment = "Płatność przy odbiorze";
    }

    const newOrder = {
      id: number,
      customer: form,
      products: cart,
      total: total,
      paymentMethod,
      paymentStatus: payment,
      status
    };

    addOrder(newOrder);

    cart.forEach((item) => {
      decreaseStock(item.id, item.quantity);
    });

    setOrderNumber(number);
    setPaymentStatus(payment);
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div className="checkout-success">
        <h1>Zamówienie złożone ✅</h1>

        <div className="payment-box">
          <h2>Numer zamówienia: #{orderNumber}</h2>
          <p>
            <b>Status płatności:</b> {paymentStatus}
          </p>
          <p>
            <b>Metoda płatności:</b> {paymentMethod}
          </p>

          {paymentMethod === "Przelew tradycyjny" && (
            <div className="bank-transfer-box">
              <h3>Dane do przelewu</h3>
              <p><b>Odbiorca:</b> NOKLER</p>
              <p><b>Numer konta:</b> 00 0000 0000 0000 0000 0000 0000</p>
              <p><b>Tytuł przelewu:</b> Zamówienie #{orderNumber}</p>
              <p><b>Kwota:</b> {Number(total).toFixed(2)} zł</p>
            </div>
          )}

          {paymentMethod === "BLIK" && (
            <div className="bank-transfer-box">
              <h3>Płatność BLIK</h3>
              <p>
                Na razie przyjmujemy BLIK ręcznie. Skontaktujemy się z Tobą
                telefonicznie lub mailowo w celu potwierdzenia płatności.
              </p>
              <p><b>Kwota:</b> {Number(total).toFixed(2)} zł</p>
              <p><b>Numer zamówienia:</b> #{orderNumber}</p>
            </div>
          )}

          {paymentMethod === "Płatność przy odbiorze" && (
            <div className="bank-transfer-box">
              <h3>Płatność przy odbiorze</h3>
              <p>
                Zamówienie zostało przyjęte. Zapłacisz przy odbiorze lub po
                indywidualnym ustaleniu szczegółów.
              </p>
            </div>
          )}

          <p>Zamówienie zostało zapisane i trafiło do realizacji.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Finalizacja zamówienia</h1>

      <form onSubmit={submitOrder} className="checkout-form">
        <input
          name="name"
          placeholder="Imię i nazwisko"
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Firma"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Telefon"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="E-mail"
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Adres dostawy"
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Uwagi do zamówienia"
          onChange={handleChange}
        />

        <h2>Metoda płatności</h2>

        <div className="payment-methods">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Przelew tradycyjny"
              checked={paymentMethod === "Przelew tradycyjny"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Przelew tradycyjny
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="BLIK"
              checked={paymentMethod === "BLIK"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            BLIK
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Płatność przy odbiorze"
              checked={paymentMethod === "Płatność przy odbiorze"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Płatność przy odbiorze
          </label>
        </div>

        <h2>Podsumowanie</h2>

        {cart.map((item) => (
          <p key={item.id}>
            {item.name} — {item.quantity} szt. ×{" "}
            {Number(item.price).toFixed(2)} zł
          </p>
        ))}

        <h2>Razem: {total.toFixed(2)} zł</h2>

        <button type="submit">Złóż zamówienie</button>
      </form>
    </div>
  );
}

export default Checkout;