import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getBlogPosts } from '../../services/api';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '../../services/adminApi';
import { useAuthStore } from '../../store/store';

function AdminBlogManager() {
  const { user } = useAuthStore();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: false,
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await getBlogPosts();
      setBlogPosts(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        author: user.id,
      };

      if (editingPost) {
        await updateBlogPost(editingPost.slug, submitData);
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost(submitData);
        toast.success('Blog post created successfully');
      }

      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        is_published: false,
      });
      setEditingPost(null);
      fetchBlogPosts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(slug);
        toast.success('Blog post deleted');
        fetchBlogPosts();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      is_published: post.is_published,
    });
  };

  return (
    <div className="admin-section">
      <h3>Manage Blog Posts</h3>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Blog post title"
            />
          </div>
          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="blog-post-slug"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Short excerpt for preview"
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full blog post content (supports HTML)"
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            Publish this post
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
        </button>
        {editingPost && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingPost(null);
              setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                is_published: false,
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="admin-list">
        <h4>Published Posts</h4>
        {(Array.isArray(blogPosts) ? blogPosts : []).filter((p) => p.is_published).length === 0 ? (
          <p className="empty-state">No published posts yet</p>
        ) : (
          <div className="list-items">
            {(Array.isArray(blogPosts) ? blogPosts : [])
              .filter((p) => p.is_published)
              .map((post) => (
                <div key={post.id} className="list-item">
                  <div className="item-info">
                    <h5>{post.title}</h5>
                    <p>{post.excerpt || post.content.substring(0, 100) + '...'}</p>
                    <small>By {post.author_name} • {new Date(post.published_date).toLocaleDateString()}</small>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-small btn-edit" onClick={() => handleEdit(post)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-delete" onClick={() => handleDelete(post.slug)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="admin-list">
        <h4>Draft Posts</h4>
        {(Array.isArray(blogPosts) ? blogPosts : []).filter((p) => !p.is_published).length === 0 ? (
          <p className="empty-state">No draft posts</p>
        ) : (
          <div className="list-items">
            {(Array.isArray(blogPosts) ? blogPosts : [])
              .filter((p) => !p.is_published)
              .map((post) => (
                <div key={post.id} className="list-item">
                  <div className="item-info">
                    <h5>{post.title} <span className="draft-badge">DRAFT</span></h5>
                    <p>{post.excerpt || post.content.substring(0, 100) + '...'}</p>
                    <small>By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}</small>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-small btn-edit" onClick={() => handleEdit(post)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-delete" onClick={() => handleDelete(post.slug)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBlogManager;
