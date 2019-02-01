var config = {
    apiKey: "AIzaSyA7jy7myE9-Of7lMOetN8vaHdPtgm4v7lI",
    authDomain: "traintime-9ae27.firebaseapp.com",
    databaseURL: "https://traintime-9ae27.firebaseio.com",
    projectId: "traintime-9ae27",
    storageBucket: "traintime-9ae27.appspot.com",
    messagingSenderId: "669588914662"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;

// Capture Button Click
$(".btn-primary").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    trainName = $("#trainName-input").val().trim();
    destination = $("#destination-input").val().trim();
    //grabbing the time value and display it in 24-hour format moment(randomdate,randomformat)
    firstTrainTime = moment($("#firsttraintime-input").val(), "HH:mm").format("HH:mm");
    frequency = $("#frequencyminutes-input").val();    

//alert(trainName);
//alert(destination);
//alert($("#firsttraintime-input").val());
//alert(firstTrainTime);
//alert(frequency);

    // Code for "Setting values in the database"
    database.ref().push({
        trName: trainName,
        trDestination: destination,
        firstTime: firstTrainTime,
        trFrequency: frequency,
        //trNextArr: nextArravial,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#firsttraintime-input").val("");
    $("#frequencyminutes-input").val("");
});

//Fairbase watcher
database.ref().on("child_added", function(childsnapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = childsnapshot.val();

    // Console.loging the last user's data
    console.log(sv.trName);
    console.log(sv.trDestination);
    console.log(sv.firstTime);
    console.log(sv.trFrequency);

    //sec from 1970 till firstTime
    var firstTimeConverted = moment(sv.firstTime, "HH:mm");
    //alert("firstTimeconverted " + firstTimeConverted);

    //minutes from first train
    var trMinutesFromFirst = moment().diff(moment(firstTimeConverted), "minutes");
    //alert("minutes from first train: " + trMinutesFromFirst);

    //minutes till next train
    var trMinutesLeft = sv.trFrequency - (trMinutesFromFirst % sv.trFrequency);
    //alert("Minutes till next train: " + trMinutesLeft);

    var nextArrival = moment().add(trMinutesLeft, "minutes").format("HH:mm");
   // alert("Next arrival " + nextArrival);

    //Creating a newe row in table with new train data
    var newRow = $("<tr>").append(
        $("<td>").text(sv.trName),
        $("<td>").text(sv.trDestination),
        $("<td>").text(sv.trFrequency),        
        $("<td>").text(nextArrival),
//        $("<td>").text(trMinutesFromFirst),
        $("<td>").text(trMinutesLeft)
    );

    // Append the new row to the table
    $("#train-schedule > tbody").append(newRow);

    // Handle the errors
}, function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});
