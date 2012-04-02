var win1 = Ti.UI.currentWindow;

var IDLabel = Ti.UI.createLabel({
	top:10,
	left:10,
	width:300,
	height:44,
	font:{fontSize:30},
	fontWeight:'bold'
});
IDLabel.text = 'イベントID';

var IDText = Ti.UI.createTextField({
	hintText:'URLの数字を入力してください',
	top:10,
	left:310,
	width:300,
	height:44,
	keyboardType:Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var setButton = Ti.UI.createButton({
	title: '出席確認をする',
	left: 450,
	top:60,
	height: 40,
	width:160
});
setButton.addEventListener('click',function() {
	Ti.App.Properties.setString('site','kokucheese');
	Ti.App.Properties.setString('lastEvent',IDText.value);
	Ti.App.fireEvent('kokucheese',{
		eventID:IDText.value
	});
	win1.close();
});

win1.add(IDLabel);
win1.add(IDText);
win1.add(setButton);

