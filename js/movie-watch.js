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
    
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const tmdbId = urlParams.get('tmdb_id') || movieId; // Fallback to movieId if no tmdb_id
    
    if (movieId) {
        loadMoviePlayer(movieId, tmdbId);
        setupQualitySelector();
        setupServerSelector();
    } else {
        // Redirect to home if no movie ID is provided
        window.location.href = 'index.html';
    }
});

function loadMoviePlayer(movieId, tmdbId) {
    const titleElement = document.getElementById('movie-title');
    const iframe = document.getElementById('movie-iframe');
    
    // First, try to get movie details from TMDB
    fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=YOUR_TMDB_API_KEY`)
        .then(response => response.json())
        .then(movie => {
            // Update page title and heading
            document.title = `AGC Movie - Watch ${movie.title}`;
            titleElement.textContent = `Watching: ${movie.title}`;
            
            // Load the player with default quality and server
            updatePlayerSource(movieId, tmdbId, 'auto', 'vidsrc');
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
            titleElement.textContent = 'Movie Playback';
            // Load player anyway without TMDB data
            updatePlayerSource(movieId, tmdbId, 'auto', 'vidsrc');
        });
}

function updatePlayerSource(movieId, tmdbId, quality, server) {
    const iframe = document.getElementById('movie-iframe');
    const spinner = document.querySelector('.player-container .loading-spinner');
    
    // Show loading spinner
    spinner.style.display = 'flex';
    iframe.style.display = 'none';
    
    // Generate embed URL based on selected server and quality
    let embedUrl;
    
    switch(server) {
        case 'vidsrcpro':
            embedUrl = `https://vidsrc.me/embed/${tmdbId}/${quality}`;
            break;
        case 'database':
            embedUrl = `https://vidsrc.me/embed/movie/${tmdbId}/${quality}`;
            break;
        case 'vidsrc':
        default:
            embedUrl = `https://vidsrc.me/embed/${tmdbId}/`;
            break;
    }
    
    // Set iframe source
    iframe.src = embedUrl;
    
    // When iframe loads, hide spinner
    iframe.onload = function() {
        spinner.style.display = 'none';
        iframe.style.display = 'block';
    };
    
    // Fallback in case iframe fails to load
    setTimeout(() => {
        if (spinner.style.display !== 'none') {
            spinner.style.display = 'none';
            iframe.style.display = 'block';
        }
    }, 10000);
}

function setupQualitySelector() {
    const qualityButtons = document.querySelectorAll('.quality-btn');
    
    qualityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            qualityButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get movie ID and TMDB ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('id');
            const tmdbId = urlParams.get('tmdb_id') || movieId;
            
            // Get current server
            const activeServer = document.querySelector('.server-btn.active').dataset.server;
            
            // Update player with new quality
            updatePlayerSource(movieId, tmdbId, this.dataset.quality, activeServer);
        });
    });
}

function setupServerSelector() {
    const serverButtons = document.querySelectorAll('.server-btn');
    
    serverButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            serverButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get movie ID and TMDB ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('id');
            const tmdbId = urlParams.get('tmdb_id') || movieId;
            
            // Get current quality
            const activeQuality = document.querySelector('.quality-btn.active').dataset.quality;
            
            // Update player with new server
            updatePlayerSource(movieId, tmdbId, activeQuality, this.dataset.server);
        });
    });
}