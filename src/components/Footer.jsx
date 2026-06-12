import { Link } from "react-router-dom";
import { useContact } from "../context/ContactContext";
import { useBrand } from "../context/BrandContext";

function Footer() {
  const { contact } = useContact();
  const { brand } = useBrand();

  return (
    <footer className="footer">
      <div className="footer-grid">

        <div>
          {brand.logo ? (
            <img
              src={brand.logo}
              alt="Nokler"
              className="footer-logo"
            />
          ) : (
            <h2>{brand.companyName}</h2>
          )}

          <p>
            Profesjonalne akcesoria meblowe dla klientów
            indywidualnych oraz firm.
          </p>
        </div>

        <div>
          <h3>Kontakt</h3>

          <p>📞 {contact.phone}</p>
          <p>✉️ {contact.email}</p>
          <p>📍 {contact.address}</p>
          <p>🕒 {contact.hours}</p>
        </div>

        <div>
          <h3>Kategorie</h3>

          <Link to="/shop">Uchwyty</Link>
          <Link to="/shop">Zawiasy</Link>
          <Link to="/shop">Prowadnice</Link>
          <Link to="/shop">Szuflady</Link>
          <Link to="/shop">Nóżki</Link>
          <Link to="/shop">Akcesoria</Link>
        </div>

        <div>
          <h3>Szybkie linki</h3>

          <Link to="/">Strona główna</Link>
          <Link to="/shop">Sklep</Link>
          <Link to="/cart">Koszyk</Link>
          <Link to="/orders">Zamówienia</Link>
          <Link to="/contact">Kontakt</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} {brand.companyName || "NOKLER"}.
        Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
}

export default Footer;