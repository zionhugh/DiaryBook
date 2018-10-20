var require = meteorInstall({"imports":{"api":{"tasks.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/tasks.js                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Tasks: function () {
    return Tasks;
  }
});
var Mongo;
module.link("meteor/mongo", {
  Mongo: function (v) {
    Mongo = v;
  }
}, 0);
var Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function () {
    function tasksPublication() {
      return Tasks.find({
        $or: [{
          "private": {
            $ne: true
          }
        }, {
          owner: this.userId
        }]
      });
    }

    return tasksPublication;
  }());
}

Meteor.methods({
  'tasks.setPrivate': function (taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    var task = Tasks.findOne(taskId); // Make sure only the task owner can make a task private

    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {
      $set: {
        "private": setToPrivate
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"accounts-config.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/accounts-config.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 0);
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"AccountsUIWrapper.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/ui/AccountsUIWrapper.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return AccountsUIWrapper;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 1);
var Template;
module.link("meteor/templating", {
  Template: function (v) {
    Template = v;
  }
}, 2);
var Blaze;
module.link("meteor/blaze", {
  Blaze: function (v) {
    Blaze = v;
  }
}, 3);

var AccountsUIWrapper =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(AccountsUIWrapper, _Component);

  function AccountsUIWrapper() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AccountsUIWrapper.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      // Use Meteor Blaze to render login buttons
      this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container));
    }

    return componentDidMount;
  }();

  _proto.componentWillUnmount = function () {
    function componentWillUnmount() {
      // Clean up Blaze view
      Blaze.remove(this.view);
    }

    return componentWillUnmount;
  }();

  _proto.render = function () {
    function render() {
      // Just render a placeholder container that will be filled in
      return React.createElement("span", {
        ref: "container"
      });
    }

    return render;
  }();

  return AccountsUIWrapper;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"App.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/ui/App.js                                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 1);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 3);
var Tasks;
module.link("../api/tasks.js", {
  Tasks: function (v) {
    Tasks = v;
  }
}, 4);
var Task;
module.link("./Task.js", {
  "default": function (v) {
    Task = v;
  }
}, 5);
var AccountsUIWrapper;
module.link("./AccountsUIWrapper.js", {
  "default": function (v) {
    AccountsUIWrapper = v;
  }
}, 6);

var App =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(App, _Component);

  function App() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = App.prototype;

  _proto.handleSubmit = function () {
    function handleSubmit(event) {
      event.preventDefault();
      var textTitle = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
      var textArea = ReactDOM.findDOMNode(this.refs.areaInput).value.trim();
      Tasks.insert({
        textTitle: textTitle,
        textArea: textArea,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
      ReactDOM.findDOMNode(this.refs.titleInput).value = '';
      ReactDOM.findDOMNode(this.refs.areaInput).value = '';
    }

    return handleSubmit;
  }();

  _proto.renderTasks = function () {
    function renderTasks() {
      var _this = this;

      var filteredTasks = this.props.tasks;

      if (!this.props.currentUser) {
        filteredTasks = filteredTasks.filter(function (task) {
          return task.checked;
        });
      }

      return filteredTasks.map(function (task) {
        var currentUserId = _this.props.currentUser && _this.props.currentUser._id;
        var showPrivateButton = task.owner === currentUserId;
        return React.createElement(Task, {
          key: task._id,
          task: task,
          showPrivateButton: showPrivateButton
        });
      });
    }

    return renderTasks;
  }();

  _proto.render = function () {
    function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement("header", null, React.createElement("h1", null, "The Diary Book"), this.props.currentUser ? React.createElement("h3", null, "PrivateDiary:(", this.props.privateCount, ")") : '', React.createElement(AccountsUIWrapper, null), this.props.currentUser ? React.createElement("form", {
        className: "new-task",
        onSubmit: this.handleSubmit.bind(this)
      }, React.createElement("input", {
        id: "title",
        type: "text",
        ref: "titleInput",
        placeholder: "Type The Diary Title"
      }), React.createElement("textarea", {
        className: "new-text-area",
        type: "text",
        ref: "areaInput",
        placeholder: "Say Something Today..."
      }), React.createElement("br", null), React.createElement("button", {
        className: "form-submit",
        type: "submit"
      }, "Submit")) : ''), React.createElement("ul", null, this.renderTasks()));
    }

    return render;
  }();

  return App;
}(Component);

