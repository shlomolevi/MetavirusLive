// Игровые переменные
let gameState = {
    dna: 50,
    infected: 0,
    deaths: 0,
    population: 7_900_000_000,
    upgrades: {
        contagion: 1,
        severity: 1,
        resistance: 1
    },
    countries: []
};

// Инициализация стран
function initCountries() {
    const countries = [
        { name: "Китай", population: 1_400_000_000, infected: 0, health: 3 },
        { name: "Индия", population: 1_300_000_000, infected: 0, health: 2 },
        { name: "США", population: 330_000_000, infected: 0, health: 4 },
        // Добавьте другие страны...
    ];
    gameState.countries = countries;
}

// Покупка улучшений
function buyUpgrade(type) {
    const costs = {
        contagion: 20,
        severity: 30,
        resistance: 25
    };
    
    if (gameState.dna >= costs[type]) {
        gameState.dna -= costs[type];
        gameState.upgrades[type]++;
        updateUI();
    }
}

// Игровой цикл
function gameLoop() {
    // Распространение вируса
    gameState.countries.forEach(country => {
        if (country.infected > 0) {
            // Новые заражения
            const newCases = Math.min(
                Math.floor(country.infected * 0.2 * gameState.upgrades.contagion),
                country.population - country.infected
            );
            country.infected += newCases;
            
            // Смертность
            const newDeaths = Math.floor(country.infected * 0.01 * gameState.upgrades.severity);
            country.infected -= newDeaths;
            gameState.deaths += newDeaths;
        }
    });
    
    // Обновление статистики
    gameState.infected = gameState.countries.reduce((sum, c) => sum + c.infected, 0);
    gameState.dna += Math.floor(gameState.infected / 1_000_000);
    
    updateUI();
    
    // Проверка победы/поражения
    if (gameState.infected >= gameState.population * 0.9) {
        alert("Победа! Весь мир заражён!");
    }
}

// Запуск заражения в стране
function infectCountry(countryIndex) {
    if (gameState.countries[countryIndex].infected === 0) {
        gameState.countries[countryIndex].infected = 1000;
        updateUI();
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('infected').textContent = 
        gameState.infected.toLocaleString();
    document.getElementById('deaths').textContent = 
        gameState.deaths.toLocaleString();
    document.getElementById('dna').textContent = gameState.dna;
}

// Инициализация игры
window.onload = function() {
    initCountries();
    setInterval(gameLoop, 1000); // Игровой цикл каждую секунду
    
    // Начальное заражение
    setTimeout(() => {
        infectCountry(Math.floor(Math.random() * gameState.countries.length));
    }, 1500);
};