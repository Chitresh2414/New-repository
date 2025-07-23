const BASE_API_COORD = `https://api.openweathermap.org/data/2.5/forecast?lat=`;
const BASE_API_CITY = `https://api.openweathermap.org/data/2.5/forecast?q=`;
const key = `d261046d471160d13caa575a5ffce137`;

const proxy = `https://cors-anywhere.herokuapp.com/`;
const btn = document.getElementById("get-location");
const show = document.getElementById("forecast");
const locText = document.getElementById("location-text");
const input = document.querySelector("input");
const search = document.getElementById("search");
const toggleTemp = document.getElementById("toggle-temp");

let isCelsius = true;

// 🔧 Fetch weather data by city or coordinates
async function fetchWeatherData({ lat, lon, city, unit = "metric" }) {
  const url = city
    ? `${BASE_API_CITY}${city}&units=${unit}&appid=${key}`
    : `${BASE_API_COORD}${lat}&lon=${lon}&units=${unit}&appid=${key}`;

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(city ? "cityity not found" : "Forecast data not found");
  const data = await res.json();
  return data;
}

// 💡 Display weather info
function displayWeather(data, unitSymbol) {
  show.innerHTML = "";
  const dailyData = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(item);
  });

  for (const date in dailyData) {
    const dayData = dailyData[date][0];
    const icon = dayData.weather[0].icon;
    const temp = Math.round(dayData.main.temp);
    const hum = dayData.main.humidity;
    const con = dayData.weather[0].description;

    show.innerHTML += `
      <div class="day">
        <h4>${date}</h4>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon"/>
        <h6>Weather in ${data.city.name}</h6>
        <p>Temperature: ${temp}${unitSymbol}</p>
        <p>Humidity: ${hum}%</p>
        <pre>Condition: ${con}</pre>
      </div>
    `;
  }

  locText.innerHTML = `${data.city.name}`;
}

//location event
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!navigator.geolocation) {
    locText.innerHTML = "Geolocation not supported";
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const unit = isCelsius ? "metric" : "imperial";
      const unitSymbol = isCelsius ? "°C" : "°F";

      const data = await fetchWeatherData({ lat, lon, unit });
      displayWeather(data, unitSymbol);
    } catch (err) {
      locText.innerHTML = "Error fetching location weather";
      console.error(err);
    }
  });
});

// search event
search.addEventListener("click", async (e) => {
  e.preventDefault();
  let city = input.value.trim();
  if (!city) return alert("Please enter a city name");
  try {
    const unit = isCelsius ? "metric" : "imperial";
    const unitSymbol = isCelsius ? "°C" : "°F";
    const data = await fetchWeatherData({ city, unit });
    displayWeather(data, unitSymbol);
    input.value = "";
  } catch (err) {
    alert("City not found");
    console.error(err);
  }
});

//toggle funcation event
toggleTemp.addEventListener("click", async () => {
  isCelsius = !isCelsius;
  toggleTemp.textContent = isCelsius ? "Switch to °F" : "Switch to °C";

  const currentCity = locText.textContent;
  if (currentCity && currentCity !== "Current Location: Not detected") {
    try {
      const unit = isCelsius ? "metric" : "imperial";
      const unitSymbol = isCelsius ? "°C" : "°F";
      const data = await fetchWeatherData({ city: currentCity, unit });
      displayWeather(data, unitSymbol);
    } catch (err) {
      console.error("Toggle fetch error:", err);
    }
  }

  /* Refresh forecast using last search
  if (locText.innerHTML !== "") {
    const city = locText.innerHTML;
    weatherIn(city); // re-fetch in selected unit
  }*/
});

// user keybord enter click event
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    search.click();
  }
});

/*
const dayWeatherloc = async (lat, lon) => {
  try {
    show.innerHTML = "";
    const unit = isCelsius ? "metric" : "imperial";
    const res = await fetch(`${api}${lat}&lon=${lon}&appid=${key}`);
    if (!res.ok) throw new Error("Forecast data not found");
    const data = await res.json();
    //console.log(data); // show api data
    //console.log(data.list[0].dt_txt.split(" ")[0]); // api dates

    const dailyData = {};

    let date;
    data.list.forEach((item) => {
      date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(item);
    });
    // console.log(dailyData); // show all data

    for (const key in dailyData) {
      const dayData = dailyData[key][0];
      const icons = dayData.weather[0].icon;
      const temp = Math.round(dayData.main.temp);
      const unitSymbol = isCelsius ? "°C" : "°F";
      const hum = dayData.main.humidity;
      const con = dayData.weather[0].description;

      show.innerHTML += ` <div class="day">
             <h4>${key}</h4>
             <img src="http://openweathermap.org/img/wn/${icons}.png" alt="Weather Icon"/>
             <h6>Weather in ${data.city.name}</h6>
             <p>Temperature:${temp}${unitSymbol}</p>
             <p>Humidity: ${hum}%</p>
             <pre>Condition:${con}</pre>



                </div>`;

      locText.innerHTML = `${data.city.name}`;
    }
  } catch (err) {
    console.error("Error fetching weather data by coordinates:", err);
  }
};*/

/*
const weatherIn = async (value) => {
  try {
    show.innerHTML = "";
    const unit = isCelsius ? "metric" : "imperial";
    const response = await fetch(`${seondApi}${value}&appid=${key}`);
    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();
    console.log(data);

    const dailyData = {};
    let date;
    data.list.forEach((item) => {
      date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });
    console.log(dailyData);

    for (const key in dailyData) {
      const dayData = dailyData[key][0];
      const icons = dayData.weather[0].icon;
      const temp = Math.round(dayData.main.temp);
      const unitSymbol = isCelsius ? "°C" : "°F";
      const hum = dayData.main.humidity;
      const con = dayData.weather[0].description;

      show.innerHTML += ` <div class="day">
             <h4>${key}</h4>
             <img src="http://openweathermap.org/img/wn/${icons}.png" alt="Weather Icon"/>
             <h6>Weather in ${data.city.name}</h6>
             <p>Temperature: ${temp}${unitSymbol}</p>
             <p>Humidity: ${hum}%</p>
             <pre>Condition:${con}</pre>
             </div>`;
    }
  } catch (err) {
    alert("please re-enter the city name");
    console.error("Error fetching weather data:", err);
  }
};*/
