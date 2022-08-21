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

// Create a function that will fetch the API data from Jikan
// create a function that will display the search result
// Included in the search card:
// Image of Anime poster data - images - large image url
// sypnoisis
// title

displaySuggestions();

function searchAnime(anime) {
  if (!anime) {
    animeTitleError();
    return;
  }

  var animeUrl = "https://api.jikan.moe/v4/anime?q=" + anime;
  console.log(animeUrl);

  fetch(animeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.data.length === 0) {
        animeTitleError();
      } else {
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
        titleEl.attr("class", "font-bold text-4xl");
        synopsisEl.attr("class", "text-3xl text-justify pr-12");

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
  console.log(suggestionsUrl);

  fetch(suggestionsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $animeCardBodySuggestions.empty();

      for (var i = 0; i < 10; i++) {
        var suggestionTitle = data.data[i].title_english;
        var suggestionPoster = data.data[i].images.jpg.large_image_url;

        // add data tag to the div, imag, and h3
        var suggestionCard = $("<div>");
        var suggestionImageEl = $("<img>");
        var suggestionTitleEl = $("<h3>");

        suggestionTitleEl.text(suggestionTitle);
        suggestionTitleEl.attr("data-title", suggestionTitle);
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
  console.log(event.target);
  var suggestionClicked = event.target.getAttribute("data-title");
  console.log(suggestionClicked);
  replaceCharacters(suggestionClicked);
  searchAnime(suggestionClicked);
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
      var recipeInfo = $("<div>");
      var instrEl = $("<p>");
      var mealTitleEl = $("<h1>");
      var mealIngredientsEl = $("<ul>");

      recipeInfo.attr("class", "col-span-2");
      mealTitleEl.attr("class", "font-bold text-4xl");
      instrEl.attr("class", "text-3xl text-justify pr-12");

      mealTitleEl.text(mealTitle);
      mealIngredientsEl.text("Ingredients:");
      instrEl.text(instructions);
      mealImgEl.attr("src", mealImg);

      recipeInfo.append(mealTitleEl, mealIngredientsEl, instrEl);
      $recipeBody.append(mealImgEl, recipeInfo);

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
            measure: meal[measure],
            ingredient: meal[ingredients],
          });
        }
      }
      for (var i = 0; i <= recipe.length; i++) {
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
  console.log(pastSearches);
  $("#user-input").empty;
  $(function () {
    console.log("inside");
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
