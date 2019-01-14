const topmost = require("ui/frame").topmost;
const fromObject = require("data/observable").fromObject; //needed for binding 

const SessionsListViewModel = require("./sessions-list-view-model");
var colorModule = require("color");

var timer = require("timer");
var connectivity = require('connectivity');

var dropdown = require("nativescript-drop-down");

let itemSource = ["ALL Sessions", "Session #1", "Session #2", "Session #3"]; // items of dropdown menu
var viewModel = new SessionsListViewModel(); 

//import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";


function onNavigatingTo(args) {
    const page = args.object;

    //let viewModel = page.bindingContext;

    if (!args.isBackNavigation) {
        //we are landing on the list page for the first time

        //set up the view model for the list
        //const viewModel = new SessionsListViewModel(); 
        page.bindingContext = viewModel;


        viewModel.loadSchedule(); 
        viewModel.loadSchools(); 
        //viewModel.load(); 
    }

    let dd = page.getViewById("dd");
   
    dd.items = itemSource;
}

 
function onPullToRefreshInitiated(args) {
    console.log('Pull to refresh sessions data initiated');
    var page = args.object; 
    let viewModel = page.bindingContext;

    //empty and refresh the UI right away
    /*TODO: this code crashed the app
    viewModel.empty();
    var allSessionsListView = page.getViewById("allSessionsList");
    allSessionsListView.refresh();
    */
    
    timer.setTimeout(function() {
        //calling different load functions depending on connectivity 
        if (connectivity.getConnectionType() === connectivity.connectionType.none) {
            viewModel.offlineLoad();    
        } else {
            //reload the data
            viewModel.load();
        }
        page.notifyPullToRefreshFinished(viewModel);
    }, 1000);
}

function onNavigatingFrom(args) {
    const page = args.object;
    const oldViewModel = page.bindingContext;
    if (oldViewModel) {
        oldViewModel.unload();
    }
}

function onTabStarTapped(args) {
    var tappedSessionView = args.view;
    var tappedSessionItem = tappedSessionView.bindingContext;

   
    tappedSessionItem.starred = !tappedSessionItem.starred; 
   
    //two-way data binding works, but somehow is not updating the view, so we'll forcefully refresh the listview
    var page = tappedSessionView.page;
    let viewModel = page.bindingContext;
    
    //refresh the main list and the selected list 
    var allSessionsListView = page.getViewById("allSessionsList");
    var selectedSessionsListView = page.getViewById("selectedSessionsList");
    allSessionsListView.refresh();
    selectedSessionsListView.refresh();

    //viewModel.persist(tappedSessionItem.id); 
    viewModel.persistAllSelectedSessions();
}




function onSessionItemTap(args) {
    const tappedSessionItem = args.view.bindingContext;

    //RadListView doesn't have the ListView feature to automatically change the background color of a list row when tapped.
    //So we are hacking it here
    args.view.backgroundColor = new colorModule.Color("#dbdbdd");

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

function scheduleTemplateSelector(item, index, items) {
   
    if(index == 0) {
        return "header";
    } else if (index > 0 && index < items.length -1){
        return "middle";
    } else {
        return "footer";
    }
}

function dropDownSelectedIndexChanged() {
    var page = topmost().currentPage;
    dd = page.getViewById("dd");
    let selectedValue = itemSource[dd.selectedIndex];

    console.log("DROPDOWN SELECTED VALUE: " + selectedValue); 

    let viewModel = page.bindingContext;

    if(selectedValue == "ALL Sessions") {
        viewModel.makeVisible(4); 
    } else if(selectedValue == "Session #1") {
        viewModel.makeVisible(1); 
    } else if(selectedValue == "Session #2") {
        viewModel.makeVisible(2); 
    } else if(selectedValue == "Session #3") {
        viewModel.makeVisible(3); 
    }


    //refresh lists
    var allSessionsListView = page.getViewById("allSessionsList");
    var selectedSessionsListView = page.getViewById("selectedSessionsList");
    allSessionsListView.refresh();
    selectedSessionsListView.refresh();

} 

//index of tab view 
function onSelectedIndexChanged(args) {
    if(args.oldIndex!== -1) {
        var tabSelectedIndex = args.object.selectedIndex; 
        console.log("Selected Index: " + tabSelectedIndex); 
        console.log("GLOBAL VARIABLE IS " + global.listLoaded);

        if(tabSelectedIndex = 1 && global.listLoaded == false) {
            global.listLoaded = true; 
            var page = args.object; 
            var viewModel = page.bindingContext;
            
            if(connectivity.getConnectionType() === connectivity.connectionType.none) {
                viewModel.offlineLoad();    
            } else {
                viewModel.load();
            }
        }
    }
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
        var page = topmost().currentPage;
        page.getViewById("sideDrawer").toggleDrawerState();
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
exports.onSessionItemTap = onSessionItemTap;
exports.onTabStarTapped = onTabStarTapped;
exports.onPullToRefreshInitiated = onPullToRefreshInitiated;
exports.scheduleTemplateSelector = scheduleTemplateSelector; 
exports.dropDownSelectedIndexChanged = dropDownSelectedIndexChanged; 
exports.onSelectedIndexChanged = onSelectedIndexChanged; 
