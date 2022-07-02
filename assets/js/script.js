let searchHistory = []
let lastCitySearched = ""

let getCityWeather = function(city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=21f70556e9750656e572b49f6f7f3a3b&units=imperial";

    fetch(apiUrl)
        
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        })
};