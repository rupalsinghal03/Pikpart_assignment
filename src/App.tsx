import React, { useEffect, useState } from 'react';
import './App.css';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from 'react-icons/ai';

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  stock: number;
  thumbnail: string;
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({}); 

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((response) => response.json())
      .then((data) => {
        const productsWithQuantity = data.products.map((product: Product) => ({
          ...product,
          quantity: 0,
        }));
        setProducts(productsWithQuantity);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Increase quantity for a specific product
  const increaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Decrease quantity for a specific product
  const decreaseQuantity = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  // Delete product from the cart
  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[id];
      return updatedQuantities;
    });
  };

  // Add product to the cart
  const addToCart = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] : 1, 
    }));
  };

  return (
    <div className="home-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <div className="like">
            <p>♡</p>
          </div>
          <img src={product.thumbnail} alt={product.title} className="product-image" />
          <h3 className="product-rating">★ {product.rating}</h3>
          <div className="details">
            <h3 className="product-title">{product.title}</h3>
            <h3 className="product-category">{product.category}</h3>
            <p className="product-price">₹{product.price.toFixed(2)}/-</p>
          </div>
          <div className="cart_btn">
            <div className="cart_btns">
              <button className="bulk-button" onClick={() => addToCart(product.id)}>
                Bulk
              </button>

              <button className="cart-button" onClick={() => addToCart(product.id)}>
                {quantities[product.id] > 0 ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {quantities[product.id] > 0 && (
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(product.id)}>
                  <AiOutlineMinus />
                </button>
                <span>{quantities[product.id]}</span>
                <button onClick={() => increaseQuantity(product.id)}>
                  <AiOutlinePlus />
                </button>
              </div>
            )}

            {quantities[product.id] > 0 && (
              <button className="delete-button" onClick={() => deleteProduct(product.id)}>
                <AiOutlineDelete /> Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
