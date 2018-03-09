// Initialize Firebase
var config = {
<<<<<<< HEAD
    apiKey: "AIzaSyC3s9mMlqYc06I9UddZ_QMqrwm-9La5CTc",
authDomain: "project1-17f4c.firebaseapp.com",
databaseURL: "https://project1-17f4c.firebaseio.com",
projectId: "project1-17f4c",
storageBucket: "",
messagingSenderId: "638710364037"
=======
  apiKey: "AIzaSyC3s9mMlqYc06I9UddZ_QMqrwm-9La5CTc",
  authDomain: "project1-17f4c.firebaseapp.com",
  databaseURL: "https://project1-17f4c.firebaseio.com",
  projectId: "project1-17f4c",
  storageBucket: "",
  messagingSenderId: "638710364037"
>>>>>>> 7936b22e6e39873509bef9fb1f5519dc54ad6a44
};

firebase.initializeApp(config);

<<<<<<< HEAD
$(document).ready(function () {
    $('.modal').modal();
=======
$(document).ready(function() {
  $(".modal").modal();
>>>>>>> 7936b22e6e39873509bef9fb1f5519dc54ad6a44
});

var database = firebase.database();

<<<<<<< HEAD
var nflURL = "http://nflarrest.com/api/v1/player/arrests/"

$("#add-player").on("click", function() {

    event.preventDefault();

    // grab user input
    var playerInput = $("#player-input").val().trim();
    // parse using 'space' as a delimiter and 
    var playerName = playerInput.split(" ");
    // grab the first word
    var firstName = playerName[0];
    console.log(firstName,"First Name");
    // grab the second word
    var lastName = playerName[1];
    console.log(lastName,"Last Name");

    // check to see if the NFL Arrest API has info on that player (ajax call to NFL Arrests API)
    $.ajax({
        url: nflURL + firstName + "+" + lastName,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        // if they do (array has values), then...
        if (typeof response !== 'undefined' && response.length > 0) {

            // store name as an object
            var playerName = {
                firstName: firstName,
                lastName: lastName
            };

            console.log(playerName, "database push");
            // push the player's name to the database
            database.ref().push(playerName);

        } else { // if they don't (array is empty), then...

            // inform the user that this player does not have an arrest record (using a modal)
            $('#modal1').modal('open');
            console.log("Nothing returned");
        }
        
    });

    $("#player-input").val("");

});

database.ref().on("child_added", function (snapshot) {

    // create a card with the player's mug shot and info from the NFL Arrests API
    
});
=======
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
      // create a card with the player's mug shot and info from the NFL Arrests API
      console.log(playerName, "database push");
      // push the player's name to the database
      database.ref().push(playerName);
    } else {
      // if they don't (array is empty), then...

      // inform the user that this player does not have an arrest record (using a modal)
      $("#modal1").modal("open");
      console.log("Nothing returned");
    }
  });

  $("#player-input").val("");
});

database.ref().on("child_added", function(snapshot) {});
>>>>>>> 7936b22e6e39873509bef9fb1f5519dc54ad6a44
