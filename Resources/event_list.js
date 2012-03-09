var win1 = Ti.UI.currentWindow;

var data = [];
var tableView = Ti.UI.createTableView({
	data:data
});

Ti.include("atnd_db.js");
var db = new AtndDB();

function loadEventData(eventList) {
	tableView.data = [];
	var currentData = [];
	for (var i=0; i<eventList.events.length; i++) {
		var eventData = eventList.events[i];
		var row = Ti.UI.createTableViewRow({
			height:50,
			hasChild:true,
			layout:'absolute'
		});
		var eventIDLabel = Ti.UI.createLabel({
			width:1,
			height:1,
			top:3,
			left:3,
			fontSize:6,
			fontWeight:'bold',
			fontColor:'#FFF'
		});
		eventIDLabel.text = eventData.event_id;
		row.add(eventIDLabel);
		
		var eventNameLabel = Ti.UI.createLabel({
			width:700,
			height:30,
			top:10,
			left:5,
			font:{fontSize:24},
			fontWeight:'bold'
		});
		eventNameLabel.text = eventData.title;
		row.add(eventNameLabel);
		
		currentData.push(row);
	}
	tableView.setData(currentData);
	tableView.addEventListener('click',function (e){
		var IDLabel = e.row.getChildren()[0]
		var NameLabel = e.row.getChildren()[1]
		db.addEvent({ eventID:IDLabel.text, eventName:NameLabel.text });
		Ti.App.Properties.setString('site','ATND');
		Ti.App.Properties.setString('lastEvent',IDLabel.text);
		Ti.App.fireEvent('custom',{
			eventID:IDLabel.text
		});
		win1.close();
	});
}

function dispMyEvent() {
	var xhr = Ti.Network.createHTTPClient();
	var nickName = Ti.App.Properties.getString('nickname');
	if (nickName == null || nickName.trim() == "") {
		alert('ATNDニックネームを設定してください。');
	} else {
		var url = "http://api.atnd.org/events/users/?nickname=" + nickName + "&format=json";
		xhr.open('GET',url);
		xhr.onload = function() {
			var eventList = JSON.parse(this.responseText);
			loadEventData(eventList);
		};
		xhr.send();
	};
}

dispMyEvent();

win1.add(tableView);
