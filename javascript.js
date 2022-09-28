async function getWeather(loc) {
  let response = await fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      loc +
      "&APPID=c573e9c387c61c0311cf64b68d31487a",
    { mode: "cors" }
  );
  if (response.status !== 200) {
    showError(response.statusText);
  } else {
    let responseData = await response.json();
    sendPrint(responseData);
    showIcon(weatherIcon, responseData.weather[0].icon);
  }
}
function showIcon(weatherIcon, iconID) {
  weatherIcon.src = "http://openweathermap.org/img/wn/" + iconID + "@4x.png";
}
function showError(txt) {
  console.log(txt);
  labels[0].textContent = "Not found";
  weatherIcon.src = "./error.png";
  for (let i = 1; i < labels.length; i++) {
    labels[i].textContent = "";
  }
}
function cToF(celsius) {
  var cTemp = celsius;
  var cToFahr = (cTemp * 9) / 5 + 32;
  return cToFahr;
}

function fToC(fahrenheit) {
  var fTemp = fahrenheit;
  var fToCel = ((fTemp - 32) * 5) / 9;
  return fToCel;
}
async function sendPrint(responseData) {
  labels[0].textContent = responseData.name;
  labels[1].textContent = responseData.weather[0].main;
  labels[2].textContent = responseData.weather[0].description;
  labels[3].textContent = (responseData.main.temp - 273.15).toFixed(2) + "C";
  labels[4].textContent = "Humidity: " + responseData.main.humidity;
  labels[5].textContent = "Pressure: " + responseData.main.pressure;
}

let labels = document.getElementsByClassName("display");
let input = document.getElementById("location");
let weatherIcon = document.getElementById("weather-icon");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather(input.value);
  }
});

let ctfbutton = document.getElementById("ctf");
let toggleCount = "c";
ctfbutton.addEventListener("click", () => {
  if (toggleCount === "f") {
    let myString = labels[3].textContent.replace(/[^\d.-]/g, "");
    labels[3].textContent = fToC(myString).toFixed(2) + "C";
    toggleCount = "c";
    ctfbutton.textContent = "F";
  } else if (toggleCount === "c") {
    let myString = labels[3].textContent.replace(/[^\d.-]/g, "");
    labels[3].textContent = cToF(myString).toFixed(2) + "F";
    toggleCount = "f";
    ctfbutton.textContent = "C";
  }
});

const successCallback = async (position) => {
  let response = await fetch(
    "http://api.openweathermap.org/geo/1.0/reverse?lat=" +
      position.coords.latitude.toFixed(2) +
      "&lon=" +
      position.coords.longitude.toFixed(2) +
      "&limit=5&appid=c573e9c387c61c0311cf64b68d31487a",
    { mode: "cors" }
  );
  if (response.status !== 200) {
    showError(response.statusText);
  } else {
    let responseData = await response.json();
    getWeather(responseData[0].name);
  }
};

const errorCallback = (error) => {
  console.log(error);
  showError(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
