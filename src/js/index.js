import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * Global state of the app:
 * - Search object;
 * - Current recipe object;
 * - Shopping list object;
 * - Liked recipes.
 */
const state = {};

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
        // 4. Search for recipes
        await state.search.getResults();
        // 5. Render results to UI
        clearLoader();
        searchView.renderResults(state.search.result);

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
