import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from "./views/searchView";
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * Global state of the app:
 * - Search object;
 * - Current recipe object;
 * - Shopping list object;
 * - Liked recipes.
 */
const state = {};

/**
* SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1. Get the query from the view
    const query = searchView.getInput();

    if(query) {
        // 2. Create new search object and add it to state
        state.search = new Search(query);
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearPreviousResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();
            // 5. Render results to UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert("Somwething went wrong with the search.");
            clearLoader();
        }

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline');
    if(button) {
        //dataset.goto is the data-goto attribute of the <button>
        //(see html in views/searchView.js createPaginationButton())
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearPreviousResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
* RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    //We are getting ID from URL and removing # from it
    let id = window.location.hash.replace("#", "");
    if(id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create new Recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(error) {
            alert(error);
        }
    }
};

//We are getting new recipe whenever new hash is detected in URL
//window.addEventListener("hashchange", controlRecipe);
//We are getting recipe whenever hash is detected in URL during
//the window.load event (for example if user has bookmarked page)
//window.addEventListener("load", controlRecipe);

//Instead of 2 lines of code above we can have one below:
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));
