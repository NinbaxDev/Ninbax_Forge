// Importa a função de busca e os dados dos jogos.
// Assumimos que os dados estão em `games.json` e a lógica de busca pode ser modularizada.
import { searchGames, getAllGenres, getAllProjects } from './search.js';

// --- Seletores de Elementos DOM ---
const searchButton = document.getElementById('botao-busca');
const searchInput = document.getElementById('busca');
const resultsContainer = document.getElementById('resultados-busca');
const aboutSection = document.querySelector('.about-section');
const filterJogosBtn = document.getElementById('filter-jogos');
const filterPluginsBtn = document.getElementById('filter-plugins');
const showAboutBtn = document.getElementById('show-about');
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const showContactBtn = document.getElementById('show-contact');
const contactOverlay = document.getElementById('contact-overlay');
const closeContactBtn = document.getElementById('close-contact');

/**
 * Função principal que executa a busca e atualiza a interface.
 * É chamada ao clicar no botão de busca ou pressionar Enter.
 */
async function performSearch() {
    const searchTerm = searchInput.value.trim(); // Pega o valor do input e remove espaços extras

    // Se o campo de busca estiver vazio, não faz nada.
    if (!searchTerm) {
        resetToAboutView();
        return;
    }
    // Limpa os resultados anteriores antes de uma nova busca.
    aboutSection.style.display = 'none'; // Esconde a seção "Sobre mim"
    resultsContainer.innerHTML = '';

    // Realiza a busca usando a função importada.
    const results = await searchGames(searchTerm);

    // Verifica se a busca retornou resultados.
    if (results.length > 0) {
        displayResults(results); // Se sim, exibe os resultados.
    } else {
        displayNoResults(); // Se não, exibe a mensagem de "nenhum resultado" e as sugestões.
    }
}

/**
 * Exibe os resultados da busca na página.
 * @param {Array} results - Um array de objetos de jogo que correspondem à busca.
 */
function displayResults(results) {
    // Cria um fragmento de documento para otimizar a manipulação do DOM.
    const fragment = document.createDocumentFragment();

    results.forEach(game => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h2>${game.title}</h2>
            <p>${game.description}</p>
            <p><strong>Gênero:</strong> ${game.genre.join(', ')}</p>
            <a href="pages/${game.page}" class="saiba-mais">Saiba mais →</a>
        `;
        fragment.appendChild(article);
    });

    resultsContainer.appendChild(fragment);
}

/**
 * Exibe uma mensagem indicando que nenhum resultado foi encontrado
 * e mostra sugestões de busca.
 */
async function displayNoResults() {
    const allGenres = await getAllGenres(); // Pega todos os gêneros únicos.

    // Cria o HTML para a mensagem e as sugestões.
    resultsContainer.innerHTML = `
        <div class="search-message">
            <p>Nenhum resultado encontrado para "${searchInput.value}".</p>
            <p>Tente buscar por um gênero:</p>
            <div class="suggestions-container">
                ${allGenres.map(genre => `<span class="suggestion">${genre}</span>`).join('')}
            </div>
        </div>
    `;

    // Adiciona eventos de clique para cada botão de sugestão.
    document.querySelectorAll('.suggestion').forEach(suggestionEl => {
        suggestionEl.addEventListener('click', () => {
            searchInput.value = suggestionEl.textContent; // Preenche o campo de busca com a sugestão.
            performSearch(); // Realiza a busca automaticamente.
        });
    });
}

/**
 * Filtra e exibe projetos com base em uma categoria (Jogos ou Plugins).
 * @param {string} category - A categoria para filtrar ('jogos' ou 'plugins').
 */
async function filterAndDisplay(category) {
    const allProjects = await getAllProjects();
    let filteredProjects = [];

    if (category === 'jogos') {
        // Filtra por projetos que NÃO têm o gênero 'Plugin'
        filteredProjects = allProjects.filter(project => !project.genre.includes('Plugin'));
    } else if (category === 'plugins') {
        // Filtra por projetos que TÊM o gênero 'Plugin'
        filteredProjects = allProjects.filter(project => project.genre.includes('Plugin'));
    }

    // Limpa a área de resultados e esconde a seção "Sobre mim"
    resultsContainer.innerHTML = '';
    aboutSection.style.display = 'none';

    if (filteredProjects.length > 0) {
        displayResults(filteredProjects);
    } else {
        resultsContainer.innerHTML = `<div class="search-message"><p>Nenhum item encontrado para esta categoria.</p></div>`;
    }

    // Fecha a sidebar após o clique
    sidebar.classList.remove('open');
    menuBtn.style.left = '1rem';
}

/**
 * Reseta a visualização para o estado inicial, mostrando a seção "Sobre mim".
 */
function resetToAboutView() {
    resultsContainer.innerHTML = '';
    aboutSection.style.display = 'flex'; // 'flex' é o display original da seção
    searchInput.value = ''; // Limpa o campo de busca

    // Fecha a sidebar se estiver aberta
    sidebar.classList.remove('open');
    menuBtn.style.left = '1rem';
}

// --- Event Listeners ---

// 1. Evento de clique no botão de busca.
searchButton.addEventListener('click', performSearch);

// 2. Evento para buscar ao pressionar "Enter" no campo de input.
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// 3. Evento de clique para o botão "Início" na sidebar.
showAboutBtn.addEventListener('click', resetToAboutView);

// 4. Eventos de clique para os filtros da sidebar.
filterJogosBtn.addEventListener('click', () => filterAndDisplay('jogos'));
filterPluginsBtn.addEventListener('click', () => filterAndDisplay('plugins'));


// 3. Evento para controlar a abertura/fechamento da sidebar.
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    // Move o botão junto com a sidebar
    if (sidebar.classList.contains('open')) {
        menuBtn.style.left = '210px';
        menuBtn.title = 'Fechar menu';
    } else {
        menuBtn.style.left = '1rem';
        menuBtn.title = 'Abrir menu';
    }
});

// --- Lógica do Overlay de Contato ---

// 1. Mostra o overlay ao clicar em "Contato"
showContactBtn.addEventListener('click', () => {
    contactOverlay.style.display = 'flex';
    // Fecha a sidebar ao abrir o contato
    sidebar.classList.remove('open');
    menuBtn.style.left = '1rem';
    menuBtn.title = 'Abrir menu';
});

// 2. Fecha o overlay ao clicar no botão 'x'
closeContactBtn.addEventListener('click', () => {
    contactOverlay.style.display = 'none';
});

// 3. Fecha o overlay ao clicar fora da caixa de conteúdo
contactOverlay.addEventListener('click', (event) => {
    if (event.target === contactOverlay) { // Verifica se o clique foi no fundo do overlay
        contactOverlay.style.display = 'none';
    }
});

// Lógica para fechar a sidebar se clicar fora dela
document.addEventListener('click', (event) => {
    // Verifica se o clique foi fora da sidebar e do botão de menu
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        menuBtn.style.left = '1rem';
        menuBtn.title = 'Abrir menu';
    }
});