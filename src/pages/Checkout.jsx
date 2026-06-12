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

  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

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

    const newOrder = {
      customer: form,
      products: cart,
      total: total
    };

    const number = Date.now();

    addOrder({
      ...newOrder,
      id: number
    });

    cart.forEach((item) => {
      decreaseStock(item.id, item.quantity);
    });

    setOrderNumber(number);
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div>
        <h1>Zamówienie złożone ✅</h1>
        <p>Numer zamówienia: #{orderNumber}</p>
        <p>Zamówienie zostało zapisane w historii zamówień.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Finalizacja zamówienia</h1>

      <form onSubmit={submitOrder} style={{ maxWidth: "600px" }}>
        <input name="name" placeholder="Imię i nazwisko" onChange={handleChange} required />
        <input name="company" placeholder="Firma" onChange={handleChange} />
        <input name="phone" placeholder="Telefon" onChange={handleChange} required />
        <input name="email" placeholder="E-mail" onChange={handleChange} required />
        <input name="address" placeholder="Adres dostawy" onChange={handleChange} required />
        <textarea name="notes" placeholder="Uwagi do zamówienia" onChange={handleChange} />

        <h2>Podsumowanie</h2>

        {cart.map((item) => (
          <p key={item.id}>
            {item.name} — {item.quantity} szt. × {Number(item.price).toFixed(2)} zł
          </p>
        ))}

        <h2>Razem: {total.toFixed(2)} zł</h2>

        <button type="submit">Złóż zamówienie</button>
      </form>
    </div>
  );
}

export default Checkout;