// API bilgileri
const apiKey = "aa979e0eb68b46c4a60165607251001";
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";

// Karanlık Mod
const darkModeToggle = document.getElementById("darkModeToggle");

document.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true; 
  }
});

darkModeToggle.addEventListener("change", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode); 
});

// Canlı Saat ve Tarih
function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("live-time").textContent = time;
  document.getElementById("live-date").textContent = date;
}

setInterval(updateTime, 1000);
updateTime();

// Hava Durumu Güncelleme
async function havadurumu(city) {
  try {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&days=1&lang=tr`);
    const data = await response.json();

    document.querySelector(".location").textContent = `📍 ${data.location.name}`;
    document.querySelector(".current-temp").textContent = `${data.current.temp_c}°C`;
    document.querySelector(".feels-like").textContent = `Hissedilen: ${data.current.feelslike_c}°C`;
    document.querySelector(".condition span").textContent = data.current.condition.text;
    document.querySelector(".condition img").src = `https:${data.current.condition.icon}`;

    document.querySelector(".humidity").textContent = `%${data.current.humidity}`;
    document.querySelector(".wind").textContent = `${data.current.wind_kph} kph`;
    document.querySelector(".pressure").textContent = data.current.pressure_mb;
    document.querySelector(".uvs").textContent = data.current.uv;
    document.querySelector(".sunrise-time").textContent = data.forecast.forecastday[0].astro.sunrise;
    document.querySelector(".sunset-time").textContent = data.forecast.forecastday[0].astro.sunset;
  } catch (error) {
    alert("Hava durumu yüklenemedi.");
    console.error(error);
  }
}

// Haftalık Tahmin
async function haftaliktahmin(city) {
  try {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&days=7&lang=tr`);
    const data = await response.json();

    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach((day) => {
      const dayCard = document.createElement("div");
      dayCard.className = "forecast-day";
      dayCard.innerHTML = `
        <div class="forecast-day-row">
          <div class="date">${new Date(day.date).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" })}</div>
          <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="small-icon">
          <div class="temps">
            <span class="max-temp">${day.day.mintemp_c}°C</span> /
            <span class="min-temp">${day.day.maxtemp_c}°C</span>
          </div>
        </div>
      `;

      forecastContainer.appendChild(dayCard);
    });
  } catch (error) {
    alert("Haftalık tahmin yüklenemedi.");
    console.error(error);
  }
}

// Saatlik Hava Durumu
let hourlyWeather = [];
let counter = 0;

async function saatlikhavadurumu(city) {
  try {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}&days=1&lang=tr`);
    const data = await response.json();

    hourlyWeather = data.forecast.forecastday[0].hour;
    counter = 0;
    kartyap();
  } catch (error) {
    alert("Saatlik hava durumu yüklenemedi.");
    console.error(error);
  }
}

function kartyap() {
  const hourlyContainer = document.querySelector(".cards-container");
  hourlyContainer.innerHTML = "";

  const saatlikveri = hourlyWeather.slice(counter, counter + 8);

  saatlikveri.forEach((hour) => {
    const time = new Date(hour.time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    weatherCard.innerHTML = `
      <p class="time">${time}</p>
      <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" class="weather-icon">
      <p class="temperature">${hour.temp_c}°</p>
      <div class="wind-info">
        <img src="wind-direction-icon.svg" alt="Rüzgar Yönü" class="wind-icon">
        <p>${hour.wind_kph} km/h</p>
      </div>
    `;

    hourlyContainer.appendChild(weatherCard);
  });
}

function siradaki() {
  if (counter + 8 < hourlyWeather.length) {
    counter += 8; 
    kartyap();
  }
}

function önceki() {
  if (counter - 8 >= 0) {
    counter -= 8; 
    kartyap();
  }
}

// Şehir Seçimi
saatlikhavadurumu("Ankara");
havadurumu("Ankara");
haftaliktahmin("Ankara");

document.querySelectorAll(".tabs span").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tabs span").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const city = tab.textContent;
    havadurumu(city);
    haftaliktahmin(city);
    saatlikhavadurumu(city);
  });
});

document.querySelector(".arrow-left").addEventListener("click", önceki);
document.querySelector(".arrow-right").addEventListener("click", siradaki);

// Arama Çubuğu
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    havadurumu(city);
    haftaliktahmin(city);
    saatlikhavadurumu(city);  
  }
});
const starsContainer = document.querySelector('.stars-container');

// Rastgele yıldız oluşturma
function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');

    // Yıldızların rastgele bir noktada görünmesi
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    // Yıldız boyutları
    const size = Math.random() * 3 + 10; // 2px ile 5px arasında boyut
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;  

    // Yıldızın arka planda görünmesini sağla
    starsContainer.appendChild(star);

    // Belirli bir süre sonra yıldızı kaldır
    setTimeout(() => star.remove(), 8000);
}

// Yıldızları düzenli olarak oluşturma
setInterval(() => createStar(), 400); // Her 400ms'de bir yeni yıldız ekle
