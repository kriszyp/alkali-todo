/*
This is our canonical "data model", holding the list of todo items.
We could override various methods to store this somewhere if we wanted.
There is not much to this, it is ybasically is a variable that holds
an array of objects
*/

import Variable from 'alkali/Variable';

let TodoList = Variable.extend({
	// define the default value as an array
	default: [],
	clearCompleted() {
		// make a copy of the array first, because it changes while we modify it
		this.valueOf().slice(0).forEach((todo) => {
			if (todo.completed) {
				this.delete(todo)
			}
		});
	},

	delete(item) {
		this.splice(this.valueOf().indexOf(item), 1)
	}
})

export default TodoList;