module.exportDefault(withTracker(function () {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch(),
    privateCount: Tasks.find({
      checked: {
        $ne: true
      }
    }).count(),
    currentUser: Meteor.user()
  };
})(App));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/ui/Task.js                                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  "default": function () {
    return Task;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var classnames;
module.link("classnames", {
  "default": function (v) {
    classnames = v;
  }
}, 2);
var Tasks;
module.link("../api/tasks.js", {
  Tasks: function (v) {
    Tasks = v;
  }
}, 3);

var Task =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(Task, _Component);

  function Task(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      textEditing: false
    };
    return _this;
  }

  var _proto = Task.prototype;

  _proto.toggleTextEditing = function () {
    function toggleTextEditing() {
      this.setState({
        textEditing: !this.state.textEditing
      });
    }

    return toggleTextEditing;
  }();

  _proto.toggleChecked = function () {
    function toggleChecked() {
      Tasks.update(this.props.task._id, {
        $set: {
          checked: !this.props.task.checked
        }
      });
      Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }

    return toggleChecked;
  }();

  _proto.deleteThisTask = function () {
    function deleteThisTask() {
      Tasks.remove(this.props.task._id);
    }

    return deleteThisTask;
  }();

  _proto.liClicked = function () {
    function liClicked() {
      Tasks.update(this.props.task._id, {
        $set: {
          onClick: !this.props.task.onClick
        }
      });
    }

    return liClicked;
  }();

  _proto.render = function () {
    function render() {
      var taskClassName = classnames({
        checked: this.props.task.checked,
        "private": this.props.task.private
      });
      var PrivateOrPublic = this.props.task.checked ? 'public' : 'private';
      var EditOrSave = !this.state.textEditing ? 'EditTitle' : 'SaveChange';
      return React.createElement("li", {
        className: taskClassName
      }, React.createElement("button", {
        className: "delete",
        onClick: this.deleteThisTask.bind(this)
      }, "\xD7"), React.createElement("input", {
        id: "inputTrueFalse",
        type: "checkbox",
        readOnly: true,
        checked: !!this.props.task.checked,
        onClick: this.toggleChecked.bind(this)
      }), React.createElement("button", {
        className: "editText",
        onClick: this.toggleTextEditing.bind(this)
      }, EditOrSave), React.createElement("div", {
        className: "toggleTrueFalse",
        onClick: this.liClicked.bind(this)
      }, React.createElement("span", {
        className: "text"
      }, "Created By ", this.props.task.username, ":", React.createElement("br", null), " \xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0", !this.state.textEditing ? React.createElement("span", {
        id: "toggleColor"
      }, "Title:", this.props.task.textTitle) : React.createElement("span", {
        id: "toggleTextChange"
      }, "Title:", React.createElement("input", {
        id: "titleChange",
        type: "text",
        ref: "titleChange",
        placeholder: this.props.task.textTitle
      }), React.createElement("button", {
        className: "form-submit",
        type: "submit"
      }, "Submit"))), React.createElement("br", null), " \xA0\xA0\xA0\xA0\xA0\xA0\xA0", React.createElement("span", {
        className: "text_status"
      }, "Status:", PrivateOrPublic), this.props.task.onClick ? '' : React.createElement("div", {
        id: "areaText"
      }, React.createElement("span", {
        className: "text"
      }, this.props.task.textArea))));
    }

    return render;
  }();

  return Task;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/main.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var render;
module.link("react-dom", {
  render: function (v) {
    render = v;
  }
}, 2);
module.link("../imports/startup/accounts-config.js");
var App;
module.link("../imports/ui/App.js", {
  "default": function (v) {
    App = v;
  }
}, 3);
Meteor.startup(function () {
  render(React.createElement(App, null), document.getElementById('render-target'));
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");