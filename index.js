const apiUrlCity = "https://geocode.maps.co/search?q=";
const apiKey = "f859181aacc9bfc8d84224bf2a6afef0";
const apiUrlWeather = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".city_search input");
const searchBtn = document.querySelector(".city_search button");
const citySelect = document.querySelector(".cityList");
const weatherIcon = document.querySelector(".weatehr_icon");
const tempF = document.querySelector(".tempF");
const tempC = document.querySelector(".tempC");
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

  //get api
  const res = await fetch(apiUrlCity + cityName);
  cityArr = await res.json();

  if (cityArr.length < 1 || cityArr == undefined) {
    document.querySelector(".error").style.display = "block";
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
  const res = await fetch(
    apiUrlWeather + `lat=${newCity.lat}&lon=${newCity.lon}&appid=${apiKey}`
  );

  document.querySelector(".wether_wrap").style.display = "block";
  metricObj.currentWeatherData = await res.json();

  impire();
  getCurrentWeatherData();
}

function getCurrentWeatherData() {
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
tempF.addEventListener("click", () => {
  metricObj.isMetric = false;
  impire();
  getCurrentWeatherData();
});
tempC.addEventListener("click", () => {
  metricObj.isMetric = true;
  impire();
  getCurrentWeatherData();
});

function impire() {
  if (!metricObj.isMetric) {
    tempF.classList.remove("nonFocus");
    tempF.classList.add("inFocus");
    tempC.classList.remove("inFocus");
    tempC.classList.add("nonFocus");
    metricObj.temper = Math.round(
      Math.round(metricObj.currentWeatherData.main.temp * 1.8 - 459.67)
    );
    metricObj.speed = metricObj.currentWeatherData.wind.speed.toFixed(2);
    metricObj.speedSymble = "mph";
  } else {
    tempC.classList.remove("nonFocus");
    tempC.classList.add("inFocus");
    tempF.classList.remove("inFocus");
    tempF.classList.add("nonFocus");
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
