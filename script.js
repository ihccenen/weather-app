function getWeatherData(data) {
  const {
    main,
    name,
    sys,
    weather,
    wind,
    unit,
  } = data;

  return Promise.resolve({
    main,
    name,
    sys,
    weather,
    unit,
    wind,
  });
}

function displayWeather({
  main,
  name,
  sys,
  weather,
  wind,
  unit,
}) {
  const {
    temp,
    temp_max,
    temp_min,
    humidity,
  } = main;
  const { country } = sys;
  const { speed } = wind;
  const { description, icon } = weather[0];
  const container = document.querySelector('[data-container="display"]');
  const div = document.createElement('div');
  const rightSide = document.createElement('div');
  const leftSide = document.createElement('div');
  const tempContainer = document.createElement('div');
  const img = document.createElement('img');
  const tempNow = document.createElement('p');
  const tempMax = document.createElement('p');
  const tempMin = document.createElement('p');
  const humidityP = document.createElement('p');
  const windP = document.createElement('p');
  const countryP = document.createElement('p');
  const cityP = document.createElement('p');
  const descriptionP = document.createElement('p');

  div.dataset.city = name;
  div.classList.add('weather-display', 'flex');

  rightSide.classList.add('rtl');

  tempContainer.classList.add('temp', 'flex');

  img.src = `http://openweathermap.org/img/w/${icon}.png`;

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  tempNow.textContent = `${Math.round(temp)} ${tempUnit}`;
  tempMax.textContent = `Max: ${Math.round(temp_max)} ${tempUnit}`;
  tempMin.textContent = `Min: ${Math.round(temp_min)} ${tempUnit}`;

  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  windP.textContent = `Wind: ${Math.round(speed) + windUnit}`;

  humidityP.textContent = `Humidity: ${humidity}%`;

  countryP.textContent = country;
  cityP.textContent = name;
  descriptionP.textContent = description[0].toUpperCase() + description.slice(1);

  tempContainer.append(img, tempNow);

  leftSide.append(tempContainer, tempMax, tempMin, windP, humidityP);

  rightSide.append(cityP, country, descriptionP);

  div.append(leftSide, rightSide);

  if (container.firstChild) container.firstChild.remove();

  const loading = document.querySelector('[data-div="loading"]');

  loading.classList.add('hidden');
  container.classList.remove('hidden');

  container.appendChild(div);
}

function displayError(error) {
  const container = document.querySelector('[data-container="display"]');
  const loading = document.querySelector('[data-div="loading"]');
  const p = document.createElement('p');

  p.textContent = error.message.replace(/^./, (c) => c.toUpperCase());
  p.classList.add('text-center');

  loading.classList.add('hidden');

  if (container.firstChild) container.firstChild.remove();

  container.classList.remove('hidden');
  container.appendChild(p);
}

function searchCity(e) {
  e.preventDefault();

  const loading = document.querySelector('[data-div="loading"]');
  const container = document.querySelector('[data-container="display"]');
  const obj = Object.fromEntries(new FormData(e.target));
  const { city, unit } = obj;

  loading.classList.remove('hidden');
  container.classList.add('hidden');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bedcb2e533f60a01f1927267c3f08a51&units=${unit}`, { mode: 'cors' })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);

      return response.json();
    })
    .then((response) => getWeatherData({ ...response, unit }))
    .then(displayWeather)
    .catch(displayError);
}

const form = document.querySelector('[data-form="location"]');

form.addEventListener('submit', searchCity);
