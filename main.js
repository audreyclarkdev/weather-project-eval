
// click event listener for city input and the search button
document.querySelector('.search').addEventListener('click', function(event) {
  event.preventDefault();

  const cityInput = document.querySelector('#city-input');
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
    const response = 
    await fetch(url, 
      {
        method: 'GET', dataType: 'json'
      });
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

async function getWeather(city) { 
  const apiKey = '3a16b1625fdf1f83be7f01c3a15bd5f0';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const weatherData = await fetchApiData(apiUrl);

    // Get coordinates for the forecast API
    const { lon, lat } = weatherData.coord;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const forecastData = await fetchApiData(forecastUrl);
    
    console.log(weatherData);
    console.log(forecastData);

    displayCurrentWeather(weatherData);
    displayForecast(forecastData);
  }
  catch(error) {
    console.error('Error fetching weather data:', error);
  }
};

// Function to display current weather information
function displayCurrentWeather(data) {
  document.querySelector('.current-weather').replaceChildren();
  document.querySelector('.forecast').replaceChildren();

   // Destructure the necessary data
  const { name: city, main: {temp}, weather: [{description, icon}] } = data;

  // Create a template string for the current weather
  const template = `
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
    document.querySelector('.current-weather').insertAdjacentHTML('beforeend', template);
};


function displayForecast(data) {
  const forecastList = data.list;

  // Create a set to keep track of the dates we have added to the forecast
  const addedDates = new Set();

  // Filter the forecast list to get the first entry for each day
  const dailyForecasts = forecastList.filter(item => { 
    const date = new Date(item.dt_text);
    const dateString = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (!addedDates.has(dateString)) {
      addedDates.add(dateString);
      return true;
    }
    return false;
  }).slice(0,5); //take only the first 5 days

  // Iterate over the forecast data and create HTML for each day
  const forecastHtml = dailyForecasts.map(item => {
    const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
    const temp = item.main.temp;
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;

    return `
      <div class="d-grid col mt-3 mb-5 bg-light border">
        <p class="fs-5 fw-bold">${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />
        <p class="fs-5 fw-bold">${Math.round(temp)}&deg;F</p>
        <p class="fs-5 fst-italic text-capitalize">${description}</p>
      </div> 
    `;
  }).join('');

  // Insert the forecast HTML into the DOM
  document.querySelector('.forecast').innerHTML = forecastHtml;
};


/**
 * Converts a Unix timestamp to the local time zone and returns a formatted string.
 * @param {number} dt - The Unix timestamp to convert.
 * @return {string} The formatted date and time string in the format: YYYY-MM-DD hh:mm:ss AM/PM.
 */
function convertToLocalTime(dt) {
  const date = new Date(dt * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based so add 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const period = date.getHours() < 12 ? 'AM' : 'PM';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;
};
