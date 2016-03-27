import Variable from 'alkali/Variable';

TodoList = class extends Variable {
	completeAll() {
		this.forEach((todo) => {
			if (!todo.completed) {
				todo.completed = true;
				this.updated(todo);
			}
		});
	}
}
export default class Todo extends Variable {
	constructor() {
		this.list = TodoList.for(this)
	}
	add() {
		this.push({ // add a new todo
			name: this.get('newItem')
		});
		this.set('newItem', '') // clear out the input
	}
	completeAll() {
		this.list.completeAll()
	}

	delete(todo) {
		this.list.splice(this.list.indexOf(todo), 1);
	}
	get activeView() {
		return this.list.filter((todo) => !todo.completed)
	}
	get completedView() {
		return this.list.filter((todo) => todo.completed)
	}
	get listView() {
		return currentPath.to((path) =>
			path === 'all' ? this.list :
			path === 'completed' ? this.completedView :
			path === 'active' ?  this.activeView :
				this.list);
	}
	get todoCount() {
		return this.activeView.to((active) => active.length)
	}
}

// our router
let currentPath = new Variable(location.hash);
window.onhashchange = () => {
	currentPath.put(location.hash.replace(/#\//, ''));
};
