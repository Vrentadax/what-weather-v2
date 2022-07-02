let searchHistory = []
let lastCitySearched = ""

let getCityWeather = function (city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=21f70556e9750656e572b49f6f7f3a3b&units=imperial";

    fetch(apiUrl)

        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })

        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        })
};

let searchSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = $("#cityname").val().trim();

    if (cityName) {
        getCityWeather(cityName);

        $("#cityname").val("");
    } else {
        alert("Please enter a city name");
    }
};

let displayWeather = function (weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=21f70556e9750656e572b49f6f7f3a3b")
        .then(function (response) {
            response.json().then(function (data) {

                $("#uv-box").text(data.value);

                if (data.value >= 11) {
                    $("#uv-box").css("background-color", "#6c49cb")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "#d90011")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "#f95901")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "#f7e401")
                } else {
                    $("#uv-box").css("background-color", "#299501")
                }
            })
        });

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=21f70556e9750656e572b49f6f7f3a3b&units=imperial")
        .then(function (response) {
            response.json().then(function (data) {

                $("#five-day").empty();

                for (i = 7; i <= data.list.length; i += 8) {

                    let fiveDayCard = `
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    $("#five-day").append(fiveDayCard);
                }
            })
        });

    lastCitySearched = weatherData.name;

    saveSearchHistory(weatherData.name);


};