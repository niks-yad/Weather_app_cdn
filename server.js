const express = require("express");
const server = express();
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const PORT = 7000;

server.listen(PORT, () => {
  console.log("Now listening at port: " + PORT);
});

server.get("/weather/:city", async (req, res) => {
  let cityName = req.params.city;
  let unique_api_key = "9054dab5b4f5749ffd5fd9018c2bd842";
  let lat = 0;
  let long = 0;

  // weather info
  let weather_res = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=metric&appid=" +
      unique_api_key
  );
  let weather_data = await weather_res.json();
  // console.log(weather_data)

  // forecast info
  let forecast_res = await fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&units=metric&appid=" +
      unique_api_key
  );
  let forecast_data = await forecast_res.json();

  // pollution info
  // checking if city is entered correctly
  if (weather_data.cod == 200) {
    lat = weather_data.coord.lat;
    long = weather_data.coord.lon;
  }

  let pollution_res = await fetch(
    "https://api.openweathermap.org/data/2.5/air_pollution?lat=" +
      lat +
      "&lon=" +
      long +
      "&appid=" +
      unique_api_key
  );
  let pollution_data = await pollution_res.json();

  // rain level info
  // let rain_lev_res = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&units=metric&appid="+unique_api_key)
  // let rain_lev_data = await rain_lev_res.json()
  // console.log(rain_lev_data)
  // making one big data array containing all the necessary data array sets
  let data = {
    weather_info: weather_data,
    forecast_info: forecast_data,
    pollution_info: pollution_data,
    // rain_lev_info: rain_lev_data,
  };

  res.json(data);
});
