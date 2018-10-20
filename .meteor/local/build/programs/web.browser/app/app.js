var require = meteorInstall({"imports":{"api":{"tasks.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/tasks.js                                                                                             //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"accounts-config.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/startup/accounts-config.js                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"AccountsUIWrapper.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/AccountsUIWrapper.js                                                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  default: () => AccountsUIWrapper
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 1);
let Template;
module.link("meteor/templating", {
  Template(v) {
    Template = v;
  }

}, 2);
let Blaze;
module.link("meteor/blaze", {
  Blaze(v) {
    Blaze = v;
  }

}, 3);

class AccountsUIWrapper extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container));
  }

  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }

  render() {
    // Just render a placeholder container that will be filled in
    return React.createElement("span", {
      ref: "container"
    });
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"App.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/App.js                                                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 3);
let Tasks;
module.link("../api/tasks.js", {
  Tasks(v) {
    Tasks = v;
  }

}, 4);
let Task;
module.link("./Task.js", {
  default(v) {
    Task = v;
  }

}, 5);
let AccountsUIWrapper;
module.link("./AccountsUIWrapper.js", {
  default(v) {
    AccountsUIWrapper = v;
  }

}, 6);

class App extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const textTitle = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const textArea = ReactDOM.findDOMNode(this.refs.areaInput).value.trim();
    Tasks.insert({
      textTitle,
      textArea,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.areaInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (!this.props.currentUser) {
      filteredTasks = filteredTasks.filter(task => task.checked);
    }

    return filteredTasks.map(task => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return React.createElement(Task, {
        key: task._id,
        task: task,
        showPrivateButton: showPrivateButton
      });
    });
  }

  render() {
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

}

module.exportDefault(withTracker(() => {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Task.js                                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  default: () => Task
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let classnames;
module.link("classnames", {
  default(v) {
    classnames = v;
  }

}, 2);
let Tasks;
module.link("../api/tasks.js", {
  Tasks(v) {
    Tasks = v;
  }

}, 3);

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textEditing: false
    };
  }

  toggleTextEditing() {
    this.setState({
      textEditing: !this.state.textEditing
    });
  }

  toggleChecked() {
    Tasks.update(this.props.task._id, {
      $set: {
        checked: !this.props.task.checked
      }
    });
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  liClicked() {
    Tasks.update(this.props.task._id, {
      $set: {
        onClick: !this.props.task.onClick
      }
    });
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private
    });
    const PrivateOrPublic = this.props.task.checked ? 'public' : 'private';
    const EditOrSave = !this.state.textEditing ? 'EditTitle' : 'SaveChange';
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

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// client/main.js                                                                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 2);
module.link("../imports/startup/accounts-config.js");
let App;
module.link("../imports/ui/App.js", {
  default(v) {
    App = v;
  }

}, 3);
Meteor.startup(() => {
  render(React.createElement(App, null), document.getElementById('render-target'));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});

var exports = require("/client/main.js");