const apiUrlCity = "https://geocode.maps.co/search?q=";
const apiKey = "f859181aacc9bfc8d84224bf2a6afef0";
//const unitw = "metric";
const apiUrlWeather = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".city_search input");
const searchBtn = document.querySelector(".city_search button");
const cityList = document.querySelector(".cityList");
const citySelect = document.querySelector(".cityList");
const weatherIcon = document.querySelector(".weatehr_icon");

let cityArr = [];

//get api list of city
async function getCities(cityName) {
  const res = await fetch(apiUrlCity + cityName);
  cityArr = await res.json();

  const options = cityArr.map((i) => {
    let cityOption = document.createElement("option");
    cityOption.textContent = i.display_name;
    cityOption.value = i.place_id;
    // cityArr.console.log(i);
    return cityOption;
  });

  cityList.innerHTML = "";
  cityList.append(...options);
}

searchBtn.addEventListener("click", () => {
  getCities(searchBox.value);
});

searchBox.addEventListener("keydown", (e) => {
  if (e.value === "Enter") {
    getCities(searchBox.value);
  }
});

async function getWeather(value) {
  let newCity = cityArr.find((i) => i.place_id == value);

  const res = await fetch(
    apiUrlWeather + `lat=${newCity.lat}&lon=${newCity.lon}&appid=${apiKey}`
  );
  if (res.status == 404 || res.status == 400) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".wether_wrap").style.display = "none";
  } else {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".wether_wrap").style.display = "block";
    let data = await res.json();

    document.querySelector(".city").innerHTML = data.name;

    document.querySelector(".temp").innerHTML =
      Math.round(Math.round(data.main.temp * 1.8 - 459.67)) + "F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    console.log(data.weather[0].main);
    console.log(weatherIcon);
    weatherIcon.src = `styles/images/${data.weather[0].main}.png`;
  }
}

// searchBtn.addEventListener("click", () => {
//   checkWeather(searchBox.value);
// });

citySelect.addEventListener("change", (event) =>
  getWeather(event.target.value)
);
