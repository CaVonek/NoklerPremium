import { useContact } from "../context/ContactContext";
import { useBrand } from "../context/BrandContext";

function Contact() {
  const { contact } = useContact();
  const { brand } = useBrand();

  return (
    <div>
      <h1>Kontakt</h1>

      <div className="contact-card">
        {brand.logo && (
          <img src={brand.logo} alt="Logo Nokler" className="contact-logo" />
        )}

        <h2>{brand.companyName}</h2>

        <p><b>Telefon:</b> {contact.phone}</p>
        <p><b>E-mail:</b> {contact.email}</p>
        <p><b>Adres:</b> {contact.address}</p>
        <p><b>Godziny pracy:</b> {contact.hours}</p>

        {contact.website && (
          <p><b>Strona WWW:</b> {contact.website}</p>
        )}

        {contact.facebook && (
          <p><b>Facebook:</b> {contact.facebook}</p>
        )}

        {contact.instagram && (
          <p><b>Instagram:</b> {contact.instagram}</p>
        )}
      </div>
    </div>
  );
}

export default Contact;