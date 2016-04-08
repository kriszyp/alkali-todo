/*
This is the main "view" component that renders the todos as DOM elements,
using the Alkali DOM constructors in declarative style
*/
import { Div, Section, Span, A, P, Header, H1, Form, Footer, Label, UL, LI, Button, Input, Checkbox, Item } from 'alkali/Element'
import Variable from 'alkali/Variable'
import Todo from './Todo'

class Editing extends Variable {}

// define our main "component", the main todo view of the todo (view) data model.
// This could easily be a reusable component, although in the case of the TodoMVC
// CSS, it relies heavily on id-based elements that can really be used multiple times
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
					// we can variables for any property; when use a variable in a user-input
					// driven property, the binding is bi-directional
					value: Todo.property('newItem')
				})
			], {
				onsubmit(event) {
					event.preventDefault()
					Todo.for(this).add() // add a new todo when the user submits
				}
			})
		]),
		Section('#main', [
			Checkbox('#toggle-all', {
				checked: Todo.allCompleted
			}),
			Label,
			UL('#todo-list', {
				content: Todo.listView,
				each: LI('.task', [
					Checkbox('.toggle', Item.property('completed')),
					Label('.view', [Item.property('name')], {
						textDecoration: Item.property('completed').to((completed) => completed ? 'line-through' : 'none'),
						display: Editing.to((editing) => editing ? 'none' : 'block'),
						ondblclick() {
							let editing = Editing.for(this);
							editing.put(!editing.valueOf());
							this.nextSibling.focus();
						}
					}),
					Input('.edit', {
						display: Editing,
						value: Item.property('name'),
						onblur() { Editing.for(this).put(false) },
						onchange() { Editing.for(this).put(false) }
					}),
					Button('.destroy', {
						onclick: Todo.delete
					})
				], {
					hasOwn: Editing
				})
			})
		]),
		Footer('#footer', [
			Span('#todo-count', Todo.todoCount.to((count) => count + (count > 1 ? ' items left' : ' item left')), {
				display: Todo.todoCount.to((count) => count > 0)
			}),
			UL('#filters', [
				LI, [
					A({href: '#/all'}, [
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
				onclick: Todo.clearCompleted
			})
		])
	]),
	Footer('#info', [
		P('', 'Double-click to edit a todo'),
	])
]) {
}

export default TodoView

