import "./App.css";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

import { useCart } from "./context/CartContext";
import { useBrand } from "./context/BrandContext";
import { useOrders } from "./context/OrderContext";

function App() {
  const { cartCount } = useCart();
  const { brand } = useBrand();
const { newOrderAlert, clearNewOrderAlert } = useOrders();

  return (
    <HashRouter>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            {brand.logo ? (
              <img src={brand.logo} alt="Logo Nokler" className="sidebar-logo" />
            ) : (
              <div className="fallback-logo">NOKLER</div>
            )}
          </div>

          <ul>
            <li><Link to="/">🏠 Strona Główna</Link></li>
            <li><Link to="/shop">🛒 Sklep</Link></li>
            <li><Link to="/cart">🛍️ Koszyk ({cartCount})</Link></li>
            <li><Link to="/orders">📦 Zamówienia</Link></li>
            <li><Link to="/contact">📞 Kontakt</Link></li>
            <li><Link to="/admin">⚙️ Panel Admina</Link></li>
          </ul>
        </aside>

        <main className="content">
          {newOrderAlert && (
  <div className="new-order-toast">
    <button onClick={clearNewOrderAlert}>×</button>
    <h3>🔔 Nowe zamówienie!</h3>
    <p>Zamówienie #{newOrderAlert.id}</p>
    <p>
      Klient: {newOrderAlert.customer?.name || "Brak danych"}
    </p>
  </div>
)}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>

          <Footer />
        </main>
      </div>
    </HashRouter>
  );
}

export default App;