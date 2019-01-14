const topmost = require("ui/frame").topmost;
var colorModule = require("color");
const SessionDetailViewModel = require("./session-detail-view-model");
var utilsModule = require("tns-core-modules/utils/utils"); 

var link = "";
var speakerName = ""
var speakerFirstName = ""
var speakerLastName = ""

function onNavigatingTo(args) {
    if (args.isBackNavigation) {
        return;
    }

    const page = args.object;

    page.bindingContext = new SessionDetailViewModel(page.navigationContext);
    link = page.bindingContext.session.presenterResourcePage; 

    speakerFirstName = page.bindingContext.session.firstName;
    speakerLastName = page.bindingContext.session.lastName;
    speakerName = speakerFirstName + " " + speakerLastName; 
}

function onBackButtonTap() {
    topmost().goBack();
}

function onLinkTapped(args) {
    console.log("LINK IS " + link); 
    utilsModule.openUrl(link);
}

function onPresenterTapped() {

    var tappedSpeakerItem = {"firstName" : speakerFirstName, "lastName" : speakerLastName, "fullName": speakerName}

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
exports.onBackButtonTap = onBackButtonTap;
exports.onLinkTapped = onLinkTapped; 
exports.onPresenterTapped = onPresenterTapped; 