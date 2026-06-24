const apiKey = "6cc8a90630b4001bc538ab8c4cded8a8";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.querySelector(".city-name");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const weatherIcon = document.getElementById("weatherIcon");
const loader = document.getElementById("loader");

let tempChart;

/* SEARCH */

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
    }
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

/* WEATHER */

async function getWeather(city) {

    try {

        loader.classList.remove("hidden");

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        updateWeather(data);

        await getAQI(
            data.coord.lat,
            data.coord.lon
        );

        await getForecast(city);

    } catch (error) {

        cityName.textContent = "City Not Found";
        description.textContent = error.message;

        console.error(error);

    } finally {

        loader.classList.add("hidden");

    }
}

/* UPDATE UI */

function updateWeather(data) {

    cityName.textContent = data.name;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} km/h`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    sunrise.textContent =
        convertTime(data.sys.sunrise);

    sunset.textContent =
        convertTime(data.sys.sunset);

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        /* RAIN */

function createRain() {

    const rain = document.getElementById("rain");

    if (!rain) return;

    rain.innerHTML = "";

    for (let i = 0; i < 120; i++) {

        const drop = document.createElement("div");

        drop.classList.add("drop");

        drop.style.left =
            Math.random() * 100 + "vw";

        drop.style.animationDuration =
            (0.5 + Math.random()) + "s";

        drop.style.opacity =
            Math.random();

        rain.appendChild(drop);
    }
}

function removeRain() {

    const rain = document.getElementById("rain");

    if (rain) {
        rain.innerHTML = "";
    }
}

/* STARS */

function createStars() {

    const stars =
        document.getElementById("stars");

    if (!stars) return;

    stars.innerHTML = "";

    for (let i = 0; i < 100; i++) {

        const star =
            document.createElement("div");

        star.classList.add("star");

        star.style.left =
            Math.random() * 100 + "vw";

        star.style.top =
            Math.random() * 100 + "vh";

        stars.appendChild(star);
    }
}

function removeStars() {

    const stars =
        document.getElementById("stars");

    if (stars) {
        stars.innerHTML = "";
    }
}

    function updateBackground(weather, icon) {

    removeRain();
    removeStars();

    const sun =
        document.querySelector(".sun");

    const clouds =
        document.querySelectorAll(".cloud");

    sun.style.display = "block";

    clouds.forEach(cloud => {
        cloud.style.display = "block";
    });

    /* NIGHT */

    if (icon.includes("n")) {

        createStars();

        document.body.style.background =
            "linear-gradient(to bottom,#0f172a,#1e293b,#334155)";

        sun.style.display = "none";
    }

    /* CLEAR */

    else if (weather === "Clear") {

        document.body.style.background =
            "linear-gradient(to bottom,#5daeff,#87ceeb,#b8e6ff)";
    }

    /* CLOUDS */

    else if (weather === "Clouds") {

        document.body.style.background =
            "linear-gradient(to bottom,#7f8c8d,#bdc3c7)";

        clouds.forEach(cloud => {
            cloud.style.opacity = "1";
        });
    }

    /* RAIN */

    else if (weather === "Rain" ||
             weather === "Drizzle") {

        document.body.style.background =
            "linear-gradient(to bottom,#4b6cb7,#182848)";

        createRain();
    }

    /* THUNDERSTORM */

    else if (weather === "Thunderstorm") {

        document.body.style.background =
            "linear-gradient(to bottom,#232526,#414345)";

        createRain();

        setInterval(() => {

            document.body.style.filter =
                "brightness(1.5)";

            setTimeout(() => {

                document.body.style.filter =
                    "brightness(1)";

            }, 150);

        }, 5000);
    }

    /* SNOW */

    else if (weather === "Snow") {

        document.body.style.background =
            "linear-gradient(to bottom,#dfe9f3,#ffffff)";
    }
}
}

/* AQI */

async function getAQI(lat, lon) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );

        const data = await response.json();

        const aqi = data.list[0].main.aqi;

        const levels = {
            1: "Good 😊",
            2: "Fair 🙂",
            3: "Moderate 😐",
            4: "Poor 😷",
            5: "Very Poor 🚨"
        };

        document.getElementById("aqi").textContent =
            levels[aqi];

    } catch {

        document.getElementById("aqi").textContent =
            "Unavailable";

    }
}

/* FORECAST */

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        const forecastContainer =
            document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        const forecast =
            data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            );

        forecast.slice(0, 5).forEach(day => {

            const date = new Date(day.dt_txt);

            forecastContainer.innerHTML += `
                <div class="forecast-card">
                    <h3>
                        ${date.toLocaleDateString("en-US", {
                            weekday: "short"
                        })}
                    </h3>

                    <img
                        src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                        width="60"
                    >

                    <p>
                        ${Math.round(day.main.temp)}°C
                    </p>
                </div>
            `;
        });

        drawChart(data.list);

    } catch (error) {

        console.error(error);

    }
}

/* CHART */

function drawChart(data) {

    const ctx =
        document.getElementById("tempChart");

    const labels = [];
    const temps = [];

    data.slice(0, 8).forEach(item => {

        labels.push(
            item.dt_txt.split(" ")[1].slice(0, 5)
        );

        temps.push(item.main.temp);

    });

    if (tempChart) {
        tempChart.destroy();
    }

    tempChart = new Chart(ctx, {

        type: "line",

        data: {
            labels,
            datasets: [{
                label: "Temperature °C",
                data: temps,
                borderWidth: 3,
                tension: 0.4,
                fill: false
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });
}

/* TIME */

function convertTime(unix) {

    return new Date(
        unix * 1000
    ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}

function updateClock() {

    const now = new Date();

    document.getElementById("clock")
        .textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("dateDisplay")
        .textContent =
        now.toDateString();
}

setInterval(updateClock, 1000);
updateClock();

/* BACKGROUND */

function updateBackground(weather, icon) {

    if (icon.includes("n")) {

        document.body.style.background =
            "linear-gradient(to bottom,#0f172a,#1e293b)";

    } else if (weather === "Clear") {

        document.body.style.background =
            "linear-gradient(to bottom,#5daeff,#87ceeb,#b8e6ff)";

    } else if (weather === "Clouds") {

        document.body.style.background =
            "linear-gradient(to bottom,#7f8c8d,#bdc3c7)";

    } else if (weather === "Rain") {

        document.body.style.background =
            "linear-gradient(to bottom,#4b6cb7,#182848)";

    }
}

/* DEFAULT CITY */

getWeather("Delhi");