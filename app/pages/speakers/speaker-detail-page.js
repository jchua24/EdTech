const topmost = require("ui/frame").topmost;
const fromObject = require("data/observable").fromObject; //needed for binding 

const SpeakerDetailViewModel = require("./speaker-detail-view-model");
var colorModule = require("color");
var connectivity = require('connectivity');

var utilityModule = require("utils/utils"); //to open links in device browser

var emailModule = require("nativescript-email");


function onNavigatingTo(args) {
    if (args.isBackNavigation) {
        return;
    }

    const page = args.object;
    
    let viewModel = new SpeakerDetailViewModel(page.navigationContext); //page.navigationContext is the selected speaker list item view model
    page.bindingContext = viewModel;

    //load data
    viewModel.loadSpeakerDetails();

}


function onNavigatingFrom(args) {
    /*
    const page = args.object;
    const oldViewModel = page.bindingContext;
    if (oldViewModel) {
        oldViewModel.unload();
    }
    */
}

function onSessionItemTap(args) {
    const tappedSessionItem = args.view.bindingContext;

    //RadListView doesn't have the ListView feature to automatically change the background color of a list row when tapped.
    //So we are hacking it here
    args.view.backgroundColor = new colorModule.Color("#DCEDC8");

    topmost().navigate({
        moduleName: "cars/session-detail-page/session-detail-page",
        context: tappedSessionItem,
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });

    //Change the list row background color to white
    args.view.backgroundColor = new colorModule.Color("#FFFFFF");
}

function onResourceTap(args) {
    const tappedSessionItem = args.view.bindingContext;
    var resourceLink = tappedSessionItem.speakerDetail.presenterResourcePage; 

    console.log("resource link is " + resourceLink); 

    utilityModule.openUrl(resourceLink);
}

function onTwitterTap(args) {
    const twitterUsername = args.view.bindingContext.speakerDetail.twitterHandle;
    var twitterLink = "https://twitter.com/" + twitterUsername + "?lang=en"; 

    console.log("twitter link is " + twitterLink); 

    utilityModule.openUrl(twitterLink);
}

function onEmailTap(args) {
    
    emailModule.compose({
        subject: "",
        body: "",
        to: ['eddyverbruggen@gmail.com']
    }).then(
        function() {
        console.log("Email composer closed");
        }, function(err) {
        console.log("Error: " + err);
        });
}





exports.toggleDrawer = function() {
    var page = topmost().currentPage;
    page.getViewById("sideDrawer").toggleDrawerState();
};

exports.navigateToPage = function(args) {
    var pageName = args.view.text.toLowerCase();

    console.log('pageName = ' + pageName);
    
    args.view.backgroundColor = new colorModule.Color("#FF7120");

    if (pageName == 'home') {
        console.log("Navigating to home (sessions list) page "); 
        topmost().navigate("cars/sessions-list-page"); 
    } else if (pageName == 'speakers') {
        topmost().navigate("pages/" + pageName + "/" + pageName + '-list-page'); 
    } else if (pageName == 'school info') {
        console.log("Navigating to school info page "); 
        topmost().navigate("pages/school/school-info-page"); 
    } else if (pageName == 'social media') {
        console.log("Navigating to social media page "); 
        topmost().navigate("pages/social/social-media-page"); 
    } else if (pageName == 'privacy policy') {
        console.log("Navigating to privacy policy page");
        topmost().navigate("pages/privacy/privacy-policy-page"); 
    }

    args.view.backgroundColor = new colorModule.Color("#d8dadb");
    
};


function onBackButtonTap() {
    topmost().goBack();
}



exports.onNavigatingTo = onNavigatingTo;
exports.onSessionItemTap = onSessionItemTap;
exports.onResourceTap = onResourceTap;
exports.onTwitterTap = onTwitterTap; 
exports.onEmailTap = onEmailTap; 
exports.onBackButtonTap = onBackButtonTap; 