import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

function Shop() {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Wszystkie");

  const categories = [
    "Wszystkie",
    "Uchwyty",
    "Zawiasy",
    "Prowadnice",
    "Szuflady",
    "Nóżki",
    "Akcesoria"
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Wszystkie" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  function handleAddToCart(product) {
    if (Number(product.stock || 0) <= 0) {
      alert("Produkt jest niedostępny.");
      return;
    }

    addToCart(product);
    alert("Dodano do koszyka.");
  }

  return (
    <div>
      <h1>Sklep Nokler</h1>

      <input
        className="search-input"
        placeholder="🔍 Szukaj produktu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={category === cat ? "active-category" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p>Brak produktów pasujących do wyszukiwania.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />

              <span className="product-category">
                {product.category || "Akcesoria"}
              </span>

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <b>Stan:</b>{" "}
                {Number(product.stock || 0) > 0
                  ? `${product.stock} szt.`
                  : "Brak na stanie"}
              </p>

              <h2>{product.price} zł</h2>

              <div className="product-card-actions">
                <Link to={`/product/${product.id}`}>
                  <button>Szczegóły</button>
                </Link>

                <button onClick={() => handleAddToCart(product)}>
                  Dodaj do koszyka
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;