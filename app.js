// App functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Main View
    const mainView = document.getElementById('main-view');
    const destinationsGrid = document.getElementById('destinations-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const searchInput = document.getElementById('search-input');
    const regionFilter = document.getElementById('region-filter');
    const budgetFilter = document.getElementById('budget-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortOptions = document.getElementById('sort-options');
    
    // DOM elements - Detail View
    const detailView = document.getElementById('detail-view');
    const destinationDetail = document.getElementById('destination-detail');
    const backButton = document.getElementById('back-button');
    
    let allDestinations = [...destinations]; // Kopie der Original-Daten
    let displayedDestinations = 0;
    const destinationsPerPage = 12;
    
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
    
    // Back button click
    backButton.addEventListener('click', function() {
        detailView.style.display = 'none';
        mainView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            card.setAttribute('data-id', destination.id);
            
            const featuresHTML = destination.features.map(feature => 
                `<span class="feature">${feature}</span>`
            ).join('');
            
            card.innerHTML = `
                <div class="destination-img-container">
                    <img src="${destination.image}" alt="${destination.name}" class="destination-img" onerror="this.src='images/placeholder.jpg'">
                    <div class="destination-region">${destination.region}</div>
                </div>
                <div class="destination-details">
                    <h3>${destination.name}</h3>
                    <p>${destination.description}</p>
                    <div class="features">
                        ${featuresHTML}
                    </div>
                </div>
            `;
            
            // Add click event to show detail view
            card.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                showDestinationDetail(id);
            });
            
            destinationsGrid.appendChild(card);
        });
    }
    
    // Function to show destination detail
    function showDestinationDetail(id) {
        const destination = destinations.find(dest => dest.id === id);
        
        if (!destination) return;
        
        // Build the detail HTML
        const highlightsHTML = destination.highlights.map(highlight => 
            `<div class="detail-highlight">${highlight}</div>`
        ).join('');
        
        const featuresHTML = destination.features.map(feature => 
            `<div class="detail-feature">${feature}</div>`
        ).join('');
        
        // Format seasons for display
        const seasonsMap = {
            spring: 'Frühling',
            summer: 'Sommer',
            autumn: 'Herbst',
            winter: 'Winter'
        };
        
        const seasons = destination.bestSeason.map(season => seasonsMap[season]).join(', ');
        
        // Format budget for display
        const budgetMap = {
            budget: 'Günstig',
            moderate: 'Mittel',
            luxury: 'Luxus'
        };
        
        const budget = destination.budget.map(b => budgetMap[b]).join(', ');
        
        // Format type for display
        const typeMap = {
            city: 'Stadt',
            beach: 'Strand',
            nature: 'Natur',
            mountains: 'Berge'
        };
        
        const types = destination.type.map(t => typeMap[t]).join(', ');
        
        // Format duration for display
        const durationMap = {
            weekend: 'Wochenende (1-3 Tage)',
            week: 'Eine Woche',
            twoweeks: 'Zwei Wochen oder länger'
        };
        
        const duration = destination.duration.map(d => durationMap[d]).join(', ');
        
        destinationDetail.innerHTML = `
            <div class="detail-header">
                <div class="detail-img-container">
                    <img src="${destination.image}" alt="${destination.name}" class="detail-img" onerror="this.src='images/placeholder.jpg'">
                </div>
                
                <div class="detail-title-container">
                    <div class="detail-title">
                        <h2>${destination.name}</h2>
                        <p>${destination.description}</p>
                    </div>
                </div>
                
                <div class="detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Region</div>
                        <div class="meta-value">${destination.region}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Beste Reisezeit</div>
                        <div class="meta-value">${seasons}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Budget</div>
                        <div class="meta-value">${budget}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Art</div>
                        <div class="meta-value">${types}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Empfohlene Dauer</div>
                        <div class="meta-value">${duration}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-content">
                <!-- Highlights Section -->
                <div class="content-section">
                    <h3>Highlights</h3>
                    <div class="detail-highlights">
                        ${highlightsHTML}
                    </div>
                </div>
                
                <!-- Features Section -->
                <div class="content-section">
                    <h3>Besonderheiten</h3>
                    <div class="detail-features">
                        ${featuresHTML}
                    </div>
                </div>
                
                <!-- History Section -->
                <div class="content-section">
                    <h3>Geschichte</h3>
                    <p>${destination.details?.history || 'Keine Informationen verfügbar.'}</p>
                </div>
                
                <!-- Attractions Section -->
                <div class="content-section">
                    <h3>Sehenswürdigkeiten</h3>
                    <p>${destination.details?.attractions || 'Keine Informationen verfügbar.'}</p>
                </div>
                
                <!-- Food Section -->
                <div class="content-section">
                    <h3>Kulinarisches</h3>
                    <p>${destination.details?.food || 'Keine Informationen verfügbar.'}</p>
                </div>
                
                <!-- Transport Section -->
                <div class="content-section">
                    <h3>Transport</h3>
                    <p>${destination.details?.transport || 'Keine Informationen verfügbar.'}</p>
                </div>
                
                <!-- Best Time to Visit Section -->
                <div class="content-section">
                    <h3>Beste Reisezeit</h3>
                    <p>${destination.details?.bestTimeToVisit || 'Keine Informationen verfügbar.'}</p>
                </div>
            </div>
        `;
        
        // Show detail view and hide main view
        mainView.style.display = 'none';
        detailView.style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
});