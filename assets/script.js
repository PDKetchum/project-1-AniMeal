// // Create a search button
var $searchButton = $("#search-button");
$searchButton.on("click", printSearch);
var $cardsBody = $("#cards-body");
var anime;

// Create a function that will fetch the API data from Jikan

function searchAnime() {
  var url = "https://api.jikan.moe/v4/anime?q=" + anime;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var title = data.data[0].title_english;
      var synopsis = data.data[1].synopsis;
      var poster = data.data[1].images.jpg.large_image_url;
      

      var imageEl = $("<img>");
      var titleEl = $("<h1>");
      var synopsisEl = $("<p>");

      titleEl.text(title);
      synopsisEl.text(synopsis);
      imageEl.attr("src", poster)

      $cardsBody.append(imageEl, titleEl, synopsisEl);

    });
}

searchAnime();

addEventListener('click')

// Create a function that displays 6 anime suggestions

// Included in the suggestion card:
// Image of Anime poster data - images - large image url
// Title

// create a function that will display the search result
// Included in the suggestion card:
// Image of Anime poster data - images - large image url
// sypnoisis
// title

$searchButton.on("click", printSearch);
function printSearch(){
  var userInput = $("#user-input")
  anime.text(userInput) 
}
