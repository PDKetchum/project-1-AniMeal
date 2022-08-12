// // Create a search button
// var $searchButton = $("#search-button");
// $searchButton.on("click", printSearch);

var anime = "hunterxhunter";

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
      // var sypnoisis =
      // var poster =

      console.log(title);
    });
}

searchAnime();

// Create a function that displays 6 anime suggestions

// Included in the suggestion card:
// Image of Anime poster data - images - large image url
// Title

// create a function that will display the search result
// Included in the suggestion card:
// Image of Anime poster data - images - large image url
// sypnoisis
// title

// function printSearch(){

// }
