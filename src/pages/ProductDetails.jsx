import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h1>Produkt nie istnieje</h1>;
  }

  const images = product.images?.length ? product.images : [product.image];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedImage = images[selectedIndex];

  useEffect(() => {
    setSelectedIndex(0);
    setQuantity(1);
  }, [product.id]);

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function previousImage() {
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function nextImage() {
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  function increaseQuantity() {
    if (quantity < Number(product.stock || 0)) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function handleAddToCart() {
    if (Number(product.stock || 0) <= 0) {
      alert("Produkt jest niedostępny.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    alert(`Dodano do koszyka: ${quantity} szt.`);
  }

  return (
    <div>
      <Link to="/shop" className="back-link">← Wróć do sklepu</Link>

      <div className="product-page">
        <div className="product-gallery-box">
          <div className="product-main-image-wrapper">
            <img
              src={selectedImage}
              alt={product.name}
              className="product-main-image"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-left"
                  onClick={previousImage}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="gallery-arrow gallery-arrow-right"
                  onClick={nextImage}
                >
                  ›
                </button>

                <div className="gallery-counter">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Zdjęcie ${index + 1}`}
                  onClick={() => setSelectedIndex(index)}
                  className={selectedIndex === index ? "active-thumb" : ""}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info-box">
          <span className="product-category">{product.category || "Akcesoria"}</span>

          {product.bestseller && <span className="product-label">Bestseller</span>}
          {product.featured && <span className="product-label">Polecany</span>}
          {product.isNew && <span className="product-label">Nowość</span>}

          <h1>{product.name}</h1>

          <p className="product-short-description">
            {product.description}
          </p>

          <h2 className="product-price">
            {Number(product.price).toFixed(2)} zł
          </h2>

          <div className="availability-box">
            <b>Dostępność:</b>{" "}
            {Number(product.stock || 0) > 0 ? (
              <span className="available">Dostępny — {product.stock} szt.</span>
            ) : (
              <span className="unavailable">Brak na stanie</span>
            )}
          </div>

          <div className="product-quantity-panel">
            <span>Ilość:</span>

            <button onClick={decreaseQuantity}>-</button>
            <strong>{quantity}</strong>
            <button onClick={increaseQuantity}>+</button>
          </div>

          <button
            className="add-cart-main"
            onClick={handleAddToCart}
            disabled={Number(product.stock || 0) <= 0}
          >
            Dodaj do koszyka
          </button>

          <div className="product-benefits">
            <div>🚚 Szybka realizacja zamówień</div>
            <div>🔧 Profesjonalne akcesoria meblowe</div>
            <div>📦 Kontrola stanów magazynowych</div>
          </div>
        </div>
      </div>

      <section className="product-section">
        <h2>Opis produktu</h2>
        <p>{product.description}</p>
      </section>

      <section className="product-section">
        <h2>Specyfikacja techniczna</h2>

        <table className="spec-table">
          <tbody>
            <tr>
              <td>Kod produktu</td>
              <td>NK-{product.id}</td>
            </tr>
            <tr>
              <td>Producent</td>
              <td>Nokler</td>
            </tr>
            <tr>
              <td>Kategoria</td>
              <td>{product.category || "Akcesoria"}</td>
            </tr>
            <tr>
              <td>Gwarancja</td>
              <td>24 miesiące</td>
            </tr>
            <tr>
              <td>Stan magazynowy</td>
              <td>{product.stock || 0} szt.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {similarProducts.length > 0 && (
        <section className="product-section">
          <h2>Produkty podobne</h2>

          <div className="product-grid">
            {similarProducts.map((similar) => (
              <div key={similar.id} className="product-card">
                <img src={similar.image} alt={similar.name} />

                <span className="product-category">
                  {similar.category || "Akcesoria"}
                </span>

                <h3>{similar.name}</h3>
                <p>{similar.description}</p>
                <h2>{Number(similar.price).toFixed(2)} zł</h2>

                <Link to={`/product/${similar.id}`}>
                  <button>Szczegóły</button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;