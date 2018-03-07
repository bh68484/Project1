var nextMugshot = 0;
// more info: http://mvark.blogspot.com/2016/06/how-to-use-bing-search-v5-api-with.html
var total;
var results = "";
//placeholder for bing query - will be changed to allow this to have data from a input form
var question = "adam jones nfl mugshot";

// In this sample, I'm trying to find the pages of my blog that Bing has indexed with the "site:" operator with the "q" parameter
//For more info on the other querystring parameters refer to the documentation - https://bingapis.portal.azure-api.net/docs/services/56b43eeccf5ff8098cef3807/operations/56b4447dcf5ff8098cef380d
// var mugshotAjax = $(function () {
function mugshotAjax() {
  var params = {
    // Request parameters
    q: question,
    count: "10",
    offset: "0",
    mkt: "en-us"
  };
  //ajax call to run the bing search
  $.ajax({
    url:
      "https://api.cognitive.microsoft.com/bing/v7.0/images/search?" +
      $.param(params),
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader(
        "Ocp-Apim-Subscription-Key",
        "891ceab86439449c8b073cab352dd806"
      );
    },
    type: "GET"
  })
    .then(function(response) {
      console.log(response + " response");
      //storing data into a variable
      var mugshot = response.value[nextMugshot].thumbnailUrl;
      var mugshotImage = $("<img>");
      console.log(response);
      mugshotImage.attr("src", mugshot);
      mugshotImage.attr("alt", "mugshot");
      $("#mugshot").prepend(mugshotImage);
    })
    .fail(function() {
      alert("error");
    });
}

$("#next").click(function() {
  nextMugshot++;
  mugshotAjax();
});
mugshotAjax();
