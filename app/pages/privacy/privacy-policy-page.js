const topmost = require("ui/frame").topmost;
const fromObject = require("data/observable").fromObject; //needed for binding 

const webViewModule = require("tns-core-modules/ui/web-view"); 


var Observable = require("data/observable").Observable;
var colorModule = require("color");
var connectivity = require('connectivity');

var WebView = require("ui/web-view");


function onNavigatingTo(args) {
    const page = args.object;
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