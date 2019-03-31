import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from "./views/searchView";
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
            alert("Something went wrong with the search.");
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
        
        //Highlight selected item
        if(state.search) {
            searchView.highlightSelected(id);
        }

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

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

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //'decrease' button is clicked and servings >= 1
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //'increase' button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Now, we handle adding to favourites
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Handle LIKE button click
        controlLike();
    }
});

/**
* SHOPPING LIST CONTROLLER
*/
const controlList = () => {
    //Create new list, if there is none yet
    if(!state.list) state.list = new List();
    
    //Add each ingredient into the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

//Handle delete and update list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Handling delete event
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count--value')) {
        //handle count update
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
    
});

/**
* LIKES CONTROLLER
*/
state.likes = new Likes(); // JUST FOR TESTING
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.author,
            state.recipe.title,
            state.recipe.img
        );
        
        //Toggle the LIKE button view style
        likesView.toggleLikeBtn(true);
        
        //Add like to the UI
        likesView.renderLike(newLike);
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        
        //Toggle the LIKE button view style
        likesView.toggleLikeBtn(false);
        
        //Remove like from the UI
        likesView.deleteLike(currentID);
    }
    //Handling HEART icon visibility depending on are there likes or not
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};