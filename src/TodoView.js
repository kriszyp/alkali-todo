/*
This is the main "view" component that renders the todos as DOM elements,
using the Alkali DOM constructors in declarative style
*/
import { Div, Section, Span, A, P, Header, H1, Form, Footer, Label, UL, LI, Button, Input, Checkbox, Item } from 'alkali/Element'
import Variable from 'alkali/Variable'
import Todo from './Todo'

class Editing extends Variable {}
let LabelView = Label('.view', [Item.property('name')], {
	textDecoration: Item.property('completed').to((completed) => completed ? 'line-through' : 'none'),
	display: Editing.to((editing) => !editing),
	ondblclick() {
		let editing = Editing.for(this)
		editing.put(!editing.valueOf())
	}
})


class TodoView extends Div({id: 'todo'}, [
	Section('#todoapp', [
		Header('#header', [
			H1(['todos']),
			Form([
				Input('#new-todo', {
					autofocus: true,
					placeholder: 'What needs to be done?',
					value: Todo.property('newItem')
				})
			], {
				onsubmit(event) {
					event.preventDefault()
					Todo.for(this).add()
				}
			})
		]),
		Section('#main', [
			Checkbox('#toggle-all', {
				onchange: Todo.completeAll
			}),
			Label,
			UL('#todo-list', {
				content: Todo.listView,
				each: LI('.task', [
					Checkbox('.toggle', Item.property('completed')),
					LabelView,
					Input('.edit', {
						display: Editing
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
			Button('#clear-completed', 'Clear completed')
		])
	]),
	Footer('#info', [
		P('', 'Double-click to edit a todo'),
	])
]) {
}

export default TodoView

