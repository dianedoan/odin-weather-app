import "./styles.css";

// test variables
const city = 'seoul';
const unit = 'metric';

async function getWeather() {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=QTUFMCGUGM8BXJ6A3KDDSUWYJ`)
    
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const weatherData = await response.json();
    console.log(weatherData);
    console.log(`The current temperature in ${city.charAt(0).toUpperCase() + city.slice(1)} is ${weatherData.currentConditions.temp} °C.`);
  } catch (error) {
    console.error(error);
  }
};
getWeather();