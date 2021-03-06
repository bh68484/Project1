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

  $("#modal3").modal("open");
  var cardCount = 0;
  var database = firebase.database();
  var firstEntry = false;
  var match = false;
  var nflURL =
    "https://cors-anywhere.herokuapp.com/http://nflarrest.com/api/v1/player/arrests/";
  var nextMugshot = 0;
  // more info: http://mvark.blogspot.com/2016/06/how-to-use-bing-search-v5-api-with.html
  var total;
  var results = "";
  var keys = [];
  //placeholder for bing query - will be changed to allow this to have data from a input form

  $("#about").on("click", function() {
    $("#modal3").modal("open");
  });

  $("#player-input").keypress(function(e) {
    if (e.which == 13) {
      $("#add-player").click();
    }
  });

  $(document).on("click", ".deletePlayer", function() {
    console.log("delete clicked");
    event.preventDefault();

    var key = $(this).attr("id");
    console.log(key);
    database.ref(key).remove();
    $("#" + key).remove();
  });

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
    // grab the second word
    var lastName = playerName[1];

    // check to see if the NFL Arrest API has info on that player (ajax call to NFL Arrests API)
    $.ajax({
      url: nflURL + firstName + "+" + lastName,
      method: "GET"
    }).then(function(response) {
      // if they do (array has values), then...
      if (typeof response !== "undefined" && response.length > 0) {
        mugshotAjax(playerInput, response, callback);
      } else {
        // if they don't (array is empty), then...

        // inform the user that this player does not have an arrest record (using a modal)
        $("#modal1").modal("open");
        console.log("Nothing returned");
      }
    });

    $("#player-input").val("");
  });

  // In this sample, I'm trying to find the pages of my blog that Bing has indexed with the "site:" operator with the "q" parameter
  //For more info on the other querystring parameters refer to the documentation - https://bingapis.portal.azure-api.net/docs/services/56b43eeccf5ff8098cef3807/operations/56b4447dcf5ff8098cef380d

  function mugshotAjax(playerInput, NFLArrestResponse, cb) {
    var query = playerInput;

    var params = {
      // Request parameters
      q: query + "nfl mugshot",
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
          "91be3f294aa54133b235da8ca1033572"
        );
      },
      type: "GET"
    })
      .then(function(response) {
        //storing data into a variable
        var mugshotURL = response.value[nextMugshot].thumbnailUrl;
        cb(mugshotURL, NFLArrestResponse);
      })
      .fail(function() {
        alert("error");
      });
  }

  function callback(mugshotURL, response) {
    // store name as an object

    console.log(response);

    var playerProfile = {
      name: response[0].Name,
      team: response[0].Team_preffered_name,
      position: response[0].Position_name,
      crime: response[0].Crime_category,
      description: response[0].Description,
      date: response[0].Date,
      arrests: response.length,
      mugshot: mugshotURL,
      mainColor: "#" + response[0].Team_hex_color,
      altColor: "#" + response[0].Team_hex_alt_color
    };

    // check if the player is already in the database
    database
      .ref()
      .once("value")
      .then(function(snapshot) {
        if (!snapshot.val()) {
          console.log("Database Empty");
          database.ref().push(playerProfile);
          firstEntry = true;
        } else {
          snapshot.forEach(function(childSnapshot) {
            // for each player profile int he database grab the object
            var object = childSnapshot.val();
            // get the player in the database's name
            var playerName = object.name.toLowerCase();
            console.log(playerName, "Existing Player");
            // get the new player's name
            var newPlayer = playerProfile.name.toLowerCase();
            console.log(newPlayer, "New Player");
            // if they are the same, don't add them to the database
            if (playerName === newPlayer) {
              console.log("Match");
              match = true;
              // if they aren't, add them to the database
            } else {
              console.log("Not a match");
            }
          });
        }
        if (match) {
          console.log("Exists...");
          $("#modal2").modal("open");
          match = false;
        } else if (firstEntry) {
          console.log("First Entry");
          firstEntry = false;
        } else {
          console.log("New Player!");
          database.ref().push(playerProfile);
          console.log(playerProfile, "database push");
        }
      });
  }

  database.ref().on("child_added", function(snapshot) {
    // create a card with the player's mug shot and info from the NFL Arrests API
    var snap = snapshot.val();
    var key = snapshot.key;
    console.log(snap);
    console.log(key);
    var playerCard = $(
      "<div class='col s6' id='" +
        key +
        "'>" +
        "<div class='card'><div class='card-image waves-effect waves-block waves-light'>" +
        "<img class='activator mugshot' src='" +
        snap.mugshot +
        "'></div>" +
        "<div class='card-content'>" +
        "<span class='card-title activator grey-text text-darken-4 playerName'>" +
        snap.name +
        "<i class='material-icons right'>more_vert</i>" +
        "</span><p><a href='#' class='right deletePlayer' id='" +
        key +
        "'>Delete Player</a></p>" +
        "</div><div class='card-reveal' id='card" +
        cardCount +
        "'>" +
        "<span class='card-title grey-text text-darken-4'><span class='playerName'>" +
        snap.name +
        "</span>" +
        "<i class='material-icons right'>close</i></span>" +
        "<p class='playerInfo'> <b>Team:</b> " +
        snap.team +
        "<br> <b>Charges:</b> " +
        snap.crime +
        "<br><b>Date:</b> " +
        snap.date +
        "<br><b>Description:</b> " +
        snap.description +
        "<br><b>Total Arrests:</b> " +
        snap.arrests +
        "</p>" +
        "</div></div></div >"
    );

    $("#cardRow").append(playerCard);
    $("#card" + cardCount).css({
      background:
        "-webkit-radial-gradient(30% 30%, circle closest-corner," +
        snap.altColor +
        ", " +
        snap.mainColor +
        ")"
    });
    cardCount++;
    console.log(cardCount);
  });
});
