document.addEventListener('DOMContentLoaded', () => {
    displayRandomProject();
});

async function displayRandomProject() {
    try {
        const response = await fetch('./js/data/games.json');
        if (!response.ok) {
            throw new Error(`Erro ao buscar projetos: ${response.status}`);
        }
        const projects = await response.json();

        if (projects && projects.length > 0) {
            const randomIndex = Math.floor(Math.random() * projects.length);
            const project = projects[randomIndex];
            
            const resultsContainer = document.getElementById('resultados-busca');
            resultsContainer.innerHTML = createProjectCard(project);
        }
    } catch (error) {
        console.error('Falha ao exibir projeto aleatório:', error);
        const resultsContainer = document.getElementById('resultados-busca');
        resultsContainer.innerHTML = '<p>Não foi possível carregar um projeto. Tente novamente mais tarde.</p>';
    }
}

function createProjectCard(project) {
    return `
        <div class="card">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <a href="pages/${project.page}" class="card-link">Ver Projeto</a>
        </div>
    `;
}