const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

search.addEventListener('click', () => {
    const APIKey = 'afb428778878b02f5e428ebfa2bca6d9';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
        if (json.weather && json.weather[0]) {
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const timeElement = document.querySelector('.time-box .time');
            const dateElement = document.querySelector('.date-box .date');

            const temp = json.main.temp.toFixed(0);
            const weatherMain = json.weather[0].main;
            const sunrise = json.sys.sunrise * 1000; // Convert to milliseconds
            const sunset = json.sys.sunset * 1000;   // Convert to milliseconds
            const currentTime = new Date().getTime(); // Current time in milliseconds

            // Update weather info
            temperature.textContent = `${temp}°C`;
            description.textContent = json.weather[0].description;
            humidity.textContent = `${json.main.humidity}%`;
            wind.textContent = `${json.wind.speed} km/h`;

            // Determine if it's day or night
            const isDay = currentTime >= sunrise && currentTime <= sunset;

            const imageMap = {
                'Clear': isDay ? 'images/sunny.jpg' : 'images/night.webp',
                'Rain': isDay ? 'images/shower.jpg' : 'images/rain-night.jfif',
                'Snow': isDay ? 'images/snow.jpg' : 'images/snow-night.jfif',
                'Clouds': isDay ? 'images/cloudy.jpg' : 'images/cloudy-night.jfif',
                'Mist': isDay ? 'images/mist.jfif' : 'images/mist-night.jfif',
                'Haze': isDay ? 'images/haze.jpg' : 'images/haze-night.jfif',
                'Fog': isDay ? 'images/fog.jpg' : 'images/fog-night.jfif',
                'Default': isDay ? 'images/cloudy.jpg' : 'images/cloudy-night.jfif'
            };

            image.src = imageMap[weatherMain] || imageMap['Default'];

            // Calculate and update local time for the city
            const timezoneOffset = json.timezone; // Offset in seconds from UTC
            const localTime = new Date((new Date()).getTime() + (timezoneOffset * 1000)); // Get local time

// Get hours, minutes and format them to AM/PM
            let hours = localTime.getUTCHours();
            const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // If the hour is 0, set it to 12 (for midnight/midday)
            const formattedLocalTime = `${hours}:${minutes} ${ampm}`;
             timeElement.textContent = `Local Time: ${formattedLocalTime}`;

              // Get the full date
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            const formattedDate = localTime.toLocaleDateString(undefined, options);
            dateElement.textContent = `Date: ${formattedDate}`;

        } else {
            console.error('Weather data not available');
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
});
