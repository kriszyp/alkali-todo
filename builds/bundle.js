/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _TodoList = __webpack_require__(1);

	var _TodoList2 = _interopRequireDefault(_TodoList);

	var _TodoView = __webpack_require__(4);

	var _TodoView2 = _interopRequireDefault(_TodoView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_TodoList2.default.defaultInstance.put([{ name: 'first one' }]); // put some data in the model
	document.body.appendChild(new _TodoView2.default()); // append the todo view to the body

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Variable = __webpack_require__(2);

	var _Variable2 = _interopRequireDefault(_Variable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TodoList = _Variable2.default.extend({
		// define the default value as an array
		default: [],
		clearCompleted: function clearCompleted() {
			var _this = this;

			// make a copy of the array first, because it changes while we modify it
			this.valueOf().slice(0).forEach(function (todo) {
				if (todo.completed) {
					_this.delete(todo);
				}
			});
		},
		delete: function _delete(item) {
			this.splice(this.valueOf().indexOf(item), 1);
		}
	}); /*
	    This is our canonical "data model", holding the list of todo items.
	    We could override various methods to store this somewhere if we wanted.
	    There is not much to this, it is ybasically is a variable that holds
	    an array of objects
	    */

	exports.default = TodoList;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory(require('./util/lang'))
	    } else {
	        root.alkali.Variable = factory(root.alkali.lang)
	    }
	}(this, function (lang) {
		var deny = {}
		var noChange = {}
		var WeakMap = lang.WeakMap
		var setPrototypeOf = Object.setPrototypeOf || (function(base, proto) { base.__proto__ = proto})
		var getPrototypeOf = Object.getPrototypeOf || (function(base) { return base.__proto__ })
		// update types
		var ToParent = 2
		var RequestChange = 3
		var Refresh = Object.freeze({
			type: 'refresh'
		})
		var ToChild = Object.freeze({
			type: 'refresh'
		})
		var nextId = 1
		var propertyListenersMap = new WeakMap(null, 'propertyListenersMap')

		var CacheEntry = lang.compose(WeakMap, function() {
		},{
			_propertyChange: function(propertyName) {
				this.variable._propertyChange(propertyName, contextFromCache(this))
			}
		})
		var listenerId = 1

		function mergeSubject(context) {
			for (var i = 1, l = arguments.length; i < l; i++) {
				var nextContext = arguments[i]
				if (nextContext !== context && (!context || nextContext && context.contains && context.contains(nextContext))) {
					context = nextContext
				}
			}
			return context
		}

		function getDistinctContextualized(variable, context) {
			var subject = context && (context.distinctSubject || context.subject)
			if (typeof variable === 'function') {
				return variable.for(subject)
			}
			var contextMap = variable.contextMap
			if (context && contextMap) {
				while(subject && !contextMap.has(subject)) {
					subject = subject.parentNode
				}
				if (!subject) {
					subject = defaultContext
				}
				return contextMap.get(subject)
			}
		}
		function when(value, callback) {
			if (value && value.then) {
				return value.then(callback)
			}
			return callback(value)
		}

		function Context(subject){
			this.subject = subject
		}
		function whenAll(inputs, callback){
			var promiseInvolved
			var needsContext
			for (var i = 0, l = inputs.length; i < l; i++) {
				if (inputs[i] && inputs[i].then) {
					promiseInvolved = true
				}
			}
			if (promiseInvolved) {
				return lang.whenAll(inputs, callback)
			}
			return callback(inputs)
		}

		function registerListener(value, listener) {
			var listeners = propertyListenersMap.get(value)
			var id = listener.listenerId || (listener.listenerId = ('-' + listenerId++))
			if (listeners) {
				if (listeners[id] === undefined) {
					listeners[id] = listeners.push(listener) - 1
				}
			}else{
				propertyListenersMap.set(value, listeners = [listener])
				listeners[id] = 0
				if (Variable.autoObserveObjects) {
					observe(value)
				}
			}
		}
		function deregisterListener(value, listener) {
			var listeners = propertyListenersMap.get(value)
			if (listeners) {
				var index = listeners[listener.listenerId]
				if (index > -1) {
					listeners.splice(index, 1)
					delete listeners[listener.listenerId]
				}
			}
		}

		function PropertyChange(key, object, childEvent) {
			this.key = key
			this.object = object
			this.childEvent = childEvent
			this.version = nextId++
		}
		PropertyChange.prototype.type = 'update'
		function Variable(value) {
			if (this instanceof Variable) {
				// new call, may eventually use new.target
				this.value = typeof value === 'undefined' ? this.default : value
			} else {
				return Variable.extend(value)
			}
		}
		Variable.prototype = {
			constructor: Variable,
			valueOf: function(context) {
				if (this.subject) {
					var variable = this
					context = new Context(this.subject)
				}
				return this.gotValue(this.getValue(context), context)
			},
			getValue: function() {
				return this.value
			},
			gotValue: function(value, context) {
				var previousNotifyingValue = this.notifyingValue
				var variable = this
				if (value && value.then) {
					return when(value, function(value) {
						return Variable.prototype.gotValue.call(variable, value, context)
					})
				}
				if (previousNotifyingValue) {
					if (value === previousNotifyingValue) {
						// nothing changed, immediately return valueOf
						return value.valueOf()
					}
					// if there was a another value that we were dependent on before, stop listening to it
					// TODO: we may want to consider doing cleanup after the next rendering turn
					if (variable.dependents) {
						previousNotifyingValue.stopNotifies(variable)
					}
					variable.notifyingValue = null
				}
				if (value && value.notifies) {
					if (variable.dependents) {
							// the value is another variable, start receiving notifications
						value.notifies(variable)
					}
					variable.notifyingValue = value
					value = value.valueOf(context)
				}
				if (typeof value === 'object' && value && (this.dependents || this.constructor.dependents)) {
					// set up the listeners tracking
					registerListener(value, this)
				}
				if (value === undefined) {
					value = variable.default
				}
				return value
			},
			isMap: function() {
				return this.value instanceof Map
			},
			property: function(key) {
				var isMap = this.isMap()
				var properties = this._properties || (this._properties = isMap ? new Map() : {})
				var propertyVariable = isMap ? properties.get(key) : properties[key]
				if (!propertyVariable) {
					// create the property variable
					propertyVariable = new Property(this, key)
					if (isMap) {
						properties.set(key, propertyVariable)
					} else {
						properties[key] = propertyVariable
					}
				}
				return propertyVariable
			},
			for: function(subject) {
				if (subject && subject.target && !subject.getForClass) {
					// makes HTML events work
					subject = subject.target
				}
				if (typeof this === 'function') {
					// this is a class, the subject should hopefully have an entry
					if (subject) {
						var instance = subject.getForClass(this)
						if (instance && !instance.subject) {
							instance.subject = subject
						}
						// TODO: Do we have a global context that we set on defaultInstance?
						return instance || this.defaultInstance
					} else {
						return this.defaultInstance
					}
				}
				return new ContextualizedVariable(this, subject || defaultContext)
			},
			distinctFor: function(subject) {
				if (typeof this === 'function') {
					return this.for(subject)
				}
				var map = this.contextMap || (this.contextMap = new WeakMap())
				if (map.has(subject)) {
					return map.get(subject)
				}
				var contextualizedVariable
				map.set(subject, contextualizedVariable = new ContextualizedVariable(this, subject))
				return contextualizedVariable
			},
			_propertyChange: function(propertyName, object, context, type) {
				if (this.onPropertyChange) {
					this.onPropertyChange(propertyName, object, context)
				}
				var properties = this._properties
				var property = properties && (properties instanceof Map ? properties.get(propertyName) : properties[propertyName])
				if (property && !(type instanceof PropertyChange) && object === this.valueOf(context)) {
					property.parentUpdated(ToChild, context)
				}
				this.updated(new PropertyChange(propertyName, object, type), null, context)
			},
			eachKey: function(callback) {
				for (var i in this._properties) {
					callback(i)
				}
			},
			apply: function(instance, args) {
				return new Call(this, args)
			},
			call: function(instance) {
				return this.apply(instance, Array.prototype.slice.call(arguments, 1))
			},
			forDependencies: function(callback) {
				if (this.notifyingValue) {
					callback(this.notifyingValue)
				}
			},
			init: function() {
				if (this.subject) {
					this.constructor.notifies(this)
				}
				var variable = this
				this.forDependencies(function(dependency) {
					dependency.notifies(variable)
				})
			},
			cleanup: function() {
				var handles = this.handles
				if (handles) {
					for (var i = 0; i < handles.length; i++) {
						handles[i].remove()
					}
				}
				this.handles = null
				var value = this.value
				if (value && typeof value === 'object') {
					deregisterListener(value, this)
				}
				var notifyingValue = this.notifyingValue
				if (notifyingValue) {
					// TODO: move this into the caching class
					this.computedVariable = null
				}
				var variable = this
				this.forDependencies(function(dependency) {
					dependency.stopNotifies(variable)
				})
				if (this.context) {
					this.constructor.stopNotifies(this)
				}
			},

			updateVersion: function() {
				this.version = nextId++
			},

			getVersion: function(context) {
				return Math.max(this.version || 0, this.notifyingValue && this.notifyingValue.getVersion ? this.notifyingValue.getVersion(context) : 0)
			},

			getSubject: function(selectVariable) {
				return this.subject
			},

			getUpdates: function(since) {
				var updates = []
				var nextUpdateMap = this.nextUpdateMap
				if (nextUpdateMap && since) {
					while ((since = nextUpdateMap.get(since))) {
						if (since === Refresh) {
							// if it was refresh, we can clear any prior entries
							updates = []
						}
						updates.push(since)
					}
				}
				return updates
			},

			updated: function(updateEvent, by, context) {
				if (this.subject) {
					if (by === this.constructor) {
						// if we receive an update from the constructor, filter it
						if (!(!context || context.subject === this.subject || (context.subject.contains && this.subject.nodeType && context.subject.contains(this.subject)))) {
							return
						}
					} else {
						// if we receive an outside update, send it to the constructor
						return this.constructor.updated(updateEvent, this, new Context(this.subject))
					}
				}
				if (this.lastUpdate) {
					var nextUpdateMap = this.nextUpdateMap
					if (!nextUpdateMap) {
						nextUpdateMap = this.nextUpdateMap = new WeakMap()
					}
					nextUpdateMap.set(this.lastUpdate, updateEvent)
				}

				this.lastUpdate = updateEvent
				this.updateVersion()
				var value = this.value
				if (value && typeof value === 'object' && !(updateEvent instanceof PropertyChange)) {
					deregisterListener(value, this)
				}

				var dependents = this.dependents
				if (dependents) {
					// make a copy, in case they change
					dependents = dependents.slice(0)
					for (var i = 0, l = dependents.length; i < l; i++) {
						try{
							var dependent = dependents[i]
							// skip notifying property dependents if we are headed up the parent chain
							if (!(updateEvent instanceof PropertyChange) ||
									dependent.parent !== this || // if it is not a child property
									(by && by.constructor === this)) { // if it is coming from a child context
								if (dependent.parent === this) {
									dependent.parentUpdated(ToChild, context)
								} else {
									dependent.updated(updateEvent, this, context)
								}
							}
						}catch(e) {
							console.error(e, e.stack, 'updating a variable')
						}
					}
				}
			},

			invalidate: function() {
				// for back-compatibility for now
				this.updated()
			},

			notifies: function(target) {
				var dependents = this.dependents
				if (!dependents || !this.hasOwnProperty('dependents')) {
					this.init()
					this.dependents = dependents = []
				}
				dependents.push(target)
				var variable = this
				return {
					unsubscribe: function() {
						variable.stopNotifies(target)
					}
				}
			},
			subscribe: function(listener) {
				// ES7 Observable (and baconjs) compatible API
				var updated
				var variable = this
				// it is important to make sure you register for notifications before getting the value
				if (typeof listener === 'function') {
					// BaconJS compatible API
					var variable = this
					var event = {
						value: function() {
							return variable.valueOf()
						}
					}
					updated = function() {
						listener(event)
					}
				}	else if (listener.next) {
					// Assuming ES7 Observable API. It is actually a streaming API, this pretty much violates all principles of reactivity, but we will support it
					updated = function() {
						listener.next(variable.valueOf())
					}
				} else {
					throw new Error('Subscribing to an invalid listener, the listener must be a function, or have an update or next method')
				}

				var handle = this.notifies({
					updated: updated
				})
				var initialValue = this.valueOf()
				if (initialValue !== undefined) {
					updated()
				}
				return handle
			},
			stopNotifies: function(dependent) {
				var dependents = this.dependents
				if (dependents) {
					for (var i = 0; i < dependents.length; i++) {
						if (dependents[i] === dependent) {
							dependents.splice(i--, 1)
						}
					}
					if (dependents.length === 0) {
						// clear the dependents so it will be reinitialized if it has
						// dependents again
						this.dependents = dependents = false
						this.cleanup()
					}
				}
			},
			put: function(value, context) {
				var variable = this
				
				return when(this.getValue(context), function(oldValue) {
					if (oldValue === value) {
						return noChange
					}
					if (variable.fixed &&
							// if it is set to fixed, we see we can put in the current variable
							oldValue && oldValue.put && // if we currently have a variable
							// and it is always fixed, or not a new variable
							(variable.fixed == 'always' || !(value && value.notifies))) {
						return oldValue.put(value)
					}
					return when(variable.setValue(value, context), function(value) {
						variable.updated(Refresh, variable, context)
					})
				})
			},
			get: function(key) {
				return when(this.valueOf(), function(object) {
					var value = object && (typeof object.get === 'function' ? object.get(key) : object[key])
					if (value && value.notifies) {
						// nested variable situation, get underlying value
						return value.valueOf()
					}
					return value
				})
			},
			set: function(key, value) {
				// TODO: create an optimized route when the property doesn't exist yet
				this.property(key).put(value)
			},
			undefine: function(key, context) {
				this.set(key, undefined, context)
			},
			getForClass: getForClass,

			next: function(value) {
				// for ES7 observable compatibility
				this.put(value)
			},
			error: function(error) {
				// for ES7 observable compatibility
				var dependents = this.dependents
				if (dependents) {
					// make a copy, in case they change
					dependents = dependents.slice(0)
					for (var i = 0, l = dependents.length; i < l; i++) {
						try{
							var dependent = dependents[i]
							// skip notifying property dependents if we are headed up the parent chain
							dependent.error(error)
						}catch(e) {
							console.error(e, 'sending an error')
						}
					}
				}
			},
			complete: function(value) {
				// for ES7 observable compatibility
				this.put(value)
			},
			setValue: function(value) {
				this.value = value
			},
			onValue: function(listener) {
				return this.subscribe(function(event) {
					lang.when(event.value(), function(value) {
						listener(value)
					})
				})
			},
			forEach: function(callback, context) {
				// iterate through current value of variable
				return when(this.valueOf(), function(value) {
					if (value && value.forEach) {
						value.forEach(callback)
					}else{
						for (var i in value) {
							callback(value[i], i)
						}
					}
				})
			},
			each: function(callback) {
				// returns a new mapped variable
				// TODO: support events on array (using dstore api)
				return this.map(function(array) {
					return array.map(callback)
				})
			},

			map: function (operator) {
				// TODO: eventually make this act on the array items instead
				return this.to(operator)
			},
			to: function (operator) {
				// TODO: create a more efficient map, we don't really need a full variable here
				if (!operator) {
					throw new Error('No function provided to map')
				}
				return new Variable(operator).apply(null, [this])
			},
			get schema() {
				var schema = new Schema(this)
				Object.defineProperty(this, 'schema', {
					value: schema
				})
				return schema
			},
			get validate() {
				var schema = this.schema
				var validate = new Validating(this, schema)
				Object.defineProperty(this, 'validate', {
					value: validate
				})
				return validate
			},
			getId: function() {
				return this.id || (this.id = nextId++)
			}
		}
		// a variable inheritance change goes through its own prototype, so classes/constructor
		// can be used as variables as well
		setPrototypeOf(Variable, Variable.prototype)

		if (typeof Symbol !== 'undefined') {
			Variable.prototype[Symbol.iterator] = function() {
				return this.valueOf()[Symbol.iterator]()
			}
		}
		var cacheNotFound = {}
		var Caching = Variable.Caching = lang.compose(Variable, function(getValue, setValue) {
			if (getValue) {
				this.getValue = getValue
			}
			if (setValue) {
				this.setValue = setValue
			}
		}, {
			valueOf: function(context) {
				// first check to see if we have the variable already computed
				if (this.cachedVersion === this.getVersion()) {
					if (this.contextMap) {
						var contextualizedVariable = getDistinctContextualized(this, context)
						if (contextualizedVariable) {
							return contextualizedVariable.cachedValue
						}
					} else {
						return this.cachedValue
					}
				}
				
				var variable = this

				function withComputedValue(computedValue) {
					if (computedValue && computedValue.notifies && variable.dependents) {
						variable.computedVariable = computedValue
					}
					computedValue = variable.gotValue(computedValue, watchedContext)
					var contextualizedVariable
					if (watchedContext && watchedContext.distinctSubject) {
						(variable.contextMap || (variable.contextMap = new WeakMap()))
							.set(watchedContext.distinctSubject,
								contextualizedVariable = new ContextualizedVariable(variable, watchedContext.distinctSubject))
						context.distinctSubject = mergeSubject(context.distinctSubject, watchedContext.distinctSubject)
					} else {
						contextualizedVariable = variable
					}
					contextualizedVariable.cachedVersion = variable.getVersion()
					contextualizedVariable.cachedValue = computedValue
					return computedValue
				}

				var watchedContext
				if (context) {
					watchedContext = new Context(context.subject)
				}
				var computedValue = this.getValue(watchedContext)
				if (computedValue && computedValue.then) {
					return computedValue.then(withComputedValue)
				} else {
					return withComputedValue(computedValue)
				}
			}
		})

		function GetCache() {
		}

		var Property = lang.compose(Variable, function Property(parent, key) {
			this.parent = parent
			this.key = key
		},
		{
			forDependencies: function(callback) {
				Variable.prototype.forDependencies.call(this, callback)
				callback(this.parent)
			},
			valueOf: function(context) {
				var key = this.key
				var property = this
				var object = this.parent.valueOf(context)
				function gotValueAndListen(object) {
					if (property.dependents) {
						var listeners = propertyListenersMap.get(object)
						if (listeners && listeners.observer && listeners.observer.addKey) {
							listeners.observer.addKey(key)
						}
					}
					var value = property.gotValue(object == null ? undefined : typeof object.get === 'function' ? object.get(key) : object[key])
					return value
				}
				if (object && object.then) {
					return when(object, gotValueAndListen)
				}
				return gotValueAndListen(object)
			},
			put: function(value, context) {
				return this._changeValue(context, RequestChange, value)
			},
			parentUpdated: function(updateEvent, context) {
				return Variable.prototype.updated.call(this, updateEvent, this.parent, context)
			},
			updated: function(updateEvent, by, context) {
				//if (updateEvent !== ToChild) {
					this._changeValue(context, updateEvent)
				//}
				return Variable.prototype.updated.call(this, updateEvent, by, context)
			},
			_changeValue: function(context, type, newValue) {
				var key = this.key
				var parent = this.parent
				return when(parent.valueOf(context), function(object) {
					if (object == null) {
						// nothing there yet, create an object to hold the new property
						var response = parent.put(object = typeof key == 'number' ? [] : {}, context)
					}else if (typeof object != 'object') {
						// if the parent is not an object, we can't set anything (that will be retained)
						return deny
					}
					if (type == RequestChange) {
						var oldValue = typeof object.get === 'function' ? object.get(key) : object[key]
						if (oldValue === newValue) {
							// no actual change to make
							return noChange
						}
						if (typeof object.set === 'function') {
							object.set(key, newValue)
						} else {
							object[key] = newValue
						}
					}
					var listeners = propertyListenersMap.get(object)
					// at least make sure we notify the parent
					// we need to do it before the other listeners, so we can update it before
					// we trigger a full clobbering of the object
					parent._propertyChange(key, object, context, type)
					if (listeners) {
						for (var i = 0, l = listeners.length; i < l; i++) {
							var listener = listeners[i]
							if (listener !== parent) {
								// now go ahead and actually trigger the other listeners (but make sure we don't do the parent again)
								listener._propertyChange(key, object, context, type)
							}
						}
					}
				})
			}
		})
		Variable.Property = Property

		var Item = Variable.Item = lang.compose(Variable, function Item(value) {
			this.value = value
		}, {})

		var Composite = Variable.Composite = lang.compose(Caching, function Composite(args) {
			this.args = args
		}, {
			forDependencies: function(callback) {
				// depend on the args
				Caching.prototype.forDependencies.call(this, callback)
				var args = this.args
				for (var i = 0, l = args.length; i < l; i++) {
					var arg = args[i]
					if (arg && arg.notifies) {
						callback(arg)
					}
				}
			},

			updated: function(updateEvent, by, context) {
				var args = this.args
				if (by !== this.notifyingValue && updateEvent !== Refresh) {
					// using a painful search instead of indexOf, because args may be an arguments object
					for (var i = 0, l = args.length; i < l; i++) {
						var arg = args[i]
						if (arg === by) {
							// if one of the args was updated, we need to do a full refresh (we can't compute differential events without knowledge of how the mapping function works)
							updateEvent = Refresh
							continue
						}
					}
				}
				Caching.prototype.updated.call(this, updateEvent, by, context)
			},

			getUpdates: function(since) {
				// this always issues updates, nothing incremental can flow through it
				if (!since || since.version < getVersion()) {
					return [new Refresh()]
				}
			},

			getVersion: function(context) {
				var args = this.args
				var version = Variable.prototype.getVersion.call(this, context)
				for (var i = 0, l = args.length; i < l; i++) {
					var arg = args[i]
					if (arg && arg.getVersion) {
						version = Math.max(version, arg.getVersion(context))
					}
				}
				return version
			},

			getValue: function(context) {
				var results = []
				var args = this.args
				for (var i = 0, l = args.length; i < l; i++) {
					var arg = args[i]
					results[i] = arg && arg.valueOf(context)
				}
				return whenAll(results, function(resolved) {
					return resolved
				})
			}
		})

		// a call variable is the result of a call
		var Call = lang.compose(Composite, function Call(functionVariable, args) {
			this.functionVariable = functionVariable
			this.args = args
		}, {
			forDependencies: function(callback) {
				// depend on the args
				Composite.prototype.forDependencies.call(this, callback)
				callback(this.functionVariable)
			},

			getValue: function(context) {
				var functionValue = this.functionVariable.valueOf(context)
				if (functionValue.then) {
					var call = this
					return functionValue.then(function(functionValue) {
						return call.invoke(functionValue, call.args, context)
					})
				}
				return this.invoke(functionValue, this.args, context)
			},

			getVersion: function(context) {
				// TODO: shortcut if we are live and since equals this.lastUpdate
				return Math.max(Composite.prototype.getVersion.call(this, context), this.functionVariable.getVersion(context))
			},

			execute: function(context) {
				var call = this
				return when(this.functionVariable.valueOf(context), function(functionValue) {
					return call.invoke(functionValue, call.args, context, true)
				})
			},

			put: function(value, context) {
				var call = this
				return when(this.valueOf(context), function(originalValue) {
					if (originalValue === value) {
						return noChange
					}
					return when(call.functionVariable.valueOf(context), function(functionValue) {
						return call.invoke(function() {
							if (functionValue.reverse) {
								functionValue.reverse.call(call, value, call.args, context)
								return Variable.prototype.put.call(call, value, context)
							}else{
								return deny
							}
						}, call.args, context)
					});				
				})
			},
			invoke: function(functionValue, args, context, observeArguments) {
				var instance = this.functionVariable.parent
				if (functionValue.handlesContext) {
					return functionValue.apply(instance, args, context)
				}else{
					var results = []
					for (var i = 0, l = args.length; i < l; i++) {
						var arg = args[i]
						results[i] = arg && arg.valueOf(context)
					}
					instance = instance && instance.valueOf(context)
					if (functionValue.handlesPromises) {
						return functionValue.apply(instance, results, context)
					}else{
						// include the instance in whenAll
						results.push(instance)
						// wait for the values to be received
						return whenAll(results, function(inputs) {
							if (observeArguments) {
								var handles = []
								for (var i = 0, l = inputs.length; i < l; i++) {
									var input = inputs[i]
									if (input && typeof input === 'object') {
										handles.push(observe(input))
									}
								}
								var instance = inputs.pop()
								try{
									var result = functionValue.apply(instance, inputs, context)
								}finally{
									when(result, function() {
										for (var i = 0; i < l; i++) {
											handles[i].done()
										}
									})
								}
								return result
							}
							var instance = inputs.pop()
							return functionValue.apply(instance, inputs, context)
						})
					}
				}
			},
			setReverse: function(reverse) {
				this.functionVariable.valueOf().reverse = reverse
				return this
			}
		})
		Variable.Call = Call

		var ContextualizedVariable = lang.compose(Variable, function ContextualizedVariable(Source, subject) {
			this.constructor = Source
			this.subject = subject
		}, {
			valueOf: function() {
				return this.constructor.valueOf(new Context(this.subject))
			},

			put: function(value) {
				return this.constructor.put(value, new Context(this.subject))
			},
			parentUpdated: function(event, context) {
				// if we receive an outside update, send it to the constructor
				this.constructor.updated(event, this.parent, this.context)
			}
		})


		function arrayMethod(name, sendUpdates) {
			Variable.prototype[name] = function() {
				var args = arguments
				var variable = this
				return when(this.cachedValue || this.valueOf(), function(array) {
					if (!array) {
						variable.put(array = [])
					}
					// try to use own method, but if not available, use Array's methods
					var result = array[name] ? array[name].apply(array, args) : Array.prototype[name].apply(array, args)
					if (sendUpdates) {
						sendUpdates.call(variable, args, result, array)
					}
					return result
				})
			}
		}
		arrayMethod('splice', function(args, result) {
			for (var i = 0; i < args[1]; i++) {
				this.updated({
					type: 'delete',
					previousIndex: args[0],
					oldValue: result[i]
				}, this)
			}
			for (i = 2, l = args.length; i < l; i++) {
				this.updated({
					type: 'add',
					value: args[i],
					index: args[0] + i - 2
				}, this)
			}
		})
		arrayMethod('push', function(args, result) {
			for (var i = 0, l = args.length; i < l; i++) {
				var arg = args[i]
				this.updated({
					type: 'add',
					index: result - i - 1,
					value: arg
				}, this)
			}
		})
		arrayMethod('unshift', function(args, result) {
			for (var i = 0, l = args.length; i < l; i++) {
				var arg = args[i]
				this.updated({
					type: 'add',
					index: i,
					value: arg
				}, this)
			}
		})
		arrayMethod('shift', function(args, results) {
			this.updated({
				type: 'delete',
				previousIndex: 0
			}, this)
		})
		arrayMethod('pop', function(args, results, array) {
			this.updated({
				type: 'delete',
				previousIndex: array.length
			}, this)
		})

		function iterateMethod(method) {
			Variable.prototype[method] = function() {
				return new IterativeMethod(this, method, arguments)
			}
		}

		iterateMethod('filter')
		//iterateMethod('map')

		var IterativeMethod = lang.compose(Composite, function(source, method, args) {
			this.source = source
			// source.interestWithin = true
			this.method = method
			this.args = args
		}, {
			getValue: function(context) {
				var method = this.method
				var args = this.args
				var variable = this
				return when(this.source.valueOf(context), function(array) {
					if (variable.dependents) {
						var map = variable.contextMap || (variable.contextMap = new WeakMap())
						var contextualizedVariable
						if (map.has(context.distinctSubject)) {
							contextualizedVariable = map.get(context.distinctSubject)
						} else {
							map.set(context.distinctSubject, contextualizedVariable = new ContextualizedVariable(variable, context.distinctSubject))
						}
						array.forEach(function(object) {
							registerListener(object, contextualizedVariable)
						})
					}
					if (context) {
						variable = variable.for(context)
					}
					return array && array[method] && array[method].apply(array, args)
				})
			},
			updated: function(event, by, context) {
				if (by === this || by && by.constructor === this) {
					return Composite.prototype.updated.call(this, event, by, context)
				}
				var propagatedEvent = event.type === 'refresh' ? event : // always propagate refreshes
					this[this.method + 'Updated'](event, context)
				// TODO: make sure we normalize the event structure
				if (this.dependents && event.oldValue && typeof event.value === 'object') {
					deregisterListener(event.value, this)
				}
				if (this.dependents && event.value && typeof event.value === 'object') {
					registerListener(event.value, getDistinctContextualized(this, context))
				}
				if (propagatedEvent) {
					Composite.prototype.updated.call(this, propagatedEvent, by, context)
				}
			},
			filterUpdated: function(event, context) {
				var contextualizedVariable = getDistinctContextualized(this, context)
				if (event.type === 'delete') {
					var index = contextualizedVariable.cachedValue.indexOf(event.oldValue)
					if (index > -1) {
						contextualizedVariable.splice(index, 1)
					}
				} else if (event.type === 'add') {
					if ([event.value].filter(this.args[0]).length > 0) {
						contextualizedVariable.push(event.value)
					}
				} else if (event.type === 'update') {
					var index = contextualizedVariable.cachedValue.indexOf(event.object)
					var matches = [event.object].filter(this.args[0]).length > 0
					if (index > -1) {
						if (matches) {
							return {
								type: 'updated',
								object: event.object,
								index: index
							}
						} else {
							contextualizedVariable.splice(index, 1)
						}
					}	else {
						if (matches) {
							contextualizedVariable.push(event.object)
						}
						// else nothing mactches
					}
					return
				} else {
					return event
				}
			},
			mapUpdated: function(event) {
				return {
					type: event.type,
					value: [event.value].map(this.args[0])
				}
			},
			forDependencies: function(callback) {
				// depend on the args
				Composite.prototype.forDependencies.call(this, callback)
				callback(this.source)
			},
			getVersion: function(context) {
				return Math.max(Composite.prototype.getVersion.call(this, context), this.source.getVersion(context))
			}		
		})

		var Validating = lang.compose(Caching, function(target, schema) {
			this.target = target
			this.targetSchema = schema
		}, {
			forDependencies: function(callback) {
				Caching.prototype.forDependencies.call(this, callback)
				callback(this.target)
				callback(this.targetSchema)
			},
			getVersion: function(context) {
				return Math.max(Variable.prototype.getVersion.call(this, context), this.target.getVersion(context), this.targetSchema.getVersion(context))
			},
			getValue: function(context) {
				return doValidation(this.target.valueOf(context), this.targetSchema.valueOf(context))
			}
		})

		var Schema = lang.compose(Caching, function(target) {
			this.target = target
		}, {
			forDependencies: function(callback) {
				Caching.prototype.forDependencies.call(this, callback)
				callback(this.target)
			},
			getVersion: function(context) {
				return Math.max(Variable.prototype.getVersion.call(this, context), this.target.getVersion(context))
			},
			getValue: function(context) {
				if (this.value) { // if it has an explicit schema, we can use that.
					return this.value
				}
				// get the schema, going through target parents until it is found
				return getSchema(this.target)
				function getSchema(target) {
					return when(target.valueOf(), function(value, context) {
						var schema
						return (value && value._schema) || (target.parent && (schema = target.parent.schema)
							&& (schema = schema.valueOf()) && schema[target.key])
					})
				}
			}
		})
		function validate(target) {
			var schemaForObject = schema(target)
			return new Validating(target, schemaForObject)
		}
		Variable.deny = deny
		Variable.noChange = noChange
		function addFlag(name) {
			Variable[name] = function(functionValue) {
				functionValue[name] = true
			}
		}
		addFlag(Variable, 'handlesContext')
		addFlag(Variable, 'handlesPromises')

		function observe(object) {
			var listeners = propertyListenersMap.get(object)
			if (!listeners) {
				propertyListenersMap.set(object, listeners = [])
			}
			if (listeners.observerCount) {
				listeners.observerCount++
			}else{
				listeners.observerCount = 1
				var observer = listeners.observer = lang.observe(object, function(events) {
					for (var i = 0, l = listeners.length; i < l; i++) {
						var listener = listeners[i]
						for (var j = 0, el = events.length; j < el; j++) {
							var event = events[j]
							listener._propertyChange(event.name, object)
						}
					}
				})
				if (observer.addKey) {
					for (var i = 0, l = listeners.length; i < l; i++) {
						var listener = listeners[i]
						listener.eachKey(function(key) {
							observer.addKey(key)
						})
					}
				}
			}
			return {
				remove: function() {
					if (!(--listeners.observerCount)) {
						listeners.observer.remove()
					}
				},
				done: function() {
					// deliver changes
					lang.deliverChanges(observer)
					this.remove()
				}
			}
		}

		function objectUpdated(object) {
			// simply notifies any subscribers to an object, that it has changed
			var listeners = propertyListenersMap.get(object)
			if (listeners) {
				for (var i = 0, l = listeners.length; i < l; i++) {
					listeners[i]._propertyChange(null, object)
				}
			}
		}

		function all(array) {
			// This is intended to mirror Promise.all. It actually takes
			// an iterable, but for now we are just looking for array-like
			if (array.length > -1) {
				return new Composite(array)
			}
			throw new TypeError('Variable.all requires an array')
		}

		function hasOwn(Target, createForInstance) {
			var ownedClasses = this.ownedClasses || (this.ownedClasses = new WeakMap())
			// TODO: assign to super classes
			var Class = this
			ownedClasses.set(Target, createForInstance || function() { return new Target() })
			return this
		}
		function getForClass(Target, type) {
			var createInstance = this.constructor.ownedClasses && this.constructor.ownedClasses.get(Target)
			if (createInstance) {
				if (type === 'key') {
					return this
				}
				var ownedInstances = this.ownedInstances || (this.ownedInstances = new WeakMap())
				var instance = ownedInstances.get(Target)
				if (!instance) {
					ownedInstances.set(Target, instance = createInstance(this))
					instance.subject = this
				}
				return instance
			}
		}
		function generalizeClass() {
			var prototype = this.prototype
			var prototypeNames = Object.getOwnPropertyNames(prototype)
			for(var i = 0, l = prototypeNames.length; i < l; i++) {
				var name = prototypeNames[i]
				Object.defineProperty(this, name, getGeneralizedDescriptor(Object.getOwnPropertyDescriptor(prototype, name), name, this))
			}
		}
		function getGeneralizedDescriptor(descriptor, name, Class) {
			if (typeof descriptor.value === 'function') {
				return {
					value: generalizeMethod(Class, name)
				}
			} else {
				return descriptor
			}
		}
		function generalizeMethod(Class, name) {
			// I think we can just rely on `this`, but we could use the argument:
			// function(possibleEvent) {
			// 	var target = possibleEvent && possibleEvent.target
			var method = Class[name] = function() {
				var instance = Class.for(this)
				return instance[name].apply(instance, arguments)
			}
			method.for = function(context) {
				var instance = Class.for(context)
				return function() {
					return instance[name].apply(instance, arguments)
				}
			}
			return method
		}

		var defaultContext = {
			name: 'Default context',
			description: 'This object is the default context for classes, corresponding to a singleton instance of that class',
			getForClass: function(Class, type) {
				if (type === 'key') {
					return this
				}
				return Class.defaultInstance
			},
			contains: function() {
				return true // contains everything
			}
		}
		function instanceForContext(Class, context) {
			if (!context) {
				throw new TypeError('Accessing a generalized class without context to resolve to an instance, call for(context) (where context is an element or related variable instance) on your variable first')
			}
			var instance = context.subject.getForClass && context.subject.getForClass(Class) || Class.defaultInstance
			context.distinctSubject = mergeSubject(context.distinctSubject, instance.subject)
			return instance
		}
		Variable.valueOf = function(context) {
			// contextualized getValue
			return instanceForContext(this, context).valueOf()
		}
		Variable.setValue = function(value, context) {
			// contextualized setValue
			return instanceForContext(this, context).put(value)
		}
		Variable.generalize = generalizeClass
		Variable.call = Function.prototype.call // restore these
		Variable.apply = Function.prototype.apply
		Variable.extend = function(properties) {
			// TODO: handle arguments
			var Base = this
			function ExtendedVariable() {
				if (this instanceof ExtendedVariable) {
					return Base.apply(this, arguments)
				} else {
					return ExtendedVariable.extend(properties)
				}
			}
			var prototype = ExtendedVariable.prototype = Object.create(this.prototype)
			ExtendedVariable.prototype.constructor = ExtendedVariable
			setPrototypeOf(ExtendedVariable, this)
			for (var key in properties) {
				var descriptor = Object.getOwnPropertyDescriptor(properties, key)
				Object.defineProperty(prototype, key, descriptor)
				Object.defineProperty(ExtendedVariable, key, getGeneralizedDescriptor(descriptor, key, ExtendedVariable))
			}
			if (properties && properties.hasOwn) {
				hasOwn.call(ExtendedVariable, properties.hasOwn)
			}
			return ExtendedVariable
		}
		Object.defineProperty(Variable, 'defaultInstance', {
			get: function() {
				return this.hasOwnProperty('_defaultInstance') ?
					this._defaultInstance : (
						this._defaultInstance = new this(),
						this._defaultInstance.subject = defaultContext,
						this._defaultInstance)
			}
		})
		Variable.hasOwn = hasOwn
		Variable.all = all
		Variable.objectUpdated = objectUpdated
		Variable.observe = observe

		return Variable
	}));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory()
	    } else {
	        root.alkali = {lang: factory()}
	    }
	}(this, function () {
		var getPrototypeOf = Object.getPrototypeOf || (function(base) { return base.__proto__ })
		var setPrototypeOf = Object.setPrototypeOf || (function(base, proto) { base.__proto__ = proto})
		var hasFeatures = {
			requestAnimationFrame: typeof requestAnimationFrame != 'undefined',
			defineProperty: Object.defineProperty && (function(){
				try{
					Object.defineProperty({}, 't', {})
					return true
				}catch(e){
				}
			})(),
			promise: typeof Promise !== 'undefined',
			'WeakMap': typeof WeakMap === 'function'
		}
		function has(feature){
			return hasFeatures[feature]
		}
		// This is an polyfill for Object.observe with just enough functionality
		// for what Variables need
		// An observe function, with polyfile
		var observe =
			has('defineProperty') ? 
			function observe(target, listener){
				/*for(var i in target){
					addKey(i)
				}*/
				listener.addKey = addKey
				listener.remove = function(){
					listener = null
				}
				return listener
				function addKey(key){
					var keyFlag = 'key' + key
					if(this[keyFlag]){
						return
					}else{
						this[keyFlag] = true
					}
					var currentValue = target[key]
					var targetAncestor = target
					var descriptor
					do {
						descriptor = Object.getOwnPropertyDescriptor(targetAncestor, key)
					} while(!descriptor && (targetAncestor = getPrototypeOf(targetAncestor)))

					if(descriptor && descriptor.set){
						var previousSet = descriptor.set
						var previousGet = descriptor.get
						Object.defineProperty(target, key, {
							get: function(){
								return (currentValue = previousGet.call(this))
							},
							set: function(value){
								previousSet.call(this, value)
								if(currentValue !== value){
									currentValue = value
									if(listener){
										listener([{target: this, name: key}])
									}
								}
							},
							enumerable: descriptor.enumerable
						})
					}else{
						Object.defineProperty(target, key, {
							get: function(){
								return currentValue
							},
							set: function(value){
								if(currentValue !== value){
									currentValue = value
									if(listener){
										listener([{target: this, name: key}])
									}
								}
							},
							enumerable: !descriptor || descriptor.enumerable
						})
					}
				}
			} :
			// and finally a polling-based solution, for the really old browsers
			function(target, listener){
				if(!timerStarted){
					timerStarted = true
					setInterval(function(){
						for(var i = 0, l = watchedObjects.length; i < l; i++){
							diff(watchedCopies[i], watchedObjects[i], listeners[i])
						}
					}, 20)
				}
				var copy = {}
				for(var i in target){
					if(target.hasOwnProperty(i)){
						copy[i] = target[i]
					}
				}
				watchedObjects.push(target)
				watchedCopies.push(copy)
				listeners.push(listener)
			}
		var queuedListeners
		function queue(listener, object, name){
			if(queuedListeners){
				if(queuedListeners.indexOf(listener) === -1){
					queuedListeners.push(listener)
				}
			}else{
				queuedListeners = [listener]
				lang.nextTurn(function(){
					queuedListeners.forEach(function(listener){
						var events = []
						listener.properties.forEach(function(property){
							events.push({target: listener.object, name: property})
						})
						listener(events)
						listener.object = null
						listener.properties = null
					})
					queuedListeners = null
				}, 0)
			}
			listener.object = object
			var properties = listener.properties || (listener.properties = [])
			if(properties.indexOf(name) === -1){
				properties.push(name)
			}
		}
		var unobserve = has('observe') ? Object.unobserve :
			function(target, listener){
				if(listener.remove){
					listener.remove()
				}
				for(var i = 0, l = watchedObjects.length; i < l; i++){
					if(watchedObjects[i] === target && listeners[i] === listener){
						watchedObjects.splice(i, 1)
						watchedCopies.splice(i, 1)
						listeners.splice(i, 1)
						return
					}
				}
			}
		var watchedObjects = []
		var watchedCopies = []
		var listeners = []
		var timerStarted = false
		function diff(previous, current, callback){
			// TODO: keep an array of properties for each watch for faster iteration
			var queued
			for(var i in previous){
				if(previous.hasOwnProperty(i) && previous[i] !== current[i]){
					// a property has changed
					previous[i] = current[i]
					(queued || (queued = [])).push({name: i})
				}
			}
			for(var i in current){
				if(current.hasOwnProperty(i) && !previous.hasOwnProperty(i)){
					// a property has been added
					previous[i] = current[i]
					(queued || (queued = [])).push({name: i})
				}
			}
			if(queued){
				callback(queued)
			}
		}

		var id = 1
		// a function that returns a function, to stop JSON serialization of an
		// object
		function toJSONHidden() {
			return toJSONHidden
		}
		// An object that will be hidden from JSON serialization
		var Hidden = function () {
		}
		Hidden.prototype.toJSON = toJSONHidden

		var lang = {
			requestAnimationFrame: has('requestAnimationFrame') ? requestAnimationFrame :
				(function(){
					var toRender = []
					var queued = false
					function processAnimationFrame() {
						for (var i = 0; i < toRender.length; i++){
							toRender[i]()
						}
						toRender = []
						queued = false
					}
					function requestAnimationFrame(renderer){
					 	if (!queued) {
							setTimeout(processAnimationFrame)
							queued = true
						}
						toRender.push(renderer)
					}
					return requestAnimationFrame
				})(),
			Promise: has('promise') ? Promise : (function(){
				function Promise(execute){
					var isResolved, resolution, errorResolution
					var queue = 0
					function resolve(value){
						// resolve function
						if(value && value.then){
							// received a promise, wait for it
							value.then(resolve, reject)
						}else{
							resolution = value
							finished()
						}
					}
					function reject(error){
						// reject function
						errorResolution = error
						finished()
					}
					execute(resolve, reject)
					function finished(){
						isResolved = true
						for(var i = 0, l = queue.length; i < l; i++){
							queue[i]()
						}
						// clean out the memory
						queue = 0
					}
					return {
						then: function(callback, errback){
							return new Promise(function(resolve, reject){
								function handle(){
									// promise fulfilled, call the appropriate callback
									try{
										if(errorResolution && !errback){
											// errors without a handler flow through
											reject(errorResolution)
										}else{
											// resolve to the callback's result
											resolve(errorResolution ?
												errback(errorResolution) :
												callback ?
													callback(resolution) : resolution)
										}
									}catch(newError){
										// caught an error, reject the returned promise
										reject(newError)
									}
								}
								if(isResolved){
									// already resolved, immediately handle
									handle()
								}else{
									(queue || (queue = [])).push(handle)
								}
							})
						}
					}
				}
				return Promise
			}()),

			WeakMap: has('WeakMap') ? WeakMap :
		 	function (values, name) {
		 		var mapProperty = '__' + (name || '') + id++
		 		return has('defineProperty') ?
		 		{
		 			get: function (key) {
		 				return key[mapProperty]
		 			},
		 			set: function (key, value) {
		 				Object.defineProperty(key, mapProperty, {
		 					value: value,
		 					enumerable: false
		 				})
		 			}
		 		} :
		 		{
		 			get: function (key) {
		 				var intermediary = key[mapProperty]
		 				return intermediary && intermediary.value
		 			},
		 			set: function (key, value) {
		 				// we use an intermediary that is hidden from JSON serialization, at least
		 				var intermediary = key[mapProperty] || (key[mapProperty] = new Hidden())
		 				intermediary.value = value
		 			}
		 		}
		 	},

			observe: observe,
			unobserve: unobserve,
			when: function(value, callback, errorHandler){
				return value && value.then ?
					(value.then(callback, errorHandler) || value) : callback(value)
			},
			whenAll: function(inputs, callback){
				var promiseInvolved
				for(var i = 0, l = inputs.length; i < l; i++){
					if(inputs[i] && inputs[i].then){
						promiseInvolved = true
					}
				}
				if(promiseInvolved){
					// we have asynch inputs, do lazy loading
					return {
						then: function(onResolve, onError){
							var remaining = 1
							var result
							var readyInputs = []
							var lastPromiseResult
							for(var i = 0; i < inputs.length; i++){
								var input = inputs[i]
								remaining++
								if(input && input.then){
									(function(i, previousPromiseResult){
										lastPromiseResult = input.then(function(value){
											readyInputs[i] = value
											onEach()
											if(!remaining){
												return result
											}else{
												return previousPromiseResult
											}
										}, onError)
									})(i, lastPromiseResult)
								}else{
									readyInputs[i] = input
									onEach()
								}
							}
							onEach()
							function onEach(){
								remaining--
								if(!remaining){
									result = onResolve(callback(readyInputs))
								}
							}
							return lastPromiseResult
						},
						inputs: inputs
					}
				}
				// just sync inputs
				return callback(inputs)

			},
			compose: function(Base, constructor, properties){
				var prototype = constructor.prototype = Object.create(Base.prototype)
				setPrototypeOf(constructor, Base)
				for(var i in properties){
					prototype[i] = properties[i]
				}
				prototype.constructor = constructor
				return constructor
			},
			nextTurn: has('promise') ? 
				function (callback) {
					// promises resolve on the next micro turn
					new Promise(function (resolve) {
						resolve(); 
					}).then(callback)
				} :
				function (callback) {
					// TODO: we can do better for other, older browsers
					setTimeout(callback, 0)
				},
			copy: Object.assign || function(target, source){
				for(var i in source){
					target[i] = source[i]
				}
				return target
			}
		}
		return lang
	}));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Element = __webpack_require__(5);

	var _Variable2 = __webpack_require__(2);

	var _Variable3 = _interopRequireDefault(_Variable2);

	var _Todo = __webpack_require__(7);

	var _Todo2 = _interopRequireDefault(_Todo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               This is the main "view" component that renders the todos as DOM elements,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               using the Alkali DOM constructors in declarative style
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


	var Editing = function (_Variable) {
		_inherits(Editing, _Variable);

		function Editing() {
			_classCallCheck(this, Editing);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Editing).apply(this, arguments));
		}

		return Editing;
	}(_Variable3.default);

	// define our main "component", the main todo view of the todo (view) data model.
	// This could easily be a reusable component, although in the case of the TodoMVC
	// CSS, it relies heavily on id-based elements that can really be used multiple times
	// The component is defined as a hierarchy of HTML elements


	var TodoView = function (_Div) {
		_inherits(TodoView, _Div);

		function TodoView() {
			_classCallCheck(this, TodoView);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoView).apply(this, arguments));
		}

		return TodoView;
	}((0, _Element.Div)('#todo', [
	// we use selector syntax to define ids and class, and arrays to define children
	(0, _Element.Section)('#todoapp', [(0, _Element.Header)('#header', [(0, _Element.H1)(['todos']), (0, _Element.Form)([(0, _Element.Input)('#new-todo', {
		autofocus: true,
		placeholder: 'What needs to be done?',
		// we can variables for any property; when we use a variable in a user-input
		// driven property, the binding is bi-directional
		value: _Todo2.default.property('newItem')
	})], {
		onsubmit: function onsubmit(event) {
			event.preventDefault();
			_Todo2.default.for(this).add(); // add a new todo when the user submits
		}
	})]), (0, _Element.Section)('#main', [(0, _Element.Checkbox)('#toggle-all', {
		checked: _Todo2.default.allCompleted
	}), _Element.Label, (0, _Element.UL)('#todo-list', {
		content: _Todo2.default.listView,
		each: (0, _Element.LI)('.task', [(0, _Element.Checkbox)('.toggle', _Element.Item.property('completed')), (0, _Element.Label)('.view', [_Element.Item.property('name')], {
			textDecoration: _Element.Item.property('completed').to(function (completed) {
				return completed ? 'line-through' : 'none';
			}),
			display: Editing.to(function (editing) {
				return editing ? 'none' : 'block';
			}),
			ondblclick: function ondblclick() {
				var editing = Editing.for(this);
				editing.put(!editing.valueOf());
				this.nextSibling.focus();
			}
		}), (0, _Element.Input)('.edit', {
			display: Editing,
			value: _Element.Item.property('name'),
			onblur: function onblur() {
				Editing.for(this).put(false);
			},
			onchange: function onchange() {
				Editing.for(this).put(false);
			}
		}), (0, _Element.Button)('.destroy', {
			onclick: _Todo2.default.delete
		})], {
			hasOwn: Editing
		})
	})]), (0, _Element.Footer)('#footer', [(0, _Element.Span)('#todo-count', _Todo2.default.todoCount.to(function (count) {
		return count + (count > 1 ? ' items left' : ' item left');
	}), {
		display: _Todo2.default.todoCount.to(function (count) {
			return count > 0;
		})
	}), (0, _Element.UL)('#filters', [_Element.LI, [(0, _Element.A)({ href: '#/' }, ['All '])], _Element.LI, [(0, _Element.A)({ href: '#/active' }, ['Active '])], _Element.LI, [(0, _Element.A)({ href: '#/completed' }, ['Completed'])]]), (0, _Element.Button)('#clear-completed', 'Clear completed', {
		onclick: _Todo2.default.clearCompleted
	})])]), (0, _Element.Footer)('#info', [(0, _Element.P)('', 'Double-click to edit a todo')])]));

	exports.default = TodoView;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory(require('./util/lang'), require('./Variable'), require('./Updater'))
	    } else {
	        root.alkali.Variable = factory(root.alkali.lang, root.alkali.Variable, root.alkali.Updater)
	    }
	}(this, function (Variable, Updater, lang) {
		var knownElementProperties = {
		}

		function Context(subject){
			this.subject = subject
		}

		var PropertyUpdater = lang.compose(Updater.PropertyUpdater, function PropertyUpdater() {
			Updater.PropertyUpdater.apply(this, arguments)
		}, {
			renderUpdate: function(newValue, element) {
				// TODO: cache or otherwise optimize this
				var rendererName = 'render' + this.name[0].toUpperCase() + this.name.slice(1)
				if (element[rendererName]) {
					// custom renderer
					element[rendererName](newValue)
				} else {
					element[this.name] = newValue
				}
			}
		})
		var StyleUpdater = lang.compose(Updater.StyleUpdater, function StyleUpdater() {
			Updater.StyleUpdater.apply(this, arguments)
		}, {
			renderUpdate: function(newValue, element) {
				var definition = styleDefinitions[this.name]
				element.style[this.name] = definition ? definition(newValue) : newValue
			}
		})
		// TODO: check for renderContent with text updater
		var TextUpdater = Updater.TextUpdater
		var ListUpdater = Updater.ListUpdater
		;['href', 'title', 'role', 'id', 'className'].forEach(function (name) {
			knownElementProperties[name] = true
		})
		var toAddToElementPrototypes = []
		var createdBaseElements = []
		var testStyle = document.createElement('div').style
		var childTagForParent = {
			TABLE: ['tr','td'],
			TBODY: ['tr','td'],
			TR: 'td',
			UL: 'li',
			OL: 'li',
			SELECT: 'option'
		}
		var inputs = {
			INPUT: 1,
			TEXTAREA: 1
			// SELECT: 1, we exclude this, so the default "content" of the element can be the options
		}
		var bidirectionalProperties = {
			value: 1,
			typedValue: 1,
			valueAsNumber: 1,
			valueAsDate: 1,
			checked: 1
		}
		function booleanStyle(options) {
			return function(value) {
				if (typeof value === 'boolean') {
					// has a boolean conversion
					return options[value ? 0 : 1]
				}
				return value
			}
		}

		function defaultStyle(value) {
			return function(value) {
				if (typeof value === 'number') {
					return value + 'px'
				}
				return value
			}
		}
		function identity(value) {
			return value
		}

		var styleDefinitions = {
			display: booleanStyle(['initial', 'none']),
			visibility: booleanStyle(['visible', 'hidden']),
			color: identity,
			opacity: identity,
			zoom: identity,
			minZoom: identity,
			maxZoom: identity,
			position: booleanStyle(['absolute', '']),
			textDecoration: booleanStyle(['underline', '']),
			fontWeight: booleanStyle(['bold', 'normal'])
		}
		;["alignContent","alignItems","alignSelf","animation","animationDelay","animationDirection","animationDuration","animationFillMode","animationIterationCount","animationName","animationPlayState","animationTimingFunction","backfaceVisibility","background","backgroundAttachment","backgroundBlendMode","backgroundClip","backgroundColor","backgroundImage","backgroundOrigin","backgroundPosition","backgroundPositionX","backgroundPositionY","backgroundRepeat","backgroundRepeatX","backgroundRepeatY","backgroundSize","baselineShift","border","borderBottom","borderBottomColor","borderBottomLeftRadius","borderBottomRightRadius","borderBottomStyle","borderBottomWidth","borderCollapse","borderColor","borderImage","borderImageOutset","borderImageRepeat","borderImageSlice","borderImageSource","borderImageWidth","borderLeft","borderLeftColor","borderLeftStyle","borderLeftWidth","borderRadius","borderRight","borderRightColor","borderRightStyle","borderRightWidth","borderSpacing","borderStyle","borderTop","borderTopColor","borderTopLeftRadius","borderTopRightRadius","borderTopStyle","borderTopWidth","borderWidth","bottom","boxShadow","boxSizing","bufferedRendering","captionSide","clear","clip","clipPath","clipRule","color","colorInterpolation","colorInterpolationFilters","colorRendering","counterIncrement","counterReset","cursor","direction","display","emptyCells","fill","fillOpacity","fillRule","filter","flex","flexBasis","flexDirection","flexFlow","flexGrow","flexShrink","flexWrap","float","floodColor","floodOpacity","font","fontFamily","fontFeatureSettings","fontKerning","fontSize","fontStretch","fontStyle","fontVariant","fontVariantLigatures","fontWeight","height","imageRendering","isolation","justifyContent","left","letterSpacing","lightingColor","lineHeight","listStyle","listStyleImage","listStylePosition","listStyleType","margin","marginBottom","marginLeft","marginRight","marginTop","marker","markerEnd","markerMid","markerStart","mask","maskType","maxHeight","maxWidth","maxZoom","minHeight","minWidth","minZoom","mixBlendMode","motion","motionOffset","motionPath","motionRotation","objectFit","objectPosition","opacity","order","orientation","orphans","outline","outlineColor","outlineOffset","outlineStyle","outlineWidth","overflow","overflowWrap","overflowX","overflowY","padding","paddingBottom","paddingLeft","paddingRight","paddingTop","page","pageBreakAfter","pageBreakBefore","pageBreakInside","paintOrder","perspective","perspectiveOrigin","pointerEvents","position","quotes","resize","right","shapeImageThreshold","shapeMargin","shapeOutside","shapeRendering","size","speak","src","stopColor","stopOpacity","stroke","strokeDasharray","strokeDashoffset","strokeLinecap","strokeLinejoin","strokeMiterlimit","strokeOpacity","strokeWidth","tabSize","tableLayout","textAlign","textAlignLast","textAnchor","textCombineUpright","textDecoration","textIndent","textOrientation","textOverflow","textRendering","textShadow","textTransform","top","touchAction","transform","transformOrigin","transformStyle","transition","transitionDelay","transitionDuration","transitionProperty","transitionTimingFunction","unicodeBidi","unicodeRange","userZoom","vectorEffect","verticalAlign","visibility","whiteSpace","widows","width","willChange","wordBreak","wordSpacing","wordWrap","writingMode","zIndex","zoom"].forEach(function(property) {
			styleDefinitions[property] = styleDefinitions[property] || defaultStyle
		})
		var doc = document
		var styleSheet
		var presumptiveParentMap = new WeakMap()

		var setPrototypeOf = Object.setPrototypeOf || (function(base, proto) { base.__proto__ = proto})
		var getPrototypeOf = Object.getPrototypeOf || (function(base) { return base.__proto__ })
		function createCssRule(selector) {
			if (!styleSheet) {
				var styleSheetElement = document.createElement("style")
				styleSheetElement.setAttribute("type", "text/css")
	//			styleSheet.appendChild(document.createTextNode(css))
				document.head.insertBefore(styleSheetElement, document.head.firstChild)
				styleSheet = styleSheetElement.sheet
			}
			var cssRules = styleSheet.cssRules || styleSheet.rules
			return cssRules[styleSheet.addRule(selector, ' ', cssRules.length)]
		}
		var invalidatedElements = new WeakMap(null, 'invalidated')
		var queued

		var toRender = []
		function flatten(target, part) {
			var base = target.base
			if (base) {
				var basePart = base[part]
				if (basePart) {
					target[part] || target[part]
				}
			}
		}

		function layoutChildren(parent, children, container) {
			var fragment = children.length > 1 ? document.createDocumentFragment() : parent
			for(var i = 0, l = children.length; i < l; i++) {
				var child = children[i]
				var childNode
				if (child && child.create) {
					// an element constructor
					currentParent = parent
					childNode = child.create()
					fragment.appendChild(childNode)
					if (child.isContentNode) {
						container.contentNode = childNode
					}
				} else if (typeof child == 'function') {
					// TODO: reenable this
	//				if (child.for) {
						// a variable constructor that can be contextualized
		//				fragment.appendChild(variableAsText(parent, child))
			//		} else {
						// an element constructor
						childNode = new child()
						fragment.appendChild(childNode)
				//	}
				} else if (typeof child == 'object') {
					if (child instanceof Array) {
						// array of sub-children
						container = container || parent
						layoutChildren(childNode.contentNode || childNode, child, container)
					} else if (child.notifies) {
						// a variable
						fragment.appendChild(variableAsText(parent, child))
					} else if (child.nodeType) {
						// an element itself
						fragment.appendChild(child)
					} else {
						// TODO: apply properties to last child, but with binding to the parent (for events)
						throw new Error('Unknown child type ' + child)
					}
				} else {
					// a primitive value
					childNode = document.createTextNode(child)
					fragment.appendChild(childNode)
				}
			}
			if (fragment != parent) {
				parent.appendChild(fragment)
			}
			return childNode
		}
		function variableAsText(parent, variable) {
			var text = variable.valueOf(new Context(parent))
			var childNode = document.createTextNode(text)
			enterUpdater(TextUpdater, {
				element: parent,
				textNode: childNode,
				variable: variable
			})
			return childNode
		}

		function applyProperties(element, properties, keys) {
			for (var i = 0, l = keys.length; i < l; i++) {
				var key = keys[i]
				var value = properties[key]
				var styleDefinition = styleDefinitions[key]
				if (styleDefinition) {
					if (value && value.notifies) {
						enterUpdater(StyleUpdater, {
							name: key,
							variable: value,
							element: element
						})

					} else {
						element.style[key] = styleDefinition(value)
					}
				} else if (value && value.notifies && key !== 'content') {
					enterUpdater(PropertyUpdater, {
						name: key,
						variable: value,
						element: element
					})
					if (bidirectionalProperties[key]) {
						bindChanges(element, value)
					}
				} else if (key.slice(0, 2) === 'on') {
					element.addEventListener(key.slice(2), value)
				} else {
					element[key] = value
				}
			}
		}

		function applySelector(element, selector) {
			selector.replace(/(\.|#)?(\w+)/g, function(t, operator, name) {
				if (operator == '.') {
					element._class = (element._class ? element._class + ' ' : '') + name
				} else if (operator == '#') {
					element._id = name
				} else {
					element._tag = name
				}
			})
		}

		nextClassId = 1
		uniqueSelectors = {}
		function getUniqueSelector(element) {
			var selector = element.hasOwnProperty('_uniqueSelector') ? element._uniqueSelector :
				(element._tag + (element._class ? '.' + element._class.replace(/\s+/g, '.') : '') +
				(element._id ? '#' + element._id : ''))
			if (!selector.match(/[#\.-]/)) {
				if (uniqueSelectors[selector]) {
					element._class = '.x-' + nextClassId++
					selector = getUniqueSelector(element)
				} else {
					uniqueSelectors[selector] = selector
				}
			}
			return selector
		}

		function renderContent(content) {
			var each = this.each
			if (each && content) {
				// render as list
				if (each.create) {
					var ItemClass = this.itemAs || Item
					hasOwn(each, ItemClass, function (element) {
						return new ItemClass(element._item, content)
					})
				}
				if (content.notifies) {
					enterUpdater(ListUpdater, {
						each: each,
						variable: content,
						element: this
					})
				} else {
					var fragment = document.createDocumentFragment()
					var element = this
					content.forEach(function(item) {
						if (each.create) {
							childElement = each.create({parent: element, _item: item}) // TODO: make a faster object here potentially
						} else {
							childElement = each(item, element)
						}
						fragment.appendChild(childElement)
					})
					this.appendChild(fragment)
				}
			} else if (inputs[this.tagName]) {
				// render into input
				this.renderInputContent(content)
			} else {
				// render as string
				try {
					var text = content === undefined ? '' : content.valueOf(new Context(this))
					var textNode = document.createTextNode(text)
				} catch (error) {
					console.error(error.stack)
					var textNode = document.createTextNode(error)
				}
				this.appendChild(textNode)
				if (content && content.notifies) {
					enterUpdater(TextUpdater, {
						variable: content,
						element: this,
						textNode: textNode
					})
				}
			}
		}

		function bindChanges(element, variable) {
			element.addEventListener('change', function (event) {
				var result = variable.put(element['typedValue' in element ? 'typedValue' : 'value'], new Context(element))
			})
		}
		function renderInputContent(content) {
			if (content && content.notifies) {
				// a variable, respond to changes
				enterUpdater(PropertyUpdater, {
					variable: content,
					name: 'typedValue' in this ? 'typedValue' : 'value',
					element: this
				})
				// and bind the other way as well, updating the variable in response to input changes
				bindChanges(this, content)
			} else {
				// primitive
				this['typedValue' in this ? 'typedValue' : 'value'] = content
			}
		}
		var classHandlers = {
			hasOwn: function(Element, descriptor) {
				hasOwn(Element, descriptor.value)
			}
		}

		function applyToClass(value, Element) {
			var applyOnCreate = Element._applyOnCreate
			var prototype = Element.prototype
			if (value && typeof value === 'object') {
				if (value instanceof Array) {
					Element.childrenToRender = value
				} else if (value.notifies) {
					prototype.content = value
				} else {
					Object.getOwnPropertyNames(value).forEach(function(key) {
						var descriptor = Object.getOwnPropertyDescriptor(value, key)
						if (classHandlers[key]) {
							classHandlers[key](Element, descriptor)
						} else {
							var onClassPrototype = (typeof descriptor.value === 'function' && !descriptor.value.notifies) // a plain function/method and not a variable constructor
								|| descriptor.get || descriptor.set // or a getter/setter
							if (onClassPrototype) {
								Object.defineProperty(prototype, key, descriptor)
							}
							if (!onClassPrototype || key.slice(0, 2) == 'on') {
								// TODO: eventually we want to be able to set these as rules statically per element
								/*if (styleDefinitions[key]) {
									var styles = Element.styles || (Element.styles = [])
									styles.push(key)
									styles[key] = descriptor.value
								} else {*/
									if (!(key in applyOnCreate)) {
										var lastLength = applyOnCreate.length || 0
										applyOnCreate[lastLength] = key
										applyOnCreate.length = lastLength + 1
									}
									// TODO: do deep merging of styles and classes, but not variables
									applyOnCreate[key] = descriptor.value
								//}
							}
						}
					})
				}
			} else if (typeof value === 'function' && !value.for) {
				Element.initialize = function() {
					var Base = getPrototypeOf(Element)
					if (Base.initialize && !Base._initialized) {
						Base._initialized = true
						Base.initialize()
					}
					applyToClass(value(Element), Element)
				}
			} else {
				prototype.content = value
			}
		}
		function extend(selector, properties) {
			function Element(selector, properties) {
				if (this instanceof Element){
					// create DOM element
					// Need to detect if we have registered the element and `this` is actually already the correct instance
					return create.apply(this.constructor, arguments)
				} else {
					// extend to create new class
					return extend.apply(Element, arguments)
				}
			}
			setPrototypeOf(Element, this)
			var prototype = Element.prototype = Object.create(this.prototype)
			prototype.constructor = Element

			if (!Element.create) {
				// if we are inheriting from a native prototype, we will create the inherited base static functions
				Element.create = create
				Element.extend = extend
				Element.for = forTarget
				Element.property = propertyForElement
				Element.append = append
			}
			if (!prototype.renderContent) {
				prototype.renderContent = renderContent
				prototype.renderInputContent = renderInputContent
				prototype.getForClass = getForClass
			}

			var i = 0 // for arguments
			if (typeof selector === 'string') {
				selector.replace(/(\.|#)?([-\w]+)/g, function(t, operator, name) {
					if (operator == '.') {
						Element._class = (Element._class ? Element._class + ' ' : '') + name
					} else if (operator == '#') {
						Element._id = name
					} else {
						Element._tag = name
					}
				})

				i++ // skip the first argument
			}
			Element._applyOnCreate = Object.create(this._applyOnCreate || null)

			for (var l = arguments.length; i < l; i++) {
				applyToClass(arguments[i], Element)
			}
			return Element
		}
		var currentParent
		function create(selector, properties) {
			// TODO: make this a symbol
			var applyOnCreate = this._applyOnCreate
			if (currentParent) {
				var parent = currentParent
				currentParent = null
			}
			var tagName = this._tag
			if (this._initialized != this) {
				this._initialized = this
				this.initialize && this.initialize()
				if (!tagName) {
					throw new Error('No tag name defined for element')
				}
				var styles = this.styles
				if (styles) {
					var rule = createCssRule(getUniqueSelector(this))
					for (var i = 0, l = styles.length; i < l; i++) {
						var key = styles[i]
						var value = styles[key]
						// TODO: if it is a contextualized variable, do this on the element
						var styleDefinition = styleDefinitions[key]
						if (styleDefinition) {
							value = styleDefinition(value)
							rule.style[key] = value
						}
					}
				}
				if (!this.hasOwnProperty('_applyOnCreate')) {
					applyOnCreate = this._applyOnCreate = Object.create(applyOnCreate || null)
					// this means we didn't extend and evaluate the prototype, so we need to at least check the prototype for event handlers
					var keys = Object.getOwnPropertyNames(this.prototype)
					for (var i = 0, l = keys.length; i < l; i++) {
						var key = keys[i]
						if (key.slice(0, 2) == 'on') {
							if (!(key in applyOnCreate)) {
								var lastLength = applyOnCreate.length || 0
								applyOnCreate[lastLength] = key
								applyOnCreate.length = lastLength + 1
							}
							applyOnCreate[key] = this.prototype[key]
						}
					}
				}
				if (tagName.indexOf('-') > -1) {
					document.registerElement(tagName, this)
				}
			}
			var element = document.createElement(tagName)
			if (selector && selector.parent) {
				parent = selector.parent
			}
			if (parent) {
				presumptiveParentMap.set(element, parent)
			}
			setPrototypeOf(element, this.prototype)
			if (this._id) {
				element.id = this._id
			}
			if (this._class) {
				element.className = this._class
			}
			var i = 0
			if (typeof selector == 'string') {
				i++
				selector.replace(/(\.|#)?([-\w]+)/g, function(t, operator, name) {
					if (operator == '.') {
						element.className = (element.className ? this.className + ' ' : '') + name
					} else if (operator == '#') {
						element.id = name
					} else {
						throw new Error('Can not assign tag name when directly create an element')
					}
				})
			}
			if (selector && selector._item) {
				// this is kind of hack, to get the Item available before the properties, eventually we may want to
				// order static properties before variable binding applications, but for now.
				element._item = selector._item
			}
			if (applyOnCreate) {
				applyProperties(element, applyOnCreate, applyOnCreate)
			}
			var childrenToRender
			for (var l = arguments.length; i < l; i++) {
				var argument = arguments[i]
				if (argument instanceof Array) {
					childrenToRender = argument
				} else if (argument.notifies) {
					element.content = argument
				} else if (typeof argument === 'function' && argument.for) {
					element.content = argument.for(element)
				} else {
					applyProperties(element, argument, Object.keys(argument))
				}
			}
			// TODO: we may want to put these on the instance so it can be overriden
			if (this.childrenToRender) {
				layoutChildren(element, this.childrenToRender, element)
			}
			if (childrenToRender) {
				var contentNode = element.contentNode || element
				layoutChildren(contentNode, argument, contentNode)
			}
			if (element.content) {
				element.renderContent(element.content)
			}
			var classes = this.classes
			if (classes) {
				if (!(classes.length > -1)) {
					// index the classes, if necessary
					var i = 0
					for (var key in classes) {
						if (!classes[i]) {
							classes[i] = key
						}
						i++
					}
					classes.length = i
				}
				for (var i = 0, l = classes.length; i < l; i++) {
					// find each class name
					var className = classes[i]
					var flag = classes[className]
					if (flag && flag.notifies) {
						// if it is a variable, we react to it
						enterUpdater(Updater, {
							element: element,
							className: className,
							variable: flag
						})
					} else if (flag || flag === undefined) {
						element.className += ' ' + className
					}
				}
			}
			element.createdCallback && element.createdCallback()
			element.created && element.created()
			return element
		}

		function append(){
			return layoutChildren(this, arguments, this)
		}

		var Element = extend.call(HTMLElement)

		Element.within = function(element){
			// find closest child
		}

		var typedValueDescriptor = {
			// TODO: eventually make this a getter/setter
			get: function() {
				var inputType = this.type
				return inputType in {date: 1, datetime: 1, time: 1} ?
					this.valueAsDate :
					inputType === 'number' ?
						parseFloat(this.value) :
						inputType === 'checkbox' ? this.checked : this.value
			},
			set: function(value) {
				var inputType = this.type
				inputType in {date: 1, datetime: 1, time: 1} ?
					this.valueAsDate = value :
					inputType === 'checkbox' ?
						this.checked = value :
						this.value = value
			}
		}
		var typedValuePrototype = Object.create(null, {typedValue: typedValueDescriptor})
		generate([
			'Video',
			'Source',
			'Media',
			'Audio',
			'UL',
			'Track',
			'Title',
			'TextArea',
			'Template',
			'TBody',
			'THead',
			'TFoot',
			'TR',
			'Table',
			'Col',
			'ColGroup',
			'TH',
			'TD',
			'Caption',
			'Style',
			'Span',
			'Shadow',
			'Select',
			'Script',
			'Quote',
			'Progress',
			'Pre',
			'Picture',
			'Param',
			'P',
			'Output',
			'Option',
			'Optgroup',
			'Object',
			'OL',
			'Ins',
			'Del',
			'Meter',
			'Meta',
			'Menu',
			'Map',
			'Link',
			'Legend',
			'Label',
			'LI',
			'KeyGen',
			'Image',
			'IFrame',
			'H1',
			'H2',
			'H3',
			'H4',
			'H5',
			'H6',
			'Hr',
			'FrameSet',
			'Frame',
			'Form',
			'Font',
			'Embed',
			'Article',
			'Aside',
			'Footer',
			'Figure',
			'FigCaption',
			'Header',
			'Main',
			'Mark',
			'MenuItem',
			'Nav',
			'Section',
			'Summary',
			'WBr',
			'Div',
			'Dialog',
			'Details',
			'DataList',
			'DL',
			'Canvas',
			'Button',
			'Base',
			'Br',
			'Area',
			'A'
		])
		generateInputs([
			'Checkbox',
			'Password',
			'Text',
			'Submit',
			'Radio',
			'Color',
			'Date',
			'DateTime',
			'Email',
			'Month',
			'Number',
			'Range',
			'Search',
			'Tel',
			'Time',
			'Url',
			'Week'])

		function generate(elements) {
			elements.forEach(function(elementName) {
				var ElementClass
				Object.defineProperty(Element, elementName, {
					get: function() {
						return ElementClass || (ElementClass = augmentBaseElement(extend.call(document.createElement(elementName.toLowerCase()).constructor, elementName.toLowerCase())))
					}
				})
			})
		}
		function generateInputs(elements) {
			elements.forEach(function(inputType) {
				var ElementClass
				Object.defineProperty(Element, inputType, {
					get: function() {
						// TODO: make all inputs extend from input generated from generate
						return ElementClass || (ElementClass = augmentBaseElement(extend.call(HTMLInputElement, 'input', {
							type: inputType.toLowerCase()
						}, typedValuePrototype)))
					}
				})
				// alias all the inputs with an Input suffix
				Object.defineProperty(Element, inputType + 'Input', {
					get: function() {
						return this[inputType]
					}
				})
			})
		}

		Object.defineProperty(Element.TextArea.prototype, 'typedValue', typedValueDescriptor)
		Object.defineProperty(Element.Select.prototype, 'typedValue', typedValueDescriptor)
		var aliases = {
			Anchor: 'A',
			Paragraph: 'P',
			Textarea: 'TextArea',
			DList: 'Dl',
			UList: 'Ul',
			OList: 'Ol',
			ListItem: 'LI',
			Input: 'Text',
			TableRow: 'TR',
			TableCell: 'TD',
			TableHeaderCell: 'TH',
			TableHeader: 'THead',
			TableBody: 'TBody'
		}
		for (var alias in aliases) {
			(function(alias, to) {
				Object.defineProperty(Element, alias, {
					get: function() {
						return this[to]
					}
				})			
			})(alias, aliases[alias])
		}

		Element.refresh = Updater.refresh
		Element.content = function(element){
			// container marker
			return {
				isContentNode: true,
				create: element.create.bind(element)
			}
		}
		function forTarget(target) {
			return target.getForClass(this)
		}

		function hasOwn(From, Target, createInstance) {
			if (typeof Target === 'object' && Target.Class) {
				return hasOwn(From, Target.Class, Target.createInstance)
			}
			if (Target instanceof Array) {
				return Target.forEach(function(Target) {
					hasOwn(From, Target)
				})
			}
			var ownedClasses = From.ownedClasses || (From.ownedClasses = new WeakMap())
			// TODO: assign to super classes
			ownedClasses.set(Target, createInstance || function() {
				return new Target()
			})
			return From
		}

		var globalInstances = {}
		function getForClass(Target) {
			var element = this
			var createInstance
			while (element && !(createInstance = element.constructor.ownedClasses && element.constructor.ownedClasses.get(Target))) {
				element = element.parentNode || presumptiveParentMap.get(element)
			}
			if (createInstance) {
				var ownedInstances = element.ownedInstances || (element.ownedInstances = new WeakMap())
				var instance = ownedInstances.get(Target)
				if (instance === undefined) {
					ownedInstances.set(Target, instance = createInstance(element))
					instance.subject = element
				}
				return instance
			}
		}

		function propertyForElement(key) {
			// we just need to establish one Variable class for each element, so we cache it
			ThisElementVariable = this._Variable
			if (!ThisElementVariable) {
				// need our own branded variable class for this element class
				ThisElementVariable = this._Variable = Variable()

				hasOwn(this, ThisElementVariable, function(element) {
					// when we create the instance, immediately observe it
					// TODO: we might want to do this in init instead
					var instance = new ThisElementVariable(element)
					Variable.observe(element)
					return instance
				})
			}
			// now actually get the property class
			return ThisElementVariable.property(key)
		}

		var Item = Element.Item = Variable.Item

		function enterUpdater(Updater, options/*, target*/) {
			// this will be used for optimized class-level variables
			/*if (target.started) { // TODO: Might want to pass in started as a parameter
				// this means that the updater has already been created, so we just need to add this instance
				Updater.prototype.renderUpdate.call(options, element)
			} else {*/
			var target = options.element
			var updaters = target.updaters || (target.updaters = [])
			updaters.push(new Updater(options))
			//}
		}

		function cleanup(target) {
			var updaters = target.updaters
			if (updaters) {
				for (var i = 0, l = updaters.length; i < l; i++) {
					updaters[i].stop()
				}
			}
			target.needsRestart = true
		}
		function restart(target) {
			var updaters = target.updaters
			if (updaters) {
				for (var i = 0, l = updaters.length; i < l; i++) {
	//				updaters[i].start()
				}
			}
		}
		// setup the mutation observer so we can be notified of attachments and removals
		function traverse(nodes, action) {
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i]
				if (node.nodeType === 1) {
					action(node)
					traverse(node.childNodes, action)
				}
			}
		}
		function elementAttached(element) {
			var Class = element.constructor
			if (Class.create) {
	/*			if (Class.attachedInstances) {
					Class.attachedInstances.push(element)
					if (Class.attachedInstances.length === 1 && Class.needsRestart) {
						restart(Class)
					}
				} else {
					Class.attachedInstances = [element]
				}*/
				if (element.attached) {
					element.attached()
				}
				if (element.needsRestart) {
					restart(element)
				}
			}
		}
		function elementDetached(element) {
			/*var attachedInstances = element.constructor.attachedInstances
			if (attachedInstances) {
				var index = attachedInstances.indexOf(element)
				if (index > -1) {
					attachedInstances.splice(index, 1)
					if (attachedInstances.length === 0) {
						cleanup(Class)
					}
				}*/
				if (element.detached) {
					element.detached()
				}
				cleanup(element)
			//}
		}
		if (typeof MutationObserver === 'function') {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					traverse(mutation.addedNodes, elementAttached)
					traverse(mutation.removedNodes, elementDetached)
				})
			})
			observer.observe(document.body, {
				childList: true,
				subtree: true
			})
		}

		function augmentBaseElement(Element) {
			var prototype = Element.prototype
			for(var i = 0, l = toAddToElementPrototypes.length; i < l; i++) {
				var key = toAddToElementPrototypes[i]
				Object.defineProperty(prototype, key, toAddToElementPrototypes[key])
			}
			createdBaseElements.push(Element)
			return Element
		}
		Element.addToElementPrototypes = function(properties) {
			var i = 0;
			for (var key in properties) {
				toAddToElementPrototypes.push(key)
				toAddToElementPrototypes[key] = Object.getOwnPropertyDescriptor(properties, key)
			}
			for(var i = 0, l = createdBaseElements.length; i < l; i++) {
				augmentBaseElement(createdBaseElements[i])
			}
		}
		return Element
	}))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory(require('./util/lang'))
	    } else {
	        root.alkali.Updater = factory(root.alkali.lang)
	    }
	}(this, function (lang, Variable) {
		var doc = typeof document !== 'undefined' && document
		var invalidatedElements
		var queued
		var toRender = []
		var nextId = 1
		var requestAnimationFrame = lang.requestAnimationFrame

		function Context(subject){
			this.subject = subject
		}

		function Updater(options) {
			var variable = options.variable

			this.variable = variable
			this.elements = []
			if (options) {
				if (options.selector) {
					this.selector = options.selector
				}
				if (options.elements) {
					this.elements = options.elements
					this.element = this.elements[0]
				}
				if (options.element) {
					this.element = options.element
					this.elements.push(options.element)
				}
				for(var i = 0, l = this.elements.length; i < l; i++) {
					(this.elements[i].alkaliRenderers || (this.elements[i].alkaliRenderers = [])).push(this)
				}
				if (options.update) {
					this.updateRendering = options.update
				}
				if (options.shouldRender) {
					this.shouldRender = options.shouldRender
				}
				if (options.renderUpdate) {
					this.renderUpdate = options.renderUpdate
				}
				if (options.alwaysUpdate) {
					this.alwaysUpdate = options.alwaysUpdate
				}
			}
			if (variable.updated) {
				// if it has update, we don't need to instantiate a closure
				variable.notifies(this)
			} else {
				// baconjs-esqe API
				var updater = this
				variable.subscribe(function (event) {
					// replace the variable with an object
					// that returns the value from the event
					updater.variable = {
						valueOf: function () {
							return event.value()
						}
					}
					updater.updated()
				})
			}
			if(options && options.updateOnStart !== false){
				this.updateRendering(true)
			}
		}
		Updater.prototype = {
			constructor: Updater,
			updateRendering: function () {
				throw new Error ('updateRendering must be implemented by sub class of Updater')
			},
			updated: function (updateEvent, by, context) {
				if (!this.invalidated) {
					if (!context || this.contextMatches(context)) {
						// do this only once, until we render again
						this.invalidated = true
						var updater = this
						requestAnimationFrame(function(){
							invalidatedElements = null
							updater.updateRendering(updater.alwaysUpdate)
						})
					}
				}
			},
			contextMatches: function(context) {
				return true
				return context == this.elements ||
					// if context is any element in this.elements - perhaps return only the specific matching elements?
					(this.elements.indexOf(context) != -1) ||
				  // (context is an array and any/all elements are contained in this.elements) ||
					// context contains() any of this.elements
					(function(elements) {
						for(var i = 0, l = elements.length; i < l; i++) {
							if (context.contains(elements[i])) return true
						}
						return false
					})(this.elements)
			},
			invalidateElement: function(element) {
				if(!invalidatedElements){
					invalidatedElements = new WeakMap(null, 'invalidated')
					// TODO: if this is not a real weak map, we don't want to GC it, or it will leak
				}
				var invalidatedParts = invalidatedElements.get(element)
				invalidatedElements.set(element, invalidatedParts = {})
				if (!invalidatedParts[id]) {
					invalidatedParts[id] = true
				}
				if (!queued) {
					lang.queueTask(processQueue)
					queued = true
				}
				var updater = this
				toRender.push(function(){
					updater.invalidated = false
					updater.updateElement(element)
				})
			},
			getId: function(){
				return this.id || (this.id = nextId++)
			},
			stop: function() {
				this.variable.stopNotifies(this)
			}

		}

		function ElementUpdater(options) {
			Updater.call(this, options)
		}
		ElementUpdater.prototype = Object.create(Updater.prototype)
		ElementUpdater.prototype.shouldRender = function (element) {
			return document.body.contains(element)
		}
		ElementUpdater.prototype.getSubject = function () {
			return this.element || this.elements[0]
		}
		ElementUpdater.prototype.updateRendering = function (always, element) {
			var elements = this.elements || (element && [element]) || []
			if(!elements.length){
				if(this.selector){
					elements = document.querySelectorAll(this.selector)
				}else{
					throw new Error('No element or selector was provided to the Updater')
				}
				return
			}
			for(var i = 0, l = elements.length; i < l; i++){
				if(always || this.shouldRender(elements[i])){
					// it is connected
					this.updateElement(elements[i])
				}else{
					var id = this.getId()
					var updaters = elements[i].updatersOnShow
					if(!updaters){
						updaters = elements[i].updatersOnShow = []
						elements[i].className += ' needs-rerendering'
					}
					if (!updaters[id]) {
						updaters[id] = this
					}
				}
			}
		}
		ElementUpdater.prototype.addElement = function (element) {
			if (this.selector) {
				element.updatersOnShow = [this]
			} else {
				this.elements.push(element)
			}
			// and immediately do an update
			this.updateElement(element)
		}
		ElementUpdater.prototype.updateElement = function(element) {
			this.invalidated = false
			try {
				// TODO: might make something cheaper than for(element) for setting context?
				var value = !this.omitValueOf && this.variable.valueOf(new Context(element))
			} catch (error) {
				element.appendChild(document.createTextNode(error))
			}
			if(value !== undefined || this.started){
				this.started = true
				if(value && value.then){
					if(this.renderLoading){
						this.renderLoading(value, element)
					}
					var updater = this
					value.then(function (value) {
						updater.renderUpdate(value, element)
					})
				}else{
					this.renderUpdate(value, element)
				}
			}
		}
		ElementUpdater.prototype.renderUpdate = function (newValue, element) {
			throw new Error('renderUpdate(newValue) must be implemented')
		}
		Updater.Updater = Updater
		Updater.ElementUpdater = ElementUpdater

		function AttributeUpdater(options) {
			if(options.name){
				this.name = options.name
			}
			ElementUpdater.apply(this, arguments)
		}
		AttributeUpdater.prototype = Object.create(ElementUpdater.prototype)
		AttributeUpdater.prototype.type = 'AttributeUpdater'
		AttributeUpdater.prototype.renderUpdate = function (newValue, element) {
			element.setAttribute(this.name, newValue)
		}
		Updater.AttributeUpdater = AttributeUpdater

		function PropertyUpdater(options) {
			if(options.name){
				this.name = options.name
			}
			ElementUpdater.apply(this, arguments)
		}
		PropertyUpdater.prototype = Object.create(ElementUpdater.prototype)
		PropertyUpdater.prototype.type = 'PropertyUpdater'
		PropertyUpdater.prototype.renderUpdate = function (newValue, element) {
			element[this.name] = newValue
		}
		Updater.PropertyUpdater = PropertyUpdater

		function StyleUpdater(options) {
			if(options.name){
				this.name = options.name
			}
			ElementUpdater.apply(this, arguments)
		}
		StyleUpdater.prototype = Object.create(ElementUpdater.prototype)
		StyleUpdater.prototype.type = 'StyleUpdater'
		StyleUpdater.prototype.renderUpdate = function (newValue, element) {
			element.style[this.name] = newValue
		}
		Updater.StyleUpdater = StyleUpdater

		function ContentUpdater(options) {
			ElementUpdater.apply(this, arguments)
		}
		ContentUpdater.prototype = Object.create(ElementUpdater.prototype)
		ContentUpdater.prototype.type = 'ContentUpdater'
		ContentUpdater.prototype.renderUpdate = function (newValue, element) {
			element.innerHTML = ''
			if (newValue === undefined){
				newValue = ''
			}
			element.appendChild(document.createTextNode(newValue))
		}
		Updater.ContentUpdater = ContentUpdater

		function TextUpdater(options) {
			this.position = options.position
			this.textNode = options.textNode
			ElementUpdater.apply(this, arguments)
		}
		TextUpdater.prototype = Object.create(ElementUpdater.prototype)
		TextUpdater.prototype.type = 'TextUpdater'
		TextUpdater.prototype.renderUpdate = function (newValue, element) {
			if (newValue === undefined){
				newValue = ''
			}
			(this.textNode || element.childNodes[this.position]).nodeValue = newValue
		}
		Updater.TextUpdater = TextUpdater

		function ListUpdater(options) {
			if (options.each) {
				this.each = options.each
			}
			ElementUpdater.apply(this, arguments)
		}
		ListUpdater.prototype = Object.create(ElementUpdater.prototype)
		ListUpdater.prototype.updated = function (updateEvent, context) {
			(this.updates || (this.updates = [])).push(updateEvent)
			ElementUpdater.prototype.updated.call(this, updateEvent, context)
		}
		ListUpdater.prototype.type = 'ListUpdater'
		ListUpdater.prototype.omitValueOf = true
		ListUpdater.prototype.renderUpdate = function (newValue, element) {
			var container
			var each = this.each
			var thisElement = this.elements[0]
			var updater = this
			if (!this.builtList) {
				this.builtList = true
				container = document.createDocumentFragment()
				var childElements = this.childElements = []
				this.variable.for(thisElement).forEach(function(item) {
					eachItem(item)
				})
				this.element.appendChild(container)
			} else {
				var childElements = this.childElements
				var updates = this.updates
				container = this.element
				updates.forEach(function(update) {
					if (update.type === 'refresh') {
						updater.builtList = false
						for (var i = 0, l = childElements.length; i < l; i++) {
							thisElement.removeChild(childElements[i])
						}
						updater.renderUpdate()
					} else {
						if (update.previousIndex > -1) {
							thisElement.removeChild(childElements[update.previousIndex])
							childElements.splice(update.previousIndex, 1)
						}
						if (update.index > -1) {
							var nextChild = childElements[update.index] || null
							eachItem(update.value, update.index, nextChild)
						}
					}
				})
				this.updates = [] // clear the updates
			}
			function eachItem(item, index, nextChild) {
				var childElement
				if (each.create) {
					childElement = each.create({parent: thisElement, _item: item}) // TODO: make a faster object here potentially
				} else {
					childElement = each(item, thisElement)
				}
				if (nextChild) {
					container.insertBefore(childElement, nextChild)
					childElements.splice(index, 0, childElement)
				} else {
					container.appendChild(childElement)
					childElements.push(childElement)
				}
			}
		}
		Updater.ListUpdater = ListUpdater

		Updater.onShowElement = function(shownElement){
			requestAnimationFrame(function(){
				invalidatedElements = null
				var elements = [].slice.call(shownElement.getElementsByClassName('needs-rerendering'))
				if (shownElement.className.indexOf('needs-rerendering') > 0){
					var includingTop = [shownElement]
					includingTop.push.apply(includingTop, elements)
					elements = includingTop
				}
				for (var i = 0, l = elements.length; i < l; i++){
					var element = elements[i]
					var updaters = element.updatersOnShow
					if(updaters){
						element.updatersOnShow = null
						// remove needs-rerendering class
						element.className = element.className.replace(/\s?needs\-rerendering\s?/g, '')
						for (var id in updaters) {
							var updater = updaters[id]
							updater.updateElement(element)
						}
					}
				}
			})
		}

		function onElementRemoval(element){
			// cleanup element renderers
			if(element.alkaliRenderers){
				var renderers = element.alkaliRenderers
				for(var i = 0; i < renderers.length; i++){
					var renderer = renderers[i]
					renderer.variable.stopNotifies(renderer)
				}
			}
		}
		Updater.onElementRemoval = function(element, onlyChildren){
			if(!onlyChildren){
				onElementRemoval(element)
			}
			var children = element.getElementsByTagName('*')
			for(var i = 0, l = children.length; i < l; i++){
				var child = children[i]
				if(child.alkaliRenderers){
					onElementRemoval(child)
				}
			}
		}
		return Updater
	}));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Variable = __webpack_require__(2);

	var _Variable2 = _interopRequireDefault(_Variable);

	var _Element = __webpack_require__(5);

	var _TodoList = __webpack_require__(1);

	var _TodoList2 = _interopRequireDefault(_TodoList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// our router, expressed as a variable
	var currentPath = new _Variable2.default(location.hash.replace(/#\//, '')); /*
	                                                                            This module represents the "view model" in MVVM parlance (or an MVC 
	                                                                            controller that offers "data views"). The data "model" is found in
	                                                                            the TodoList (although it is little more than a variable that holds
	                                                                            an array).
	                                                                            */

	window.onhashchange = function () {
		currentPath.put(location.hash.replace(/#\//, ''));
	};

	var ActiveView = void 0,
	    CompletedView = void 0;
	// the main view model
	exports.default = (0, _Variable2.default)({
		add: function add() {
			// add a new todo
			_TodoList2.default.for(this).push({
				name: this.get('newItem')
			});
			// clear out the input
			this.set('newItem', '');
		},

		// delegate this to the list data model
		clearCompleted: _TodoList2.default.clearCompleted,
		allCompleted:
		// the checkbox corresponds to the state of the todos
		_TodoList2.default.to(function (todos) {
			return todos.length && todos.every(function (todo) {
				return todo.completed;
			});
		}).setReverse( // and define the reverse action when the checkbox changes
		function (allCompleted) {
			return _TodoList2.default.defaultInstance.forEach(function (todo) {
				new _Variable2.default(todo).set('completed', allCompleted);
			});
		}),
		delete: function _delete(event) {
			// delete a todo
			_TodoList2.default.for(this).delete(_Element.Item.for(event).valueOf());
		},

		// our three data "views" of the different filtered todo lists
		activeView: ActiveView = _TodoList2.default.filter(function (todo) {
			return !todo.completed;
		}),
		completedView: CompletedView = _TodoList2.default.filter(function (todo) {
			return todo.completed;
		}),
		listView: currentPath.to(function (path) {
			return(
				// determine which view to show based on the current hash path
				path === '' ? _TodoList2.default : path === 'completed' ? CompletedView : path === 'active' ? ActiveView : _TodoList2.default
			);
		}),
		todoCount: ActiveView.to(function (active) {
			return active.length;
		})
	});

/***/ }
/******/ ]);