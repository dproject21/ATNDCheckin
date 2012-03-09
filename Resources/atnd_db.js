var AtndDB = function() {
	this.dbName = 'ATND_DB';
	
	this.open = function () {
		this.db = Ti.Database.open(this.dbName);
	};
	
	this.close = function() {
		this.db.close();
	}
	
	this.addUsers = function(entryList) {
		this.open();
		for (var i=0; i<entryList.users.length; i++) {
			var user = entryList.users[i];
			var rows = this.db.execute(
				'select * from users where event_id = ? and service = ? and user_id = ?',
				entryList.event_id,
				'ATND',
				user.user_id
			);
			if (rows.getRowCount() > 0 ) continue;
			
			var res = this.db.execute(
				'insert into users (event_id, service, user_id, nickname, twitter_id, twitter_img, arrive, party, status) values(?,?,?,?,?,?,?,?,?)',
				entryList.event_id,
				'ATND',
				user.user_id,
				user.nickname,
				user.twitter_id,
				user.twitter_img,
				0,
				0,
				user.status
			);
		}
		this.close();
		return true;
	};
	
	this.addKokucheeseUsers = function(entryList,eventID) {
		this.open();
		for (var i=0; i<entryList.channel.item.length; i++) {
			var user = entryList.channel.item[i];
			if (user.title == null) {
				continue;
			}
			var rows = this.db.execute(
				'select * from users where event_id = ? and service = ? and nickname = ?',
				eventID,
				'kokucheese',
				user.title
			);
			if (rows.getRowCount() > 0 ) continue;
			
			var res = this.db.execute(
				'insert into users (event_id, service, user_id, nickname, twitter_id, twitter_img, arrive, party, status) values(?,?,?,?,?,?,?,?,?)',
				eventID,
				'kokucheese',
				null,
				user.title,
				null,
				null,
				0,
				0,
				1
			);
		}
		this.close();
		return true;
	};
	
	this.addEvent = function(event) {
		this.open();
		var rows = this.db.execute(
			'select * from events where event_id = ? and service = ?',
			event.eventID,
			'ATND'
		);		
		if (rows.getRowCount() > 0) return true;
		
		var insertEvent = this.db.execute(
			'insert into events (event_id,event_name,service) values(?,?,?)',
			event.eventID,
			event.eventName,
			'ATND'
		);
		this.close();
		return true;
	};
	
	this.addKokucheeseEvent = function(event,eventID) {
		this.open();
		var rows = this.db.execute(
			'select * from events where event_id = ? and service = ?',
			eventID,
			'kokucheese'
		);		
		if (rows.getRowCount() > 0) return true;
		
		var insertEvent = this.db.execute(
			'insert into events (event_id,event_name,service) values(?,?,?)',
			eventID,
			event.channel.description,
			'kokucheese'
		);
		this.close();
		return true;
	};
	
	this.getSavedUsers = function(eventID,site) {
		this.open();
		var rows = this.db.execute('select * from users where event_id = ? and service = ? order by status desc, nickname',
									eventID,
									site);
		var res = [];
		if (rows.getRowCount() > 0 ) {
			while (rows.isValidRow() ) {
				var userObj = {};
				userObj.event_id = rows.fieldByName('event_id');
				userObj.service = rows.fieldByName('service');
				userObj.user_id = rows.fieldByName('user_id');
				userObj.nickname = rows.fieldByName('nickname');
				userObj.twitter_id = rows.fieldByName('twitter_id');
				userObj.twitter_img = rows.fieldByName('twitter_img');
				userObj.arrive = rows.fieldByName('arrive');
				userObj.party = rows.fieldByName('party');
				userObj.status = rows.fieldByName('status');
				res.push(userObj);
				rows.next();
			}
		}
		rows.close();
		this.close();
		return res;
	};
	
	this.getSavedEvent = function(eventID,site) {
		this.open();
		var rows = this.db.execute('select * from events where event_id = ? and service = ?',
									eventID,
									site);
		var eventObj = {};
		if (rows.getRowCount() > 0) {
			eventObj.event_id = rows.fieldByName('event_id');
			eventObj.service = rows.fieldByName('service');
			eventObj.event_name = rows.fieldByName('event_name');			
		}
		rows.close();
		this.close();
		return eventObj;
	};
	
	this.changeArrive = function(eventID,nickname,arrive,site) {
		this.open();
		this.db.execute('update users set arrive = ? where event_id = ? and service = ? and nickname = ?',
						arrive,
						eventID,
						site,
						nickname);
		this.close();
		return true;
	};
	
	this.changeParty = function(eventID,nickname,party,site) {
		this.open();
		this.db.execute('update users set party = ? where event_id = ? and service = ? and nickname = ?',
						party,
						eventID,
						site,
						nickname);
		this.close();
		return true;
	}

	this.getArriveCount = function(eventID,site) {
		this.open();
		var row = this.db.execute('select count(*) as arrivecount from users where event_id = ? and service = ? and arrive = 1',
									eventID,
									site);
		var count = row.fieldByName('arrivecount');
		this.close();
		return count;
	}
	
	this.getUserCount = function(eventID,site) {
		this.open();
		var row = this.db.execute('select count(*) as usercount from users where event_id = ? and service = ?',
									eventID,
									site);
		var count = row.fieldByName('usercount');
		this.close();
		return count;
	}
	
	this.getPartyCount = function(eventID,site) {
		this.open();
		var row = this.db.execute('select count(*) as partycount from users where event_id = ? and service = ? and party = 1',
									eventID,
									site);
		var count = row.fieldByName('partycount');
		this.close();
		return count;
	}
	this.open();
	this.db.execute('create table if not exists users(event_id INTEGER, service TEXT, user_id TEXT, nickname TEXT, twitter_id TEXT, twitter_img TEXT, arrive INTEGER, party INTEGER, status INTEGER)');
	this.db.execute('create table if not exists events(event_id INTEGER, event_name TEXT, service TEXT)');
	this.close();
};
