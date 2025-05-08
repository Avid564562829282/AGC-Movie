// Slider Class Implementation
class MovieSlider {
    constructor() {
      this.apiKey = '3de5d8a62f09ad6692992112646adec2'; // Replace with your actual TMDB API key
      this.sliderContainer = document.getElementById('trending-slider');
      this.dotsContainer = document.getElementById('slider-dots');
      this.slides = [];
      this.currentIndex = 0;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.autoSlideInterval = null;
      this.autoSlideDelay = 5000;
      this.isPaused = false;
      
      if (this.sliderContainer) {
        this.init();
      }
    }
  
    async init() {
      try {
        await this.fetchSliderData();
        this.setupSlider();
        this.startAutoSlide();
        this.setupEventListeners();
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async fetchSliderData() {
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.slides = data.results.slice(0, 5); // Get top 5 trending movies
      
      this.renderSlider();
    }
  
    renderSlider() {
      // Clear existing content
      this.sliderContainer.innerHTML = '';
      this.dotsContainer.innerHTML = '';
      
      // Create slides
      this.slides.forEach((movie, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        
        slide.innerHTML = `
          <div class="slide-content">
            <h2>${movie.title}</h2>
            <p>${movie.overview ? movie.overview.substring(0, 150) + '...' : 'No overview available.'}</p>
            <div class="slide-meta">
              <span class="slide-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
              <span class="slide-year">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
            </div>
            <a href="movie-detail.html?id=${movie.id}" class="btn">View Details</a>
          </div>
        `;
        
        this.sliderContainer.appendChild(slide);
        
        // Create dots
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        this.dotsContainer.appendChild(dot);
      });
    }
  
    setupSlider() {
      // Set initial active slide
      this.showSlide(this.currentIndex);
    }
  
    showSlide(index) {
      // Validate index
      if (index < 0) index = this.slides.length - 1;
      if (index >= this.slides.length) index = 0;
      
      // Update current index
      this.currentIndex = index;
      
      // Update slides
      const slides = document.querySelectorAll('.slide');
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      
      // Update dots
      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      // Reset auto-slide timer when manually changing slides
      this.resetAutoSlide();
    }
  
    nextSlide() {
      this.showSlide(this.currentIndex + 1);
    }
  
    prevSlide() {
      this.showSlide(this.currentIndex - 1);
    }
  
    goToSlide(index) {
      this.showSlide(index);
    }
  
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        if (!this.isPaused) {
          this.nextSlide();
        }
      }, this.autoSlideDelay);
    }
  
    resetAutoSlide() {
      clearInterval(this.autoSlideInterval);
      this.startAutoSlide();
    }
  
    pauseAutoSlide() {
      this.isPaused = true;
    }
  
    resumeAutoSlide() {
      this.isPaused = false;
    }
  
    handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = this.touchEndX - this.touchStartX;
      
      if (swipeDistance < -swipeThreshold) {
        this.nextSlide();
      } else if (swipeDistance > swipeThreshold) {
        this.prevSlide();
      }
    }
  
    setupEventListeners() {
      // Button controls
      document.querySelector('.slider-prev')?.addEventListener('click', () => this.prevSlide());
      document.querySelector('.slider-next')?.addEventListener('click', () => this.nextSlide());
      
      // Dot navigation
      document.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          this.goToSlide(parseInt(dot.dataset.index));
        });
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') this.nextSlide();
        if (e.key === 'ArrowLeft') this.prevSlide();
      });
      
      // Touch events
      this.sliderContainer.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.pauseAutoSlide();
      }, { passive: true });
      
      this.sliderContainer.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.resumeAutoSlide();
      }, { passive: true });
      
      // Pause on hover
      this.sliderContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
      this.sliderContainer.addEventListener('mouseleave', () => this.resumeAutoSlide());
      
      // Visibility API - pause when tab is inactive
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAutoSlide();
        } else {
          this.resumeAutoSlide();
        }
      });
    }
  
    handleError(error) {
      console.error('Error loading slider data:', error);
      this.sliderContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load featured movies. Please try again later.</p>
        </div>
      `;
    }
  }
  
  // Initialize slider when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    mobileMenuBtn?.addEventListener('click', function() {
      navbar.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbar.classList.remove('active');
      });
    });
    
    // Initialize slider
    if (document.querySelector('.hero-slider')) {
      new MovieSlider();
    }
    
    // Load movies for homepage sections
    if (document.getElementById('now-playing')) {
      fetchMovies('now_playing', 'now-playing');
    }
    
    if (document.getElementById('popular')) {
      fetchMovies('popular', 'popular');
    }
    
    if (document.getElementById('upcoming')) {
      fetchMovies('upcoming', 'upcoming');
    }
  });
  
  // Existing fetchMovies function remains the same
  async function fetchMovies(endpoint, elementId) {
    const apiKey = '3de5d8a62f09ad6692992112646adec2'; // Replace with your actual TMDB API key
    const url = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}&language=en-US&page=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayMovies(data.results.slice(0, 6), elementId); // Display first 6 movies
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
  // Existing displayMovies function remains the same
  function displayMovies(movies, elementId) {
    const movieGrid = document.getElementById(elementId);
    
    if (!movieGrid) return;
    
    movieGrid.innerHTML = movies.map(movie => `
      <div class="movie-card">
        <a href="movie-detail.html?id=${movie.id}">
          <div class="movie-poster">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='assets/poster-placeholder.png'">
            <div class="movie-rating">
              <i class="fas fa-star"></i>
              ${movie.vote_average.toFixed(1)}
            </div>
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-date">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
          </div>
        </a>
      </div>
    `).join('');
  }