/*
This module represents the "view model" in MVVM parlance (or an MVC 
controller that offers "data views"). The data "model" is found in
the TodoList (although it is little more than a variable that holds
an array).
*/
import Variable from 'alkali/Variable';
import { Item } from 'alkali/Element';
import TodoList from './TodoList';

// our router, expressed as a variable
let currentPath = new Variable(location.hash.replace(/#\//, ''));
window.onhashchange = () => {
	currentPath.put(location.hash.replace(/#\//, ''));
};


let ActiveView, CompletedView;
// the main view model
export default class Todo extends Variable({
	add() {
		// add a new todo
		TodoList.for(this).push({
			name: this.get('newItem')
		});
		// clear out the input
		this.set('newItem', '');
	},
	// delegate this to the list data model
	clearCompleted: TodoList.clearCompleted,
	allCompleted:
		// the checkbox corresponds to the state of the todos
		TodoList.to((todos) =>
			todos.length && todos.every((todo) => todo.completed))
		.setReverse( // and define the reverse action when the checkbox changes
			(allCompleted) =>
				TodoList.defaultInstance.forEach((todo) => {
					new Variable(todo).set('completed', allCompleted);
				})),
	delete(event) {
		// delete a todo
		TodoList.for(this).delete(Item.for(event).valueOf());
	},
	// our three data "views" of the different filtered todo lists
	activeView: ActiveView = TodoList.filter((todo) => !todo.completed),
	completedView: CompletedView = TodoList.filter((todo) => todo.completed),
	listView: currentPath.to((path) =>
		// determine which view to show based on the current hash path
		path === 'completed' ? CompletedView :
		path === 'active' ?  ActiveView :
		TodoList),
	todoCount: ActiveView.to((active) => active.length)
}) {
}
