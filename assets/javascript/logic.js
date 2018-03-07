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
var firstEntry = false;
var match = false;
var nflURL = "http://nflarrest.com/api/v1/player/arrests/"

$("#add-player").on("click", function() {

    event.preventDefault();

    // grab user input
    var playerInput = $("#player-input").val().trim();
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
    }).then(function (response) {

        // if they do (array has values), then...
        if (typeof response !== 'undefined' && response.length > 0) {

            // store name as an object
            var playerProfile = {
                name: response[0].Name,
                team: response[0].Team_preffered_name,
                position: response[0].Position_name,
                crime: response[0].Crime_category,
                description: response[0].Description,
                arrests: response.length
            };

            // check if the player is already in the database
            database.ref().once("value")
                .then(function (snapshot) {
                    if(!snapshot.val()){
                        console.log("Database Empty");
                        database.ref().push(playerProfile);
                        firstEntry = true;
                    } else {
                        snapshot.forEach(function(childSnapshot){
                            // for each player profile int he database grab the object
                            var object = childSnapshot.val();
                            // get the player in the database's name
                            var playerName = object.name.toLowerCase();
                            console.log(playerName, "Existing Player");
                            // get the new player's name
                            var newPlayer = playerProfile.name.toLowerCase();
                            console.log(newPlayer, "New Player");
                            // if they are the same, don't add them to the database
                            if(playerName === newPlayer){
                                console.log("Match");
                                match = true;
                            // if they aren't, add them to the database
                            } else {
                                console.log("Not a match");
                            };
                        });
                    };
                    if (match) {
                        console.log("Exists...");
                        $('#modal2').modal('open');
                        match = false;
                    } else if (firstEntry) {
                        console.log("First Entry");
                        firstEntry = false;
                    } else {
                        console.log("New Player!");
                        database.ref().push(playerProfile);
                        console.log(playerProfile, "database push");
                    };
                });
           
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