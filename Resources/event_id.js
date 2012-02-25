var win1 = Ti.UI.currentWindow

var eventIDText = Ti.UI.createTextField({
	hintText:'イベントIDを入力してください',
	top:10,
	left:10,
	width:250,
	height:40,
	keyboardType:Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win1.add(eventIDText);

var getButton = Ti.UI.createButton({
	title: '決定',
	height: 40,
	width:100
});
getButton.addEventListener('click',function() {
	Ti.App.fireEvent('custom', {
		eventID:eventIDText.value
	});
	win1.close();
});

win1.add(getButton);


