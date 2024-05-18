const currentWeather = document.querySelector(".current-weather");
const currentWeatherIcon = document.querySelector(".current-weather-icon");
const forecast = document.querySelector(".week-forecast");
const city = document.querySelector("#city-input");
const searchBtn = document.querySelector(".search");
const card = document.querySelector(".card");



document.getElementById('weather-form').addEventListener('submit', function(event) {
  event.preventDefault();
  getWeather(city.value);
});

function getWeather(city) { 
  const apiKey = "3a16b1625fdf1f83be7f01c3a15bd5f0";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        document.querySelector('.weather-city').textContent = `Weather in ${data.name}`;
        document.querySelector('.weather-description').textContent = `${data.weather[0].description}`;
        document.querySelector('.weather-temperature').textContent = `${Math.round(data.main.temp)}°F`;
        currentWeatherIcon.setAttribute('src', getWeatherIcon(data.weather[0].id));
        currentWeatherIcon.setAttribute('alt', `${data.weather[0].description}`);
        displayWeather(data);
      } else {
        alert('City not found. Please enter a valid city name.');
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
};


// Determines the weather icon based on the weather ID from the API
function getWeatherIcon(weatherId) {

  switch(true){
    case (weatherId >= 200 && weatherId <= 300): 
      return "https://openweathermap.org/img/wn/11n@2x.png";
    case (weatherId >= 300 && weatherId <= 400): 
      return "https://openweathermap.org/img/wn/10n@2x.png";
    case (weatherId >= 500 && weatherId <= 600): 
      return "https://openweathermap.org/img/wn/09n@2x.png";
    case (weatherId >= 600 && weatherId <= 700): 
      return "https://openweathermap.org/img/wn/13n@2x.png";
    case (weatherId >= 700 && weatherId <= 780): 
      return "https://openweathermap.org/img/wn/50n@2x.png";
    case (weatherId === 800): 
      return "https://openweathermap.org/img/wn/01n@2x.png";
    case (weatherId >= 801 && weatherId <= 810): 
      return "https://openweathermap.org/img/wn/03n@2x.png";
    default: 
      return "❓";
  }
};

// Error messaging
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
};