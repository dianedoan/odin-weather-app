import "./styles.css";

// test variables
const unit = 'metric'; // toggle temp in Fahrenheit or Celsius later

// takes a location and returns the weather data for that location using an API
async function getWeather(searchLocation) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchLocation}?unitGroup=${unit}&key=QTUFMCGUGM8BXJ6A3KDDSUWYJ`)

    // check for response errors
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    // get data 
    const weatherData = await response.json();
    console.log(weatherData);

    // use only required data for app
    const processedData = processRequiredData(weatherData);
    console.log(processedData);

    // display weather info
    displayWeatherInfo(processedData);

  } catch (error) {
    console.error(error);
  }
};

// processes JSON data from the API and returns an object with only required data for the app
function processRequiredData(data) {
  return {
    location: data.resolvedAddress,
    timezone: data.timezone,
    currentTime: data.currentConditions.datetime,
    currentTemp: data.currentConditions.temp,
    description: data.description,
    icon: data.currentConditions.icon,
    nextDays: [
      {date: data.days[0].datetime, temp: data.days[0].temp, description: data.days[0].description, icon: data.days[0].icon},
      {date: data.days[1].datetime, temp: data.days[1].temp, description: data.days[1].description, icon: data.days[1].icon},
      {date: data.days[2].datetime, temp: data.days[2].temp, description: data.days[2].description, icon: data.days[2].icon},
      {date: data.days[3].datetime, temp: data.days[3].temp, description: data.days[3].description, icon: data.days[3].icon},
      {date: data.days[4].datetime, temp: data.days[4].temp, description: data.days[4].description, icon: data.days[4].icon},
      {date: data.days[5].datetime, temp: data.days[5].temp, description: data.days[5].description, icon: data.days[5].icon},
      {date: data.days[6].datetime, temp: data.days[6].temp, description: data.days[6].description, icon: data.days[6].icon},
    ]
  };
};

// display weather info
async function displayWeatherInfo(processedData) {
  const container = document.querySelector(".container");
  const weatherContainer = document.querySelector(".weather-container");

  const currentWeatherContainer = document.createElement("div");
  currentWeatherContainer.classList = "current-weather-container";

  // clear any existing displayed weather info
  weatherContainer.innerHTML = "";

  // append containers
  weatherContainer.appendChild(currentWeatherContainer);
  container.appendChild(weatherContainer);

  // location
  const locationHeader = document.createElement("h1");
  locationHeader.textContent = processedData.location;
  currentWeatherContainer.appendChild(locationHeader);

  // current temperature
  const tempHeader = document.createElement("h2");
  tempHeader.textContent = `${processedData.currentTemp} °C`;
  currentWeatherContainer.appendChild(tempHeader);

  // icon
  const weatherIcon = await loadWeatherIcon(processedData.icon);
  currentWeatherContainer.appendChild(weatherIcon);

  // time
  const timeHeader = document.createElement("h3");
  timeHeader.textContent = `${processedData.currentTime} ${processedData.timezone}`;
  currentWeatherContainer.appendChild(timeHeader);

  // description
  const descriptionHeader = document.createElement("h3");
  descriptionHeader.textContent = processedData.description;
  currentWeatherContainer.appendChild(descriptionHeader);

};

export async function loadWeatherIcon(weatherIcon) {
  const module = await import(`./weather-icons/${weatherIcon}.svg`);

  const img = document.createElement("img");
  img.src = module.default;
  img.classList = "weather-icon";

  return img;
};

// location search bar
const searchLocationForm = document.querySelector("#search-location-form");
const searchLocation = document.querySelector("#search-location");

searchLocationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(searchLocation.value);
});

