// --- Módulo de Lógica de Busca ---

let games = []; // Cache para armazenar os dados dos jogos.
let genres = new Set(); // Cache para armazenar os gêneros únicos.

/**
 * Carrega os dados dos jogos do arquivo JSON.
 * Usa um cache para evitar múltiplas requisições de rede.
 */
async function loadGames() {
    if (games.length === 0) {
        try {
            const response = await fetch('js/data/games.json');
            if (!response.ok) throw new Error('Falha ao carregar os dados dos jogos.');
            games = await response.json();
            
            // Extrai todos os gêneros e os armazena em um Set para garantir valores únicos.
            games.forEach(game => game.genre.forEach(g => genres.add(g)));
        } catch (error) {
            console.error(error);
            games = []; // Em caso de erro, garante que o array esteja vazio.
        }
    }
}

/**
 * Retorna todos os jogos/projetos.
 * @returns {Promise<Array>} - Uma promessa que resolve para um array de todos os jogos.
 */
export async function getAllProjects() {
    await loadGames();
    return games;
}

/**
 * Busca jogos por título, descrição ou gênero.
 * @param {string} term - O termo a ser buscado.
 * @returns {Promise<Array>} - Uma promessa que resolve para um array de jogos.
 */
export async function searchGames(term) {
    await loadGames();
    const lowerCaseTerm = term.toLowerCase();
    return games.filter(game => 
        game.title.toLowerCase().includes(lowerCaseTerm) ||
        game.description.toLowerCase().includes(lowerCaseTerm) ||
        game.genre.some(g => g.toLowerCase() === lowerCaseTerm)
    );
}

/**
 * Retorna uma lista de todos os gêneros únicos.
 * @returns {Promise<Array>} - Uma promessa que resolve para um array de strings de gênero.
 */
export async function getAllGenres() {
    await loadGames();
    return Array.from(genres); // Converte o Set de gêneros para um Array.
}