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
    
    if (movieId) {
        loadMovieDetails(movieId);
    } else {
        // Redirect to home if no movie ID is provided
        window.location.href = 'index.html';
    }
});

async function loadMovieDetails(movieId) {
    const apiKey = '3de5d8a62f09ad6692992112646adec2'; // Replace with your actual TMDB API key
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;
    const container = document.getElementById('movie-detail-container');
    
    try {
        // Fetch movie details and credits in parallel
        const [movieResponse, creditsResponse] = await Promise.all([
            fetch(movieUrl),
            fetch(creditsUrl)
        ]);
        
        const movie = await movieResponse.json();
        const credits = await creditsResponse.json();
        
        // Update page title
        document.title = `AGC Movie - ${movie.title}`;
        
        // Format genres
        const genres = movie.genres.map(genre => genre.name).join(', ');
        
        // Format runtime
        const runtime = movie.runtime ? 
            `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
        
        // Get top 10 cast members
        const topCast = credits.cast.slice(0, 10);
        
        // Create HTML for movie details
        container.innerHTML = `
            <div class="detail-container">
                <div class="movie-poster-large">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='assets/poster-placeholder.png'">
                </div>
                <div class="movie-content">
                    <div class="movie-meta">
                        <h1 class="movie-title-large">${movie.title}</h1>
                        ${movie.tagline ? `<p class="movie-tagline">"${movie.tagline}"</p>` : ''}
                        <div class="movie-facts">
                            <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                            <span>${genres}</span>
                            <span>${runtime}</span>
                        </div>
                        <div class="movie-rating-large">
                            <div class="rating-circle" style="border-color: ${getRatingColor(movie.vote_average)}">
                                ${movie.vote_average.toFixed(1)}
                            </div>
                            <div class="rating-text">
                                User<br>Score
                            </div>
                        </div>
                            <div class="movie-card">
        <div class="movie-poster">
            <a href="movie-detail.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='assets/poster-placeholder.png'">
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    ${movie.vote_average.toFixed(1)}
                </div>
            </a>
            <div class="play-button">
                <a href="movie-watch.html?id=${movie.id}&tmdb_id=${movie.id}">
                    <i class="fas fa-play"></i>
                </a>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-date">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
        </div>
    </div>
        <div class="watch-actions" style="margin-top: 30px;">
        <a href="movie-watch.html?id=${movie.id}&tmdb_id=${movie.id}" class="btn" style="display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-play"></i> Watch Now
        </a>
    </div>
                    </div>
                    <div class="movie-overview">
                        <h3>Overview</h3>
                        <p>${movie.overview || 'No overview available.'}</p>
                    </div>
                    <div class="cast-section">
                        <h3>Top Cast</h3>
                        <div class="cast-grid">
                            ${topCast.map(person => `
                                <div class="cast-card">
                                    <div class="cast-image">
                                        <img src="https://image.tmdb.org/t/p/w200${person.profile_path}" alt="${person.name}" onerror="this.src='assets/avatar-placeholder.png'">
                                    </div>
                                    <h4 class="cast-name">${person.name}</h4>
                                    <p class="cast-character">${person.character || 'N/A'}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load movie details. Please try again later.</p>
            </div>
        `;
    }
}

function getRatingColor(rating) {
    if (rating >= 8) return '#21d07a'; // Green
    if (rating >= 6) return '#d2d531'; // Yellow
    if (rating >= 4) return '#f5a623'; // Orange
    return '#db2360'; // Red
}

// Inside the movie details rendering code, add this:
movieContent.innerHTML += `
    <div class="watch-actions" style="margin-top: 30px;">
        <a href="movie-watch.html?id=${movie.id}&tmdb_id=${movie.id}" class="btn" style="display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-play"></i> Watch Now
        </a>
    </div>
`;
// Modify the movie card template to include watch link
movieGrid.innerHTML = movies.map(movie => `
    <div class="movie-card">
        <div class="movie-poster">
            <a href="movie-detail.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='assets/poster-placeholder.png'">
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    ${movie.vote_average.toFixed(1)}
                </div>
            </a>
            <div class="play-button">
                <a href="movie-watch.html?id=${movie.id}&tmdb_id=${movie.id}">
                    <i class="fas fa-play"></i>
                </a>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-date">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
        </div>
    </div>
`).join('');

// Di dalam fungsi loadMovieDetails, tambahkan:
function updateMetaTags(movie) {
    // Update regular meta tags
    document.getElementById('meta-description').content = 
        `${movie.title} (${movie.release_date.substring(0,4)}) - ${movie.overview.substring(0,160)}...`;
    
    document.getElementById('meta-keywords').content = 
        `${movie.title}, film ${movie.genres.map(g => g.name).join(', ')}, nonton ${movie.title}, streaming ${movie.title}`;
    
    // Update Open Graph tags
    document.getElementById('og-type').content = 'video.movie';
    document.getElementById('og-url').content = window.location.href;
    document.getElementById('og-title').content = `Nonton ${movie.title} (${movie.release_date.substring(0,4)}) - AGC Movie`;
    document.getElementById('og-description').content = movie.overview.substring(0,300);
    document.getElementById('og-image').content = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
    
    // Update Twitter tags
    document.getElementById('twitter-url').content = window.location.href;
    document.getElementById('twitter-title').content = `Nonton ${movie.title} (${movie.release_date.substring(0,4)}) - AGC Movie`;
    document.getElementById('twitter-description').content = movie.overview.substring(0,200);
    document.getElementById('twitter-image').content = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
    
    // Update canonical URL
    document.getElementById('canonical-url').href = window.location.href;
    
    // Update page title
    document.getElementById('page-title').textContent = `${movie.title} (${movie.release_date.substring(0,4)}) - AGC Movie`;
    
    // Add Schema.org markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Movie",
        "name": movie.title,
        "url": window.location.href,
        "image": `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
        "description": movie.overview,
        "dateCreated": movie.release_date,
        "genre": movie.genres.map(g => g.name),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": movie.vote_average,
            "ratingCount": movie.vote_count,
            "bestRating": "10",
            "worstRating": "0"
        }
    });
    document.head.appendChild(schemaScript);
}

// Panggil fungsi ini setelah mendapatkan data film
updateMetaTags(movie);