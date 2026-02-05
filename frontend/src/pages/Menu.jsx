import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCategories } from '../services/api';
import { useCartStore } from '../store/store';
import './Menu.css';

function Menu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantities, setQuantities] = useState({});
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || []);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item, price) => {
    const quantityKey = `${item.id}-${price.id}`;
    const quantity = quantities[quantityKey] || 1;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        price: parseFloat(price.price),
        portionType: price.portion_type,
        category: item.category_name,
      });
    }
    
    toast.success(`${quantity} x ${item.name} (${price.portion_type}) added to cart!`);
    // Reset quantity after adding
    setQuantities({ ...quantities, [quantityKey]: 1 });
  };

  const updateQuantity = (itemId, priceId, delta) => {
    const quantityKey = `${itemId}-${priceId}`;
    const currentQty = quantities[quantityKey] || 1;
    const newQty = Math.max(1, Math.min(99, currentQty + delta));
    setQuantities({ ...quantities, [quantityKey]: newQty });
  };

  const getQuantity = (itemId, priceId) => {
    const quantityKey = `${itemId}-${priceId}`;
    return quantities[quantityKey] || 1;
  };

  if (loading) return <div className="loading">Loading menu...</div>;

  return (
    <div className="menu-page">
      <div className="menu-layout">
        {/* Sidebar Navigation */}
        <aside className="category-sidebar">
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 'active' : ''}
            >
              {category.name}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="menu-content">
          {(Array.isArray(categories) ? categories : [])
            .filter((cat) => !selectedCategory || cat.id === selectedCategory)
            .map((category) => (
              <div key={category.id} className="category-section">
                <h2 className="category-title">{category.name}</h2>
                
                <div className="menu-items">
                  {Array.isArray(category.items) && category.items.length > 0 ? (
                    category.items.map((item) => (
                      <div key={item.id} className="menu-item">
                        <div className="item-header">
                          <h3 className="item-name">{item.name}</h3>
                          {(item.is_vegetarian || item.is_vegan) && (
                            <div className="item-badges">
                              {item.is_vegetarian && <span className="badge veg">VEG</span>}
                              {item.is_vegan && <span className="badge vegan">VEGAN</span>}
                            </div>
                          )}
                        </div>
                        
                        {item.description && <p className="item-desc">{item.description}</p>}
                        
                        <div className="item-prices">
                          {Array.isArray(item.prices) && item.prices.map((price) => {
                            const quantity = getQuantity(item.id, price.id);
                            return (
                              <div key={price.id} className="price-row">
                                <span className="portion-label">{price.portion_type}</span>
                                <div className="price-action">
                                  <span className="price">£{parseFloat(price.price).toFixed(2)}</span>
                                  <div className="quantity-control">
                                    <button
                                      className="qty-btn"
                                      onClick={() => updateQuantity(item.id, price.id, -1)}
                                      disabled={!item.is_available}
                                    >
                                      -
                                    </button>
                                    <span className="quantity">{quantity}</span>
                                    <button
                                      className="qty-btn"
                                      onClick={() => updateQuantity(item.id, price.id, 1)}
                                      disabled={!item.is_available}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    className="btn-add"
                                    onClick={() => handleAddToCart(item, price)}
                                    disabled={!item.is_available}
                                    title="Add to cart"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-items">No items available in this category</p>
                  )}
                </div>
              </div>
            ))}
        </main>
      </div>
    </div>
  );
}

export default Menu;
