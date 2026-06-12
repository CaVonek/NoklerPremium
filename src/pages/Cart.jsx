import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    total,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  return (
    <div>
      <h1>Koszyk</h1>

      {cart.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Cena: {Number(item.price).toFixed(2)} zł</p>

                <div className="quantity-box">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <h2>
                  Suma: {(Number(item.price) * Number(item.quantity)).toFixed(2)} zł
                </h2>

                <button onClick={() => removeFromCart(item.id)}>
                  Usuń produkt
                </button>
              </div>
            </div>
          ))}

          <h2>Razem: {total.toFixed(2)} zł</h2>

          <button onClick={clearCart}>
            Wyczyść koszyk
          </button>

          <Link to="/checkout">
            <button>Przejdź do zamówienia</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;