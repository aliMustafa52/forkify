import { MODAL_CLOSE_SEC } from './config';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import icons from 'url:../img/icons.svg';
// icons is the path to the file
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //0) show spinner
    recipeView.renderSpinner();
    // 1)load recipe
    await model.loadRecipe(id);

    //2) render recipe
    recipeView.render(model.state.recipe);

    // 3) update the search results
    resultsView.update(model.getSearchResultsPage());

    // 4) update the bookmarks
    bookmarkView.update(model.state.bookmarks);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    //1) get query from search inpu
    const query = searchView.getQuery();
    if (!query) return;

    //2) show spinner
    resultsView.renderSpinner();

    // 3)load search results
    await model.loadSearchResults(query);

    //4) render search results
    resultsView.render(model.getSearchResultsPage());

    //5) render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError();
  }
}

function controlPagination(page) {
  //1) render new search results
  resultsView.render(model.getSearchResultsPage(page));

  //2) render new pagination
  paginationView.render(model.state.search);
}

function controlServings(newNumOfServing) {
  //1) update recipe seriving in the state
  model.updateServings(newNumOfServing);
  //2)update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmarks() {
  // add or remove bookmark
  if (model.state.recipe.isBookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  //update recipeview
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
}

function controlRenderBookmarks() {
  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
}
async function controlAddRecipe(newRecipe) {
  try {
    //0) show spinner
    addRecipeView.renderSpinner();

    //1) upload new Recipe
    await model.uploadRecipe(newRecipe);

    // 2)render new Recipe
    recipeView.render(model.state.recipe);

    //3) add recipe id to the url
    // window.location.hash = `#${model.state.recipe.id}`;
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //4) show success message and close form window
    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //5) render bookmarks
    bookmarkView.render(model.state.bookmarks);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}

function init() {
  recipeView.addHandlerRecipes(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  bookmarkView.addHanlerRender(controlRenderBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
