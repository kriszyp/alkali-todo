import { Div, Section, Span, A, Header, H1, Form, Footer, Label, UL, LI, Button, Input, Checkbox, Item } from 'alkali/Element'
import TodoModel from './Todo'
let todoModel = new TodoModel([{name: 'first one'}])

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
					value: TodoModel.property('newItem')
				})
			], {
				onsubmit(event) {
					event.preventDefault()
					TodoModel.for(this).add()
				}
			})
		]),
		Section('.main', [
			Checkbox('#toggle-all', {
				onchange() { TodoModel.for(this).completeAll() }
			}),
			Label,
			UL('#todo-list', {
				content: todoModel.todoView,
				each: LI('.task', [
					Checkbox('.toggle', Item.property('completed')),
					LabelView,
					Button('.destroy', {
						onclick { todoModel.delete(Item.for(this)) }
					})
				])
			})
		]),
		Footer([
			Span(todoModel.todoCount.to((count) => count + (count > 1 ? ' items left' : ' item left'))),
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

