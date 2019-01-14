const topmost = require("ui/frame").topmost;
const fromObject = require("data/observable").fromObject; //needed for binding 
var colorModule = require("color");
const SpeakersListViewModel = require("./speakers-list-view-model");

var connectivity = require('connectivity');


function onNavigatingTo(args) {
    const page = args.object;

    let viewModel = page.bindingContext;

    if (!args.isBackNavigation) {
        //we are landing on the list page for the first time

        //set up the view model for the list
        viewModel = new SpeakersListViewModel(); 
        page.bindingContext = viewModel;

        //load data
        viewModel.loadSpeakers();

        //refresh the list to apply the sorting done in the view model
        page.getViewById("allSpeakersList").refresh();
    }
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


function onSpeakerItemTap(args) {
    const tappedSpeakerItem = args.view.bindingContext;
    
    console.log('Speaker ' + tappedSpeakerItem.firstName + ' tapped.');
    
    //RadListView doesn't have the ListView feature to automatically change the background color of a list row when tapped.
    //So we are hacking it here
    args.view.backgroundColor = new colorModule.Color("#FF7120");

    topmost().navigate({
        moduleName: "pages/speakers/speaker-detail-page",
        context: tappedSpeakerItem,
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });

    //Change the list row background color to the background color specified in the class list-group-item-content-speaker-list
    args.view.backgroundColor = new colorModule.Color("#e8e8e8");
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
    } else if (pageName == 'venue/wifi information') {
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

exports.onNavigatingTo = onNavigatingTo;
exports.onSpeakerItemTap = onSpeakerItemTap;
