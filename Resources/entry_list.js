var win1 = Ti.UI.currentWindow;

var getDataButton = Ti.UI.createButton({
	title:'イベント選択'
});

getDataButton.addEventListener('click',function() {
	var eventIDWindow = Ti.UI.createWindow(
		{
			url:'event_list.js',
			title:'イベント選択',
			backgroundColor:'#fff'
		}
	);
	Ti.UI.currentTab.open(eventIDWindow);
});
win1.rightNavButton = getDataButton;

var settingButton = Ti.UI.createButton({
	title:'設定'
});

settingButton.addEventListener('click',function() {
	var settingWindow = Ti.UI.createWindow({
		url:'setting.js',
		title:'ニックネーム設定',
    	backgroundImage:'image/light-tile.gif',
		repeatCount:10
    });
	Ti.UI.currentTab.open(settingWindow);
});
win1.leftNavButton = settingButton;

var eventIDLabel = Ti.UI.createLabel ({
	top:3,
	left:3,
	height:1,
	width:1,
	fontSize:7,
	fontWeight:'bold',
	color:'#FFF'
});

var eventNameLabel = Ti.UI.createLabel ({
	top: 5,
	left: 5,
	height: 34,
	width: 600,
	font:{fontSize:29},
	fontWeight:'bold',
	color:'#000'
});

var registLabel = Ti.UI.createLabel ({
	top:44,
	left:5,
	height: 22,
	width: 80,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
	text:'申込人数'
});

var registCountLabel = Ti.UI.createLabel ({
	top:44,
	left: 90,
	height: 22,
	width: 50,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
});

var arriveLabel = Ti.UI.createLabel ({
	top:44,
	left: 150,
	height: 22,
	width: 80,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
	text:'参加人数'
});

var arriveCountLabel = Ti.UI.createLabel ({
	top:44,
	left: 240,
	height: 22,
	width: 50,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
});

var partyLabel = Ti.UI.createLabel ({
	top:44,
	left: 300,
	height: 22,
	width: 100,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
	text:'懇親会人数'
});

var partyCountLabel = Ti.UI.createLabel ({
	top:44,
	left: 410,
	height: 22,
	width: 50,
	fontSize: 6,
	fontWeight:'bold',
	color:'#000',
});
	
var data = [];
var tableView = Ti.UI.createTableView({
	top:71,
	left:0,
	data:data
});

	var clickEvent = function(e) {
			var statusLabel = e.row.getChildren()[3]
			var partyLabel = e.row.getChildren()[4]
			var nickNameLabel = e.row.getChildren()[1]
			var arriveCount = arriveCountLabel.text
			var partyCount = partyCountLabel.text
			if (statusLabel.text == "まだ来てない" && partyLabel.text == "懇親会参加しない") {
				statusLabel.text = "出席"
				db.changeArrive(eventIDLabel.text,nickNameLabel.text,1);
				arriveCount = arriveCount + 1;
				arriveCountLabel.text = arriveCount;
			} else if (statusLabel.text == "出席" && partyLabel.text == "懇親会参加しない") {
				partyLabel.text = "懇親会参加する"
				db.changeParty(eventIDLabel.text,nickNameLabel.text,1);
				partyCount = partyCount + 1;
				partyCountLabel.text = partyCount;
			} else if (statusLabel.text = "出席" && partyLabel.text == "懇親会参加する")　{
				statusLabel.text = "まだ来てない"
				partyLabel.text = "懇親会参加しない"
				db.changeArrive(eventIDLabel.text,nickNameLabel.text,0);
				db.changeParty(eventIDLabel.text,nickNameLabel.text,0);
				arriveCount = arriveCount - 1;
				partyCount = partyCount - 1;
				arriveCountLabel.text = arriveCount;
				partyCountLabel.text = partyCount;
			};
		}

tableView.addEventListener('click', clickEvent);

Ti.include("atnd_db.js");
var db = new AtndDB();

function getUserList (list) {
	tableView.data = null;
	var currentData = [];
	db.addUsers(list.events[0]);
	var userList = db.getSavedUsers(list.events[0].event_id);
	for (var i=0; i < userList.length; i++) {
		var entryUser = userList[i];
		var row = Ti.UI.createTableViewRow(
			{
				height: 52,
				layout: 'absolute'
			}
		);
		var imageView = Ti.UI.createImageView (
			{
				image: entryUser.twitter_img,
				width:44,
				height:44,
				top:4,
				left:4
			}
		);
		row.add(imageView);
		var nicknameLabel = Ti.UI.createLabel(
			{
				width:200,
				height:20,
				left:52,
				top:4,
				font:{fontSize:18},
				fontWeight:'bold',
				color:'#2b4771'
			}
		);
		nicknameLabel.text = entryUser.nickname;
		row.add(nicknameLabel);
		
		var statusLabel = Ti.UI.createLabel({
			width:60,
			height:20,
			left:52,
			top:28,
			font:{fontSize:18},
			color:'#2b4771'
		});
		if (entryUser.status == 0) {
			statusLabel.text = "補欠"
		}
		row.add(statusLabel)
		
		var statusLabel = Ti.UI.createLabel(
			{
				width:262,
				height:20,
				left:264,
				top:4,
				fontSize:6
			}
		);
		if (entryUser.arrive == 0) {
			statusLabel.text = "まだ来てない"
		} else {
			statusLabel.text = "出席"
		}
		row.add(statusLabel);
		
		var partyLabel = Ti.UI.createLabel(
			{
				width:262,
				height:20,
				left:264,
				top:28,
				fontSize:6
			}
		);
		if (entryUser.party == 0) {
			partyLabel.text = "懇親会参加しない"
		} else {
			partyLabel.text = "懇親会参加する"
		}
		row.add(partyLabel);
			
		currentData.push(row);
	}
	tableView.setData(currentData);
}

function dispEventData (ID) {
	var xhr = Ti.Network.createHTTPClient();
	var userlist = null;
	var url = "http://api.atnd.org/events/users/?event_id=" + ID + "&format=json";
	xhr.open('GET', url);
	xhr.onload = function() {
		userlist = JSON.parse(this.responseText);
		getUserList(userlist);
		dispEventDetail(ID);
	};
	xhr.send();
}

function dispEventDetail (ID) {
	var eventDetail = db.getSavedEvent(ID);
	eventIDLabel.text = eventDetail.event_id;
	eventNameLabel.text = eventDetail.event_name;
	var registCount = db.getUserCount(ID);
	registCountLabel.text = registCount;
	var arriveCount = db.getArriveCount(ID);
	arriveCountLabel.text = arriveCount;
	var partyCount = db.getPartyCount(ID);
	partyCountLabel.text = partyCount;
	
};

var nickName = Ti.App.Properties.getString('nickname');
var eventID = Ti.App.Properties.getString('lastEvent');

if (nickName == null || nickName.trim() == "") {
	alert('ATNDニックネームを設定してください');
} else {
	if (eventID != null && nickName.trim() != "") {
		dispEventData(eventID);		
	}
};

Titanium.App.addEventListener('custom',function(e) {
	dispEventData(e.eventID);
});	
	
win1.add(eventIDLabel);
win1.add(eventNameLabel);
win1.add(registLabel);
win1.add(registCountLabel);
win1.add(arriveLabel);
win1.add(arriveCountLabel);
win1.add(partyLabel);
win1.add(partyCountLabel);

win1.add(tableView);
