// Configuración inicial
const PLAYERS = {
    table1: [
        { id: 'silvia', name: 'Silvia', avatar: 'Silvia.png' },
        { id: 'pato', name: 'Pato', avatar: 'Pato.png' },
        { id: 'sofia', name: 'Sofia', avatar: 'Sofia.png' },
        { id: 'africa', name: 'Africa', avatar: 'Africa.png' },
        { id: 'jorge', name: 'Jorge', avatar: 'jorge.png' },
        { id: 'martin', name: 'Martin', avatar: 'martin.png' },
        { id: 'andres', name: 'Andres', avatar: 'andres.png' },
        { id: 'thomas', name: 'Thomas', avatar: 'thomas.png' },
        { id: 'nacho', name: 'Nacho', avatar: 'nacho.png' },
    ],
    table2: [
        { id: 'silvia', name: 'Silvia', avatar: 'Silvia.png' },
        { id: 'pato', name: 'Pato', avatar: 'Pato.png' },
        { id: 'sofia', name: 'Sofia', avatar: 'Sofia.png' },
        { id: 'africa', name: 'Africa', avatar: 'Africa.png' },
        { id: 'jorge', name: 'Jorge', avatar: 'jorge.png' },
        { id: 'martin', name: 'Martin', avatar: 'martin.png' },
        { id: 'andres', name: 'Andres', avatar: 'andres.png' },
        { id: 'thomas', name: 'Thomas', avatar: 'thomas.png' },
        { id: 'nacho', name: 'Nacho', avatar: 'nacho.png' },
    ],
    tableFinal: [
        { id: 'silvia', name: 'Silvia', avatar: 'Silvia.png' },
        { id: 'pato', name: 'Pato', avatar: 'Pato.png' },
        { id: 'sofia', name: 'Sofia', avatar: 'Sofia.png' },
        { id: 'africa', name: 'Africa', avatar: 'Africa.png' },
        { id: 'jorge', name: 'Jorge', avatar: 'jorge.png' },
        { id: 'martin', name: 'Martin', avatar: 'martin.png' },
        { id: 'andres', name: 'Andres', avatar: 'andres.png' },
        { id: 'thomas', name: 'Thomas', avatar: 'thomas.png' },
        { id: 'nacho', name: 'Nacho', avatar: 'nacho.png' },
    ]
};

// Variables de estado
let currentTable = 1;
let gameState = {
    table: null,
    players: [],
    limit: 301,
    rounds: [],
    totals: {}
};

// Elementos del DOM
const elements = {
    tableBtns: document.querySelectorAll('.table-btn'),
    playersContainer: document.getElementById('players-container'),
    startGameBtn: document.getElementById('start-game'),
    setupPanel: document.querySelector('.setup-panel'),
    gameBoard: document.querySelector('.game-board'),
    currentTableDisplay: document.getElementById('current-table'),
    currentLimitDisplay: document.getElementById('current-limit'),
    scoreboard: document.getElementById('scoreboard'),
    addRoundBtn: document.getElementById('add-round'),
    resetGameBtn: document.getElementById('reset-game'),
    limitOptions: document.querySelectorAll('input[name="limit"]')
};

// Inicialización
function init() {
    setupEventListeners();
    loadTablePlayers(1);
    checkSavedGame();
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de mesa
    elements.tableBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tableNum = btn.dataset.table;
            currentTable = tableNum;
            loadTablePlayers(tableNum);
            
            elements.tableBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Iniciar juego
    elements.startGameBtn.addEventListener('click', startGame);

    // Agregar ronda
    elements.addRoundBtn.addEventListener('click', addRound);

    // Reiniciar juego
    elements.resetGameBtn.addEventListener('click', resetGame);

    // Guardar puntos al cambiar
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('points-input')) {
            updateTotals();
            saveGameState();
        }
    });

    // Validar inputs
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('points-input')) {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        }
    });
}

