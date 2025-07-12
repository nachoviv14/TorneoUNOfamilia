document.addEventListener('DOMContentLoaded', function() {
    // Datos de los jugadores (puedes modificarlos o cargarlos desde una API)
    const players = [
        {
            id: 1,
            name: "Silvia",
            points: 12,
            avatar: "Silvia.png",
            lastGames: [6, 5, 1] // Últimos 3 resultados
        },
        {
            id: 2,
            name: "Sofia",
            points: 8,
            avatar: "Sofia.png",
            lastGames: [2, 3, 3]
        },
        {
            id: 3,
            name: "Martin",
            points: 6,
            avatar: "Martin.png",
            lastGames: [1, 2, 3]
        },
        {
            id: 4,
            name: "Andres",
            points: 5,
            avatar: "Andres.png",
            lastGames: [2, 1, 2]
        },
        {
            id: 5,
            name: "Jorge",
            points: 4,
            avatar: "Jorge.png",
            lastGames: [1, 1, 2]
        },
        {
            id: 6,
            name: "Africa",
            points: 3,
            avatar: "Africa.png",
            lastGames: [1, 1, 1]
        },
        {
            id: 7,
            name: "Nacho",
            points: 2,
            avatar: "Nacho.png",
            lastGames: [0, 1, 1]
        },
        {
            id: 8,
            name: "Pato",
            points: 1,
            avatar: "Pato.png",
            lastGames: [0, 0, 1]
        },
        {
            id: 9,
            name: "Thomas",
            points: 0,
            avatar: "Thomas.png",
            lastGames: [0, 0, 0]
        },
        {
            id: 10,
            name: "Proximo Novie",
            points: 0,
            avatar: "Signo2.png",
            lastGames: [0, 0, 0]
        },
        {
            id: 10,
            name: "Proximo Novie",
            points: 0,
            avatar: "Signo2.png",
            lastGames: [0, 0, 0]
        },
        {
            id: 10,
            name: "Proximo Novie",
            points: 0,
            avatar: "Signo2.png",
            lastGames: [0, 0, 0]
        }

    ];

    // Datos de los últimos resultados
    const lastResults = [
        {
            date: "4 Mar 2025",
            players: [
                { name: "Silvia", points: 6, avatar: "Silvia.png" },
                { name: "Sofia", points: 5, avatar: "Sofia.png" },
                { name: "Martin", points: 4, avatar: "Martin.png" },
                { name: "Andres", points: 3, avatar: "Andres.png" },
                { name: "Jorge", points: 2, avatar: "Jorge.png" },
                { name: "Africa", points: 3, avatar: "Africa.png" },
            ]
        },
        {
            date: "10 Ene 2025",
            players: [
                { name: "Silvia", points: 6, avatar: "Silvia.png" },
                { name: "Sofia", points: 5, avatar: "Sofia.png" },
                { name: "Martin", points: 4, avatar: "Martin.png" },
                { name: "Nacho", points: 3, avatar: "Nacho.png" },
                { name: "Africa", points: 2, avatar: "Africa.png" },
                { name: "Pato", points: 1, avatar: "Pato.png"},
            ]
        },
        {
            date: "10 Dic 2024",
            players: [
                { name: "Martin", points: 6, avatar: "Martin.png" },
                { name: "Sofia", points: 5, avatar: "Sofia.png" },
                { name: "EX  ✝", points: 4, avatar: "Signo2.png" },
                { name: "EX  ✝", points: 3, avatar: "signo2.png" },
                { name: "Nacho", points: 2, avatar: "Nacho.png" },
                { name: "Thomas", points: -1, avatar: "Thomas.png" },

            ]
        }
    ];

    // Renderizar tabla de posiciones
    function renderRanking() {
        const container = document.getElementById('ranking-container');
        container.innerHTML = '';

        // Ordenar jugadores por puntos (de mayor a menor)
        const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

        sortedPlayers.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';

            playerCard.innerHTML = `
                <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <div class="player-points">${player.points} puntos</div>
                    <div class="player-last-games">
                        ${player.lastGames.map(points => 
                            `<div class="point-bubble ${points >= 3 ? 'win' : points > 0 ? '' : 'lose'}">${points}</div>`
                        ).join('')}
                    </div>
                </div>
            `;

            container.appendChild(playerCard);
        });
    }

    // Renderizar últimos resultados
    function renderLastResults() {
        const container = document.getElementById('results-container');
        container.innerHTML = '';

        lastResults.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match';

            const playersHTML = match.players.map(player => `
                <div class="match-player">
                    <img src="${player.avatar}" alt="${player.name}" class="match-player-avatar">
                    <span>${player.name}</span>
                    <span class="match-player-points">${player.points} pts</span>
                </div>
            `).join('');

            matchElement.innerHTML = `
                <h3 class="match-date">${match.date}</h3>
                <div class="match-results">
                    ${playersHTML}
                </div>
            `;

            container.appendChild(matchElement);
        });
    }

    // Efecto de scroll para las cruces
    function setupCrossAnimation() {
        const cross1 = document.getElementById('cross-overlay-1');
        const cross2 = document.getElementById('cross-overlay-2');
        const photoContainer = document.querySelector('.family-photo-container');

        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const containerPosition = photoContainer.offsetTop;
            const containerHeight = photoContainer.offsetHeight;
            
            // Cuando el scroll llega al 30% del contenedor, activar animación
            if (scrollPosition > containerPosition - window.innerHeight + containerHeight * 0.3) {
                cross1.style.top = '20%';
                cross2.style.top = '60%';
            }
        });
    }

    // Smooth scrolling para los enlaces del menú
    function setupSmoothScrolling() {
        document.querySelectorAll('.main-nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    }



    // Inicializar todo
    renderRanking();
    renderLastResults();
    setupCrossAnimation();
    setupSmoothScrolling();
});