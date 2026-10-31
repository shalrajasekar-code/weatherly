const $ = (selector) => document.querySelector(selector);
const weatherCodes = {
  0: ["Clear skies", "☀", "sunny"], 1: ["Mostly clear", "🌤", "sunny"], 2: ["Partly cloudy", "⛅", "cloudy"], 3: ["Overcast", "☁", "cloudy"],
  45: ["Foggy", "🌫", "fog"], 48: ["Icy fog", "🌫", "fog"], 51: ["Light drizzle", "🌦", "rainy"], 53: ["Drizzle", "🌦", "rainy"], 55: ["Heavy drizzle", "🌧", "rainy"],
  56: ["Freezing drizzle", "🌧", "rainy"], 57: ["Heavy freezing drizzle", "🌧", "rainy"], 61: ["Light rain", "🌦", "rainy"], 63: ["Rain", "🌧", "rainy"], 65: ["Heavy rain", "🌧", "rainy"],
  66: ["Freezing rain", "🌧", "rainy"], 67: ["Heavy freezing rain", "🌧", "rainy"], 71: ["Light snow", "🌨", "snowy"], 73: ["Snow", "🌨", "snowy"], 75: ["Heavy snow", "❄", "snowy"],
  77: ["Snow grains", "❄", "snowy"], 80: ["Rain showers", "🌦", "rainy"], 81: ["Rain showers", "🌧", "rainy"], 82: ["Heavy showers", "🌧", "rainy"], 85: ["Snow showers", "🌨", "snowy"],
  86: ["Heavy snow showers", "🌨", "snowy"], 95: ["Thunderstorms", "⛈", "stormy"], 96: ["Thunderstorms with hail", "⛈", "stormy"], 99: ["Severe thunderstorms", "⛈", "stormy"]
};
let units = "celsius";
let selectedDay = 0;
let state = { location: null, forecast: null };
const tripStorageKey = "weatherly-trip-dates";

