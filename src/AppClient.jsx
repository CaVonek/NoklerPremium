import "./App.css";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";

import { useCart } from "./context/CartContext";
import { useBrand } from "./context/BrandContext";

function AppClient() {
  const { cartCount } = useCart();
  const { brand } = useBrand();

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
            <li><Link to="/contact">📞 Kontakt</Link></li>
          </ul>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>

          <Footer />
        </main>
      </div>
    </HashRouter>
  );
}

export default AppClient;