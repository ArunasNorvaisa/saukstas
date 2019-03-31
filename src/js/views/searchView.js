import { elements } from './base';

export const getInput = () => encodeURIComponent(elements.searchInput.value);

export const clearInput = () => { elements.searchInput.value = ''; };

export const clearPreviousResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

//We are highlighting an active search result
export const highlightSelected = id => {
    //First, we make an array from all search results
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    //Then, we remove an 'active' class - if found
    resultsArray.forEach(el => {
        el.classList.remove('results__link--active');
    });
    //Last, we add an 'active' class to the selected id
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// We're cutting the title to the desired length so it will take one line only
const limitRecipeTitleLength = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};


const renderRecipe = recipe => {
    const html = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitleLength(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', html);
};

const createPaginationButton = (page, type) => {
    return `<button
    class="btn-inline results__btn--${type}"
    data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}">
            </use>
        </svg>
    </button>`;
};

const renderPaginationButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage);
    let button;
    if(page === 1 && pages > 1) {
        //Only button to go to the next page
        button = createPaginationButton(page, 'next');
    } else if(page < pages) {
        //Buttons to go to the previous/next page
        button = `
            ${createPaginationButton(page, 'prev')}
            ${createPaginationButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1) {
        //Only button to go to the previous page
        button = createPaginationButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderPaginationButtons(page, recipes.length, resultsPerPage);
};

