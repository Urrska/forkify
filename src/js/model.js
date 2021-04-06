import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // prettyfy the response object that contains all the data I need
    state.recipe = createRecipeObject(data);
    // check if current state already includes a bookmark and set it accordingly
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    const searchData = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.results = searchData.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
}

export function getSearchResultsPerPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resPerPage;
  const end = page * state.search.resPerPage;
  return state.search.results.slice(start, end);
}

export function updateServing(newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
  });
  state.recipe.servings = newServing;
}

function persistBookmark() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

//add bookmark to the state bookmark []
// mark the current recipe as bookmarked if the cur recipe is the same as the recipe in the input of the f()
export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
}

export function removeBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
}

export async function uploadRecipe(newRecipe) {
  // take raw data and transform it into API acceptable data
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Please, use the correct ingredient format.');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();
