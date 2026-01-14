/**
 * Modern B2B Homepage - Glassmorphism + Memphis Design
 * Reference: localhost:3000 design with enhanced UX
 */

import { createLayout } from './layout';

export async function homePage(env, request) {
  // Default settings
  let settings = {
    site_name: 'FK Demo Store',
    site_description: 'Premium E-commerce Platform - Purchase Goods Directly from Verified Suppliers',
    company_intro: 'Founded in 2018, we are a leading e-commerce platform dedicated to delivering a seamless and enjoyable shopping experience to customers worldwide.'
  };

  try {
    // Load settings from API
    const response = await fetch(new URL('/api/settings', request.url).href, {
      method: 'GET',
      headers: { 'Authorization': '' }
    });
    const data = await response.json();
    if (data.success) {
      settings = { ...settings, ...data.data };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  const content = `
    <!-- Hero Section with Carousel -->
    <section class="hero-section">
      <div class="hero-slider">
        <div class="hero-slide active" style="background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=2400&q=85')">
          <div class="slide-content">
            <h1 class="hero-title">Purchase Goods Directly from Verified Suppliers</h1>
            <p class="hero-subtitle">Very Good Quality</p>
            <div class="hero-cta">
              <a href="/products" class="btn btn-primary btn-lg">Discover More</a>
            </div>
          </div>
        </div>
        <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=2400&q=85')">
          <div class="slide-content">
            <h1 class="hero-title">Global Shipping & Fast Delivery</h1>
            <p class="hero-subtitle">Worldwide Logistics Network</p>
            <div class="hero-cta">
              <a href="/products" class="btn btn-primary btn-lg">Learn More</a>
            </div>
          </div>
        </div>
        <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1556740758-90de374c12ad?w=2400&q=85')">
          <div class="slide-content">
            <h1 class="hero-title">Wholesale & Retail Solutions</h1>
            <p class="hero-subtitle">Flexible Business Models</p>
            <div class="hero-cta">
              <a href="/products" class="btn btn-primary btn-lg">Get Started</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Slider Navigation -->
      <div class="slider-nav">
        <button class="slider-dot active" data-slide="0" aria-label="Go to slide 1"></button>
        <button class="slider-dot" data-slide="1" aria-label="Go to slide 2"></button>
        <button class="slider-dot" data-slide="2" aria-label="Go to slide 3"></button>
      </div>
    </section>

    <!-- Trust Indicators -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-number">18+</div>
            <div class="trust-label">Years of Excellence</div>
          </div>
          <div class="trust-item">
            <div class="trust-number">1000+</div>
            <div class="trust-label">Global Customers</div>
          </div>
          <div class="trust-item">
            <div class="trust-number">80+</div>
            <div class="trust-label">Countries Served</div>
          </div>
          <div class="trust-item">
            <div class="trust-number">75+</div>
            <div class="trust-label">Products</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Product Categories</h2>
          <p class="section-subtitle">Explore our wide range of products</p>
          <a href="/products" class="section-link">View All →</a>
        </div>

        <div id="product-categories" class="categories-grid">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Handpicked products just for you</p>
          <a href="/products" class="section-link">View All →</a>
        </div>

        <div id="featured-products" class="products-grid">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </section>

    <!-- About Section with Stats -->
    <section class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <span class="section-tag">About Us</span>
            <h2 class="section-title">Blueheart Technology of Zhejiang Ltd.</h2>
            <p class="about-description">
              Founded in 2018, we are a leading e-commerce platform dedicated to delivering a seamless
              and enjoyable shopping experience to customers worldwide. Our mission is to connect people
              with the products they love, offering a curated selection of top-quality items across a
              variety of categories, including electronics, fashion, home goods, and more.
            </p>
            <p class="about-description">
              With a focus on innovation, reliability, and customer satisfaction, we have rapidly grown
              our user base and built strong relationships with trusted suppliers and brands. Our
              user-friendly website and mobile app are designed to make shopping fast, easy, and secure for everyone.
            </p>
            <a href="/about" class="btn btn-primary">View More</a>
          </div>
          <div class="about-image">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85" alt="Blueheart Technology" loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Us</h2>
          <p class="section-subtitle">Discover the advantages of working with us</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Premium Quality" loading="lazy">
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Premium Quality</h3>
              <p class="feature-description">All products are thoroughly tested and certified to ensure the highest quality standards.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" alt="Global Shipping" loading="lazy">
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Global Shipping</h3>
              <p class="feature-description">Fast and reliable worldwide delivery with tracking and insurance options.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Secure Payments" loading="lazy">
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Secure Payments</h3>
              <p class="feature-description">Multiple secure payment options with buyer protection guaranteed.</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" alt="24/7 Support" loading="lazy">
            </div>
            <div class="feature-content">
              <h3 class="feature-title">24/7 Support</h3>
              <p class="feature-description">Our dedicated support team is always ready to assist you with any questions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What Our Customers Say</h2>
          <p class="section-subtitle">Don't just take our word for it - hear from our satisfied customers</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85" alt="Phoebe Buffay" loading="lazy">
            </div>
            <h4 class="testimonial-name">Phoebe Buffay</h4>
            <p class="testimonial-role">Verified Customer</p>
            <p class="testimonial-text">
              "Fast shipping and excellent customer service. The product was even better than expected.
              I will definitely be a returning customer."
            </p>
            <div class="testimonial-rating">
              <span class="rating-star">★★★★★</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=85" alt="Monica Geller" loading="lazy">
            </div>
            <h4 class="testimonial-name">Monica Geller</h4>
            <p class="testimonial-role">Verified Customer</p>
            <p class="testimonial-text">
              "Great user experience on your website. I found exactly what I was looking for at a great price.
              I will definitely be telling my friends."
            </p>
            <div class="testimonial-rating">
              <span class="rating-star">★★★★★</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=85" alt="Robort Green" loading="lazy">
            </div>
            <h4 class="testimonial-name">Robort Green</h4>
            <p class="testimonial-role">Verified Customer</p>
            <p class="testimonial-text">
              "Thank you for the excellent shopping experience. It arrived quickly and was exactly as described.
              I will definitely be shopping with you again in the future."
            </p>
            <div class="testimonial-rating">
              <span class="rating-star">★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company News Preview -->
    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Company News</h2>
          <p class="section-subtitle">Stay updated with our latest news</p>
          <a href="/news" class="section-link">View All →</a>
        </div>

        <div class="news-grid">
          <article class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=85" alt="Exporters Embrace AI" loading="lazy">
            </div>
            <div class="news-content">
              <span class="news-category">Technology</span>
              <span class="news-date">Mar 16, 2025</span>
              <h3 class="news-title">Exporters Embrace Artificial Intelligence Solutions</h3>
              <a href="/news/1" class="news-link">Read More →</a>
            </div>
          </article>

          <article class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85" alt="Future of E-commerce" loading="lazy">
            </div>
            <div class="news-content">
              <span class="news-category">Industry</span>
              <span class="news-date">Mar 17, 2025</span>
              <h3 class="news-title">The Future of E-commerce and Retail Technology</h3>
              <a href="/news/2" class="news-link">Read More →</a>
            </div>
          </article>

          <article class="news-card">
            <div class="news-image">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85" alt="Supply Chain Hurdles" loading="lazy">
            </div>
            <div class="news-content">
              <span class="news-category">Logistics</span>
              <span class="news-date">Mar 20, 2025</span>
              <h3 class="news-title">Supply Chains Face New Hurdles</h3>
              <a href="/news/3" class="news-link">Read More →</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-content">
            <h2 class="cta-title">Contact Us</h2>
            <p class="cta-description">
              Send me a message to discuss your needs. I always reply within 24 hours.
            </p>

            <div class="contact-info">
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <strong>Address</strong>
                  <p>No. 22 Beichen West Road, Shaoxing City, Zhejiang Province</p>
                </div>
              </div>

              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:net936@163.com">net936@163.com</a></p>
                </div>
              </div>

              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+86-17801460534">+86-17801460534</a></p>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-form-wrapper">
            <h3>Send Us a Message</h3>
            <form id="contact-form" class="contact-form">
              <div class="form-group">
                <label for="contact-name">Name *</label>
                <input type="text" id="contact-name" name="name" required>
              </div>

              <div class="form-group">
                <label for="contact-email">Email *</label>
                <input type="email" id="contact-email" name="email" required>
              </div>

              <div class="form-group">
                <label for="contact-phone">Phone</label>
                <input type="tel" id="contact-phone" name="phone">
              </div>

              <div class="form-group">
                <label for="contact-message">Message *</label>
                <textarea id="contact-message" name="message" rows="4" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block">Send Message</button>
            </form>
          </div>

          <div class="cta-image">
            <img src="https://005.fktool.com/upload/img/1745053949716.png" alt="Contact Us" loading="lazy">
          </div>
        </div>
      </div>
    </section>
  `;

  const scripts = `
    <script>
      // Unsplash image URLs for different categories
      const categoryImageUrls = {
        'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=85',
        'monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=85',
        'ebook': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=85',
        'embedded': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85',
        'control': 'https://images.unsplash.com/photo-1563770095122-2c456c8b3cc4?w=800&q=85',
        'hydraulic': 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=85',
        'pneumatic': 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=85',
        'industrial': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85',
        'automation': 'https://images.unsplash.com/photo-1563770095122-2c456c8b3cc4?w=800&q=85',
        'electronics': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
        'machinery': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85',
        'conveyor': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85',
        'material': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85',
        'handling': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85',
        'robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=85',
        'cnc': 'https://images.unsplash.com/photo-1565439398-0454c814cbbd?w=800&q=85',
        'sensor': 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=85',
        'iot': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=85',
        'power': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
        'systems': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
        'default': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85'
      };

      // Get Unsplash image for category
      function getCategoryImage(category) {
        const categoryLower = category.toLowerCase();

        for (const [key, value] of Object.entries(categoryImageUrls)) {
          if (categoryLower.includes(key)) {
            return value;
          }
        }

        return categoryImageUrls['default'];
      }

      // Load product categories
      async function loadCategories() {
        try {
          const response = await API.get('/products/categories');
          const categories = response.data || [];

          const container = document.getElementById('product-categories');

          if (categories.length === 0) {
            container.innerHTML = '<p class="no-data">No categories available.</p>';
            return;
          }

          container.innerHTML = categories.map(category => {
            const imageUrl = getCategoryImage(category);
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

            return \`
              <a href="/products?category=\${encodeURIComponent(category)}" class="category-card" tabindex="0">
                <div class="category-image">
                  <img src="\${imageUrl}" alt="\${category}" loading="lazy">
                </div>
                <div class="category-overlay">
                  <h3 class="category-title">\${category}</h3>
                  <span class="category-action">Explore</span>
                </div>
              </a>
            \`;
          }).join('');
        } catch (error) {
          console.error('Error loading categories:', error);
          document.getElementById('product-categories').innerHTML =
            '<p class="error-message">Unable to load categories. Please try again later.</p>';
        }
      }

      // Load featured products
      async function loadFeaturedProducts() {
        try {
          const response = await API.get('/products?featured=true&limit=8');
          let products = response.data || [];

          // Limit to 8 products (2 rows × 4 columns)
          products = products.slice(0, 8);

          const container = document.getElementById('featured-products');

          if (products.length === 0) {
            container.innerHTML = '<p class="no-data">No featured products available.</p>';
            return;
          }

          container.innerHTML = products.map(product => \`
            <div class="product-card">
              <div class="product-image">
                <a href="/products/\${product.id}">
                  <img src="\${product.image_url || '/images/placeholder.jpg'}"
                       alt="\${product.name}"
                       loading="lazy">
                </a>
              </div>
              <div class="product-info">
                <h3 class="product-title">
                  <a href="/products/\${product.id}">\${product.name}</a>
                </h3>
                <div class="product-price">\${product.price ? '$' + product.price : 'Contact for Price'}</div>
                <div class="product-actions">
                  <a href="/products/\${product.id}" class="btn btn-primary btn-sm">View Details</a>
                </div>
              </div>
            </div>
          \`).join('');
        } catch (error) {
          console.error('Error loading products:', error);
          document.getElementById('featured-products').innerHTML =
            '<p class="error-message">Unable to load products. Please try again later.</p>';
        }
      }

      // Hero slider functionality
      function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        let currentSlide = 0;
        let autoSlideInterval;

        function showSlide(index) {
          slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
          });
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
          currentSlide = index;
        }

        function nextSlide() {
          const next = (currentSlide + 1) % slides.length;
          showSlide(next);
        }

        function prevSlide() {
          const prev = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(prev);
        }

        // Auto-slide
        function startAutoSlide() {
          autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
          clearInterval(autoSlideInterval);
        }

        // Dot navigation
        dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
          });
        });

        // Start auto-slide
        startAutoSlide();
      }

      // Contact form handling
      function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const formData = new FormData(form);
          const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
          };

          try {
            const response = await API.post('/inquiries', data);
            if (response.success) {
              alert('Message sent successfully! We will get back to you within 24 hours.');
              form.reset();
            } else {
              alert('Failed to send message. Please try again.');
            }
          } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again later.');
          }
        });
      }

      // Scroll animations
      function initScrollAnimations() {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        document.querySelectorAll('.categories-section, .featured-section, .about-section, .features-section, .testimonials-section, .news-section, .cta-section').forEach(section => {
          observer.observe(section);
        });
      }

      // Smooth scroll
      function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      }

      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        loadCategories();
        loadFeaturedProducts();
        initHeroSlider();
        initContactForm();
        initScrollAnimations();
        initSmoothScroll();
      });
    </script>
  `;

  const html = createLayout(
    settings.site_name,
    content,
    scripts,
    settings.site_description,
    false
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
