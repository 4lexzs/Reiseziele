// App functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const destinationsGrid = document.getElementById('destinations-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const searchInput = document.getElementById('search-input');
    const regionFilter = document.getElementById('region-filter');
    const budgetFilter = document.getElementById('budget-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortOptions = document.getElementById('sort-options');
    
    let allDestinations = [...destinations]; // Kopie der Original-Daten
    let displayedDestinations = 0;
    const destinationsPerPage = 12;
    
    // Zufällige Hintergrundbilder beim Laden der Seite
    setRandomHeaderBackground();
    
    // Initial alle Destinationen anzeigen
    filterAndDisplayDestinations();
    
    // Load more button click
    loadMoreBtn.addEventListener('click', function() {
        const nextBatch = allDestinations.slice(
            displayedDestinations, 
            displayedDestinations + destinationsPerPage
        );
        
        appendDestinations(nextBatch);
        displayedDestinations += nextBatch.length;
        
        // Update load more button visibility
        updateLoadMoreButton();
    });
    
    // Filter-Events
    searchInput.addEventListener('input', filterAndDisplayDestinations);
    regionFilter.addEventListener('change', filterAndDisplayDestinations);
    budgetFilter.addEventListener('change', filterAndDisplayDestinations);
    typeFilter.addEventListener('change', filterAndDisplayDestinations);
    sortOptions.addEventListener('change', filterAndDisplayDestinations);
    
    // Funktion zum Filtern und Anzeigen der Destinationen
    function filterAndDisplayDestinations() {
        const searchTerm = searchInput.value.toLowerCase();
        const regionValue = regionFilter.value;
        const budgetValue = budgetFilter.value;
        const typeValue = typeFilter.value;
        const sortValue = sortOptions.value;
        
        // Filtern der Destinationen basierend auf den Filterkriterien
        let filteredDestinations = destinations.filter(destination => {
            // Filter by search term
            const nameMatch = destination.name.toLowerCase().includes(searchTerm);
            const descMatch = destination.description.toLowerCase().includes(searchTerm);
            const searchMatch = nameMatch || descMatch;
            
            // Filter by region
            const regionMatch = regionValue === 'all' || destination.region === regionValue;
            
            // Filter by budget
            const budgetMatch = budgetValue === 'all' || destination.budget.includes(budgetValue);
            
            // Filter by type
            const typeMatch = typeValue === 'all' || destination.type.includes(typeValue);
            
            return searchMatch && regionMatch && budgetMatch && typeMatch;
        });
        
        // Sortieren der Destinationen
        if (sortValue === 'nameAsc') {
            filteredDestinations.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'nameDesc') {
            filteredDestinations.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortValue === 'regionAsc') {
            filteredDestinations.sort((a, b) => a.region.localeCompare(b.region));
        } else if (sortValue === 'random') {
            shuffleArray(filteredDestinations);
        }
        
        // Reset displayed count
        displayedDestinations = 0;
        
        // Display filtered and sorted results
        displayResults(filteredDestinations.slice(0, destinationsPerPage));
        displayedDestinations = Math.min(destinationsPerPage, filteredDestinations.length);
        
        // Update global list
        allDestinations = filteredDestinations;
        
        // Update load more button visibility
        updateLoadMoreButton();
    }
    
    // Function to display results
    function displayResults(destinations) {
        // Clear previous results
        destinationsGrid.innerHTML = '';
        
        if (destinations.length === 0) {
            destinationsGrid.innerHTML = `
                <div class="no-results">
                    <p>Leider wurden keine passenden Reiseziele gefunden. Versuche es mit anderen Filterkriterien.</p>
                </div>
            `;
            return;
        }
        
        // Append destinations
        appendDestinations(destinations);
    }
    
    // Function to append destinations to the grid
    function appendDestinations(destinations) {
        destinations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination-card';
            
            const featuresHTML = destination.features.map(feature => 
                `<span class="feature">${feature}</span>`
            ).join('');
            
            const highlightsHTML = destination.highlights.map(highlight => 
                `<li>${highlight}</li>`
            ).join('');
            
            card.innerHTML = `
                <div class="destination-img-container">
                    <img src="${destination.image}" alt="${destination.name}" class="destination-img">
                    <div class="destination-region">${destination.region}</div>
                </div>
                <div class="destination-details">
                    <h3>${destination.name}</h3>
                    <p>${destination.description}</p>
                    <div class="destination-highlights">
                        <h4>Highlights:</h4>
                        <ul>${highlightsHTML}</ul>
                    </div>
                    <div class="features">
                        ${featuresHTML}
                    </div>
                </div>
            `;
            
            destinationsGrid.appendChild(card);
        });
    }
    
    // Function to update load more button visibility
    function updateLoadMoreButton() {
        if (displayedDestinations >= allDestinations.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // Function to shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Function to set a random header background
    function setRandomHeaderBackground() {
        const headerElement = document.querySelector('header');
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        
        // Verwende den Bildpfad des zufälligen Reiseziels, entferne aber die Größenbeschränkungen
        const bgImageUrl = randomDestination.image.replace('w=600&h=400&', '');
        headerElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImageUrl})`;
    }
});