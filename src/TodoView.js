/*
This is the main "view" component that renders the todos as DOM elements,
using the Alkali DOM constructors in declarative style
*/
import { Div, Section, Span, A, Header, H1, Form, Footer, Label, UL, LI, Button, Input, Checkbox, Item } from 'alkali/Element'
import Todo from './Todo'

let LabelView = Label('.view', [Item.property('name')], {
	textDecoration: Item.property('completed').to((completed) => completed ? 'line-through' : 'none'),
	ondblclick() {
	}
})


class TodoView extends Div({id: 'todo'}, [
	Section('#todoapp', [
		Header('#header', [
			H1(['todos']),
			Form([
				Input({
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
		Section('.main', [
			Checkbox('#toggle-all', {
				onchange: Todo.completeAll
			}),
			Label,
			UL('#todo-list', {
				content: Todo.listView,
				each: LI('.task', [
					Checkbox('.toggle', Item.property('completed')),
					LabelView,
					Button('.destroy', {
						onclick: Todo.delete
					})
				])
			})
		]),
		Footer([
			Span(Todo.todoCount.to((count) => count + (count > 1 ? ' items left' : ' item left'))),
			UL('#filters', [
				LI, [
					A({href: '#/all'}, [
						'All'
					])
				],
				LI, [
					A({href: '#/active'}, [
						'Active'
					])
				],
				LI, [
					A({href: '#/completed'}, [
						'Completed'
					])
				],
			])
		])
	])
]) {
}

export default TodoView

