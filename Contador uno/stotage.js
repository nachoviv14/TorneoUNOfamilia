/**
 * Manejo del almacenamiento local para persistencia de datos
 */

/**
 * Guarda el estado completo del juego
 * @param {number} tableNum - Número de mesa (1, 2 o 'final')
 * @param {object} gameData - Datos del juego a guardar
 */
function saveGameState(tableNum, gameData) {
    try {
        localStorage.setItem(`unoGameTable${tableNum}`, JSON.stringify(gameData));
        return true;
    } catch (e) {
        console.error('Error al guardar el juego:', e);
        return false;
    }
}

/**
 * Carga el estado guardado del juego
 * @param {number} tableNum - Número de mesa (1, 2 o 'final')
 * @returns {object|null} Datos del juego o null si no hay datos guardados
 */
function loadGameState(tableNum) {
    try {
        const savedData = localStorage.getItem(`unoGameTable${tableNum}`);
        return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
        console.error('Error al cargar el juego:', e);
        return null;
    }
}

/**
 * Elimina los datos guardados de una mesa
 * @param {number} tableNum - Número de mesa (1, 2 o 'final')
 */
function clearGameState(tableNum) {
    localStorage.removeItem(`unoGameTable${tableNum}`);
}

/**
 * Comprueba si hay datos guardados para alguna mesa
 * @returns {boolean} True si hay datos guardados
 */
function hasSavedGames() {
    return localStorage.getItem('unoGameTable1') !== null || 
           localStorage.getItem('unoGameTable2') !== null ||
           localStorage.getItem('unoGameTablefinal') !== null;
}

export { saveGameState, loadGameState, clearGameState, hasSavedGames };