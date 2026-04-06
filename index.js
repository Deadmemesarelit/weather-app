const searchBar = document.querySelector('.search-bar');
const date = document.querySelector('.date');
const tempValue = document.querySelector('.temp-value');
const tempUnit = document.querySelector('.temp-unit');
const cityName = document.querySelector('.city-name');
const humidity = document.querySelector('.humidity-data');
const wind = document.querySelector('.wind-data');
const toggleDegreeModeBtn = document.querySelector('.toggle-degree-mode');
toggleDegreeModeBtn.addEventListener('click', toggleDegreeMode);
/*
@param {boolean} show
*/
const weatherDatacontainers = {
    date: document.querySelector('.date'),
    tempCity: document.querySelector('.temp-city-container'),
    windWater: document.querySelector('.wind-water-container'),
    nextDay: document.querySelector('.next-day-container')
};



const error404 = document.querySelector('.error-404');
let isACity = true;
let currentCity = '';
let currentUnits = 'metric';
searchBar.addEventListener('keypress', (e)=>{
    if (e.key === `Enter` && searchBar.value !== ``){
        currentCity = searchBar.value;
        retrieveAPI(currentCity);
        retrieveForecast(currentCity);
        searchBar.value = ``;
    }
});

function showWeatherData(show){
    Object.values(weatherDatacontainers).forEach(element => {
        element.classList.toggle('hidden', !show);
    });
}
async function retrieveAPI(city){
    try{
        const retrieved = await fetch(`/api/weather?city=${encodeURIComponent(city)}&units=${currentUnits}`);
        document.querySelector('.opening-words').classList.add('hidden');
        if (!retrieved.ok){
            console.log(`Error, the city doesn't exist.`);
            showWeatherData(false);
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
    showWeatherData(true);
    cityName.textContent = data.name;
    tempValue.textContent = Math.round(data.main.temp);
    tempUnit.textContent = data.units === 'celsius' ? '°C' : '°F';
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
    const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}&units=${currentUnits}`);
    const data = await response.json();

    // Filter to get only one timestamp per day (e.g., midday)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    
    updateForecastUI(dailyData, data.units);
}


function updateForecastUI(forecastList, units) {
    const container = document.querySelector('.next-day-container');
    container.innerHTML = ''; // Clear the old static boxes

    const unitSymbol = units === 'celsius' ? '°C' : '°F';

    forecastList.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        container.innerHTML += `
            <div class="day">
                <h5 class="next-day">${date}</h5>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
                <h5 class="next-day-degree">${temp} ${unitSymbol}</h5>
            </div>
        `;
    });
}

function toggleDegreeMode() {
    currentUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
    console.log('Toggled units to:', currentUnits);
    console.log('Current city:', currentCity);
    
    if (currentCity) {
        retrieveAPI(currentCity);
        retrieveForecast(currentCity);
    } else {
        console.log('No city stored - search for a city first');
    }
    
    const buttonText = currentUnits === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    toggleDegreeModeBtn.textContent = buttonText;
}

showWeatherData(false);
