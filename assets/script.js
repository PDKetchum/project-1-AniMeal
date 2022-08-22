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

// API call to fetch anime data by passing through an anime name
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
      // If there is not data alert with modal
      if (data.data.length === 0) {
        animeTitleError();
      } else {
        // Clearing out the html
        $("#topAnime").empty();
        $animeCardBodySuggestions.empty();
        $animeCardBodySearch.empty();

        // Retreiving data needed
        var title = data.data[0].title_english;
        var synopsis = data.data[0].synopsis;
        var poster = data.data[0].images.jpg.large_image_url;
        var score = data.data[0].score;
        var popularity = data.data[0].popularity;
        var trailer = data.data[0].trailer.embed_url;

        // Creating elements for HTML
        var card = $("<div>");
        var info = $("<div>");
        var sub_title = $("<div>");
        var imageEl = $("<img>");
        var titleEl = $("<h3>");
        var scoreEl = $("<span>");
        var popularityEl = $("<span>");
        var synopsisEl = $("<p>");
        var trailerEl = $("<iframe>");

        // Adding attribues to the elements
        info.attr("class", "col-span-2 mt-8");
        titleEl.attr("class", "font-bold text-4xl py-6 text-slate-50");
        synopsisEl.attr("class", "text-1xl text-justify pr-12 p-3 max-w-6xl");
        sub_title.attr("class", "p-3 font-semibold text-slate-50");
        scoreEl.attr("class", "pr-2.5");
        imageEl.attr("src", poster);
        imageEl.attr("class", "mt-20 border-8 rounded-xl border-zinc-500");
        trailerEl.attr("src", trailer);
        trailerEl.attr("class", "video p-3");

        // Adding text to elements
        scoreEl.text("Score: ⭐ " + score + "/10");
        popularityEl.text("Popularity Ranking: " + popularity);
        titleEl.text(title);
        synopsisEl.text("Synopsis: " + synopsis);

        // Appending elements to html/parents
        sub_title.append(scoreEl, popularityEl);
        info.append(titleEl, sub_title, synopsisEl, trailerEl);
        card.append(imageEl, info);
        $animeCardBodySearch.append(card, info);

        savePastSearches(anime);
        displayPastSearches();
        randomRecipe();
      }
    });
}

// Event listener for search button
$searchButton.on("click", printSearch);
function printSearch() {
  var anime = replaceCharacters();
  searchAnime(anime);
}

// Event listener for the enter key
$userInputEl.keydown(function (evt) {
  if (evt.keyCode === 13) {
    printSearch();
  }
});

// Changes spaces in user anime title input to '-'
function replaceCharacters(anime) {
  return $userInputEl.val().replace(" ", "-");
}

// API call to fetch top rated anime data
function displaySuggestions() {
  var suggestionsUrl = "https://api.jikan.moe/v4/top/anime?page=1";

  fetch(suggestionsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $animeCardBodySuggestions.empty();

      // Page title
      var topAnime = $("<h2>");
      topAnime.text("Highest Scored Animes");
      topAnime.attr("class", "font-bold text-4xl p-6 m-8");
      $("#topAnime").append(topAnime);

      for (var i = 0; i < 12; i++) {
        // Retreiving data needed
        var suggestionTitle = data.data[i].title_english;
        var suggestionPoster = data.data[i].images.jpg.large_image_url;

        // Creating elements for HTML
        var suggestionCard = $("<div>");
        var suggestionImageEl = $("<img>");
        var suggestionTitleEl = $("<h3>");

        // Adding text to element
        suggestionTitleEl.text(suggestionTitle);

        // Adding Sttributes for elements
        suggestionTitleEl.attr("data-title", suggestionTitle);
        suggestionTitleEl.attr(
          "class",
          "text-slate-400 font-semibold text-xl transition hover:text-slate-300 suggestionTitle"
        );
        suggestionImageEl.attr("src", suggestionPoster);
        suggestionImageEl.attr("data-title", suggestionTitle);

        suggestionCard.attr("data-title", suggestionTitle);
        suggestionCard.attr(
          "class",
          "card bg-zinc-800 w-80 h-[34rem] rounded-xl p-6 space-y-4 hover:bg-zinc-700 cursor-pointer"
        );

        // Appending elements to html/parents
        suggestionCard.append(suggestionImageEl, suggestionTitleEl);
        $animeCardBodySuggestions.append(suggestionCard);

        // Event listeners for elements created
        suggestionImageEl.on("click", openAnimeSuggestion);
        suggestionTitleEl.on("click", openAnimeSuggestion);
        suggestionCard.on("click", openAnimeSuggestion);
      }
    });
}

// Function to open up suggested animes data when clicked
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

      recipeInfo.attr("class", "col-span-2 mx-8");

      // styles the JQuery items listed above
      recipeInfo.attr("class", "col-span-2");

      mealTitleEl.attr("class", "font-bold text-4xl");
      instrEl.attr("class", "text-1xl text-justify pr-12 max-w-6xl");

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

// Function that stores past searches
function savePastSearches(anime) {
  var search = anime;
  var searches = localStorage.getItem("searches");
  if (searches) {
    searches = JSON.parse(searches);
  } else {
    searches = [];
  }
  // Prevents duplicates
  if (!searches.includes(search)) {
    searches.push(search);
  }

  localStorage.setItem("searches", JSON.stringify(searches));
}

// Function that will displays past searches when typing in the search bar
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

// Shows and hides error modal
function animeTitleError() {
  $errorModal.attr("class", "errorModalShow");
}

$closeButton.on("click", hideModal);

function hideModal() {
  $errorModal.attr("class", "errorModalHide");
}
