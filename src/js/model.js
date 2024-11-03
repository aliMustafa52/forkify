import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { Ajax } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    pageNumber: 1,
  },
  bookmarks: [],
};

function createRecipeObject(recipe) {
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}
export async function loadRecipe(id) {
  try {
    const data = await Ajax(`${API_URL}${id}?key=${API_KEY}`);
    let { recipe } = data.data;
    console.log(recipe);
    state.recipe = createRecipeObject(recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
      state.recipe.isBookmarked = true;
    else state.recipe.isBookmarked = false;
  } catch (error) {
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    //https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await Ajax(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log(data);

    if (data.data.recipes.length === 0)
      throw new Error(
        "We couldn't find a recipe with this name try another one"
      );
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.pageNumber = 1;
  } catch (error) {
    throw error;
  }
}

export function getSearchResultsPage(pageNumber = state.search.pageNumber) {
  state.search.pageNumber = pageNumber;
  const start = (pageNumber - 1) * state.search.resultsPerPage; // (pageNumber -1) * number of elements per page
  const end = pageNumber * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newNumOfServing) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newNumOfServing;
  });
  state.recipe.servings = newNumOfServing;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export function addBookmark(recipe) {
  // add recipe to bookmarks array
  state.bookmarks.push(recipe);

  //add bookmark to local storage
  persistBookmarks();

  //mark recipe as bookmarked
  if (state.recipe.id === recipe.id) state.recipe.isBookmarked = true;
  console.log(state.recipe);
}

export function deleteBookmark(id) {
  // remove recipe to bookmarks array
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  //remove bookmark to local storage
  persistBookmarks();

  //mark recipe as bookmarked
  if (state.recipe.id === id) state.recipe.isBookmarked = false;
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();

function clearBookmarksItem() {
  localStorage.clear('bookmarks');
}
// clearBookmarksItem();

//{quantity: 2, unit: '', description: 'packages refrigerated crescent rolls'}
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ing') && entry[1] !== '')
      .map(ingredients => {
        const ingredientsArr = ingredients[1].split(',').map(el => el.trim());
        if (ingredientsArr.length !== 3)
          throw new Error('not valid ingredient format');

        const [quantity, unit, description] = ingredientsArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };
    console.log(recipe);
    const data = await Ajax(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data.data.recipe);
    state.recipe.isBookmarked = true;

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
