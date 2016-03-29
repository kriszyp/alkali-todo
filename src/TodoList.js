/*
This is our canonical "data model", holding the list of todo items.
We could override various methods to store this somewhere if we wanted.
*/

import Variable from 'alkali/Variable';

let TodoList = Variable.extend({
	// define the default value as an array
	default: [],
	completeAll() {
		this.forEach((todo) => {
			if (!todo.completed) {
				todo.completed = true;
				this.updated(todo);
			}
		});
	},
	delete(item) {
		this.splice(this.valueOf().indexOf(item), 1)
	}
})

export default TodoList;