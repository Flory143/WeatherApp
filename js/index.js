const input = document.querySelector(".search__input");
const btn = document.querySelector(".search__btn");

btn.addEventListener("click", () => {
  if (input.value != "") {
    takeCity();
  } else {
    console.warn("Error in input!");
  }
});

addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (input.value != "") {
      takeCity();
    } else {
      console.warn("Error in input!");
    }
  }
});

function takeCity() {
  let inputText = input.value.trim();

  input.value = "";

  let cityName = inputText;

  cityName = cityName.replace(/^[^a-zа-яё]*([a-zа-яё])/i, function (m) {
    return m.toUpperCase();
  });

  cityName = cityName.replace(/[^a-zA-Zа-яА-Я]/g, "");

  localStorage.clear();
  localStorage.setItem("сityName", cityName);

  checkCity();
}

// Takes coodinates of city
function checkCity() {
  // api key from https://opencagedata.com/dashboard#geocoding
  const apiKey = "59d1d77f3da34a11999c868634c20819";

  let cityName = localStorage.getItem("сityName");

  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    cityName
  )}&key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        let location = data.results[0].geometry;
        let latitude = location.lat;
        let longitude = location.lng;

        localStorage.setItem("cityLatitude", latitude);
        localStorage.setItem("cityLongitude", longitude);

        console.log(
          `Координаты города ${cityName}: Широта ${latitude}, Долгота ${longitude}`
        );

        loadActual(latitude, longitude, cityName);
      } else {
        console.error(`Не удалось получить координаты для города ${cityName}`);
        alert(`Не удалось получить координаты для города ${cityName}`);
        localStorage.clear();
      }
    })
    .catch((error) => {
      console.error("Произошла ошибка при выполнении запроса:", error);
      localStorage.clear();
    });
}

function loadActual(latitude, longitude, cityName) {
  const windDirText = document.querySelector(".wind__direction-text");
  const daysImg = document.querySelectorAll(".day__img");
  const dayImg = document.querySelectorAll(".temprature__real-img");
  const dayText = document.querySelectorAll(".day__text");

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,rain,snowfall,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum&wind_speed_unit=ms`;

  fetch(url)
    .then((response) => {
      response.status != 200
        ? console.error("Error in response!")
        : console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // app__info
      document.querySelector(".info__city").textContent = cityName;
      document.querySelector(
        ".weather__temperature"
      ).textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;

      // app__content
      if (data.daily.rain_sum[0] != 0 || data.daily.snowfall_sum[0] != 0) {
        if (data.daily.rain_sum[0] != 0) {
          dayImg[0].src = "./img/rainy.svg";
          if (data.daily.snowfall_sum[0] != 0) {
            dayImg[0].src = "./img/rainy-snow.svg";
          }
        } else if (data.daily.snowfall_sum[0] != 0) {
          dayImg[0].src = "./img/snow.svg";
          if (data.daily.rain_sum[0] != 0) {
            dayImg[0].src = "./img/rainy-snow.svg";
          }
        }
      } else {
        dayImg[0].src = "./img/sunny.svg";
      }
      document.querySelector(
        ".temprature__real-num"
      ).textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
      document.querySelector(
        ".temprature__feel-num"
      ).textContent = `${data.current.apparent_temperature} ${data.current_units.temperature_2m}`;

      document.querySelector(".wind__speed-num").textContent =
        data.current.wind_speed_10m;
      document.querySelector(
        ".wind__direction-position"
      ).style.transform = `rotate(${data.current.wind_direction_10m}deg)`;

      let windDirection = data.current.wind_direction_10m;

      if (windDirection <= 5) {
        windDirText.textContent = "С";
      } else if (windDirection <= 85) {
        windDirText.textContent = "С-В";
      } else if (windDirection <= 95) {
        windDirText.textContent = "В";
      } else if (windDirection <= 175) {
        windDirText.textContent = "Ю-В";
      } else if (windDirection <= 185) {
        windDirText.textContent = "Ю";
      } else if (windDirection <= 265) {
        windDirText.textContent = "Ю-З";
      } else if (windDirection <= 275) {
        windDirText.textContent = "З";
      } else if (windDirection <= 355) {
        windDirText.textContent = "С-З";
      } else if (windDirection <= 265) {
        windDirText.textContent = "С";
      }

      // app__daily

      for (let i = 0; i < 7; i++) {
        let dayDate = `${data.daily.time[i][8]}${data.daily.time[i][9]}`;
        switch (`${data.daily.time[i][5]}${data.daily.time[i][6]}`) {
          case "1":
            dayText[i].textContent = `${dayDate} января`;
            break;
          case "2":
            dayText[i].textContent = `${dayDate} февраля`;
            break;
          case "3":
            dayText[i].textContent = `${dayDate} марта`;
            break;
          case "4":
            dayText[i].textContent = `${dayDate} апреля`;
            break;
          case "5":
            dayText[i].textContent = `${dayDate} мая`;
            break;
          case "6":
            dayText[i].textContent = `${dayDate} июня`;
            break;
          case "7":
            dayText[i].textContent = `${dayDate} июля`;
            break;
          case "8":
            dayText[i].textContent = `${dayDate} августа`;
            break;
          case "9":
            dayText[i].textContent = `${dayDate} сентября`;
            break;
          case "10":
            dayText[i].textContent = `${dayDate} октября`;
            break;
          case "11":
            dayText[i].textContent = `${dayDate} ноября`;
            break;
          case "12":
            dayText[i].textContent = `${dayDate} декабря`;
            break;
          default:
            dayText[i].textContent = `${dayDate} число`;
        }

        document.querySelectorAll(".content__temp-min")[
          i
        ].textContent = `${data.daily.temperature_2m_min[i]} ${data.current_units.temperature_2m}`;
        document.querySelectorAll(".content__temp-max")[
          i
        ].textContent = `${data.daily.temperature_2m_max[i]} ${data.current_units.temperature_2m}`;

        if (data.daily.rain_sum[i] != 0 || data.daily.snowfall_sum[i] != 0) {
          if (data.daily.rain_sum[i] != 0) {
            daysImg[i].src = "./img/rainy.svg";
            if (data.daily.snowfall_sum[i] != 0) {
              daysImg[i].src = "./img/rainy-snow.svg";
            }
          } else if (data.daily.snowfall_sum[i] != 0) {
            daysImg[i].src = "./img/snow.svg";
            if (data.daily.rain_sum[i] != 0) {
              daysImg[i].src = "./img/rainy-snow.svg";
            }
          }
        } else {
          daysImg[i].src = "./img/sunny.svg";
        }
      }
    });
}

// onload
if (
  localStorage.getItem("cityLatitude") !== null &&
  localStorage.getItem("cityLongitude") !== null &&
  localStorage.getItem("сityName") !== null
) {
  loadActual(
    localStorage.getItem("cityLatitude"),
    localStorage.getItem("cityLongitude"),
    localStorage.getItem("сityName")
  );
} else {
  loadActual(55.7505412, 37.6174782, "Москва");
}
