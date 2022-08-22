// // Create a search button
var $searchButton = $("#search-button");
var $animeCardBodySearch = $("#anime-card-body-search");
var $animeCardBodySuggestions = $("#anime-card-body-suggestions");
var $userInputEl = $("#user-input");
var $recipeBody = $("#recipe-body");
var $recipeList = $("#recipe-list");
var $recipeImg = $("#recipe-img");
var $recipeName = $("#recipe-name");
var $errorModal = $("#errorModal");
var $closeButton = $("#error-modal-close-button");


displaySuggestions();

function searchAnime(anime) {
  if (!anime) {
    animeTitleError();
    return;
  }

  var animeUrl = "https://api.jikan.moe/v4/anime?q=" + anime;

  fetch(animeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.data.length === 0) {
        animeTitleError();
      } else {
        $("#topAnime").empty();
        $animeCardBodySuggestions.empty();
        $animeCardBodySearch.empty();

        var title = data.data[0].title_english;
        var synopsis = data.data[0].synopsis;
        var poster = data.data[0].images.jpg.large_image_url;

        var card = $("<div>");
        var info = $("<div>");
        var imageEl = $("<img>");
        var titleEl = $("<h3>");
        var synopsisEl = $("<p>");

        info.attr("class", "col-span-2");
        titleEl.attr("class", "font-bold text-4xl searchTitle");
        synopsisEl.attr("class", "text-1xl text-justify pr-12");

        titleEl.text(title);
        synopsisEl.text(synopsis);
        imageEl.attr("src", poster);

        info.append(titleEl, synopsisEl);
        card.append(imageEl, info);
        $animeCardBodySearch.append(card, info);

        savePastSearches(anime);
        displayPastSearches();
        randomRecipe();
      }
    });
}

$searchButton.on("click", printSearch);
function printSearch() {
  var anime = replaceCharacters();
  searchAnime(anime);
}

$userInputEl.keydown(function (evt) {
  if (evt.keyCode === 13) {
    printSearch();
  }
});

function replaceCharacters(anime) {
  return $userInputEl.val().replace(" ", "-");
}

// Create a function that displays 6 anime suggestions
// Fetch from the Jikan API random
// create a for loop that will grab 6 anime suggestions
// in the for loop, create elements for a card for the anime info to append to
// in the for loop append the anime card to the html body

function displaySuggestions() {
  var suggestionsUrl = "https://api.jikan.moe/v4/top/anime?page=1";

  fetch(suggestionsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $animeCardBodySuggestions.empty();

      var topAnime = $("<h2>");
      topAnime.text("Top 10 Highest Rated Animes");
      topAnime.attr("class", "font-bold text-4xl searchTitle");
      $("#topAnime").append(topAnime);

      for (var i = 0; i < 10; i++) {
        var suggestionTitle = data.data[i].title_english;
        var suggestionPoster = data.data[i].images.jpg.large_image_url;

        // add data tag to the div, imag, and h3
        var suggestionCard = $("<div>");
        var suggestionImageEl = $("<img>");
        var suggestionTitleEl = $("<h3>");

        suggestionTitleEl.text(suggestionTitle);
        suggestionTitleEl.attr("data-title", suggestionTitle);
        suggestionTitleEl.attr("class", "suggestionTitle");
        suggestionImageEl.attr("src", suggestionPoster);
        suggestionImageEl.attr("data-title", suggestionTitle);

        suggestionCard.attr("data-title", suggestionTitle);

        suggestionCard.append(suggestionImageEl, suggestionTitleEl);
        $animeCardBodySuggestions.append(suggestionCard);
        suggestionImageEl.on("click", openAnimeSuggestion);
        suggestionTitleEl.on("click", openAnimeSuggestion);
        suggestionCard.on("click", openAnimeSuggestion);
      }
    });
}

function openAnimeSuggestion(event) {
  var suggestionClicked = event.target.getAttribute("data-title");
  replaceCharacters(suggestionClicked);
  searchAnime(suggestionClicked);
}



// Random Recipe function and API
function randomRecipe() {
  var mealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

// API call to fetch random recipe
  fetch(mealUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

// This puts all data items into an array
      $recipeBody.empty();
      var mealTitle = data.meals[0].strMeal;
      var instructions = data.meals[0].strInstructions;
      var mealImg = data.meals[0].strMealThumb;

// variables to display image and text from the API
      var mealImgEl = $("<img>");
      var recipeInfo = $("<div>");
      var instrEl = $("<p>");
      var mealTitleEl = $("<h1>");
      var mealIngredientsEl = $("<ul>");

// styles the JQuery items listed above
      recipeInfo.attr("class", "col-span-2");
      mealTitleEl.attr("class", "font-bold text-4xl");
      instrEl.attr("class", "text-1xl text-justify pr-12");

// applying text and image to the JQuery variables above
      mealTitleEl.text(mealTitle);
      mealIngredientsEl.text("Ingredients:");
      instrEl.text(instructions);
      mealImgEl.attr("src", mealImg);

// These append all recipe details to the page
      recipeInfo.append(mealTitleEl, mealIngredientsEl, instrEl);
      $recipeBody.append(mealImgEl, recipeInfo);

// Array is here to store recipe locally every time
      var recipe = [];

// 
      for (var i = 1; i <= 20; i++) {
        var ingredients = "strIngredient" + i;
        var measure = "strMeasure" + i;
        var meal = data.meals[0];

// This gets rid of any empty sting/'null'
        if (meal[ingredients] != null && meal[ingredients].length != 0) {
          recipe.push({
            measure: meal[measure],
            ingredient: meal[ingredients],
          });
        }
      }

// This displays recipe ingredients as a list with item and measurements
      for (var i = 0; i < recipe.length; i++) {
        var mealIngredients = $("<ul>");
        mealIngredients.text(recipe[i].measure + " " + recipe[i].ingredient);
        mealIngredientsEl.append(mealIngredients);
      }
    });
}

// Create a function that will store recent saves
function savePastSearches(anime) {
  var search = anime;
  var searches = localStorage.getItem("searches");
  if (searches) {
    searches = JSON.parse(searches);
  } else {
    searches = [];
  }

  if (!searches.includes(search)) {
    searches.push(search);
  }

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

function animeTitleError() {
  $errorModal.attr("class", "errorModalShow");
}

$closeButton.on("click", hideModal);

function hideModal() {
  $errorModal.attr("class", "errorModalHide");
}

// fix
