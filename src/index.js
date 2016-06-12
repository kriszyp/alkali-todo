import TodoList from './TodoList';
import TodoView from './TodoView';
import { setup as benchmarkSetup } from './test/benchmark';

TodoList.defaultInstance.put([{name: 'first one'}]) // put some data in the model
document.body.appendChild(new TodoView()) // append the todo view to the body
benchmarkSetup()