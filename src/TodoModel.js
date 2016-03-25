import Variable from 'alkali/Variable';

export default class TodoModel extends Variable {
	add() {
		this.push({
			name: this.get('newItem')
		});
	}
	completeAll() {
		this.forEach((todo) => {
			if (!todo.completed) {
				todo.completed = true;
				this.updated(todo);
			}
		});
	}
	delete(todo) {
		this.splice(this.indexOf(todo), 1);
	}
	get activeView() {
		return this.filter((todo) => !todo.completed)
	}
	get completedView() {
		return this.filter((todo) => todo.completed)
	}
	get todoView() {
		return currentPath.to((path) =>
			path === 'all' ? this :
			path === 'completed' ? this.completedView :
			path === 'active' ?  this.activeView :
				this);
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
