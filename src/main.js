import "./style.css";


window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (res) => {
      let lat = res.coords.latitude;
      let long = res.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=90052a13875944c86e5ef892bbc0d454`;
      const options = {
        method: "GET",
        units: 'metric'
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);        
        updateUI(result);
      } catch (error) {
        console.error(error);
      }
    });
  }
});

function updateUI(weatherData) {
  document.querySelector(
    ".title-block h2"
  ).innerText = `${weatherData.name}, ${weatherData.sys.country}`;
  const date = new Date();
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let weekday = weekdays[date.getDay()];
  let day = date.getDate();
  let month = months[date.getMonth()];

  // This arrangement can be altered based on how we want the date's format to appear.
  document.querySelector(
    ".title-block p"
  ).innerText = `${weekday} | ${month} ${day}`;

  // console.log(weatherData.weather[0].icon);

  document.querySelector(
    ".curr-weather-icon img"
  ).src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  // modifying main heading weather (Kelvin to Celsius)
  document.querySelector("#current-temp").innerText = weatherData.main.temp;
  // getting a description of conditions
  document.querySelector(
    "#current-description"
  ).innerText = `${weatherData.weather[0].description}`;

  // modifying weather (Kelvin to Celsius)
  document.querySelector("[data-thigh] :first-child span").innerText =
    weatherData.main.temp_max;
  document.querySelector("[data-tlow] :first-child span").innerText =
    weatherData.main.temp_min;
  // wind is in meters per second
  document.querySelector(
    "[data-wind] :first-child"
  ).innerText = `${weatherData.wind.speed} m/s`;

  /* FROM API:
    sys
      sys.sunrise -> Sunrise time, unix, UTC
      sys.sunset -> Sunset time, unix, UTC
    timezone -> Shift in seconds from UTC 
  */
  // apparently the values are in seconds - UNIX tags usually in seconds
  // - could be wrong...
  // - regardless, multiply by 1000 to make it milliseconds
  // modifying sunrise and sunset times
  const msSunrise = weatherData.sys.sunrise * 1000;
  const msSunset = weatherData.sys.sunset * 1000;
  const dateSunrise = new Date(msSunrise);
  const dateSunset = new Date(msSunset);

  document.querySelector(
    "[data-sunrise] :first-child"
  ).innerText = `${dateSunrise.getHours()}:${dateSunrise.getMinutes()}`;

  document.querySelector(
    "[data-sunset] :first-child"
  ).innerText = `${dateSunset.getHours()}:${dateSunset.getMinutes()}`;

  // couldn't pull a value regarding chances of rain from API
}

document
  .querySelector("#form-city-search")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const city = formData.get("cityname").toLowerCase().trim();

    const url = `https://open-weather13.p.rapidapi.com/city/${city}/EN`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_API_KEY,
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    };
    

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      updateUI(result);
    } catch (error) {
      console.error(error);
    }
  });
