const weatherData = {
  Santorini: {
    temp: 28,
    feelsLike: 30,
    humidity: 58,
    wind: 9,
    uv: '5 / 10',
    card: 'Clear skies',
    icon: '☀️',
    forecast: [
      { day: 'Mon', date: 'Jun 12', icon: '☀️', hi: 29, lo: 23 },
      { day: 'Tue', date: 'Jun 13', icon: '🌤️', hi: 30, lo: 24 },
      { day: 'Wed', date: 'Jun 14', icon: '⛅', hi: 28, lo: 22 },
      { day: 'Thu', date: 'Jun 15', icon: '🌦️', hi: 27, lo: 21 },
      { day: 'Fri', date: 'Jun 16', icon: '☀️', hi: 31, lo: 24 }
    ]
  },
  Kyoto: {
    temp: 24,
    feelsLike: 26,
    humidity: 68,
    wind: 12,
    uv: '4 / 10',
    card: 'Mild & breezy',
    icon: '🌤️',
    forecast: [
      { day: 'Mon', date: 'Jun 12', icon: '🌤️', hi: 26, lo: 20 },
      { day: 'Tue', date: 'Jun 13', icon: '🌦️', hi: 25, lo: 19 },
      { day: 'Wed', date: 'Jun 14', icon: '⛅', hi: 24, lo: 18 },
      { day: 'Thu', date: 'Jun 15', icon: '🌧️', hi: 23, lo: 18 },
      { day: 'Fri', date: 'Jun 16', icon: '🌤️', hi: 27, lo: 20 }
    ]
  },
  Reykjavik: {
    temp: 13,
    feelsLike: 12,
    humidity: 72,
    wind: 18,
    uv: '2 / 10',
    card: 'Cool & crisp',
    icon: '⛅',
    forecast: [
      { day: 'Mon', date: 'Jun 12', icon: '⛅', hi: 14, lo: 8 },
      { day: 'Tue', date: 'Jun 13', icon: '🌧���', hi: 12, lo: 7 },
      { day: 'Wed', date: 'Jun 14', icon: '⛅', hi: 13, lo: 8 },
      { day: 'Thu', date: 'Jun 15', icon: '🌦️', hi: 15, lo: 9 },
      { day: 'Fri', date: 'Jun 16', icon: '🌤️', hi: 16, lo: 10 }
    ]
  },
  Bali: {
    temp: 30,
    feelsLike: 32,
    humidity: 74,
    wind: 14,
    uv: '8 / 10',
    card: 'Tropical warmth',
    icon: '🌤️',
    forecast: [
      { day: 'Mon', date: 'Jun 12', icon: '🌤️', hi: 31, lo: 26 },
      { day: 'Tue', date: 'Jun 13', icon: '🌦️', hi: 30, lo: 25 },
      { day: 'Wed', date: 'Jun 14', icon: '🌧️', hi: 29, lo: 25 },
      { day: 'Thu', date: 'Jun 15', icon: '☀️', hi: 32, lo: 27 },
      { day: 'Fri', date: 'Jun 16', icon: '🌤️', hi: 31, lo: 26 }
    ]
  }
};

const cityNameEl = document.getElementById('cityName');
const currentTempEl = document.getElementById('currentTemp');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const uvEl = document.getElementById('uv');
const forecastGridEl = document.getElementById('forecastGrid');
const plannerForm = document.getElementById('plannerForm');
const destinationInput = document.getElementById('destination');

const renderForecast = (forecast) => {
  forecastGridEl.innerHTML = forecast
    .map(
      (item) => `
        <article class="forecast-card">
          <span class="date">${item.date}</span>
          <span class="day">${item.day}</span>
          <span class="icon" aria-hidden="true">${item.icon}</span>
          <div class="high-low">
            <span>${item.hi}°</span>
            <span class="low">${item.lo}°</span>
          </div>
        </article>
      `
    )
    .join('');
};

const updateWeather = (city) => {
  const info = weatherData[city] || weatherData.Santorini;
  cityNameEl.textContent = city;
  currentTempEl.textContent = `${info.temp}°`;
  feelsLikeEl.textContent = `${info.feelsLike}°`;
  humidityEl.textContent = `${info.humidity}%`;
  windEl.textContent = `${info.wind} km/h`;
  uvEl.textContent = info.uv;

  const chip = document.querySelector('.chip');
  chip.textContent = info.card;

  const icon = document.querySelector('.weather-icon');
  icon.textContent = info.icon;

  renderForecast(info.forecast);
};

plannerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = destinationInput.value.trim();
  const city = value || 'Santorini';
  updateWeather(city.charAt(0).toUpperCase() + city.slice(1));
});

updateWeather('Santorini');
