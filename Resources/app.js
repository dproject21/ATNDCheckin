// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.App.idleTimerDisabled = true;
// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    url:'entry_list.js',
    title:'出席確認',
    backgroundImage:'image/light-tile.gif',
    backgroundRepeat: true,
	repeatCount:10
});
var tab1 = Titanium.UI.createTab({  
    window:win1
});

win1.eventID = '23850'
win1.hideTabBar();
tabGroup.addTab(tab1);  
tabGroup.open();
