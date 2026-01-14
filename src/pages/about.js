/**
 * About Page
 * Displays company information, history, and certifications
 */

import { createLayout } from './layout';

export async function aboutPage(env, request) {
  // Default settings for SEO
  let siteName = 'B2B Product Exhibition';
  let siteDescription = 'Your trusted partner for high-quality industrial products and innovative solutions worldwide';
  let companyIntro = 'We are a leading manufacturer and supplier of high-quality industrial products.';

  try {
    const response = await fetch(new URL('/api/settings', request.url).href);
    const data = await response.json();
    if (data.success) {
      siteName = data.data.site_name || siteName;
      siteDescription = data.data.site_description || siteDescription;
      companyIntro = data.data.company_intro || companyIntro;
    }
  } catch (error) {
    console.error('Error loading settings for SEO:', error);
  }

  const content = `
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container hero-content">
        <div class="hero-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span>Global Industry Leader</span>
        </div>
        <h1 class="hero-title">About Our Company</h1>
        <p class="hero-subtitle">
          Driving industrial innovation with decades of expertise and commitment to excellence
        </p>
      </div>
    </section>

    <section class="section-intro">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text">
            <span class="section-tag">Who We Are</span>
            <h2 class="section-title">Leading the Way in Industrial Excellence</h2>
            <p id="company-intro" class="intro-description">
              \${companyIntro}
            </p>
            <p style="margin-top: 1rem; color: var(--text-light);">
              Our state-of-the-art manufacturing facilities and rigorous quality control processes ensure that every product meets the highest international standards. With a global network of partners and clients across 50+ countries, we continue to expand our reach while maintaining our commitment to quality and customer satisfaction.
            </p>

            <div class="intro-highlights">
              <div class="highlight-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="check-icon">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>ISO 9001:2015 Certified</span>
              </div>
              <div class="highlight-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="check-icon">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Global Quality Standards</span>
              </div>
              <div class="highlight-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="check-icon">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Sustainable Manufacturing</span>
              </div>
            </div>
          </div>

          <div class="intro-visual">
            <div class="stats-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="stat-card glass-card" style="padding: 1.5rem; text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem;">20+</div>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat-card glass-card" style="padding: 1.5rem; text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem;">500+</div>
                <div class="stat-label">Global Clients</div>
              </div>
              <div class="stat-card glass-card" style="padding: 1.5rem; text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem;">1000+</div>
                <div class="stat-label">Products</div>
              </div>
              <div class="stat-card glass-card" style="padding: 1.5rem; text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem;">50+</div>
                <div class="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-features">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Values</span>
          <h2 class="section-title">What Sets Us Apart</h2>
        </div>

        <div class="bento-grid">
          <div class="bento-card bento-large glass-card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="feature-title">Quality First</h3>
            <p class="feature-description">
              Every product undergoes rigorous testing and meets international quality standards before reaching you.
            </p>
          </div>

          <div class="bento-card bento-medium glass-card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 class="feature-title">On-Time Delivery</h3>
            <p class="feature-description">
              Efficient supply chain ensures your products arrive when you need them.
            </p>
          </div>

          <div class="bento-card bento-medium glass-card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h3 class="feature-title">Expert Support</h3>
            <p class="feature-description">
              Our dedicated team is ready to help you find the right solutions for your needs.
            </p>
          </div>

          <div class="bento-card bento-small glass-card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="feature-title">Secure & Reliable</h3>
            <p class="feature-description">
              Trusted by industry leaders worldwide.
            </p>
          </div>

          <div class="bento-card bento-small glass-card feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
            <h3 class="feature-title">Global Reach</h3>
            <p class="feature-description">
              Serving customers in over 50 countries.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  const scripts = `
    <script>
      // Intersection Observer for scroll animations
      function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section-intro, .section-features').forEach(section => {
          section.style.opacity = '0';
          section.style.transform = 'translateY(30px)';
          section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          observer.observe(section);
        });

        document.querySelectorAll('.bento-card, .intro-visual').forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
          observer.observe(card);
        });
      }

      document.addEventListener('DOMContentLoaded', initScrollAnimations);
    </script>
  `;

  const html = createLayout(
    `About Us - ${siteName}`,
    content,
    scripts,
    siteDescription,
    false
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
