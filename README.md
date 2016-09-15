This is the TodoMVC app written with [Alkali](https://github.com/kriszyp/alkali). This is a good example of how to build reactive UI with Alkali and leverage its features. I've included a short walk through to see how this works.

## Performance

Also checkout the [todomvc performance comparison](https://github.com/kriszyp/todomvc-perf-comparison/), to see alkali's speed in handling todomvc.

# Installation
To run this, do:

	$ npm install
	$ webpack # assuming you have it installed globaly

and after you can open `index.html` in a browser of your preference


# Walk Through
The entry for the application is [`index.js`](src/index.js), which loads the main "view" component, [`TodoView`](src/TodoView.js), and the model, TodoList, and provides it with some default data. The [`TodoList`](src/TodoList.js) module/class define our data model. This model is basically just a variable with an array, so there isn't much to do in that module. The [`Todos`](src/Todos.js) module is the "view-model" class, defining the a model for the behavior of our UI. And then the [`TodoView`](src/TodoView.js) component is our actual view class. It is an extension of a native DOM element, so we can directly append it to the `document.body` after creating it.

## TodoView
This is the main "view" component. Like all components in Alkali, it is an extension of native DOM elements, defining child elements and behavior that will be created when instantiated. This example application relies heavily on the declarative usage of Alkali, declaring the child elements of TodoView element. This child elements consist of element constructors that should be pretty intuitive. You may also notice, that we define ids and classes of elements using CSS selector syntax in the first string argument to the classes. We also define properties that are applied to the elements inline as well. We include CSS properties as well.

The central interaction between a view and the underlying is acheived by being able to directly include various parts of the data model directly in our view, and the view will reactively update in response to any changes. The model "variables", are used in various places, to drive styles, properties, and text content throughout the component. For example, the `#new-todo` element is bound to a `newItem` property. Because it is an input, it is bi-directional binding, used entered data will update this property, and within the data model, any changes to the property are reflected in the UI.

The `#todo-list` element contains the main content of the application, is bound to the `Todo.listView` which is computed and filtered based on the current URL hash/path. This particular type of content is an array, so we define an `each` property that will define the element(s) to render for each item in the array.

Another key Alkali concept used here is contextualized variables. All of the variables references from the view component are actually classes of variables, they are not direct references to instances. They can be thought of as "generalized" variables, and they will be contextualized as soon as they are used in instantiated components. While the class-based references make it very clear exactly what will be used, this deferred contextualization gives great flexibility in how the instances are created and related to each other. We are using a [`TodoList`](src/TodoList.js) as the data model, and alkali will automatically create a singleton instance for the view by default. However, we can easily specify a relationalship so that we could create multiple instances a the TodoView component that each have their own data model instance. Or we can even create a mock/test TodoList and inject into the TodoView for testing purposes.

We actually use this type of relationship for the `Editing` variable. In the TodoView, the `Editing` variable is defined (by extending `Variable`), and then associating it with each row in the view. This means there is a distinct instance of this variable created for each row that is generated. These distinct instances can then easily carry the individual view state of each row, as it may toggle between the view and editing state. Again, we simple reference `Editing` anywhere we have interest in this variable, indepedently of the scope or relationship we define for the variable.

We also need to be aware of this contextualization in our event handlers; when we operating programmatically, we need to work with direct instances. Therefore, we explicitly contextualize with the `for` calls to get the correct instances.

## Todos
Again, this [module](src/Todos.js) provides the view model. It simply extends `Variable` and defines the basic methods for interacting with our data of todos. We also make use of generalized references to the `TodoList`, which again will be resolved as needed by their eventual downstream use in the UI componenent. This class consists of a number of `to` calls which are the basic transform in Alkali, where a source variable is converted to a target variable. This class also utilizes a bi-directional transform with `allCompleted`. This allow this variable to be directly bound to the select-all checkbox, and both send state to that checkbox, as well receive state from the checkbox, and process data in the reverse direction.

This module also includes a very simple variable-based router. In this case, it is only a couple lines of code, so it is put in this module for simplicity.

## TodoList and Todo
And finally the [TodoList module](src/TodoList.js) and [Todo module](src/Todo.js) contains the source data model. This includes a couple methods for deletion and clear completed items. The collection class and item class are linked together with a static `collection` property, which allows the `Todo` class instances to be referenced within loops through a `TodoList` collection.
