$(document).ready(function () {
    const history = window.localStorage.getItem("history");
    let key = "920a4b29fbcfc27b5c48d10de6154ef9";

    weatherSearch(history);

    $("#submitWeather").on("click", weatherSearch)



    // Renders current date for the 'day of' forecast
    $("#date").text(moment().format("[Forecast for:] MM/D/YYYY"));


    function weatherSearch() {
        // Weather info
        const city = $('#city').val();
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=imperial"
        console.log(url)
        $.ajax({
            method: "GET",
            url: url
        }).then(function (data) {
            console.log(data)

            let title = $("<h1>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            let card = $("<div>").addClass("card");
            let wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");


            let humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");

            let temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            let cardBody = $("<div>").addClass("card-body");


            let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);

            fiveDayForecast(city);
            getUVIndex(data.coord.lat, data.coord.lon);
        })
    };

    let lat = data.coord.lat;
    let lon = data.coord.lon;


    $.ajax({
        // UVI 
        url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + key,
        method: "GET",
    }).
    then(function (data) {
        console.log(data)
        let uv = $("<p>").text("UV Index: ");
        let btn = $("<span>").addClass("btn btn-sm").text(data.value);
        let uvIndex = data.value;

        if (uvIndex >= 7) {
            btn.addClass("btn-success")
        } else if (uvIndex <= 6 && uvIndex >= 3) {
            btn.addClass("btn-warning");
        } else if (uvIndex <= 2) {
            btn.addClass("btn-danger");
        }
        uv.append(btn);
        $("#today .card-body").append(uv);
    });



    function fiveDayForecast(city) {
        // Five-Day Forecast

        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + key + "&units=imperial",
        }).then(function (data) {
            console.log(data)
            $("#forecast").html("<h1 class=\"mt-3\">5-Day Forecast:</h1>").append("<div class=\"row\">");
            for (let i = 0; i < data.list.length; i++) {
                let hourChange = data.list[i];
                if (hourChange.dt_txt.indexOf("15:00:00") !== -1) {
                    let col = $("<div>").addClass("col-md-2");
                    let title = $("<h5>").addClass("card-title").text(new Date(hourChange.dt_txt).toLocaleDateString());
                    let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + hourChange.weather[0].icon + ".png");



                    let card = $("<div>").addClass("card bg-warning text-black");
                    let body = $("<div>").addClass("card-body p-2");

                    let p1 = $("<p>").addClass("card-text").text("Temp: " + hourChange.main.temp_max + " °F");
                    let p2 = $("<p>").addClass("card-text").text("Humidity: " + hourChange.main.humidity + "%");


                    col.append(card.append(body.append(title, img, p1, p2)));

                    $("#forecast .row").append(col);

                }
            }
        })
    }
});