function weather(code) { return weatherCodes[code] || ["Variable conditions", "⛅", "cloudy"]; }
function degree(value) { return `${Math.round(value)}°`; }
function formatDay(value, options) { return new Intl.DateTimeFormat("en-US", options).format(new Date(`${value}T12:00:00`)); }
function setStatus(title, message, tone = "") { const panel = $("#status-panel"); panel.className = `status-panel ${tone}`; panel.innerHTML = `<div class="status-icon">${tone === "error" ? "!" : tone === "loading" ? "⋯" : "☁"}</div><div><h2>${title}</h2><p>${message}</p></div>`; $("#weather-dashboard").classList.add("hidden"); }
function locationLabel(location) { return [location.name, location.admin1, location.country].filter(Boolean).join(", "); }
function getAdvice(current, daily, index) {
  const rain = daily.precipitation_probability_max[index] || 0;
  const wind = daily.wind_speed_10m_max[index] || 0;
  const condition = weather(current.weather_code);
  if (condition[2] === "stormy" || rain >= 75 || wind >= 55) return "Not ideal for outdoor travel — severe weather is likely. Keep plans flexible and check local alerts.";
  if (condition[2] === "snowy" || rain >= 45 || wind >= 35) return "Use caution — pack waterproof layers and allow extra time for weather-related travel delays.";
  if (condition[2] === "fog") return "Use caution — visibility may be reduced, especially for driving or early departures.";
  if (condition[2] === "rainy") return "A rainy day ahead — still travel-friendly with a waterproof layer and a flexible outdoor plan.";
  return condition[2] === "sunny" ? "Sunny and ideal for exploring. Bring water, sunscreen, and enjoy the day outdoors." : "Good for travel — comfortable conditions for sightseeing and getting around.";
}
function renderDaily() {
  const { daily } = state.forecast;
  $("#daily-forecast").innerHTML = daily.time.map((date, index) => {
    const [label, icon] = weather(daily.weather_code[index]);
    const active = index === selectedDay ? "active" : "";
    const dateName = index === 0 ? "Today" : formatDay(date, { weekday:"short" });
    return `<button class="day-card ${active}" data-day="${index}" type="button" role="listitem" aria-label="View hourly weather for ${dateName}"><span class="day-name">${dateName}</span><span class="day-date">${formatDay(date, { month:"short", day:"numeric" })}</span><span class="day-icon" aria-label="${label}">${icon}</span><span class="day-temps"><span>${degree(daily.temperature_2m_max[index])}</span><span>${degree(daily.temperature_2m_min[index])}</span></span><span class="day-meta">☂ ${Math.round(daily.precipitation_probability_max[index] || 0)}% · ↝ ${Math.round(daily.wind_speed_10m_max[index])}</span></button>`;
  }).join("");
}
function renderHourly() {
  const { hourly, daily } = state.forecast;
  const date = daily.time[selectedDay];
  const indexes = hourly.time.map((time, index) => time.startsWith(date) ? index : -1).filter((index) => index !== -1);
  const showIndexes = indexes.filter((_, position) => position % 3 === 0);
  $("#hourly-title").textContent = `${selectedDay === 0 ? "Today" : formatDay(date, { weekday:"long" })} by the hour`;
  $("#hourly-summary").textContent = `${weather(daily.weather_code[selectedDay])[0]} · ${formatDay(date, { month:"long", day:"numeric" })}`;
  $("#hourly-forecast").innerHTML = showIndexes.map((index) => {
    const [label, icon] = weather(hourly.weather_code[index]);
    const time = Number(hourly.time[index].slice(11, 13));
    const isCurrent = hourly.time[index] === state.forecast.current.time;
    return `<article class="hour-card ${isCurrent ? "current-hour" : ""}"><span class="hour-time">${new Intl.DateTimeFormat("en-US", { hour:"numeric" }).format(new Date(2000, 0, 1, time))}</span><span class="hour-icon" aria-label="${label}">${icon}</span><strong class="hour-temp">${degree(hourly.temperature_2m[index])}</strong><span class="hour-meta">☂ ${Math.round(hourly.precipitation_probability[index] || 0)}%<br />↝ ${Math.round(hourly.wind_speed_10m[index])}</span></article>`;
  }).join("");
}
function renderWeather() {
  const { location, forecast } = state;
  const { current, daily } = forecast;
  const [condition, icon] = weather(current.weather_code);
  const travelText = getAdvice(current, daily, selectedDay);
  $("#status-panel").classList.add("hidden"); $("#weather-dashboard").classList.remove("hidden");
  $("#place-name").textContent = location.name; $("#place-region").textContent = [location.admin1, location.country].filter(Boolean).join(" · ").toUpperCase() || "TRAVEL FORECAST";
  $("#current-date").textContent = new Intl.DateTimeFormat("en-US", { weekday:"long", month:"long", day:"numeric" }).format(new Date(`${daily.time[0]}T12:00:00`));
  $("#current-icon").textContent = icon; $("#current-icon").setAttribute("aria-label", condition); $("#current-condition").textContent = condition; $("#current-temp").textContent = Math.round(current.temperature_2m); $("#feels-like").textContent = `Feels like ${degree(current.apparent_temperature)}`;
  $("#humidity").textContent = `${Math.round(current.relative_humidity_2m)}%`; $("#wind").textContent = `${Math.round(current.wind_speed_10m)} ${forecast.current_units.wind_speed_10m} ${windDirection(current.wind_direction_10m)}`;
  $("#travel-advice p").textContent = travelText; $("#unit-toggle").textContent = units === "celsius" ? "°C" : "°F"; $("#unit-toggle").setAttribute("aria-label", `Switch to ${units === "celsius" ? "Fahrenheit" : "Celsius"}`);
  renderDaily(); renderHourly();
}
function windDirection(degrees) { const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; return directions[Math.round(degrees / 45) % 8]; }
async function lookupLocation(query) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({ name:query, count:"1", language:"en", format:"json" })}`);
  if (!response.ok) throw new Error("Unable to search for that destination.");
  const data = await response.json(); if (!data.results?.length) throw new Error("We couldn’t find that destination. Try adding a country or region."); return data.results[0];
}
async function getForecast(location) {
  const params = new URLSearchParams({ latitude:location.latitude, longitude:location.longitude, timezone:"auto", forecast_days:"10", temperature_unit:units, wind_speed_unit:"kmh", current:"temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m", daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max", hourly:"temperature_2m,precipitation_probability,weather_code,wind_speed_10m" });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`); if (!response.ok) throw new Error("The weather service is unavailable right now. Please try again shortly."); return response.json();
}
async function search(query) {
  const cleanQuery = query.trim(); if (!cleanQuery) return; const button = $("#search-button"); button.disabled = true; button.textContent = "Searching…"; setStatus("Finding your forecast", `Checking weather for ${cleanQuery}…`, "loading");
  try { const location = await lookupLocation(cleanQuery); const forecast = await getForecast(location); state = { location, forecast }; selectedDay = 0; renderWeather(); }
  catch (error) { setStatus("Couldn’t load weather", error.message || "Please check your connection and try again.", "error"); }
  finally { button.disabled = false; button.innerHTML = "Search <span>↗</span>"; }
}
$("#search-form").addEventListener("submit", (event) => { event.preventDefault(); search($("#location-input").value); });
$("#trip-form").addEventListener("submit", (event) => { event.preventDefault(); const start = $("#trip-start").value; const end = $("#trip-end").value; if (end < start) { $("#trip-note").textContent = "Your end date must be on or after your start date."; return; } localStorage.setItem(tripStorageKey, JSON.stringify({ start, end })); const startLabel = new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(new Date(`${start}T12:00:00`)); const endLabel = new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(new Date(`${end}T12:00:00`)); $("#trip-note").textContent = `Travel dates saved: ${startLabel} – ${endLabel}. Your live 10-day forecast remains visible.`; });
$("#daily-forecast").addEventListener("click", (event) => { const card = event.target.closest("[data-day]"); if (!card) return; selectedDay = Number(card.dataset.day); renderWeather(); document.querySelector(".hourly-section").scrollIntoView({ behavior:"smooth", block:"start" }); });
$("#unit-toggle").addEventListener("click", async () => { units = units === "celsius" ? "fahrenheit" : "celsius"; if (state.location) { setStatus("Updating units", "Refreshing your forecast…", "loading"); try { state.forecast = await getForecast(state.location); renderWeather(); } catch { setStatus("Couldn’t update units", "Please check your connection and try again.", "error"); } } });
window.addEventListener("offline", () => setStatus("You’re offline", "Reconnect to the internet, then search again for a live forecast.", "error"));
(() => { const today = new Date(); const start = new Date(today); const end = new Date(today); end.setDate(end.getDate() + 3); const saved = JSON.parse(localStorage.getItem(tripStorageKey) || "null"); $("#trip-start").value = saved?.start || start.toISOString().slice(0, 10); $("#trip-end").value = saved?.end || end.toISOString().slice(0, 10); })();
