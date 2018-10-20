
import React, { Component } from 'react';  
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';  


export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textEditing: false,
    };
  }

  toggleTextEditing(){
    this.setState({
      textEditing:!this.state.textEditing,
    })
  }

  toggleChecked() {

     Tasks.update(this.props.task._id, {  
       $set: { checked: !this.props.task.checked },
     });
     Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  deleteThisTask() {  
     Tasks.remove(this.props.task._id);
  }
  
  liClicked() {  
     Tasks.update(this.props.task._id,{
       $set:{ onClick: !this.props.task.onClick },
     });
  }

  render() {
  	
    const taskClassName = classnames({
       checked: this.props.task.checked,
       private: this.props.task.private,
    });
    const PrivateOrPublic = this.props.task.checked ? 'public' :'private';
    const EditOrSave = !this.state.textEditing ? 'EditTitle' : 'SaveChange'

    return (
      <li className={taskClassName}>
         <button className="delete" onClick={this.deleteThisTask.bind(this)}>
           &times;
         </button>
         <input
           id="inputTrueFalse"
           type="checkbox"
           readOnly
           checked={!!this.props.task.checked}
           onClick={this.toggleChecked.bind(this)}
         />
         <button className="editText" onClick={this.toggleTextEditing.bind(this)}> 
           {EditOrSave}
         </button>

      <div className="toggleTrueFalse" onClick={this.liClicked.bind(this)}>
           <span className="text">
              Created By {this.props.task.username}: 
              <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {!this.state.textEditing ? <span id="toggleColor">Title:{this.props.task.textTitle}</span> :
              <span id="toggleTextChange" >
              Title:
              <input id="titleChange" 
                 type="text"
                 ref="titleChange"
                 placeholder={this.props.task.textTitle}/>
              <button className="form-submit" type="submit">Submit</button>
              </span> }
           </span>
           <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <span className="text_status">
              Status:{PrivateOrPublic}
           </span>
           { this.props.task.onClick ?
           '' : 
            <div id="areaText">
            <span className="text">
              {this.props.task.textArea}
            </span>
            </div>
           }
      </div>
       </li>
    );
  }
}
