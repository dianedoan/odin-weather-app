import "./styles.css";

// default temp unit
let tempUnit = "metric";

const tempUnitToggle = document.createElement("input");
tempUnitToggle.type = "checkbox";

tempUnitToggle.addEventListener("change", (e) => {
  e.preventDefault();

  if (tempUnitToggle.checked) {
    tempUnit = "us";
  } else {
    tempUnit = "metric";
  }
  getWeather(searchLocation.value, tempUnit);
});

// location search bar
const searchLocationForm = document.querySelector("#search-location-form");
const searchLocation = document.querySelector("#search-location");

searchLocationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(searchLocation.value, tempUnit);
});

// takes a location and returns the weather data for that location using an API
async function getWeather(searchLocation, tempUnit) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchLocation}?unitGroup=${tempUnit}&key=QTUFMCGUGM8BXJ6A3KDDSUWYJ`);

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
    displayWeatherInfo(processedData, tempUnit);

  } catch (error) {
    console.error(error);
    displayError();
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
    currentDateTimeEpoch: data.currentConditions.datetimeEpoch,
    sunriseEpoch: data.currentConditions.sunriseEpoch,
    sunsetEpoch: data.currentConditions.sunsetEpoch,
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

const container = document.querySelector(".container");
const weatherContainer = document.querySelector(".weather-container");

const currentWeatherContainer = document.createElement("div");
currentWeatherContainer.classList = "current-weather-container";

const weeklyWeatherContainer = document.createElement("div");
weeklyWeatherContainer.classList = "weekly-weather-container";

// default startup message
const message = "Use the search bar to look up the weather of a city!";
displayMessage(weatherContainer, message);

(async () => {
  const cloudyIcon = await getWeatherIcon("cloudy");
  defaultIcons.appendChild(cloudyIcon);
  const sunnyIcon = await getWeatherIcon("clear-day");
  defaultIcons.appendChild(sunnyIcon);
  const moonIcon = await getWeatherIcon("partly-cloudy-night");
  defaultIcons.appendChild(moonIcon);
})();

// display weather info
async function displayWeatherInfo(processedData, tempUnit) {
  // clear any existing displayed weather info
  weatherContainer.innerHTML = "";
  currentWeatherContainer.innerHTML = "";
  weeklyWeatherContainer.innerHTML = "";
  
  // append containers
  weatherContainer.appendChild(currentWeatherContainer);
  weatherContainer.appendChild(weeklyWeatherContainer);
  container.appendChild(weatherContainer);

  // set background color based on sunrise and sunset
  const currentDate = new Date(processedData.currentDateTimeEpoch * 1000);
  const sunriseDate = new Date(processedData.sunriseEpoch * 1000);
  const sunsetDate = new Date(processedData.sunsetEpoch * 1000);

  if (currentDate >= sunsetDate || currentDate < sunriseDate) {
    container.style.backgroundColor = "#466a92";
    weatherContainer.style.backgroundColor = "#466a92";
    weatherContainer.style.color = "#fff";
  } else {
    container.style.backgroundColor = "#e8f7ff";
    weatherContainer.style.backgroundColor = "#e8f7ff";
    weatherContainer.style.color = "#000";
  }

  // location
  const locationHeader = document.createElement("h1");
  const locationText = processedData.location.charAt(0).toUpperCase() + processedData.location.slice(1).toLowerCase();
  locationHeader.textContent = locationText;
  currentWeatherContainer.appendChild(locationHeader);

  // current temperature
  const tempContainer = document.createElement("div");
  tempContainer.classList = "temp-container";

  const tempHeader = document.createElement("h1");
  const unit = getTempUnit(processedData, tempUnit);
  tempHeader.textContent = `${processedData.currentTemp} ${unit}`;

  tempContainer.appendChild(tempHeader);

  // temp unit toggle
  const toggle = document.createElement("label");
  toggle.classList = "toggle";
  const toggleSlider = document.createElement("span");
  toggleSlider.classList = "slider";

  toggle.appendChild(tempUnitToggle);
  toggle.appendChild(toggleSlider);
  tempContainer.appendChild(toggle);

  currentWeatherContainer.appendChild(tempContainer);

  // icon
  const weatherIcon = await getWeatherIcon(processedData.icon);
  currentWeatherContainer.appendChild(weatherIcon);

  // description
  const descriptionHeader = document.createElement("h2");
  descriptionHeader.textContent = processedData.description;
  currentWeatherContainer.appendChild(descriptionHeader);

  // time
  const timeHeader = document.createElement("h3");
  timeHeader.textContent = `${processedData.currentTime} ${processedData.timezone}`;
  currentWeatherContainer.appendChild(timeHeader);

  // display weather info for next 7 days
  const upcomingDayWeather = processedData.nextDays;
  for (const day of upcomingDayWeather) {
    // create container
    const upcomingDayItem = document.createElement("div");
    upcomingDayItem.classList = "upcoming-weather-item";
    weeklyWeatherContainer.append(upcomingDayItem);

    // date
    const weekDateHeader = document.createElement('h3');
    weekDateHeader.textContent = day.date;
    upcomingDayItem.append(weekDateHeader);

    // temperature
    const weekTempHeader = document.createElement('h2');
    weekTempHeader.textContent = `${day.temp} ${unit}`;
    upcomingDayItem.append(weekTempHeader);

    // icon
    const weekWeatherIcon = await getWeatherIcon(day.icon);
    weekWeatherIcon.id = "week-weather-icon";
    upcomingDayItem.appendChild(weekWeatherIcon);

    // description
    const weekDescriptionHeader = document.createElement('h6');
    weekDescriptionHeader.textContent = day.description;
    upcomingDayItem.append(weekDescriptionHeader);
  };
};

function displayError() {
  // clear any existing displayed weather info
  weatherContainer.innerHTML = "";
  currentWeatherContainer.innerHTML = "";
  weeklyWeatherContainer.innerHTML = "";

  // default background and text color
  container.style.backgroundColor = "#fff";
  weatherContainer.style.backgroundColor = "#fff";
  weatherContainer.style.color = "#000";

  // display message
  const errorMessage = "Error finding city, please try again :(";
  displayMessage(weatherContainer, errorMessage);
};

function displayMessage(weatherContainer, message) {
  // message
  const noWeatherMessage = document.createElement("p");
  noWeatherMessage.classList = "no-weather-message";
  noWeatherMessage.textContent = message;
  weatherContainer.appendChild(noWeatherMessage);

  // display default startup weather icons
  const defaultIcons = document.createElement("div");
  weatherContainer.appendChild(defaultIcons);
  defaultIcons.classList = "default-icons";

  (async () => {
    const cloudyIcon = await getWeatherIcon("cloudy");
    defaultIcons.appendChild(cloudyIcon);
    const sunnyIcon = await getWeatherIcon("clear-day");
    defaultIcons.appendChild(sunnyIcon);
    const moonIcon = await getWeatherIcon("partly-cloudy-night");
    defaultIcons.appendChild(moonIcon);
  })();
};


function getTempUnit(processedData, tempUnit) {
  if (tempUnit === "metric") {
    return "°C";
  } else {
    return "°F";
  }
};

export async function getWeatherIcon(weatherIcon) {
  const module = await import(`./weather-icons/${weatherIcon}.svg`);

  const img = document.createElement("img");
  img.src = module.default;
  img.classList = "weather-icon";

  return img;
};
