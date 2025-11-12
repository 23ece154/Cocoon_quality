import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const images = [
  "https://cdn.pixabay.com/photo/2014/04/21/11/59/cocoons-329087_960_720.jpg",
  "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_863/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ufgfoiqukhblyhznuuhv/DaLatCountrysideDayTour.jpg",
  "https://trc-leiden.nl/trc-needles/media/k2/items/cache/8e5d0a99fb541b160b93701aa4b01306_XL.jpg"
];

const faqsData = [
  {
    question: "How do I predict cocoon quality?",
    answer: "Connect your IoT sensors to SilkHue and follow the guided steps to get accurate predictions."
  },
  {
    question: "Which markets are supported?",
    answer: "SilkHue supports all major cocoon markets in your region and provides nearby market suggestions."
  },
  {
    question: "Can I track daily price trends?",
    answer: "Yes! Our platform updates daily cocoon market prices and visualizes them for easier decision-making."
  },
  {
    question: "Is there a mobile version?",
    answer: "SilkHue is mobile-friendly and works on all modern devices for convenient access on the go."
  }
];

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

  return (
    <div className="landing-container">
      <header className="navbar">
        <h1 className="logo">SilkHue</h1>
        <nav className="nav-links">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-secondary">Signup</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>Predict Your Cocoon's Quality</h1>
          <p>
            Stay ahead in sericulture by tracking daily cocoon market prices. 
            Predict cocoon quality accurately using IoT sensors and camera analysis. 
            Get smart suggestions for the best nearby markets based on your cocoon quality.
          </p>
          <Link to="/cocoon-market">
            <button className="btn-simple">View Today's cocoon price</button>
          </Link>
        </div>
        <div className="hero-right">
          <div className="carousel">
            <img src={images[currentIndex]} alt="Cocoon" />
            <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
            <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>
            <div className="carousel-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Daily Price Updates</h3>
            <p>Check the latest cocoon market prices every day.</p>
          </div>
          <div className="card">
            <h3>Predict Cocoon Quality (IoT)</h3>
            <p>Use IoT sensors to predict cocoon quality accurately.</p>
          </div>
          <div className="card">
            <h3>Market Suggestions</h3>
            <p>Get recommendations for the best nearby markets based on predicted quality.</p>
          </div>
        </div>
      </section>

      <section className="how-to-use">
      <h2>How to Use SilkHue</h2>
      <ol className="steps-list">
        <li>Sign up or log in to your account.</li>
        <li>Connect your IoT sensors to get the cocoon data.</li>
        <li>Check your cocoon’s predicted quality on the dashboard.</li>
        <li>View nearest market suggestions and daily price updates.</li>
        <li>Calculate potential profits based on cocoon weight and quality.</li>
        <li>Stay updated with daily market trends and recommendations.</li>
      </ol>
    </section>


      {/* =========================
          FAQs Section
      ========================== */}
      <section className="faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-cards">
          {faqsData.map((faq, index) => (
            <div
              key={index}
              className={`faq-card ${openFAQ === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="faq-question">
                {faq.question}
                <span className="faq-icon">{openFAQ === index ? "−" : "+"}</span>
              </h3>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 SilkHue. All rights reserved.</p>
        <p>Developed by: Sri Karthika L | Email: sri459874@gmail.com</p>
      </footer>
    </div>
  );
}

export default LandingPage;
