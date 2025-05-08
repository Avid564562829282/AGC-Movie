document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
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

// Function to fetch movies from TMDB API
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

// Function to display movies in the grid
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