var config = require("../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;

var app = require("tns-core-modules/application");

//variables needed for file system access and offline data 
var fileSystemModule = require("tns-core-modules/file-system");
var fileName = "sessionText.txt";   //this file serves as our database
var persistFileName = "persistedSessions.txt";

var file = fileSystemModule.knownFolders.documents().getFile(fileName); 
var persistFile = fileSystemModule.knownFolders.documents().getFile(persistFileName); 


//handles all the information that will be visible on the page
function SessionsListViewModel() {
    //var viewModel = new Observable();

    let observableSessionModel = {
        isLoading: false,
        sessions: new ObservableArray([]),  //array of all sessions objects 
        selectedSessions: new ObservableArray([]),  //array of selected sessions objects 
        school: {}, //object for loading school data 
        schedule: new ObservableArray([]),
    
        load : function () {
            
            viewModel.set("isLoading", true);
            
            console.log("Starting online load.");

            //retrieve current content from the persisted file - will be used to check starred attribute
            //console.log("Loading persist file.");
            
         
            var lines;
            
            
            persistFile.readText().then(function(content) {
                lines = content.split('\n'); 
            }); 
    
            //create some random #
    
            var randomNum = Math.floor((Math.random() * 100) + 1);

            
            fetch("http://www.winskee.com/EdTech/EdTechJSON.json?r=" + randomNum)
                .then(handleErrors)
                .then(function (response) {
                    //extracting jsondata, which is returned to the next .then function
                    jsonData = response.json();
                    return jsonData;
                }).then(function (data) {
                    //we got a fresh list of sessions, so empty the existing ones first
                    viewModel.empty();
                    console.log("PUSHING SESSION DATA");
    
                    //console.log(lines.toString()); 

                    file.writeText(JSON.stringify(data)); 
           
                    /*
                    for(var x = 0; x < lines.length; x++) {
                        console.log(lines[x]);
                    } */ 

                    for(var i = 0; i < data.length; i++) {
                       //console.log(viewModel.sessions.getItem(i).starred);
                        //console.log("SESSIONS INDEX: " + data[i].id); 
                        var result = lines.indexOf(data[i].id.toString());
                        //console.log("Result: " + result); 

                        if(result != -1) {
                            data[i].starred = true; 
                        }
                    }  
                    
                    viewModel.sessions.push(data); 
                    
                    console.log("Finished online load");
                    viewModel.set("isLoading", false); //set loading to false after writing to file
                }); 
        },


        //function is called when the user's device is not connected to a network 
        offlineLoad : function () {
        
            this.set("isLoading", true);
            console.log("Starting offline load.");
    
            //retrieve current content from the persisted file - will be used to check starred attribute
            //console.log("Loading persist file.");
            var lines; 
            persistFile.readText().then(function(content) {
                lines = content.split('\n'); 
                console.log(lines);
            }); 

            file.readText()
            .then(function (content) {
                var data = JSON.parse(content); 

                //we are restoring the list of sessions, so empty the existing ones first
                viewModel.empty();

                data.forEach(function(sessionObj) { 
                    
                    //console.log("sessionObj.id = " + sessionObj.id + " sessionObj.starred = " + sessionObj.starred); 

                    //if item is in the persisted file id list, then change starred to true
                    for(var i = 0; i < lines.length; i++) {
                        if(sessionObj.id == lines[i]) {
                            sessionObj.starred = true;
                            //console.log("Restoring starred flag for session id: " + lines[i]); 
                            break;
                        }
                    }  

                    viewModel.sessions.push(sessionObj);
                });

                //console.log("Finished offline load");

                viewModel.set("isLoading", false); //set loading to false after writing to file
            }), function (error) {
                alert("Error. Please check your network connection.")
            };
        }, 

        persistAllSelectedSessions: function() {
            let newContent = "";

            //get all selected session ids
            this.sessions.forEach(function(sessionObj) { 
                if (sessionObj.starred) {
                    //console.log("Adding session " + sessionObj.id + " to the persist id file");
                    newContent = newContent + sessionObj.id + "\n";
                }
            });

            //persist all selected session ids
            //as per API, writeText recreates the file, it overwrites the previous content
            persistFile.writeText(newContent)
            .then(function () {
                //read it back to confirm content
                persistFile.readText().then(function(content) {
                    //console.log("\nContents of persist file:\n" + content);
                });  
            });  

        },

        makeVisible : function(sessionKey) {
            if(sessionKey == 4) {
                //make all sessions visible since 4 represents full schedule
                this.sessions.forEach(function(sessionObj) {
                    sessionObj.visible = true; 
                });
            } else {
                //make only sessions of the specified sessionKey visible 
                this.sessions.forEach(function(sessionObj) {
                    if(sessionKey == sessionObj.session) {
                        sessionObj.visible = true; 
                    } else {
                        sessionObj.visible = false; 
                    }
                });
            }
        }, 
    
        empty : function () {
            //console.log('Emptying list of sessions');
            //console.log('Before emptying list: size is ' + this.sessions.length);
            while (this.sessions.length) {
                this.sessions.pop();
            }
            //console.log('After emptying list: size is ' + this.sessions.length);
        },

        emptySchedule : function () {
            console.log('Emptying list of schedule');
            while (this.schedule.length) {
                this.schedule.pop();
            }
        },

        addToSelectedSession: function (sessionItem) {
            viewModel.selectedSessions.push(sessionItem); 
        },

        getCount: function() {
            return this.sessions.length;
        },

        loadSchedule : function() {

            console.log("Inside home page - schedule loading function!!"); 
            
            viewModel.emptySchedule(); 

            // generate random #
            var randomNum = Math.floor((Math.random() * 100) + 1);

            fetch("http://winskee.com/EdTech/DailySchedule.json?r=" + randomNum)
            .then(function (response) {
                //extracting jsondata, which is returned to the next .then function
                jsonData = response.json();
                return jsonData;
            }).then(function (data) {
                data.forEach(function(scheduleObj) { 
                    
                    viewModel.schedule.push(scheduleObj);
                });
            }); 

        },

        loadSchools : function () {
            console.log("Inside home page - school loading function!!"); 


            // generate random #
            var randomNum = Math.floor((Math.random() * 100) + 1);

            fetch("http://www.winskee.com/EdTech/SchoolData.json?r=" + randomNum)
            .then(function (response) {
                //extracting jsondata, which is returned to the next .then function
                jsonData = response.json();
                return jsonData;
            }).then(function (data) {
                //console.log('Assigning school to view model');
                viewModel.school = observableModule.fromObject(data);
                viewModel.set("isLoading", false); //set loading to false after writing to file

            }); 
        }
    }

    var viewModel = observableModule.fromObject(observableSessionModel);

    return viewModel; //returns viewModel object containing sessions data 
} 


function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = SessionsListViewModel;


