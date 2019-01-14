var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;

var app = require("tns-core-modules/application");

//variables needed for file system access and offline data 
var fileSystemModule = require("tns-core-modules/file-system");
var fileName = "sessionText.txt";   //this file serves as our database

var file = fileSystemModule.knownFolders.documents().getFile(fileName); 

var sortSpeakerNames = function(speakersList) {
    console.log('Sorting speakers');
    speakersList.sort(function(a,b) {return (a.fullName > b.fullName) ? 1 : ((b.fullName > a.fullName) ? -1 : 0);}); 
}

//handles all the information that will be visible on the page
function SpeakersListViewModel() {

    let observableSpeakerModel = {
        isLoading: false,

        uniqueSpeakers: [], //array of unique speaker names

        speakers: new ObservableArray([]),  //array of all speakers objects 
    
        loadSpeakers : function () {
        
            this.set("isLoading", true);

            console.log("Start loading speakers");

            file.readText()
            .then(function (content) {
                var data = JSON.parse(content); 

                //we are creating the list of speakers, so empty the existing ones first
                viewModel.empty();

                //loop thru the sessions file (our database) and extract all unique speakers into the unique speakers array list
                data.forEach(function(sessionObj) { 
                    
                    let firstName = sessionObj.firstName;
                    let lastName = sessionObj.lastName;

                    //we are using the variable fullName as the unique key in the uniqueSpeakers array list
                    let fullName = firstName + ' ' + lastName;

                    //search for the fullname in the uniqueSpeakers array list
                    var fullNameFound = false; 
                    for (var i = 0; i < viewModel.uniqueSpeakers.length; i++) {
                        if (viewModel.uniqueSpeakers[i] == fullName) {
                            fullNameFound = true;
                            //console.log(fullName + ' is already in the unique speakers list.'); 
                            break;
                        }
                    } 

                    if (!fullNameFound) {
                        //console.log('Found unique speaker ' + fullName);

                        //add the speaker to the unique speaker array list
                        viewModel.uniqueSpeakers.push(fullName);

                        //add the unique speaker to the speaker object for the view model
                        viewModel.speakers.push({
                            "firstName" : firstName,
                            "lastName" : lastName,
                            "fullName" : fullName
                        });
                    }


                });

                // sort the speaker names in ascending order
                sortSpeakerNames(viewModel.speakers);

                console.log("Finished loading speakers");

                viewModel.set("isLoading", false); //set loading to false after loading speakers

            }), function (error) {
                alert("Error. Please check your network connection.")
            };
        }, 

        empty: function () {
            console.log('Emptying list of speakers');
            console.log('Before emptying list: size is ' + this.speakers.length);
            while (this.speakers.length) {
                this.speakers.pop();
            }
            console.log('After emptying list: size is ' + this.speakers.length);
        }

    }

    var viewModel = observableModule.fromObject(observableSpeakerModel);

    return viewModel; //returns viewModel object containing speakers data 
} 

module.exports = SpeakersListViewModel;