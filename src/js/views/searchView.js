import { elements } from './base';

export const getInput = () => encodeURIComponent(elements.searchInput.value);

export const clearInput = () => { elements.searchInput.value = ''; };

export const clearPreviousResults = () => {
    elements.searchResList.innerHTML = '';
};

const limitRecipeTitleLength = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        console.log('newTitle:', newTitle)
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

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
}
