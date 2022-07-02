let searchHistory = []
let lastCitySearched = ""

/**
 * The function takes a city name as an argument, creates a URL for the OpenWeather API, fetches the
 * data, and then displays the weather data on the page.
 * @param city - The name of the city you want to get the weather for.
 */
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

/**
 * The searchSubmitHandler function is called when the user clicks the search button. 
 * 
 * The function prevents the default action of the form submit event. 
 * 
 * The function then gets the value of the city name input field and trims any leading or trailing
 * spaces. 
 * 
 * If the city name is not empty, the function calls the getCityWeather function and passes the city
 * name as a parameter. 
 * 
 * If the city name is empty, the function displays an alert message. 
 * 
 * The function then clears the city name input field.
 * @param event - The event object is automatically passed to the event handler by the browser.
 */
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

/**
 * It takes the weather data from the API and displays it on the page.
 * @param weatherData - {
 */
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
                    $("#uv-box").css("background-color", "#FF0000")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "#FF6600")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "#FF9900")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "#FFFF00")
                } else {
                    $("#uv-box").css("background-color", "#00FF00")
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

/**
 * If the city is not in the search history, then add it to the search history and append it to the
 * search history list.
 * @param city - The city that the user searched for.
 */
let saveSearchHistory = function (city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    }

    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    loadSearchHistory();
};

/**
 * This function loads the search history from local storage and displays it on the page.
 */
let loadSearchHistory = function () {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));

    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    $("#search-history").empty();

    for (i = 0; i < searchHistory.length; i++) {

        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
};

loadSearchHistory();

/* This is the code that is running when the page loads. It checks to see if there is a city saved in
local storage. If there is, it runs the getCityWeather function with the saved city. If there is
not, it does nothing. */
if (lastCitySearched != "") {
    getCityWeather(lastCitySearched);
}

$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function (event) {
    let prevCity = $(event.target).closest("a").attr("id");
    getCityWeather(prevCity);
});