// Cargar jugadores de la mesa seleccionada
function loadTablePlayers(tableNum) {
    elements.playersContainer.innerHTML = '';
    const players = 
        tableNum === '1' ? PLAYERS.table1 : 
        tableNum === '2' ? PLAYERS.table2 : 
        PLAYERS.tableFinal;
    
    players.forEach(player => {
        const playerEl = document.createElement('div');
        playerEl.className = 'player-option';
        playerEl.dataset.id = player.id;
        
        playerEl.innerHTML = `
            <div class="player-avatar" style="background-image: url('${player.avatar}')">
                ${player.avatar ? '' : player.name.charAt(0)}
            </div>
            <div class="player-name">${player.name}</div>
        `;
        
        playerEl.addEventListener('click', () => {
            playerEl.classList.toggle('selected');
        });
        
        elements.playersContainer.appendChild(playerEl);
    });
}

// Comenzar el juego
function startGame() {
    const selectedPlayers = Array.from(document.querySelectorAll('.player-option.selected'));
    const limit = document.querySelector('input[name="limit"]:checked').value;
    
    const requiredPlayers = 
        currentTable === '1' ? 5 : 
        currentTable === '2' ? 4 : 6;
    
    if (selectedPlayers.length !== requiredPlayers) {
        alert(`Debes seleccionar exactamente ${requiredPlayers} jugadores para esta mesa.`);
        return;
    }
    
    // Configurar estado del juego
    gameState = {
        table: currentTable,
        players: selectedPlayers.map(el => {
            const id = el.dataset.id;
            const playerData = 
                currentTable === '1' ? PLAYERS.table1.find(p => p.id === id) : 
                currentTable === '2' ? PLAYERS.table2.find(p => p.id === id) : 
                PLAYERS.tableFinal.find(p => p.id === id);
            return {
                id,
                name: playerData.name,
                avatar: playerData.avatar
            };
        }),
        limit: parseInt(limit),
        rounds: [],
        totals: {}
    };
    
    // Inicializar totales
    gameState.players.forEach(player => {
        gameState.totals[player.id] = 0;
    });
    
    // Actualizar UI
    elements.currentTableDisplay.textContent = `Mesa ${currentTable === 'final' ? 'FINAL' : currentTable}`;
    elements.currentLimitDisplay.textContent = limit;
    elements.setupPanel.classList.add('hidden');
    elements.gameBoard.classList.remove('hidden');
    
    // Renderizar tablero
    renderScoreboard();
    saveGameState();
}

// Renderizar el tablero de puntuación
function renderScoreboard() {
    // Limpiar tablero
    elements.scoreboard.innerHTML = '';
    
    // Crear filas de jugadores
    gameState.players.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.className = `player-row ${gameState.totals[player.id] >= gameState.limit ? 'eliminated' : ''}`;
        playerRow.dataset.playerId = player.id;
        
        // Celda de información del jugador
        const playerInfoCell = document.createElement('div');
        playerInfoCell.className = 'player-info-cell';
        
        const avatar = document.createElement('div');
        avatar.className = 'player-avatar-sm';
        avatar.style.backgroundImage = player.avatar ? `url('${player.avatar}')` : 'none';
        if (!player.avatar) {
            avatar.textContent = player.name.charAt(0);
        }
        
        const name = document.createElement('div');
        name.className = 'player-name-sm';
        name.textContent = player.name;
        
        playerInfoCell.appendChild(avatar);
        playerInfoCell.appendChild(name);
        
        // Celda de total
        const totalCell = document.createElement('div');
        totalCell.className = 'points-cell';
        totalCell.textContent = gameState.totals[player.id];
        
        playerRow.appendChild(playerInfoCell);
        playerRow.appendChild(totalCell);
        
        // Celdas de rondas
        gameState.rounds.forEach((round, roundIndex) => {
            const roundCell = document.createElement('div');
            roundCell.className = 'round-cell';
            
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.className = 'points-input';
            input.dataset.playerId = player.id;
            input.dataset.roundIndex = roundIndex;
            input.value = round[player.id] || '';
            
            roundCell.appendChild(input);
            playerRow.appendChild(roundCell);
        });
        
        elements.scoreboard.appendChild(playerRow);
    });
    
    // Actualizar encabezado de rondas
    updateRoundHeaders();
}

