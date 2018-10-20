
import { Mongo } from 'meteor/mongo';
 
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
       $or: [
         { private: { $ne: true } },
         { owner: this.userId },
       ],
     });
  });
}

Meteor.methods({
   'tasks.setPrivate'(taskId, setToPrivate) {
     check(taskId, String);
     check(setToPrivate, Boolean);

     const task = Tasks.findOne(taskId);

     // Make sure only the task owner can make a task private
     if (task.owner !== this.userId) {
       throw new Meteor.Error('not-authorized');
     }

     Tasks.update(taskId, { $set: { private: setToPrivate } });
   },
 });