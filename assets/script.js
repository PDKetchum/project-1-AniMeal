// // Create a search button
var $searchButton = $("#search-button");
var $cardsBody = $("#cards-body");
var $userInputEl = $("#user-input");
var anime;

// Create a function that will fetch the API data from Jikan
// create a function that will display the search result
// Included in the search card:
// Image of Anime poster data - images - large image url
// sypnoisis
// title

// https://www.themealdb.com/api.php

function searchAnime() {
  var url = "https://api.jikan.moe/v4/anime?q=" + anime;
  console.log(url);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var title = data.data[0].title_english;
      var synopsis = data.data[0].synopsis;
      var poster = data.data[0].images.jpg.large_image_url;
      $cardsBody.empty();

      var imageEl = $("<img>");
      var titleEl = $("<h1>");
      var synopsisEl = $("<p>");

      titleEl.text(title);
      synopsisEl.text(synopsis);
      imageEl.attr("src", poster);

      $cardsBody.append(imageEl, titleEl, synopsisEl);
    });
}

$searchButton.on("click", printSearch);
function printSearch() {
  replaceSpace();
  searchAnime();
}

$userInputEl.keydown(function(evt) {
  if(evt.keyCode === 13) {
    printSearch()
  }
})


function replaceSpace() {
  anime = $userInputEl.val().replace(" ", "-");
}

function displaySuggestion() {
  fetch()
}

// Create a function that displays 6 anime suggestions
// Fetch from the Jikan API random
// create a for loop that will grab 6 anime suggestions
// in the for loop, create elements for a card for the anime info to append to
// in the for loop append the anime card to the html body

// create a API fetch function for recipies
// have the recipies randomized
// target the data info needed
// create elements for the recipie data to append to
// append the recipe to html body