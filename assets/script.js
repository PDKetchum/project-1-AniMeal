// // Create a search button
var $searchButton = $("#search-button");
var $animeCardBody = $("#anime-card-body");
var $userInputEl = $("#user-input");
var $recipeBody = $("#recipe-body");
var $recipeList = $("#recipe-list");
var $recipeImg = $("#recipe-img");
var $recipeName = $("#recipe-name");
var anime;

// Create a function that will fetch the API data from Jikan
// create a function that will display the search result
// Included in the search card:
// Image of Anime poster data - images - large image url
// sypnoisis
// title

displaySuggestions();

function searchAnime(anime) {
  var animeUrl = "https://api.jikan.moe/v4/anime?q=" + anime;
  console.log(animeUrl);

  fetch(animeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $animeCardBody.empty();
      var title = data.data[0].title_english;
      var synopsis = data.data[0].synopsis;
      var poster = data.data[0].images.jpg.large_image_url;

      var imageEl = $("<img>");
      var titleEl = $("<h3>");
      var synopsisEl = $("<p>");

      titleEl.text(title);
      synopsisEl.text(synopsis);
      imageEl.attr("src", poster);

      $animeCardBody.append(imageEl, titleEl, synopsisEl);
    });
}

$searchButton.on("click", printSearch);
function printSearch() {
  replaceCharacters();
  searchAnime(anime);
  randomRecipe();
  savePastSearches(anime);
}

$userInputEl.keydown(function (evt) {
  if (evt.keyCode === 13) {
    printSearch();
  }
});

function replaceCharacters() {
  anime = $userInputEl.val().replace(" ", "-");
}

// Create a function that displays 6 anime suggestions
// Fetch from the Jikan API random
// create a for loop that will grab 6 anime suggestions
// in the for loop, create elements for a card for the anime info to append to
// in the for loop append the anime card to the html body

function displaySuggestions() {
  var suggestionsUrl = "https://api.jikan.moe/v4/top/anime?page=1";
  console.log(suggestionsUrl);

  fetch(suggestionsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $animeCardBody.empty();

      for (var i = 0; i < 6; i++) {
        var suggestionTitle = data.data[i].title_english;
        var suggestionPoster = data.data[i].images.jpg.large_image_url;

        var suggestionImageEl = $("<img>");
        var suggestionTitleEl = $("<h3>");

        suggestionTitleEl.text(suggestionTitle);
        suggestionImageEl.attr("src", suggestionPoster);

        $animeCardBody.append(suggestionImageEl, suggestionTitleEl);
      }
    });
}

// create a API fetch function for recipies
// have the recipies randomized
// target the data info needed
// create elements for the recipie data to append to
// append the recipe to html body

// This is technically done but could be better
function randomRecipe() {
  var mealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
  console.log(mealUrl);

  fetch(mealUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $recipeBody.empty();
      var mealTitle = data.meals[0].strMeal;
      var instructions = data.meals[0].strInstructions;
      var mealImg = data.meals[0].strMealThumb;

      var mealImgEl = $("<img>");
      var instrEl = $("<p>");
      var mealEl = $("<h1>");

      mealEl.text(mealTitle);
      instrEl.text(instructions);
      mealImgEl.attr("src", mealImg);
      

      $recipeBody.append(mealImgEl, mealEl, instructions);

      // Array is here to store locally every time
      var recipe = [];

      console.log(data.meals[0]);
      for (var i = 1; i <= 20; i++) {
        var ingredients = "strIngredient" + i;
        var measure = "strMeasure" + i;
        var meal = data.meals[0];

        // This gets rid of any empty sting/'null'
        if (meal[ingredients] != null && meal[ingredients].length != 0) {
          console.log(meal[ingredients], meal[measure]);
          recipe.push({
            ingredient: meal[ingredients],
            measure: meal[measure],
          });
        }
      }
      console.log(recipe);
    });
}

// Create a function that will store recent saves
function saveRecentSearches(anime) {
  var recentSearch = anime.toUpperCase();
  var recentSearches = localStorage.getItem("RecentSearches");
  if (recentSearches) {
    recentSearches = JSON.parse(recentSearches);
  } else {
    searches = [];
  }

  searches.push(search);

  localStorage.setItem("searches", JSON.stringify(searches));
}

// Create a function that will display recent searches when typing in the search bar
function displayPastSearches() {
  var pastSearches = JSON.parse(localStorage.getItem("searches"));
  $("#user-input").empty;
  $(function () {
    var availableTags = pastSearches;
    $("#user-input").autocomplete({
      source: availableTags,
    });
  });
}

displayPastSearches();
