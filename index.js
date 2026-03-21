const searchBar = document.querySelector('.search-bar');
const date = document.querySelector('.date');
const temp = document.querySelector('.temp');
const cityName = document.querySelector('.city-name');
const humidity = document.querySelector('.humidity-data');
const wind = document.querySelector('.wind-data');

const weatherDatacontainers = {
    date: document.querySelector('.date'),
    tempCity: document.querySelector('.temp-city-container'),
    windWater: document.querySelector('.wind-water-container'),
    nextDay: document.querySelector('.next-day-container')
};

const error404 = document.querySelector('.error-404');
let isACity = true;
searchBar.addEventListener('keypress', (e)=>{
    if (e.key === `Enter` && searchBar.value !== ``){
        retrieveAPI(searchBar.value);
        retrieveForecast(searchBar.value);
        searchBar.value = ``;
    }
});

function hideInfo(){
    Object.values(weatherDatacontainers).forEach(element => {
        element.classList.add('hidden');
    });
}

function unhideInfo(){
    Object.values(weatherDatacontainers).forEach(element => {
        element.classList.remove('hidden');

    });
}

async function retrieveAPI(city){
    try{
        const retrieved = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        document.querySelector('.opening-words').classList.add('hidden');
        if (!retrieved.ok){
            console.log(`Error, the city doesn't exist.`);
            hideInfo()
            error404.classList.remove('hidden');
            isACity = false;
            return;
        }

        const data = await retrieved.json();
        updateUI(data);
    }catch(err){
        console.log(err)

    }
}

function updateUI(data) {
    if (isACity === false){
        
        isACity = true;
        error404.classList.add('hidden');
    }
    unhideInfo();
    cityName.textContent = data.name;
    temp.textContent = Math.round(data.main.temp);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed ;
    date.textContent = getCurrentDate();
}


function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday: `short`,
        day: `2-digit`,
        month: `short`
    }
    return currentDate.toLocaleDateString('en-GB', options);
};

async function retrieveForecast(city) {
    const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    // Filter to get only one timestamp per day (e.g., midday)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
    updateForecastUI(dailyData);
}


function updateForecastUI(forecastList) {
    const container = document.querySelector('.next-day-container');
    container.innerHTML = ''; // Clear the old static boxes

    forecastList.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        container.innerHTML += `
            <div class="day">
                <h5 class="next-day">${date}</h5>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
                <h5 class="next-day-degree">${temp} °C</h5>
            </div>
        `;
    });
}

hideInfo();