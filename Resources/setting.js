var win1 = Ti.UI.currentWindow;

var nickNameLabel = Ti.UI.createLabel({
	top:10,
	left:10,
	width:300,
	height:44,
	font:{fontSize:30},
	fontWeight:'bold'
});
nickNameLabel.text = 'ATNDニックネーム';

var nickNameText = Ti.UI.createTextField({
	hintText:'ニックネームを入力してください',
	top:10,
	left:310,
	width:300,
	height:44,
	keyboardType:Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
var nickNameData = Ti.App.Properties.getString('nickname');
if (nickNameData != null) {
	nickNameText.value = nickNameData;
};

var setButton = Ti.UI.createButton({
	title: '設定',
	left: 510,
	top:60,
	height: 40,
	width:100
});
setButton.addEventListener('click',function() {
	var nickName = nickNameText.value;
	Ti.App.Properties.setString('nickname',nickName);
	alert('ATNDニックネームを設定しました');
});

var iconCredit = Ti.UI.createLabel({
	text:"icon : iconfinder - CC BY 3.0",
	top: 150,
	left: 10,
	height:12,
	width:180,
	font:{fontSize:10} 
});
var patternCredit = Ti.UI.createLabel({
	text:"BackGroundImage : DinPattern",
	top:165,
	left:10,
	height:12,
	width:180,
	font:{fontSize:10}
});
win1.add(nickNameLabel);
win1.add(nickNameText);
win1.add(setButton);
win1.add(iconCredit);
win1.add(patternCredit);
