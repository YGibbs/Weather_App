import axios from "axios";

// Get the current date and time
function getCurrentDateTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  let nowDate = document.querySelector("#now-Date");

  nowDate.innerHTML = `${day}  ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

// Get weather data from the API
const getWeatherData = (cityName) => {
  let apiKey = "5d15497581644d7a8364721eb3e8fb16";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(weatherChar);
};
const getGeoData = (latitude, longitude) => {
  let apiKey = "5d15497581644d7a8364721eb3e8fb16";
  let apiUrlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrlGeo)
    .then(weatherChar)
    .catch((error) => {
      console.error("API request error:", error);
    });
};

// Update the weather characteristics on the page
const weatherChar = (response) => {
  console.log(response.data);
  let cityName = document.querySelector("#search-City");
  cityName.innerHTML = response.data.name;

  updateTemperature(response.data.main.temp);
  updateDescription(response.data.weather[0].description);
  updateHumidity(response.data.main.humidity);
  updateWind(response.data.wind.speed);
  updatePrecipitation(response.data.rain);
};

// Update functions for individual weather characteristics
let currentTempCelsius;
const updateTemperature = (temp) => {
  let temperature = document.querySelector(".temperature");
  currentTempCelsius = Math.round(temp);
  temperature.innerHTML = currentTempCelsius;
};

const updateDescription = (description) => {
  let descriptionElement = document.querySelector(".description");
  descriptionElement.innerHTML = description;
};

const updateHumidity = (humidity) => {
  let humidityElement = document.querySelector(".humidity");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
};

const updateWind = (windSpeed) => {
  let windElement = document.querySelector(".wind");
  windElement.innerHTML = `Wind: ${windSpeed} km/h`;
};

const updatePrecipitation = (rainData) => {
  let precipitationElement = document.querySelector(".precipitation");
  let updatedPrecipitation = rainData && rainData["1h"] ? rainData["1h"] : 0;
  precipitationElement.innerHTML = `Precipitation: ${updatedPrecipitation} mm`;
};

const handlePosition = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getGeoData(latitude, longitude);
};

const getCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition(handlePosition);
};

// Search city event handler
const manualSearch = (event) => {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  getWeatherData(searchInput.value);
};

const geoSearch = (event) => {
  event.preventDefault();
  getCurrentPosition();
};

getCurrentDateTime();

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", manualSearch);

const geoButton = document.querySelector(".geolocation-button-bg");
geoButton.addEventListener("click", geoSearch);

const celsius = document.querySelector("#celsius-temp");
const fahrenheit = document.querySelector("#fahrenheit-temp");

const convertTemperature = (event, unit) => {
  event.preventDefault();
  let updatedTemperature = 0;
  let temperature = document.querySelector(".temperature");

  if (unit === "F") {
    updatedTemperature = (currentTempCelsius * 9) / 5 + 32;
  } else if (unit === "C") {
    updatedTemperature = currentTempCelsius;
  }
  temperature.innerHTML = updatedTemperature.toFixed(0);
};
celsius.addEventListener("click", (event) => convertTemperature(event, "C"));
fahrenheit.addEventListener("click", (event) => convertTemperature(event, "F"));
