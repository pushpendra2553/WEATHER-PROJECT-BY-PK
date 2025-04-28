// code for api key 
const apiKey = '3cf4c21a9891d81b31204193962371d1'; 

// code for search button, city name , weather icon, wind , humidity, current date and other things.
const searchButton = document.getElementById('searchButton');

const cityInput = document.getElementById('cityInput');

const currentWeather = document.getElementById('currentWeather');

const extendedForecast = document.getElementById('extendedForecast');

const errorMessage = document.getElementById('errorMessage');

const cityName = document.getElementById('cityName');

const weatherIcon = document.getElementById('weatherIcon');

const temperature = document.getElementById('temperature');

const wind = document.getElementById('wind');

const humidity = document.getElementById('humidity');

const forecastContainer = document.getElementById('forecastContainer');

const dateElement = document.getElementById('date'); 

// CODE for Search button event listener
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  } else {
    showError('PLEASE FILL YOUR CITY');
  }
});

// Code for Current date for Search city
function getCurrentDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString(undefined, options);
}

//Code for fetch api for weather data.....
function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        showError('City not found. Please search with original name of city');
      } else {
        displayCurrentWeather(data);
        getExtendedForecast(data.coord.lat, data.coord.lon);
      }
    })
    .catch(() => {
      showError('There was a problem fetching the weather data.');
    });
}

// Code for display current weather
function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  weatherIcon.innerHTML = getWeatherIcon(data.weather[0].icon);
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  wind.textContent = `Wind: ${data.wind.speed} m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  
  // Code for Display today's date
  dateElement.textContent = getCurrentDate();

  currentWeather.classList.remove('hidden');
  errorMessage.classList.add('hidden');
}

// Code for weather icons ( based on Weather Map Api )
function getWeatherIcon(iconCode) {
  return `<img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">`;
}

// Code to get extended forecast of cities.
function getExtendedForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayExtendedForecast(data.list);
    })
    .catch(() => {
      showError('Could not retrieve the extended forecast.');
    });
}

// code for display extended forecast
function displayExtendedForecast(forecast) {
  extendedForecast.classList.remove('hidden');
  forecastContainer.innerHTML = '';

  forecast.forEach((item, index) => {
    if (index % 8 === 0) { // Every 8th item is a forecast for the next day
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-lg', 'text-center');

      const date = new Date(item.dt * 1000).toLocaleDateString();
      const icon = getWeatherIcon(item.weather[0].icon);
      const temp = `${item.main.temp}°C`;
      const windSpeed = `Wind: ${item.wind.speed} m/s`;
      const humidityPercent = `Humidity: ${item.main.humidity}%`;

      forecastElement.innerHTML = `
        <p class="font-bold">${date}</p>
        <div>${icon}</div>
        <p>${temp}</p>
        <p>${windSpeed}</p>
        <p>${humidityPercent}</p>
      `;

      forecastContainer.appendChild(forecastElement);
    }
  });
}


function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  currentWeather.classList.add('hidden');
  extendedForecast.classList.add('hidden');
}
