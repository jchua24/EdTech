var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;

var app = require("tns-core-modules/application");

//variables needed for file system access and offline data 
var fileSystemModule = require("tns-core-modules/file-system");
var fileName = "schoolText.txt";   //gets info about school from file 

var file = fileSystemModule.knownFolders.documents().getFile(fileName); 


//handles all the information that will be visible on the page
function SocialMediaViewModel() {

    let observableSocialMediaModel = {
        isLoading: false,

        socialMedia: {}, 
    
        loadSocialMedia: function () {
            console.log("Inside social media loading function!!"); 

            //generate random #
            var randomNum = Math.floor((Math.random() * 100) + 1);

            fetch("http://www.winskee.com/EdTech/SocialMediaData.json?r=" + randomNum)
            .then(function (response) {
                //extracting jsondata, which is returned to the next .then function
                jsonData = response.json();
                return jsonData;
            }).then(function (data) {

                viewModel.socialMedia = observableModule.fromObject(data);
                viewModel.set("isLoading", false); //set loading to false after writing to file

            }); 
        }

    }

    var viewModel = observableModule.fromObject(observableSocialMediaModel);

    return viewModel; //returns viewModel object containing speakers data 
} 

function onBackButtonTap() {

}

module.exports = SocialMediaViewModel;