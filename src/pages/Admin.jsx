import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useHome } from "../context/HomeContext";
import { useBrand } from "../context/BrandContext";
import { useContact } from "../context/ContactContext";

function Admin() {
  const { isAdmin, login, logout, changePassword } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const { home, updateHome } = useHome();
  const { brand, updateBrand } = useBrand();
  const { contact, updateContact } = useContact();

  const categories = ["Uchwyty", "Zawiasy", "Prowadnice", "Szuflady", "Nóżki", "Akcesoria", "Panele"];

  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [homeForm, setHomeForm] = useState(home);
  const [brandForm, setBrandForm] = useState(brand);
  const [contactForm, setContactForm] = useState(contact);

  const emptyForm = {
    name: "",
    price: "",
    stock: "",
    image: "https://via.placeholder.com/300x200",
    images: [],
    description: "",
    category: "Akcesoria",
    featured: false,
    bestseller: false,
    isNew: false
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const totalOrdersValue = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "Nowe").length;

  function handleLogin(e) {
    e.preventDefault();
    const ok = login(loginPassword);

    if (!ok) {
      setLoginError("Nieprawidłowe hasło.");
      return;
    }

    setLoginError("");
    setLoginPassword("");
  }

  function handlePasswordChange(e) {
    e.preventDefault();

    if (newPassword.length < 4) {
      alert("Hasło musi mieć minimum 4 znaki.");
      return;
    }

    changePassword(newPassword);
    setNewPassword("");
    alert("Hasło zostało zmienione.");
  }

  function handleHomeChange(e) {
    setHomeForm({ ...homeForm, [e.target.name]: e.target.value });
  }

  function saveHome(e) {
    e.preventDefault();
    updateHome(homeForm);
    alert("Strona główna została zapisana.");
  }

  function handleBrandChange(e) {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  }

  function handleLogoFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandForm({ ...brandForm, logo: reader.result });
    };
    reader.readAsDataURL(file);
  }
  function handlePdfLogoFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setBrandForm({
      ...brandForm,
      pdfLogo: reader.result
    });
  };

  reader.readAsDataURL(file);
}

  function saveBrand(e) {
    e.preventDefault();
    updateBrand(brandForm);
    alert("Logo i dane marki zostały zapisane.");
  }

  function handleContactChange(e) {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  }

  function saveContact(e) {
    e.preventDefault();
    updateContact(contactForm);
    alert("Dane kontaktowe zostały zapisane.");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function handleImageFile(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setForm({
        ...form,
        image: images[0],
        images: images
      });
    });
  }

  function submitProduct(e) {
    e.preventDefault();

    if (editingId) {
      updateProduct({ ...form, id: editingId });
      setEditingId(null);
    } else {
      addProduct(form);
    }

    setForm(emptyForm);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock || 0,
      image: product.image,
      images: product.images || [product.image],
      description: product.description,
      category: product.category || "Akcesoria",
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
      isNew: Boolean(product.isNew)
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  if (!isAdmin) {
    return (
      <div className="admin-login">
        <h2>Logowanie administratora</h2>

        <form onSubmit={handleLogin} className="admin-form">
          <input
            type="password"
            placeholder="Hasło administratora"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          {loginError && <p style={{ color: "orange" }}>{loginError}</p>}

          <button type="submit">Zaloguj</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Panel Administratora Nokler</h1>

      <button onClick={logout}>Wyloguj</button>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span>Produkty</span>
          <h2>{products.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>Zamówienia</span>
          <h2>{orders.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>Nowe zamówienia</span>
          <h2>{newOrders}</h2>
        </div>

        <div className="dashboard-card">
          <span>Wartość zamówień</span>
          <h2>{totalOrdersValue.toFixed(2)} zł</h2>
        </div>
      </div>

      <form onSubmit={saveHome} className="admin-form">
        <h2>Edycja strony głównej</h2>

        <input name="title" placeholder="Tytuł" value={homeForm.title} onChange={handleHomeChange} />
        <input name="subtitle" placeholder="Podtytuł" value={homeForm.subtitle} onChange={handleHomeChange} />
        <textarea name="description" placeholder="Opis firmy" value={homeForm.description} onChange={handleHomeChange} />
        <input name="bannerText" placeholder="Tekst bannera" value={homeForm.bannerText} onChange={handleHomeChange} />
        <input name="buttonText" placeholder="Tekst przycisku" value={homeForm.buttonText} onChange={handleHomeChange} />

        <button type="submit">Zapisz stronę główną</button>
      </form>

      <form onSubmit={saveBrand} className="admin-form">
        <h2>Logo i marka</h2>

        <input name="companyName" placeholder="Nazwa firmy" value={brandForm.companyName} onChange={handleBrandChange} />
        <input type="file" accept="image/*" onChange={handleLogoFile} />
        <h3 style={{ marginTop: "15px" }}>
  Logo do PDF
</h3>

<input
  type="file"
  accept="image/*"
  onChange={handlePdfLogoFile}
/>

{brandForm.pdfLogo && (
  <img
    src={brandForm.pdfLogo}
    alt="PDF Logo"
    className="admin-logo-preview"
  />
)}

        {brandForm.logo && (
          <img src={brandForm.logo} alt="Logo" className="admin-logo-preview" />
        )}

        <button type="submit">Zapisz logo i markę</button>
      </form>

      <form onSubmit={saveContact} className="admin-form">
        <h2>Dane kontaktowe</h2>

        <input name="phone" placeholder="Telefon" value={contactForm.phone} onChange={handleContactChange} />
        <input name="email" placeholder="E-mail" value={contactForm.email} onChange={handleContactChange} />
        <input name="address" placeholder="Adres firmy" value={contactForm.address} onChange={handleContactChange} />
        <input name="hours" placeholder="Godziny pracy" value={contactForm.hours} onChange={handleContactChange} />
        <input name="website" placeholder="Strona WWW" value={contactForm.website} onChange={handleContactChange} />
        <input name="facebook" placeholder="Facebook" value={contactForm.facebook} onChange={handleContactChange} />
        <input name="instagram" placeholder="Instagram" value={contactForm.instagram} onChange={handleContactChange} />

        <button type="submit">Zapisz dane kontaktowe</button>
      </form>

      <form onSubmit={handlePasswordChange} className="admin-form">
        <h2>Zmiana hasła administratora</h2>

        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Zmień hasło</button>
      </form>

      <form onSubmit={submitProduct} className="admin-form">
        <h2>{editingId ? "Edytuj produkt" : "Dodaj produkt"}</h2>

        <input name="name" placeholder="Nazwa produktu" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Cena" value={form.price} onChange={handleChange} required />
        <input name="stock" placeholder="Stan magazynowy" value={form.stock} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <div className="product-flags">
          <label>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Produkt polecany
          </label>

          <label>
            <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} />
            Bestseller
          </label>

          <label>
            <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
            Nowość
          </label>
        </div>

        <input name="image" placeholder="Link do zdjęcia" value={form.image} onChange={handleChange} />

        <input type="file" accept="image/*" multiple onChange={handleImageFile} />

        {form.image && (
          <img src={form.image} alt="Podgląd" className="admin-preview" />
        )}

        {form.images && form.images.length > 0 && (
          <div className="admin-gallery-preview">
            {form.images.map((img, index) => (
              <img key={index} src={img} alt={`Zdjęcie ${index + 1}`} />
            ))}
          </div>
        )}

        <textarea name="description" placeholder="Opis produktu" value={form.description} onChange={handleChange} required />

        <button type="submit">{editingId ? "Zapisz zmiany" : "Dodaj produkt"}</button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Anuluj edycję
          </button>
        )}
      </form>

      <h2>Produkty w sklepie</h2>

      {products.map((product) => (
        <div key={product.id} className="admin-product">
          <img src={product.image} alt={product.name} />

          <div>
            <h3>{product.name}</h3>

            <p>
              <b>Kategoria:</b> {product.category || "Akcesoria"}
            </p>

            <p>
              <b>Stan magazynowy:</b> {product.stock || 0} szt.
            </p>

            <div className="admin-badges">
              {product.featured && <span>Polecany</span>}
              {product.bestseller && <span>Bestseller</span>}
              {product.isNew && <span>Nowość</span>}
            </div>

            <p>{product.description}</p>
            <h2>{product.price} zł</h2>

            <button onClick={() => startEdit(product)}>Edytuj</button>
            <button onClick={() => deleteProduct(product.id)}>Usuń produkt</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;