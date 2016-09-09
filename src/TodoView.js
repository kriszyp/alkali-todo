/*
This is the main "view" component that renders the todos as DOM elements,
using the Alkali DOM constructors in declarative style
*/
import { react, Div, Section, Span, A, P, Header, H1, Form, Footer, Label, UL, LI, Button, Input, Checkbox, Item, Variable, options } from 'alkali';
import Todos from './Todos';
import Todo from './Todo';

// variable representing the state of editing each row
class Editing extends Variable {}

// define our main "component", the main todo view of the todo (view) data model.
// This could easily be a reusable component, although in the case of the TodoMVC
// CSS, it relies heavily on id-based elements that can not really be used multiple times
// The component is defined as a hierarchy of HTML elements
class TodoView extends Div('#todo', [
	// we use selector syntax to define ids and class, and arrays to define children
	Section('#todoapp', [
		Header('#header', [
			H1(['todos']),
			Form([
				Input('#new-todo', {
					autofocus: true,
					placeholder: 'What needs to be done?',
					// we can variables for any property; when we use a variable in a user-input
					// driven property, the binding is bi-directional
					value: Todos.property('newItem')
				})
			], {
				onsubmit(event) {
					event.preventDefault()
					Todos.for(this).add() // add a new todo when the user submits
				}
			})
		]),
		Section('#main', [
			Checkbox('#toggle-all', {
				checked: Todos.allCompleted
			}),
			Label,
			UL('#todo-list', {
				content: Todos.listView,
				each: LI('.task', [
					react(Checkbox('.toggle', Todo.completed)),
					Label('.view', [Todo.property('name')], {
						textDecoration: react(Todo.completed ? 'line-through' : 'none'),
						ondblclick() {
							let editing = Editing.for(this);
							editing.put(!editing.valueOf());
							this.nextSibling.focus();
						}
					}),
					Input('.edit', {
						value: Todo.property('name'),
						onblur() { Editing.for(this).put(false); },
						onchange() { Editing.for(this).put(false); }
					}),
					Button('.destroy', {
						onclick: Todos.delete
					})
				], {
					hasOwn: Editing,
					classes: {
						editing: Editing
					}
				})
			})
		]),
		Footer('#footer', [
			react(Span('#todo-count', Todos.todoCount + (Todos.todoCount > 1 ? ' items left' : ' item left'), {
				display: Todos.todoCount > 0
			})),
			UL('#filters', [
				LI, [
					A({href: '#/'}, [
						'All '
					])
				],
				LI, [
					A({href: '#/active'}, [
						'Active '
					])
				],
				LI, [
					A({href: '#/completed'}, [
						'Completed'
					])
				],
			]),
			Button('#clear-completed', 'Clear completed', {
				onclick: Todos.clearCompleted
			})
		])
	]),
	Footer('#info', [
		P('', 'Double-click to edit a todo'),
	])
]) {
}

export default TodoView;