/*
 * lib.js
 */

if (typeof window === "undefined") {  
  // we're in node
	var window = {};
}
window.oslib = window.oslib || {};


window.oslib.fetchPeople = function() {
  var batch = osapi.newBatch().
      add('viewer', osapi.people.getViewer()).
      add('friends', osapi.people.get({userId: '@viewer', groupId: '@friends'}));
  batch.execute(function(result) {
    document.getElementById('viewer').innerHTML = result.viewer.id;
    var friends = result.friends.list;
    for (var i = 0; i < friends.length; i++) {
      document.getElementById('friends').innerHTML += '<li>' + friends[i].id + '</li>';
    }
    gadgets.window.adjustHeight();
  });
};

window.oslib.postActivity = function() {
  var title = document.getElementById('title').value;
  var req = osapi.activities.create({activity: {title: title}});
  req.execute(function(response) {
    if (response.error) {
      document.getElementById('result_activity').innerHTML = response.error.message;
    } else {
      document.getElementById('result_activity').innerHTML = 'Succeeded!';
    }
    gadgets.window.adjustHeight();
  });
};

window.oslib.shareData = function() {
  var content = document.getElementById('content').value;
  var req = osapi.appdata.update({userId: '@viewer', data: {content: content}});
  req.execute(function(response) {
    if (response.error) {
      document.getElementById('result_appdata').innerHTML = response.error.message;
    } else {
      document.getElementById('result_appdata').innerHTML = 'Succeeded!';
    }
    gadgets.window.adjustHeight();
  });
};

window.oslib.fetchFriendData = function() {
  var req = osapi.appdata.get({userId: '@viewer', groupId: '@friends', keys: ['content']});
  req.execute(function(response) {
    for (var id in response) {
      var obj = response[id];
      document.getElementById('contents').innerHTML += '<li>' + id + ': ' + obj.content + '</li>';
    }
    gadgets.window.adjustHeight();
  });
};

window.oslib.testFunction = function() {
    return 1;
};

if (typeof exports !== "undefined") {
    // we're in node
    exports.testFunction = window.oslib.testFunction;
}