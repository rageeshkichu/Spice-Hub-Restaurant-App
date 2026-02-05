import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>WELCOME TO <span>SPICE HUB</span></h1>
            <p>
              Spice Hub is the place for you and all you need to do is decide what you want to eat. 
              We have all those favourite dishes such as Sheesh Kebab, Naga Wings, Hot Wings, BBQ Wings...
            </p>
            <Link to="/tablereservation" className="btn">BOOK A TABLE</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-cards">
            <div className="feature-card">
              <h2>UNLIMITED <span>NON VEG FOOD</span></h2>
              <p>Explore our extensive range of non-vegetarian delicacies</p>
              <Link to="/menu" className="btn">ORDER NOW</Link>
            </div>
            <div className="feature-card">
              <h2>UNLIMITED <span>VEG FOOD</span></h2>
              <p>Delicious vegetarian options for every taste</p>
              <Link to="/menu" className="btn">ORDER NOW</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about section">
        <div className="container">
          <h2 className="section-title">About <span>Spice Hub</span></h2>
          <div className="about-content">
            <p>
              Welcome to Spice Hub, your destination for authentic Indian cuisine. 
              We pride ourselves on serving traditional dishes with a modern twist, 
              using only the finest ingredients and authentic spices.
            </p>
            <p>
              Whether you're dining in, taking away, or ordering delivery, 
              we guarantee a memorable culinary experience that will keep you coming back for more.
            </p>
          </div>
        </div>
      </section>

      <section className="cta section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Check out our full menu and place your order now!</p>
          <Link to="/menu" className="btn btn-secondary">VIEW MENU</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
