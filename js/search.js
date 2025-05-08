document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    mobileMenuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
        });
    });
    
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        performSearch(query);
    }
});

async function performSearch(query) {
    const apiKey = '3de5d8a62f09ad6692992112646adec2'; // Replace with your actual TMDB API key
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
    const moviesContainer = document.getElementById('movies-container');
    const searchHeader = document.querySelector('.search-header h1');
    
    // Update search header
    searchHeader.innerHTML = `Search <span>Results for "${query}"</span>`;
    
    // Show loading spinner
    moviesContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results.length > 0) {
            moviesContainer.innerHTML = data.results.map(movie => `
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
        } else {
            moviesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        moviesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to search movies. Please try again later.</p>
            </div>
        `;
    }
}