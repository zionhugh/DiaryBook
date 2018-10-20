
import React, { Component } from 'react';  
import ReactDOM from 'react-dom';  
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';  

import { Tasks } from '../api/tasks.js'; 
 
import Task from './Task.js';  
import AccountsUIWrapper from './AccountsUIWrapper.js';  
 

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
       username: Meteor.user().username,  
     });

     ReactDOM.findDOMNode(this.refs.titleInput).value = '';
     ReactDOM.findDOMNode(this.refs.areaInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (!this.props.currentUser) {
      filteredTasks = filteredTasks.filter(task => task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>The Diary Book</h1>

          { this.props.currentUser ? <h3>PrivateDiary:({this.props.privateCount})</h3> : ''}

          <AccountsUIWrapper />


          { this.props.currentUser ?
             <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
               <input
                 id="title"
                 type="text"
                 ref="titleInput"
                 placeholder="Type The Diary Title"
               />
               <textarea className="new-text-area" 
                 type="text"
                 ref="areaInput"
                 placeholder="Say Something Today..."
               />
               <br />
               <button className="form-submit" type="submit">Submit</button>
             </form> : ''
          }
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
   return {
     tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),  
     privateCount: Tasks.find({ checked: { $ne: true } }).count(),  
     currentUser: Meteor.user(), 
   };
})(App);