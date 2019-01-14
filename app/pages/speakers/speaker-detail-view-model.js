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


//handles all the information that will be visible on the page
function SpeakerDetailViewModel(speakerItemModel) {

    console.log('Preparing speaker details for ' + speakerItemModel.firstName + ' ' + speakerItemModel.lastName);

    let observableSpeakerDetailModel = {
        isLoading: false,

        speakerDetail: {},

        speakerSessions: new ObservableArray([]),  //array of all speaker sessions 

        loadSpeakerDetails : function () {
        
            this.set("isLoading", true);

            console.log("Start loading speaker details");

            //read the sessions file (database) to get the speaker details
            file.readText()
            .then(function (content) {
                var data = JSON.parse(content); 

                //loop thru the sessions file (our database) and get the details of the selected speaker
                var speakerDetailFound = false;
                data.forEach(function(sessionObj) { 
                    
                    let firstName = sessionObj.firstName;
                    let lastName = sessionObj.lastName;
                    let fullName = firstName + ' ' + lastName;

                    if (!speakerDetailFound && firstName == speakerItemModel.firstName && lastName == speakerItemModel.lastName) {
                        //console.log('Found the details for speaker ' + fullName); 
                        viewModel.speakerDetail = observableModule.fromObject(sessionObj);
                        speakerDetailFound = true;  //we can't put a break statement here
                    }

                });

                console.log("Finished loading speaker details");
                viewModel.set("isLoading", false); //set loading to false after writing to file

                //now load the speaker sessions
                viewModel.loadSpeakerSessions();

            }), function (error) {
                console.log('An error occurred loading the speaker details!');
            };
        }, 

        loadSpeakerSessions : function () {
            
            this.set("isLoading", true);

            console.log("Start loading speaker sessions");

            //read the sessions file (database) to get the speaker sessions
            file.readText()
            .then(function (content) {
                var data = JSON.parse(content); 

                //we are creating the list of speaker sesssions, so empty the existing ones first
                viewModel.emptySpeakerSessionsList();

                //loop thru the sessions file (our database) and get the sessions of the selected speaker
                data.forEach(function(sessionObj) { 
                    
                    let firstName = sessionObj.firstName;
                    let lastName = sessionObj.lastName;
                    let fullName = firstName + ' ' + lastName;

                    if (firstName == speakerItemModel.firstName && lastName == speakerItemModel.lastName) {
                        //console.log('Found session ' + sessionObj.id + ' for speaker ' + fullName); 

                        //add the session to the list view model
                        viewModel.speakerSessions.push(sessionObj);
                    }

                });

                console.log("Finish loading speaker sessions");
                viewModel.set("isLoading", false); //set loading to false after writing to file

            }), function (error) {
                console.log('An error occurred loading the speaker sessions!');
            };
        }, 

        emptySpeakerSessionsList: function () {
            console.log('Emptying list of speaker sessions');
            console.log('Before emptying list: size is ' + this.speakerSessions.length);
            while (this.speakerSessions.length) {
                this.speakerSessions.pop();
            }
            console.log('After emptying list: size is ' + this.speakerSessions.length);
        }

    }

    var viewModel = observableModule.fromObject(observableSpeakerDetailModel);

    return viewModel; //returns viewModel object containing speakers detail and sessions 
} 

module.exports = SpeakerDetailViewModel;