import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCategories, getMenuItems } from '../../services/api';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../services/adminApi';

function AdminMenuManager() {
  const [activeSection, setActiveSection] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [editingCategory, setEditingCategory] = useState(null);

  // Menu item form
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    is_vegetarian: false,
    is_vegan: false,
    is_available: true,
    starter_price: '',
    mains_price: '',
  });
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems();
      setMenuItems(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    }
  };

  // Category handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        toast.success('Category updated successfully');
      } else {
        await createCategory(categoryForm);
        toast.success('Category created successfully');
      }
      setCategoryForm({ name: '', slug: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
  };

  // Menu item handlers
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuItemForm.name || !menuItemForm.slug || !menuItemForm.category) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, menuItemForm);
        toast.success('Menu item updated successfully');
      } else {
        await createMenuItem(menuItemForm);
        toast.success('Menu item created successfully');
      }
      setMenuItemForm({
        name: '',
        slug: '',
        category: '',
        description: '',
        is_vegetarian: false,
        is_vegan: false,
        is_available: true,
        starter_price: '',
        mains_price: '',
      });
      setEditingMenuItem(null);
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
        toast.success('Menu item deleted');
        fetchMenuItems();
      } catch (error) {
        toast.error('Failed to delete menu item');
      }
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuItem(item);
    
    // Extract prices from item.prices array if they exist
    const starterPrice = item.prices?.find(p => p.portion_type.toLowerCase() === 'starter')?.price || '';
    const mainsPrice = item.prices?.find(p => p.portion_type.toLowerCase() === 'mains')?.price || '';
    
    setMenuItemForm({
      name: item.name,
      slug: item.slug,
      category: item.category,
      description: item.description,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_available: item.is_available,
      starter_price: starterPrice,
      mains_price: mainsPrice,
    });
  };

  return (
    <div className="admin-section">
      <div className="admin-subsection-tabs">
        <button
          className={`subsection-tab ${activeSection === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveSection('categories')}
        >
          Categories
        </button>
        <button
          className={`subsection-tab ${activeSection === 'items' ? 'active' : ''}`}
          onClick={() => setActiveSection('items')}
        >
          Menu Items
        </button>
      </div>

      {activeSection === 'categories' && (
        <div className="subsection">
          <h3>Manage Categories</h3>

          <form onSubmit={handleAddCategory} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Grill, Wraps"
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g., grill"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Category description"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            {editingCategory && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', slug: '', description: '' });
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="admin-list">
            <h4>Existing Categories</h4>
            {Array.isArray(categories) && categories.length === 0 ? (
              <p className="empty-state">No categories yet</p>
            ) : (
              <div className="list-items">
                {(Array.isArray(categories) ? categories : []).map((category) => (
                  <div key={category.id} className="list-item">
                    <div className="item-info">
                      <h5>{category.name}</h5>
                      <p>{category.description || 'No description'}</p>
                      <small>Items: {category.item_count}</small>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'items' && (
        <div className="subsection">
          <h3>Manage Menu Items</h3>

          <form onSubmit={handleAddMenuItem} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={menuItemForm.name}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                  placeholder="Item name"
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  value={menuItemForm.slug}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, slug: e.target.value })}
                  placeholder="item-slug"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={menuItemForm.category}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {(Array.isArray(categories) ? categories : []).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Available</label>
                <select
                  value={menuItemForm.is_available}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, is_available: e.target.value === 'true' })}
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Vegetarian</label>
                <select
                  value={menuItemForm.is_vegetarian}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, is_vegetarian: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vegan</label>
                <select
                  value={menuItemForm.is_vegan}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, is_vegan: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Starter Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={menuItemForm.starter_price}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, starter_price: e.target.value })}
                  placeholder="5.99"
                />
              </div>
              <div className="form-group">
                <label>Mains Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={menuItemForm.mains_price}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, mains_price: e.target.value })}
                  placeholder="8.49"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                placeholder="Item description"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingMenuItem ? 'Update Item' : 'Add Item'}
            </button>
            {editingMenuItem && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingMenuItem(null);
                  setMenuItemForm({
                    name: '',
                    slug: '',
                    category: '',
                    description: '',
                    is_vegetarian: false,
                    is_vegan: false,
                    is_available: true,
                    starter_price: '',
                    mains_price: '',
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="admin-list">
            <h4>Existing Menu Items</h4>
            {menuItems.length === 0 ? (
              <p className="empty-state">No menu items yet</p>
            ) : (
              <div className="list-items">
                {(Array.isArray(menuItems) ? menuItems : []).map((item) => (
                  <div key={item.id} className="list-item">
                    <div className="item-info">
                      <h5>{item.name}</h5>
                      <p>{item.description || 'No description'}</p>
                      <div className="item-tags">
                        <span className="tag">{item.category_name}</span>
                        {item.is_vegetarian && <span className="tag tag-vegetarian">🥬 Vegetarian</span>}
                        {item.is_vegan && <span className="tag tag-vegan">🌱 Vegan</span>}
                        {!item.is_available && <span className="tag tag-unavailable">❌ Unavailable</span>}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleEditMenuItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDeleteMenuItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenuManager;
