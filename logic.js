// Initialize Firebase
var config = {
  apiKey: "AIzaSyC3s9mMlqYc06I9UddZ_QMqrwm-9La5CTc",
  authDomain: "project1-17f4c.firebaseapp.com",
  databaseURL: "https://project1-17f4c.firebaseio.com",
  projectId: "project1-17f4c",
  storageBucket: "",
  messagingSenderId: "638710364037"
};

firebase.initializeApp(config);

$(document).ready(function() {
  $(".modal").modal();
});

var database = firebase.database();

var nflURL = "http://nflarrest.com/api/v1/player/arrests/";

$("#add-player").on("click", function() {
  event.preventDefault();

  // grab user input
  var playerInput = $("#player-input")
    .val()
    .trim();
  // parse using 'space' as a delimiter and
  var playerName = playerInput.split(" ");
  // grab the first word
  var firstName = playerName[0];
  console.log(firstName, "First Name");
  // grab the second word
  var lastName = playerName[1];
  console.log(lastName, "Last Name");

  // check to see if the NFL Arrest API has info on that player (ajax call to NFL Arrests API)
  $.ajax({
    url: nflURL + firstName + "+" + lastName,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    console.log("Name: " + response[0].Name);
    console.log("Team: " + response[0].Team_preffered_name);
    console.log("Year: " + response[0].Year);
    console.log("Date: " + response[0].Date);
    console.log("Category: " + response[0].Category);
    console.log("Description: " + response[0].Description);
    console.log("Outcome: " + response[0].Outcome);
    $("#p").text(response[0].Name);

    // if they do (array has values), then...
    if (typeof response !== "undefined" && response.length > 0) {
      // store name as an object
      var playerName = {
        firstName: firstName,
        lastName: lastName
      };
      var nextMugshot = 0;
      // more info: http://mvark.blogspot.com/2016/06/how-to-use-bing-search-v5-api-with.html
      var total;
      var results = "";
      //placeholder for bing query - will be changed to allow this to have data from a input form
      var question = playerInput;

      // In this sample, I'm trying to find the pages of my blog that Bing has indexed with the "site:" operator with the "q" parameter
      //For more info on the other querystring parameters refer to the documentation - https://bingapis.portal.azure-api.net/docs/services/56b43eeccf5ff8098cef3807/operations/56b4447dcf5ff8098cef380d
      // var mugshotAjax = $(function () {
      function mugshotAjax() {
        var params = {
          // Request parameters
          q: question + "nfl mugshot",
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
            mugshotImage.attr("class", "card");
            mugshotImage.attr("class", "col s12 m4");
            $(".card-image").prepend(mugshotImage);
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
      // create a card with the player's mug shot and info from the NFL Arrests API
      console.log(playerName, "database push");
      // push the player's name to the database
      database.ref().push(playerName);
      console.log("Push player name " + playerName);
    } else {
      // if they don't (array is empty), then...

      // inform the user that this player does not have an arrest record (using a modal)
      $("#modal1").modal("open");
      console.log("Nothing returned");
    }
  });

  $("#player-input").val("");
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(snapshot) {
  var newPlayerName = snapshot.val().playerName;
  console.log(snapshot.val().playerName);

  var snap = snapshot.val();
  $("#information").append(snap.firstName);
});
