const apiCityUrl = "https://geocode.maps.co/search?q=";
const apiKey = "f859181aacc9bfc8d84224bf2a6afef0";
const apiWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".city_search input");
const searchBtn = document.querySelector(".city_search button");
const citySelect = document.querySelector(".cityList");
const weatherIcon = document.querySelector(".weatehr_icon");
const temperatureFarengate = document.querySelector(".temperatureFarengate");
const temperatureCelcium = document.querySelector(".temperatureCelcium");
const errorText = document.querySelector(".error");
let cityArr = [];
let metricObj = {
  temper: 0,
  speed: 0,
  isMetric: false,
  currentWeatherData: {},
  speedSymble: "mph",
};

//get api list of city
async function getCities(cityName) {
  //clean all
  cityArr = [];
  document.querySelector(".wether_wrap").style.display = "none";
  citySelect.classList.add("hide");
  citySelect.innerHTML = "";

  try {
    const res = await fetch(apiCityUrl + cityName);
    if (res.status != 200) {
      throw new Error("Something went wrong");
    }
    cityArr = await res.json();

    if (cityArr.length < 1 || cityArr == undefined) {
      errorText.style.display = "block";
      errorText.textContent = "Invalide city name :/";
    } else {
      citySelect.classList.remove("hide");
      document.querySelector(".error").style.display = "none";

      //creating select list
      const options = cityArr.map((i) => {
        let cityOption = document.createElement("option");
        cityOption.textContent = i.display_name;
        cityOption.value = i.place_id;
        return cityOption;
      });
      const firstOption = document.createElement("option");
      firstOption.textContent = "choose your option";
      firstOption.value = "disabled";
      citySelect.append(firstOption, ...options);
      firstOption.disabled = true;
    }
  } catch (error) {
    errorText.style.display = "block";
    errorText.textContent = "No server connection :/ ";
    console.log(error.message);
  }
}

searchBtn.addEventListener("click", () => {
  getCities(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    getCities(searchBox.value);
  }
});

//get api list of weather
async function getWeather(value) {
  //new obj of choosen city
  let newCity = cityArr.find((i) => i.place_id == value);

  //get api

  try {
    const res = await fetch(
      apiWeatherUrl + `lat=${newCity.lat}&lon=${newCity.lon}&appid=${apiKey}`
    );
    if (res.status != 200) {
      throw new Error("Something went wrong");
    }
    metricObj.currentWeatherData = await res.json();
    document.querySelector(".wether_wrap").style.display = "block";

    changeMetricSystem();
    renderCurrentWeather();
  } catch (error) {
    errorText.style.display = "block";
    errorText.textContent = "No server connection :/ ";
    console.log(error);
  }
}

function renderCurrentWeather() {
  document.querySelector(".city").innerHTML = metricObj.currentWeatherData.name;

  document.querySelector(".temp").innerHTML = metricObj.temper;
  document.querySelector(".humidity").innerHTML =
    metricObj.currentWeatherData.main.humidity + "%";
  document.querySelector(".wind").innerHTML =
    metricObj.speed + metricObj.speedSymble;
  weatherIcon.src = `styles/images/${metricObj.currentWeatherData.weather[0].main}.png`;
}

citySelect.addEventListener("change", (event) =>
  getWeather(event.target.value)
);
temperatureFarengate.addEventListener("click", () => {
  metricObj.isMetric = false;
  changeMetricSystem();
  renderCurrentWeather();
});
temperatureCelcium.addEventListener("click", () => {
  metricObj.isMetric = true;
  changeMetricSystem();
  renderCurrentWeather();
});

//change metric system to the US system
function changeMetricSystem() {
  if (!metricObj.isMetric) {
    temperatureFarengate.classList.remove("nonFocus");
    temperatureFarengate.classList.add("inFocus");
    temperatureCelcium.classList.remove("inFocus");
    temperatureCelcium.classList.add("nonFocus");
    metricObj.temper = Math.round(
      Math.round(metricObj.currentWeatherData.main.temp * 1.8 - 459.67)
    );
    metricObj.speed = metricObj.currentWeatherData.wind.speed.toFixed(2);
    metricObj.speedSymble = "mph";
  } else {
    temperatureCelcium.classList.remove("nonFocus");
    temperatureCelcium.classList.add("inFocus");
    temperatureFarengate.classList.remove("inFocus");
    temperatureFarengate.classList.add("nonFocus");
    metricObj.temper = Math.round(
      Math.round(metricObj.currentWeatherData.main.temp - 273.15)
    );
    metricObj.speed = (
      metricObj.currentWeatherData.wind.speed * 1.609344
    ).toFixed(2);
    metricObj.speedSymble = "km/h";
  }
  return metricObj;
}
