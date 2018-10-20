var require = meteorInstall({"imports":{"api":{"tasks.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// imports/api/tasks.js                                                                          //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
module.export({
  Tasks: () => Tasks
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      }]
    });
  });
}

Meteor.methods({
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    const task = Tasks.findOne(taskId); // Make sure only the task owner can make a task private

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  }

});
///////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// server/main.js                                                                                //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
module.link("../imports/api/tasks.js");
///////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGFza3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIlRhc2tzIiwiTW9uZ28iLCJsaW5rIiwidiIsIkNvbGxlY3Rpb24iLCJNZXRlb3IiLCJpc1NlcnZlciIsInB1Ymxpc2giLCJ0YXNrc1B1YmxpY2F0aW9uIiwiZmluZCIsIiRvciIsInByaXZhdGUiLCIkbmUiLCJvd25lciIsInVzZXJJZCIsIm1ldGhvZHMiLCJ0YXNrSWQiLCJzZXRUb1ByaXZhdGUiLCJjaGVjayIsIlN0cmluZyIsIkJvb2xlYW4iLCJ0YXNrIiwiZmluZE9uZSIsIkVycm9yIiwidXBkYXRlIiwiJHNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0MsT0FBSyxFQUFDLE1BQUlBO0FBQVgsQ0FBZDtBQUFpQyxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsT0FBSyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsU0FBSyxHQUFDRSxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBR3BDLE1BQU1ILEtBQUssR0FBRyxJQUFJQyxLQUFLLENBQUNHLFVBQVYsQ0FBcUIsT0FBckIsQ0FBZDs7QUFFUCxJQUFJQyxNQUFNLENBQUNDLFFBQVgsRUFBcUI7QUFDbkI7QUFDQUQsUUFBTSxDQUFDRSxPQUFQLENBQWUsT0FBZixFQUF3QixTQUFTQyxnQkFBVCxHQUE0QjtBQUNsRCxXQUFPUixLQUFLLENBQUNTLElBQU4sQ0FBVztBQUNmQyxTQUFHLEVBQUUsQ0FDSDtBQUFFQyxlQUFPLEVBQUU7QUFBRUMsYUFBRyxFQUFFO0FBQVA7QUFBWCxPQURHLEVBRUg7QUFBRUMsYUFBSyxFQUFFLEtBQUtDO0FBQWQsT0FGRztBQURVLEtBQVgsQ0FBUDtBQU1ELEdBUEQ7QUFRRDs7QUFFRFQsTUFBTSxDQUFDVSxPQUFQLENBQWU7QUFDWixxQkFBbUJDLE1BQW5CLEVBQTJCQyxZQUEzQixFQUF5QztBQUN2Q0MsU0FBSyxDQUFDRixNQUFELEVBQVNHLE1BQVQsQ0FBTDtBQUNBRCxTQUFLLENBQUNELFlBQUQsRUFBZUcsT0FBZixDQUFMO0FBRUEsVUFBTUMsSUFBSSxHQUFHckIsS0FBSyxDQUFDc0IsT0FBTixDQUFjTixNQUFkLENBQWIsQ0FKdUMsQ0FNdkM7O0FBQ0EsUUFBSUssSUFBSSxDQUFDUixLQUFMLEtBQWUsS0FBS0MsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBTSxJQUFJVCxNQUFNLENBQUNrQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0Q7O0FBRUR2QixTQUFLLENBQUN3QixNQUFOLENBQWFSLE1BQWIsRUFBcUI7QUFBRVMsVUFBSSxFQUFFO0FBQUVkLGVBQU8sRUFBRU07QUFBWDtBQUFSLEtBQXJCO0FBQ0Q7O0FBYlcsQ0FBZixFOzs7Ozs7Ozs7OztBQ2pCQW5CLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHlCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuIFxuZXhwb3J0IGNvbnN0IFRhc2tzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3Rhc2tzJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gVGhpcyBjb2RlIG9ubHkgcnVucyBvbiB0aGUgc2VydmVyXG4gIE1ldGVvci5wdWJsaXNoKCd0YXNrcycsIGZ1bmN0aW9uIHRhc2tzUHVibGljYXRpb24oKSB7XG4gICAgcmV0dXJuIFRhc2tzLmZpbmQoe1xuICAgICAgICRvcjogW1xuICAgICAgICAgeyBwcml2YXRlOiB7ICRuZTogdHJ1ZSB9IH0sXG4gICAgICAgICB7IG93bmVyOiB0aGlzLnVzZXJJZCB9LFxuICAgICAgIF0sXG4gICAgIH0pO1xuICB9KTtcbn1cblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgJ3Rhc2tzLnNldFByaXZhdGUnKHRhc2tJZCwgc2V0VG9Qcml2YXRlKSB7XG4gICAgIGNoZWNrKHRhc2tJZCwgU3RyaW5nKTtcbiAgICAgY2hlY2soc2V0VG9Qcml2YXRlLCBCb29sZWFuKTtcblxuICAgICBjb25zdCB0YXNrID0gVGFza3MuZmluZE9uZSh0YXNrSWQpO1xuXG4gICAgIC8vIE1ha2Ugc3VyZSBvbmx5IHRoZSB0YXNrIG93bmVyIGNhbiBtYWtlIGEgdGFzayBwcml2YXRlXG4gICAgIGlmICh0YXNrLm93bmVyICE9PSB0aGlzLnVzZXJJZCkge1xuICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgIH1cblxuICAgICBUYXNrcy51cGRhdGUodGFza0lkLCB7ICRzZXQ6IHsgcHJpdmF0ZTogc2V0VG9Qcml2YXRlIH0gfSk7XG4gICB9LFxuIH0pOyIsImltcG9ydCAnLi4vaW1wb3J0cy9hcGkvdGFza3MuanMnOyAgXG4iXX0=
