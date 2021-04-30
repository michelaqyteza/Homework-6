var key = "6a48b9183ab4fd02b40049f31e71dc00"
var currentTemp = document.getElementById("curTemp")
var currentHumidity = document.getElementById("curHumidity")
var currentWindSpeed = document.getElementById("curWindSpeed")
var currentUvIndex = document.getElementById("curUv")
var searchbtn = document.getElementById("citySearch")
var list = document.getElementById("pastList")
var topCity = document.getElementById("topCityName")
var forecastrow=document.getElementById("forecastRow")
var hide= document.getElementById("hide")

if (!(localStorage.getItem("searched") == null)) {
    var searchedarray = JSON.parse(localStorage.getItem("searched"))
    for (var i = 0; i < searchedarray.length; i++) {
        var listItem = document.createElement("li")
        listItem.textContent = searchedarray[i]
        listItem.setAttribute("class", "list-group-item")
        listItem.addEventListener("click", function (event) {
            var btn = event.target
            var city = btn.textContent
            getWeather(city)
        })
        list.appendChild(listItem)
    }
}



function getWeather(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + key)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    $(forecastrow).empty()
                    var lon = data[0].lon
                    var lat = data[0].lat
                    var cityName = data[0].name
                    if (localStorage.getItem("searched") == null) {
                        var searchedarray = [cityName]
                        localStorage.setItem("searched", JSON.stringify(searchedarray))
                        var listItem = document.createElement("li")
                        listItem.textContent = cityName
                        listItem.setAttribute("class", "list-group-item")
                        listItem.addEventListener("click", function (event) {
                            var btn = event.target
                            var city = btn.textContent
                            getWeather(city)
                        })
                        list.appendChild(listItem)
                    } else {
                        var searchedarray = JSON.parse(localStorage.getItem("searched"))
                        if (!(searchedarray.includes(cityName))) {
                            searchedarray.push(cityName)
                            localStorage.setItem("searched", JSON.stringify(searchedarray))
                            var listItem = document.createElement("li")
                            listItem.textContent = cityName
                            listItem.setAttribute("class", "list-group-item")
                            listItem.addEventListener("click", function (event) {
                                var btn = event.target
                                var city = btn.textContent
                                getWeather(city)
                            })
                            list.appendChild(listItem)
                        }
                    }
                    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + key)
                        .then(function (response) {
                            response.json()
                                .then(function (data) {
                                    var temp = data.current.temp
                                    var humidity = data.current.humidity
                                    var windspeed = data.current.wind_speed
                                    var uvIndex = data.current.uvi
                                    currentTemp.textContent = temp
                                    currentHumidity.textContent = humidity
                                    currentWindSpeed.textContent = windspeed
                                    currentUvIndex.textContent = uvIndex
                                    if(uvIndex<3){
                                        currentUvIndex.setAttribute("id", "green")
                                    }else if(uvIndex<6){
                                        currentUvIndex.setAttribute("id", "yellow")
                                    }else{
                                        currentUvIndex.setAttribute("id", "red")
                                    }
                                    var dt= data.current.dt
                                    var currenttime= moment(dt,"X").format("MM/DD/YYYY")
                                    topCity.textContent=cityName + " " + currenttime
                                    var currenticon=document.createElement("img")
                                    var icon=data.current.weather[0].icon
                                    currenticon.setAttribute("src", "http://openweathermap.org/img/wn/"+ icon +"@2x.png")
                                    topCity.appendChild(currenticon)

                                    for(var i=0; i<5; i++){
                                        var fivetemp= data.daily[i+1].temp.day
                                        var fivehumidity= data.daily[i+1].humidity
                                        var fivedt= data.daily[i+1].dt
                                        var fiveicon= data.daily[i+1].weather[0].icon
                                        var date= moment(dt,"X").add(i+1,"days").format("MM/DD/YYYY")
                                        var div= document.createElement("div")
                                        div.setAttribute("class", "forecast-container bg-primary text-white mb-4 col-2")
                                        var fivedate= document.createElement("h5")
                                        fivedate.setAttribute("class","date-title font-weight-bold")
                                        fivedate.textContent=date
                                        var fiveimage=document.createElement("img")
                                        fiveimage.setAttribute("src", "http://openweathermap.org/img/wn/"+ fiveicon +"@2x.png")
                                        var forecasttemp=document.createElement("p")
                                        forecasttemp.setAttribute("class", "font-weight-bold")
                                        forecasttemp.textContent="temperature: " + fivetemp + "F"
                                        var forecasthumidity=document.createElement("p")
                                        forecasthumidity.setAttribute("class", "font-weight-bold")
                                        forecasthumidity.textContent="humidity " + fivehumidity + "%"
                                        div.appendChild(fivedate)
                                        div.appendChild(fiveimage)
                                        div.appendChild(forecasttemp)
                                        div.appendChild(forecasthumidity)
                                        forecastrow.appendChild(div)
                                    }
                                    hide.style.display="initial"
                                })

                        })

                })

        })

}

searchbtn.addEventListener("click", function (event) {
    event.preventDefault()
    var btn = event.target
    if (btn.getAttribute("id") === "citySearch") {
        var city = btn.parentNode.parentNode.childNodes[1].value
        getWeather(city)
    }
}) 