import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import AppClient from "./AppClient.jsx";

import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";
import { HomeProvider } from "./context/HomeContext";
import { BrandProvider } from "./context/BrandContext";
import { ContactProvider } from "./context/ContactContext";

const isClientSite = import.meta.env.VITE_APP_MODE === "client";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandProvider>
      <HomeProvider>
        <ContactProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <AuthProvider>
                  {isClientSite ? <AppClient /> : <App />}
                </AuthProvider>
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </ContactProvider>
      </HomeProvider>
    </BrandProvider>
  </StrictMode>
);