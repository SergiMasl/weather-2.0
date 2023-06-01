const apiUrlCity = "https://geocode.maps.co/search?q=";
const apiKey = "f859181aacc9bfc8d84224bf2a6afef0";
const apiUrlWeather = "https://api.openweathermap.org/data/2.5/weather?";
const searchBox = document.querySelector(".city_search input");
const searchBtn = document.querySelector(".city_search button");
const citySelect = document.querySelector(".cityList");
const weatherIcon = document.querySelector(".weatehr_icon");
let cityArr = [];

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
    citySelect.append(...options);
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

citySelect.addEventListener("change", (event) =>
  getWeather(event.target.value)
);
