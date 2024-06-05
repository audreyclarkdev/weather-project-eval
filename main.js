const cityInput = document.querySelector('#city-input');
const currentWeatherContainer = document.querySelector('.current-weather');
const forecastContainer = document.querySelector('.forecast');

// click event listener for city input and the search button
document.querySelector('.search').addEventListener('click', function(event) {
  event.preventDefault();

  const city = cityInput.value;
  if (city !== '') {
    getWeather(city);

    cityInput.value = '';

  } else {
    alert(('Please enter a city.'));
  };
});

/**
 * Fetches data from the specified URL using the GET method and returns the response as JSON.
 * If the response is not OK, throws an error with a message from the response or a default message.
 * If an error occurs during the fetch, displays an error message and returns an empty object.
 *
 * @param {string} url - The URL to fetch data from.
 * @return {Promise<Object>} A promise that resolves to the JSON response data.
 * @throws {Error} If the response is not OK.
 */
async function fetchApiData(url){
  try {
    const response = await fetch(url, { method: 'GET', dataType: 'json' });
    const data = await response.json();

    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.message || 'Error fetching data');
    }
  }
  catch(error) { 
      alert('Not a valid city. Please try again.');
      console.error('Error fetching weather data:', error);
      return {};  
  }
};

/**
 * Fetches weather data for a given city using the OpenWeatherMap API.
 *
 * @param {string} city - The name of the city to fetch weather data for.
 * @return {Promise<void>} A promise that resolves when the weather data has been fetched and displayed.
 * Rejects with an error if there was an issue fetching the data.
 */
async function getWeather(city) { 
  const apiKey = '3a16b1625fdf1f83be7f01c3a15bd5f0';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const weatherData = await fetchApiData(apiUrl);

    // Get coordinates for the forecast API
    const { lon, lat } = weatherData.coord;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const forecastData = await fetchApiData(forecastUrl);

    displayCurrentWeather(weatherData);
    displayForecast(processForecastData(forecastData.list));
  }
  catch(error) {
    console.error('Error fetching weather data:', error);
  }
};

/**
 * Displays the current weather information on the page.
 *
 * @param {Object} data - The weather data object containing the current weather information.
 * @return {void} This function does not return anything.
 */
function displayCurrentWeather(data) {
  currentWeatherContainer.replaceChildren();
  forecastContainer.replaceChildren();

   // Destructure the necessary data
  const { name: city, main: {temp}, weather: [{description, icon}] } = data;

  // Create a template string for the current weather
  const currentWeatherTemplate = `
    <div class="col-3 mt-3">
      <p class="fs-3 fw-bold">${city}</p>
      <p class="fs-3 fw-bold">${Math.round(temp)}&deg;F</p>
      <p class="fs-4 fst-italic text-capitalize">${description}</p>
    </div>
    <div class="col-3">
      <img
        src="https://openweathermap.org/img/wn/${icon}@2x.png"
        alt="weather icon"
      />
    </div>
    ` 
    // Insert the template into the DOM
    currentWeatherContainer.insertAdjacentHTML('beforeend', currentWeatherTemplate);
};

/**
 * Processes the forecast data to calculate the average temperature and other information for each day.
 *
 * @param {Array} data - An array of objects containing the forecast data.
 * @return {Array} An array of objects containing the processed forecast data for the next 5 days.
 */
function processForecastData(data) {
  const dailyData = {};

  data.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const temp = item.main.temp;
    const icon = item.weather[0].icon;
    const description = item.weather[0].description;

    if (!dailyData[day]) {
      dailyData[day] = {
        temps: [],
        icons: [],
        descriptions: []
      };
    }

    dailyData[day].temps.push(temp);
    dailyData[day].icons.push(icon);
    dailyData[day].descriptions.push(description);
  });

  const result = [];
  for (const day in dailyData) {
    const temps = dailyData[day].temps;
    const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length;
    const icon = dailyData[day].icons[0];
    const description = dailyData[day].descriptions[0];

    result.push({
      day,
      avgTemp: avgTemp.toFixed(1),
      icon,
      description
    });
  }

  return result.slice(0, 5); // Return only the next 5 days
};


/**
 * Displays the forecast information for the next 5 days.
 * @param {Object} data - The forecast data containing the list of forecast items.
 * @return {void} This function does not return anything.
 */
function displayForecast(data) {
  data.forEach(dayData => {
    const forecastTemplate = `
      <div class="d-grid col mt-5 mb-5 bg-transparent border border-secondary shadow-sm">
        <p class="fs-5 fw-bold">${dayData.day}</p>
        <img src="https://openweathermap.org/img/wn/${dayData.icon}@2x.png" alt="weather icon" />
        <p class="fs-5 fw-bold">${Math.round(dayData.avgTemp)}&deg;F</p>
        <p class="fs-5 fst-italic text-capitalize">${dayData.description}</p>
      </div> 
    `;
    forecastContainer.insertAdjacentHTML('beforeend', forecastTemplate);
  })
};