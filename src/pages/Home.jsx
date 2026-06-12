import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHome } from "../context/HomeContext";
import { useProducts } from "../context/ProductContext";
import { useBrand } from "../context/BrandContext";

function ProductSection({ title, products }) {
  if (products.length === 0) return null;

  return (
    <section className="home-section">
      <h2>{title}</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <span className="product-category">
              {product.category || "Akcesoria"}
            </span>

            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h2>{Number(product.price).toFixed(2)} zł</h2>

            <Link to={`/product/${product.id}`}>
              <button>Szczegóły</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { home } = useHome();
  const { products } = useProducts();
  const { brand } = useBrand();

  const slides = [
    {
      title: home.title,
      subtitle: home.subtitle,
      text: home.description,
      button: home.buttonText
    },
    {
      title: "Nowości w ofercie",
      subtitle: "Akcesoria meblowe premium",
      text: "Sprawdź najnowsze produkty dostępne w sklepie Nokler.",
      button: "Zobacz nowości"
    },
    {
      title: "Profesjonalne wyposażenie",
      subtitle: "Uchwyty, zawiasy, prowadnice",
      text: "Wszystko, czego potrzebujesz do nowoczesnych mebli.",
      button: "Przejdź do sklepu"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newest = products.filter((product) => product.isNew).slice(0, 4);
  const fallbackProducts = products.slice(0, 3);

  const categories = ["Uchwyty", "Zawiasy", "Prowadnice", "Szuflady", "Nóżki", "Akcesoria"];
const slide = slides[activeSlide];
  return (
    <div>
     <section className="nokler-hero">
  <div className="nokler-hero-content">
    {brand.logo && (
      <img src={brand.logo} alt="Logo Nokler" className="nokler-hero-logo" />
    )}

    <h1>{slide.title}</h1>
    <h2>{slide.subtitle}</h2>
    <p>{slide.text}</p>

    <Link to="/shop">
      <button>{slide.button}</button>
    </Link>
  </div>

  <div className="nokler-hero-box">
    <h3>{home.bannerText}</h3>
    <p>Jakość • styl • funkcjonalność</p>
  </div>

  <div className="nokler-hero-dots">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setActiveSlide(index)}
        className={activeSlide === index ? "active-dot" : ""}
      />
    ))}
  </div>
</section>

      <section className="home-section">
        <h2>Kategorie produktów</h2>

        <div className="home-category-grid">
          {categories.map((category) => (
            <Link to="/shop" key={category} className="home-category-card">
              <h3>{category}</h3>
              <p>Zobacz produkty</p>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="🔥 Bestsellery" products={bestsellers} />
      <ProductSection title="⭐ Polecane produkty" products={featured} />
      <ProductSection title="🆕 Nowości" products={newest} />

      {bestsellers.length === 0 && featured.length === 0 && newest.length === 0 && (
        <ProductSection title="Wybrane produkty" products={fallbackProducts} />
      )}

      <section className="why-nokler">
        <h2>Dlaczego Nokler?</h2>

        <div className="why-grid">
          <div>
            <h3>Jakość</h3>
            <p>Starannie dobrane akcesoria meblowe do codziennego użytku.</p>
          </div>

          <div>
            <h3>Wygoda</h3>
            <p>Prosty sklep, koszyk i szybkie składanie zamówień.</p>
          </div>

          <div>
            <h3>Profesjonalizm</h3>
            <p>Oferta przygotowana z myślą o klientach i wykonawcach.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;