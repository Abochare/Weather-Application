document.getElementById('cityForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the usual way

    // Get the city from the input
    const city = document.getElementById('cityInput').value;

    // Your OpenWeatherMap API key
    const apiKey = 'adfda5c9e053fc6dc1e1506aaaddc609';

    // URL to fetch weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // Fetch weather data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display temperature and humidity
            const temperature = Math.round(data.main.temp);
            const minTemp = Math.round(data.main.temp_min);
            const maxTemp = Math.round(data.main.temp_max);
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const description = data.weather[0].description;

            // Update weather image based on description
            updateWeatherImage(description);

            document.getElementById('temperature').textContent = `${temperature} °C`;
            document.getElementById('humidity').textContent = `${humidity}%`;
            document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
            document.getElementById('description').textContent = description;
            document.getElementById('minMaxTemp').textContent = `Min: ${minTemp} °C | Max: ${maxTemp} °C`;

            // Save coordinates to use later when the map is shown
            const coordinates = [data.coord.lat, data.coord.lon];
            document.getElementById('map').dataset.coordinates = JSON.stringify(coordinates);

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        });
});

document.getElementById('toggleMapButton').addEventListener('click', function() {
    const mapElement = document.getElementById('map');
    if (mapElement.style.display === 'none' || mapElement.style.display === '') {
        mapElement.style.display = 'block';
        
        // Hide the toggle button after displaying the map
        this.style.display = 'none';

        // Initialize the map only if it hasn't been initialized yet
        if (!mapElement.dataset.initialized) {
            const coordinates = JSON.parse(mapElement.dataset.coordinates);
            var map = L.map('map', { 
                center: coordinates, 
                zoom: 9, 
                attributionControl: false,
                zoomControl: false 
            });

            // Add a tile layer (e.g., OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 13,
            }).addTo(map);

            // Add a marker at the city location
            L.marker(coordinates).addTo(map)
                .bindPopup(`Weather: ${document.getElementById('description').textContent}, ${document.getElementById('temperature').textContent}`)
                .openPopup();

            // Mark the map as initialized
            mapElement.dataset.initialized = 'true';
        }
    } else {
        mapElement.style.display = 'none';
    }
});

function updateWeatherImage(description) {
    if (description === "snow" || description === "light snow") {
        document.getElementById("image").src = './4.png';
    } else if (description === "rain") {
        document.getElementById("image").src = './2.png';
    } else if (description === "clear sky") {
        document.getElementById("image").src = './3.png';
    } else if (description === "haze") {
        document.getElementById("image").src = './5.png';
    } else if (description === "cloudy" || description === "few clouds" || description === "more clouds" || description === "overcast clouds" || description === "scattered clouds") {
        document.getElementById("image").src = './6.png';
    } else {
        document.getElementById("image").src = "./1.png";
    }
}
