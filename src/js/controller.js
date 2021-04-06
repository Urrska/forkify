import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/View.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    //get the hash id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPerPage());
    // update bookmarks so it always shows which one is selected
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPerPage());
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
}

function controlPagination(goToPage) {
  resultsView.render(model.getSearchResultsPerPage(goToPage));
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // change the servings and ingredients amount in the state
  model.updateServing(newServings);
  //render the changed state in the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

//bookmark controller for adding new bookmark
function controlAddBookmark() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //must be else, otherwise  it will always remove the bookmark in the previous if
  else model.removeBookmark(model.state.recipe.id);
  // have to update so the bookmark fill is visible
  recipeView.update(model.state.recipe);
  //render the bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmark() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderSuccess();

    bookmarksView.render(model.state.bookmarks);

    // change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  //add event handler to the buttons --> controlServings f() gets triggered on click
  recipeView.addHandlerUpdateServings(controlServings);
  // call the bookmark event listener
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
