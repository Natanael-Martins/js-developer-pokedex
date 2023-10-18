const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
let modalContainer = document.getElementById('modalContainer');
let modalContent;

// Função para inicializar os elementos do modal
function initializeModal() {
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modalContainer';
        document.body.appendChild(modalContainer);
    }

    modalContent = document.createElement('div');
    modalContent.id = 'modalContent';
    modalContainer.appendChild(modalContent);
}

// Chame a função de inicialização no início do script
initializeModal();

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon pokemon-card ${pokemon.type}" onclick="showPokemonDetails(${pokemon.number}, '${pokemon.photo}')">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </li>
    `
}

function showPokemonDetails(pokemonNumber, pokemonPhoto) {
    pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/` })
        .then((selectedPokemon) => {
            const modalContentHtml = `
                <div class="modal">
                    <div class="modal-content">
                        <h2>${selectedPokemon.name} - #${selectedPokemon.number}</h2>
                        <img src="${pokemonPhoto}" alt="${selectedPokemon.name}">
                        <p>Attack: ${selectedPokemon.attack}</p>
                        <p>Defense: ${selectedPokemon.defense}</p>
                        <p>Power Level: ${selectedPokemon.powerLevel}</p>
                        <p>Special: ${selectedPokemon.special}</p>
                        <button onclick="closeModal()">Fechar</button>
                    </div>
                </div>
            `;

            modalContent.innerHTML = modalContentHtml;
            modalContainer.style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao obter detalhes do Pokémon:', error);
        });
}

function closeModal() {
    modalContainer.style.display = 'none';
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit)
        .then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
        });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
