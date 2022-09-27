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
  }
}
function showError(txt) {
  console.log(txt);
  labels[0].textContent = "Couldn't find the entered location";
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
  labels[3].textContent = responseData.main.humidity;
  labels[4].textContent = responseData.main.pressure;
  labels[5].textContent = responseData.main.temp;
}

let labels = document.getElementsByClassName("display");
let input = document.getElementById("location");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather(input.value);
  }
});

let ctfbutton = document.getElementById("ctf");
let toggleCount = "f";
ctfbutton.addEventListener("click", () => {
  if (toggleCount === "f") {
    labels[5].textContent = fToC(labels[5].textContent).toFixed(2);
    toggleCount = "c";
    ctfbutton.textContent = "to Farenheit";
  } else if (toggleCount === "c") {
    labels[5].textContent = cToF(labels[5].textContent).toFixed(2);
    toggleCount = "f";
    ctfbutton.textContent = "to Celcius";
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