// Actualizar encabezados de rondas
function updateRoundHeaders() {
    const header = document.querySelector('.scoreboard-header');
    
    // Limpiar encabezados de rondas existentes
    const existingRoundHeaders = document.querySelectorAll('.round-header');
    existingRoundHeaders.forEach(el => el.remove());
    
    // Agregar nuevos encabezados
    gameState.rounds.forEach((_, index) => {
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.textContent = `Ronda ${index + 1}`;
        header.appendChild(roundHeader);
    });
}

// Agregar nueva ronda
function addRound() {
    const newRound = {};
    gameState.players.forEach(player => {
        newRound[player.id] = 0;
    });
    
    gameState.rounds.push(newRound);
    renderScoreboard();
    saveGameState();
}

// Actualizar totales
function updateTotals() {
    // Resetear totales
    gameState.players.forEach(player => {
        gameState.totals[player.id] = 0;
    });
    
    // Calcular nuevos totales
    gameState.rounds.forEach((round, roundIndex) => {
        gameState.players.forEach(player => {
            const input = document.querySelector(`.points-input[data-player-id="${player.id}"][data-round-index="${roundIndex}"]`);
            const points = parseInt(input.value) || 0;
            round[player.id] = points;
            gameState.totals[player.id] += points;
        });
    });
    
    // Actualizar UI
    gameState.players.forEach(player => {
        const totalCell = document.querySelector(`.player-row[data-player-id="${player.id}"] .points-cell`);
        totalCell.textContent = gameState.totals[player.id];
        
        const playerRow = document.querySelector(`.player-row[data-player-id="${player.id}"]`);
        if (gameState.totals[player.id] >= gameState.limit) {
            playerRow.classList.add('eliminated');
        } else {
            playerRow.classList.remove('eliminated');
        }
    });
}

// Reiniciar juego
function resetGame() {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego? Se perderán todos los datos.')) {
        localStorage.removeItem(`unoGameTable${currentTable}`);
        gameState = {
            table: null,
            players: [],
            limit: 301,
            rounds: [],
            totals: {}
        };
        
        elements.gameBoard.classList.add('hidden');
        elements.setupPanel.classList.remove('hidden');
    }
}

// Guardar estado del juego
function saveGameState() {
    localStorage.setItem(`unoGameTable${currentTable}`, JSON.stringify(gameState));
}

// Cargar juego guardado
function checkSavedGame() {
    const savedGame = localStorage.getItem(`unoGameTable${currentTable}`);
    
    if (savedGame) {
        const parsedGame = JSON.parse(savedGame);
        
        if (confirm('Hay un juego guardado para esta mesa. ¿Deseas continuar?')) {
            gameState = parsedGame;
            currentTable = gameState.table;
            
            // Actualizar UI
            elements.currentTableDisplay.textContent = `Mesa ${currentTable === 'final' ? 'FINAL' : currentTable}`;
            elements.currentLimitDisplay.textContent = gameState.limit;
            
            // Seleccionar límite correcto
            elements.limitOptions.forEach(option => {
                if (parseInt(option.value) === gameState.limit) {
                    option.checked = true;
                }
            });
            
            // Seleccionar jugadores
            document.querySelectorAll('.player-option').forEach(option => {
                if (gameState.players.some(p => p.id === option.dataset.id)) {
                    option.classList.add('selected');
                }
            });
            
            elements.setupPanel.classList.add('hidden');
            elements.gameBoard.classList.remove('hidden');
            renderScoreboard();
        } else {
            localStorage.removeItem(`unoGameTable${currentTable}`);
        }
    }
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);