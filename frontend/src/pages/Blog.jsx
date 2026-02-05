import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../services/api';
import './Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getBlogPosts();
      setPosts(response.data.results || []);
    } catch (error) {
      console.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading blog posts...</div>;

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Latest news and updates from Spice Hub</p>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No blog posts yet</h2>
            <p>Check back soon for updates and news from Spice Hub!</p>
            <Link to="/menu" className="btn">Browse Our Menu</Link>
          </div>
        ) : (
          <div className="blog-grid">
            {(Array.isArray(posts) ? posts : []).map((post) => (
              <article key={post.id} className="blog-card">
                {post.image && (
                  <div className="blog-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                <div className="blog-content">
                  <h2>{post.title}</h2>
                  <div className="blog-meta">
                    <span>By {post.author_name}</span>
                    <span>{new Date(post.published_date).toLocaleDateString()}</span>
                  </div>
                  <p className="blog-excerpt">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  <Link to={`/blog/${post.slug}`} className="btn-read-more">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
