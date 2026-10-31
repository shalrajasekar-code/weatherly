# Weatherly — Travel Weather Planner

A polished, responsive ten-day weather planner for travelers. Search a destination to see current conditions, a travel recommendation, a selectable ten-day forecast, and detailed hourly weather.

## Features

- Search by city, town, postal code, or place name
- Optional start and end date trip planner (saved locally; it does not filter the live ten-day forecast)
- Live ten-day forecast and selectable hourly view for each day
- Current temperature, feels-like temperature, humidity, wind, and weather condition
- Travel advice based on forecast precipitation, wind, and weather conditions
- Accessible, responsive interface and Celsius/Fahrenheit toggle
- Loading, empty, invalid-location, offline, and API-error states

## Free API

This project uses the free public [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) and [Geocoding API](https://open-meteo.com/en/docs/geocoding-api). No API key, payment method, or account is required for this browser-based demo. The optional date planner uses built-in browser calendar fields, so it is free and does not require another service.

## Run locally

Open `index.html` in a browser. A local static server may be used if preferred.

## Publish to GitHub

1. Create a new GitHub repository, for example `weatherly`.
2. Upload all project files from this folder and commit them.
3. Keep `index.html` at the root of the repository.

## Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) with GitHub.
2. Choose **Add New → Project** and import the GitHub repository.
3. Select the **Other** framework preset. No build command or output directory is needed.
4. Select **Deploy**. Vercel will provide a live HTTPS URL.

## Files

```
travel-weather/
├── index.html
├── styles.css
├── app.js
├── vercel.json
└── README.md
```
