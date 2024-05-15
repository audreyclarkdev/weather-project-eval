const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector(".search");
const card = document.querySelector(".card");
const apiKey = "3a16b1625fdf1f83be7f01c3a15bd5f0";
const units = '&units=imperial';

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  getWeather(cityInput.value);
});

async function getWeatherData(city) { 
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if(!response.ok){
    throw new Error("Could not fetch weather data");
  } 
    return await response.json();
};


// Determines the weather icon based on the weather ID from the API
function getWeatherIcon(weatherId) {

  switch(true){
    case (weatherId >= 200 && weatherId <= 300): 
      return "https://openweathermap.org/img/wn/11d@2x.png";
    case (weatherId >= 300 && weatherId <= 400): 
      return "https://openweathermap.org/img/wn/10d@2x.png";
    case (weatherId >= 500 && weatherId <= 600): 
      return "https://openweathermap.org/img/wn/09d@2x.png";
    case (weatherId >= 600 && weatherId <= 700): 
      return "https://openweathermap.org/img/wn/13d@2x.png";
    case (weatherId >= 700 && weatherId <= 780): 
      return "https://openweathermap.org/img/wn/50d@2x.png";
    case (weatherId === 800): 
      return "https://openweathermap.org/img/wn/01d@2x.png";
    case (weatherId >= 801 && weatherId <= 810): 
      return "https://openweathermap.org/img/wn/03d@2x.png";
    default: 
      return "❓";
    }
};


function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
};