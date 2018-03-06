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

$(document).ready(function () {
    $('.modal').modal();
});

var database = firebase.database();

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