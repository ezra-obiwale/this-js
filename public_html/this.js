/* global BreakException */

(function () {
	/**
	 * Creates an AJAX connection
	 * @param object config
	 * @returns ajax object
	 */
	var ajax = function (config) {
		config = __.extend({
			type: 'get',
			url: location.href,
			data: null,
			dataType: 'json',
			success: function () {
			},
			error: function () {
			},
			complete: function () {
			},
			crossDomain: true,
			async: true,
			clearCache: false
		}, config);
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status >= 200 && httpRequest.status < 400) {
					__.callable(config.success).call(httpRequest, httpRequest.response);
				} else {
					__.callable(config.error).call(httpRequest, httpRequest.response);
				}
			}
		};
		if (config.clearCache) {
			config.url += '?' + new Date().getTime();
		}
		httpRequest.open(config.type.toUpperCase(), config.url, config.async);
		httpRequest.responseType = config.dataType;
		httpRequest.withCredentials = config.crossDomain;
		httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		httpRequest.setRequestHeader('Requested-With', 'XMLHttpRequest');
		if (config.data) {
			httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		httpRequest.send(config.data);
		return httpRequest;
	};
	__ = {
		selector: null,
		items: [],
		/**
		 * Fetches the callable function
		 * @param function|string callback
		 * @param boolean nullable Indicates if to return nullable instead of empty function if 
		 * not callable
		 * @returns function
		 */
		callable: function (callback, nullable) {
			if (typeof callback === 'function') {
				return callback;
			}
			else if (typeof callback === 'string') {
				var split = callback.split('.'), func = window;
				for (var i = 0; i < split.length; i++) {
					if (!func[split[i]]) {
						return function () {
						};
					}
					func = func[split[i]];
				}
				return func === window ? function () {
				} : this.callable(func);
			}
			else if (!nullable) {
				return function () {
				};
			}
		},
		/**
		 * Loops through found elements and calls the given callback on each
		 * @param function|string callback
		 * The function receives two parameters: index and item
		 * The this object is also the item
		 * @returns __
		 */
		each: function (callback) {
			return this.forEach(this.items, callback);
		},
		/**
		 * Checks if the given item is an object
		 * @param mixed item
		 * @param boolean allowArray Indicates wether to return array as object too
		 * @returns boolean
		 */
		isObject: function (item, allowArray) {
			return typeof item === 'object' && (allowArray || !Array.isArray(item));
		},
		/**
		 * Checks if the given item is an array
		 * @param mixed item
		 * @returns boolean
		 */
		isArray: function (item) {
			return typeof item === 'object' && Array.isArray(item);
		},
		/**
		 * Loops through the given array or object and calls the given callback on each item
		 * @param array|object items
		 * @param function|string callback
		 * The function receives two parameters: index and item
		 * The this object is also the item
		 * @returns __
		 */
		forEach: function (items, callback) {
			try {
				if (this.isArray(items)) {
					items.every(function (v, i) {
						return false !== this.callable(callback).call(v, i, v);
					}.bind(this));
				}
				else {
					for (var a in items) {
						if (!items.hasOwnProperty(a))
							continue;
						if (false === this.callable(callback).call(items[a], a, items[a]))
							break;
					}
				}
			}
			catch (e) {
				this.logError(e.message);
			}
			return this;
		},
		/**
		 * Shows the matched elements
		 * @returns __
		 */
		show: function () {
			return this.each(function () {
				try {
					this.style.display = 'block';
				}
				catch (e) {
					this.logError(e.message);
				}
			});
		},
		/**
		 * Hides the matched elements
		 * @returns __
		 */
		hide: function () {
			return this.each(function () {
				try {
					this.style.display = 'none';
				}
				catch (e) {
					this.logError(e.message);
				}
			});
		},
		/**
		 * Sets or gets the attr of the elements
		 * @param string attr
		 * @param mixed val
		 * @returns __|string
		 */
		attr: function (attr, val) {
			if (val) {
				try {
					this.each(function () {
						this.setAttribute(attr, val);
					});
				}
				catch (e) {
					this.logError(e.message);
				}
				return this;
			}
			try {
				return this.items[0].getAttribute(attr);
			}
			catch (e) {
				this.logError(e.message);
				return null;
			}
		},
		/**
		 * Clones a new object from the given objects. There can be as many as possible objects to 
		 * clone from
		 * @param object object
		 * @param object _object
		 * @returns object The new object
		 * @todo extend arrays properly
		 */
		extend: function (object, _) {
			var args = Array.from(arguments),
					newObject = {};
			this.forEach(args, function () {
				__.forEach(this, function (i, v) {
					newObject[i] = v;
				});
			});
			return newObject;
		},
		/**
		 * Deeply clones a new object by going deep into object values and deep cloning those as well
		 * @param obect object
		 * @param object _
		 * @returns object
		 * @todo extend arrays properly
		 */
		deepExtend: function (object, _) {
			var args = Array.from(arguments),
					newObject = {},
					_this = this;
			this.forEach(args, function () {
				__.forEach(this, function (i, v) {
					newObject[i] = (_this.isObject(v, true) && newObject[i]) ?
							_this.deepExtend(newObject[i], v) : v;
				});
			});
			return newObject;
		},
		/**
		 * Sends an AJAX request
		 * @param object config
		 * Keys include:
		 * type (string): GET | POST | PATCH | PUT | DELETE
		 * url (string): The url to connect to
		 * data (string|object}: The data to send with the request
		 * success (function): Function to call when a success response is gotten. The response data
		 * is passed as a parameter
		 * error (function) : Function to call when error occurs
		 * complete (function): Function to call when a response has been received, error or success.
		 * @returns ajax object
		 */
		ajax: function (config) {
			config = this.extend({
				type: 'get',
				url: '',
				data: {},
				success: function (data) {
				},
				error: function () {
				},
				complete: function () {
				}
			}, config);
			return ajax(config);
		},
		/**
		 * Triggers the given event on current items
		 * @param string event
		 * @returns __
		 */
		trigger: function (event) {
			return this.each(function () {
				this.dispatchEvent(new Event(event));
			});
		},
		/**
		 * Gets the immediate descendants of the current items
		 * @returns _
		 */
		children: function () {
			if (this.selector) {
				return _(this.selector + '>*');
			}
			else {
				try {
					var result = [];
					this.each(function () {
						_(Array.from(this.children)).each(function () {
							result.push(this);
						});
					});
					return _(result);
				}
				catch (e) {
					this.logError(e.message);
				}
			}
			return _([]);
		},
		/**
		 * Adds an event listener
		 * @param string event
		 * @param function callback
		 * @returns __
		 */
		on: function (event, selector, callback) {
			if (arguments.length === 2) {
				callback = selector;
				selector = null;
			}
			var _this = this;
			try {
				return this.each(function () {
					this.addEventListener(event, function (e) {
						if (selector && e.target && !e.target.matches(selector)) {
							return;
						}
						_this.callable(callback).apply(this, Array.from(arguments));
					}, false);
				});
			}
			catch (e) {
				this.logError(e.message);
			}
			return this;
		},
		/**
		 * Fetches the outer html of the first item
		 * @returns string
		 */
		outerHtml: function () {
			try {
				return this.items[0].outerHTML;
			}
			catch (e) {
				this.logError(e.message);
				return '';
			}
		},
		/**
		 * Set or get the content of an element
		 * @param mixed content
		 * @returns __
		 */
		html: function (content) {
			if (content === undefined) {
				try {
					return this.items[0].innerHTML;
				}
				catch (e) {
					this.logError(e.message);
					return '';
				}
			}
			try {
				return this.each(function () {
					if (content instanceof _) {
						content = content.outerHtml();
					}
					else if (__.isObject(this.content) && this.content['outerHTML']) {
						content = this.content.outerHTML;
					}
					this.innerHTML = content;
				});
			}
			catch (e) {
				this.logError(e.message);
				return this;
			}
		},
		/**
		 * Append content to the elements
		 * @param mixed content
		 * @returns __
		 */
		append: function (content) {
			try {
				return this.each(function () {
					if (content instanceof _) {
						content = content.outerHtml();
					}
					else if (__.isObject(this.content) && this.content['outerHTML']) {
						content = this.content.outerHTML;
					}
					this.innerHTML += content;
				});
			}
			catch (e) {
				this.logError(e.message);
				return this;
			}
		},
		/**
		 * Clones the first item
		 * @returns _
		 */
		clone: function () {
			try {
				return _(this.items[0].cloneNode(true));
			}
			catch (e) {
				this.logError(e.message);
				return null;
			}
		},
		/**
		 * Searches the current items for elements that match the given selector
		 * @param string selector
		 * @returns _
		 */
		find: function (selector) {
			if (this.selector) {
				return _(this.selector + ' ' + selector);
			}
			else {
				try {
					var result = [], _this = this;
					this.each(function () {
						if (_this.items.length > 1) {
							Array.from(this.querySelectorAll(selector))
									.map(function (v) {
										this.push(v);
									}, result);
						}
						else
							result = Array.from(this.querySelectorAll(selector));
					});
					return _(result);
				}
				catch (e) {
					this.logError(e.message);
				}
			}
			return _([]);
		},
		/**
		 * Replaces current items with the given content
		 * @param mixed content
		 * @returns __
		 */
		replaceWith: function (content) {
			return this.each(function () {
				this.outerHTML = content instanceof _ ? content.outerHtml() : content;
			});
		},
		/**
		 * Logs the error message
		 * @param string message
		 * @returns _
		 */
		logError: function (message) {
			console.error(message);
			return this;
		},
		/**
		 * Stores or retrieves stored data
		 * @param string key
		 * @param mixed value
		 * @returns {Array|Object|__}
		 */
		store: function (key, value) {
			if (!value) {
				var data = localStorage.getItem(key),
						_data = this.toObject(data);
				return _data || data;
			}
			if (this.isObject(value, true))
				value = this.toJSON(value);
			if (value)
				localStorage.setItem(key, value);
			return this;
		},
		/**
		 * Parses a string to object
		 * @param {string} string
		 * @returns {Array|Object}
		 */
		toObject: function (string) {
			try {
				return JSON.parse(string);
			}
			catch (e) {
				this.logError(e.message);
			}
		},
		/**
		 * Parse an object to string
		 * @param {Object} object
		 * @returns {String}
		 */
		toJSON: function (object) {
			try {
				return JSON.stringify(object);
			} catch (e) {
				this.logError(e.message);
			}
		}
	},
	_ = function (selector) {
		if (selector instanceof _) {
			return selector;
		}
		else if (!(this instanceof _)) {
			return new _(selector);
		}
		else if (this.isObject(selector)) {
			this.items = selector instanceof HTMLCollection ? Array.from(selector) : [selector];
		}
		else if (this.isArray(selector)) {
			this.items = selector;
		}
		else {
			return _(document).find(selector);
		}
		this.length = this.items.length;
		return this;
	},
			_.prototype = __,
			deepVariableData = function (variable, data) {
				var value = data, vars = variable.split('.');
				__.forEach(vars, function (i, v) {
					value = value[v];
				});
				return value || '';
			};
	ThisApp = function (container) {
		if (!(this instanceof ThisApp))
			return new ThisApp(container);
		this.version = '1.0';
		this.container = _(container);
		if (!this.container.length) {
			this.error('App container not found');
		}
		return this;
	};
	ThisApp.prototype = {
		config: {
			startWith: null,
			baseUrl: location.href,
			debug: false,
			dataKey: null
		},
		/**
		 * Number of collections still loading
		 */
		collections: 0,
		/**
		 * Number of models still loading
		 */
		models: 0,
		/**
		 * Set the base url for the app
		 * @param string url
		 * @returns ThisApp
		 */
		setBaseUrl: function (url) {
			this.config.baseUrl = url;
			return this;
		},
		/**
		 * Indicates the page to start the app with
		 * @param string page ID of the page
		 * @returns ThisApp
		 */
		startWith: function (page) {
			this.config.startWith = page;
			return this;
		},
		/**
		 * Sets the app debug mode
		 * @param boolean debug Default is TRUE
		 * @returns ThisApp
		 */
		debug: function (debug) {
			this.config.debug = debug ? true : false;
			return this;
		},
		/**
		 * Sets the key in the response which holds the data array
		 * @param string key
		 * @returns ThisApp
		 */
		setDataKey: function (key) {
			this.config.dataKey = key;
			return this;
		},
		/**
		 * Initializes the app
		 * @param object config
		 * Keys include:
		 * start (selector): The selector of the page to start with
		 * @returns app
		 */
		start: function (config) {
			this.config = __.extend(this.config, config);
			this.setup();
			var target_page = location.hash.substr(1);
			if (target_page === __.store('last_page'))	{
				this.restoreState(history.state);
			}
			else
				this.loadPage(target_page || this.config.startWith || _('[this-default-page]').attr('this-id'));
			return this;
		},
		/**
		 * Loads the given page
		 * @param string page ID of the page
		 * @returns ThisApp
		 */
		loadPage: function (page) {
			this.firstPage = !this.container.html();
			this.page = _('[this-type="pages"] [this-id="' + page + '"]').clone();
			if (!this.page) {
				this.container.trigger('page.not.found');
				return;
			}
			this.page.trigger('page.before.load');
			var _this = this;
			if (this.page.attr('this-type') === 'page') {
				this.container.html(this.page);
				if (this.page.attr('this-url') || this.page.attr('this-load-model')) {
					this.request(this.page, function (data) {
						_this.loadData(this, data);
						this.loadTemplates();
						this.loadCollections();
						this.loadModels();
						_this.pageLoaded();
					});
				}
				else {
					this.loadTemplates();
					this.loadCollections();
					this.loadModels();
					this.pageLoaded();
				}
			}
			else {
				this.error('Failed to load ' + this.page.attr('this-type') + ':'
						+ this.page.attr('this-id') + ' as page');
				this.page.trigger('page.load.failed');
			}
			return this;
		},
		/**
		 * Loads all templates in the current page
		 * @returns ThisApp
		 */
		loadTemplates: function () {
			this.container.find('[this-template]').each(function () {
				var _this = _(this);
				_this.replaceWith(_('[this-type="templates"] [this-id="'
						+ _this.attr('this-template') + '"]'));
			});
			return this;
		},
		/**
		 * Loads all collections in the current page
		 * @returns ThisApp
		 */
		loadCollections: function () {
			var _this = this;
			this.collections += this.container.find('[this-type="collection"]')
					.each(function () {
						var content = _(this).html();
						_(this).html('');
						_this.request(this, function (data) {
							--_this.collections;
							_this.saveCollection(this, data, true);
							_this.loadData(this, data, content);
							_this.pageLoaded();
						});
					}).length;
			return this;
		},
		/**
		 * Saves a collection for later use
		 * @param _ container
		 * @param mixed data
		 * @returns ThisApp
		 */
		saveCollection: function (container, data, update) {
			if (update) {
				var _data = __.store(_(container).attr('this-id'));
				if (_data) {
					data = __.deepExtend(_data, data);
				}
			}
			console.log(data);
			__.store(_(container).attr('this-id'), data);
			return this;
		},
		/**
		 * Loads all models in the current page
		 * @returns ThisApp
		 */
		loadModels: function () {
			var _this = this;
			this.models = +this.container.find('[this-type="model"]')
					.each(function () {
						var content = _(this).html();
						_(this).html('');
						_this.request(this, function (data) {
							--_this.models;
							_this.loadData(this, data, content);
							_this.pageLoaded();
						});
					}).length;
			return this;
		},
		/**
		 * Takes the app back one step in history
		 * @returns ThisApp
		 */
		back: function (e) {
			if (e && __.isObject(e) && e['preventDefault'])
				e.preventDefault();
			history.back();
			return this;
		},
		/**
		 * Takes the app forward one step in history
		 * @returns ThisApp
		 */
		forward: function (e) {
			if (e && __.isObject(e) && e['preventDefault'])
				e.preventDefault();
			history.forward();
			return this;
		},
		/**
		 * Setups the app events
		 * @returns ThisApp
		 */
		setup: function () {
			if (this.ready)
				return;
			this.ready = true;
			_('[this-type="pages"]').hide();
			var _this = this;
			this.container.on('click', '[this-go-back]', this.back)
					.on('click', '[this-go-forward]', this.forward)
					.on('click', '[this-goto]', function (e) {
						e.preventDefault();
						_this.loadPage(_(e.target).attr('this-goto'));
					});
			_('[this-go-back]').on('click', this.back);
			_('[this-go-forward]').on('click', this.forward);
			_(window).on('popstate', function (e) {
				if (e.state)
					_this.restoreState(e.state);
			});
			return this;
		},
		/**
		 * Restores a saved state
		 * @param object state
		 * @returns ThisApp
		 */
		restoreState: function (state) {
			this.container.html(state.content);
			this.page = this.container.find('[this-id="' + state.id + '"]');
			this.updatePage();
		},
		/**
		 * Updates a retrieved saved page
		 * @returns ThisApp
		 */
		updatePage: function () {
			return this;
		},
		/**
		 * Saves the app state
		 * @returns ThisApp
		 */
		saveState: function () {
			var action = 'pushState';
			if (this.firstPage || __.store('cancel_forward')) {
				action = 'replaceState';
			}
			history[action]({
				id: this.page.attr('this-id'),
				title: this.page.attr('this-title'),
				content: this.container.html()
			}, this.page.attr('this-title'), '#' + this.page.attr('this-id'));
			__.store('last_page', this.page.attr('this-id'));
			return this;
		},
		/**
		 * Listens to the given event on the given target
		 * @param string event
		 * @param string target ID of the page to target
		 * @param function callback
		 * @returns ThisApp
		 */
		on: function (event, target, callback) {
			this.container.on(event, '[this-id="' + target + '"]', callback);
			return this;
		},
		onError: function (callback) {
			this.error = __.callable(callback, true) || this.error;
			return this;
		},
		/**
		 * Called after the page has been fully loaded
		 * @returns ThisApp
		 */
		pageLoaded: function () {
			if (!this.collections && !this.models) {
				this.page.trigger('page.loaded');
				this.saveState();
				delete this.page;
				delete this.firstPage;
			}
			return this;
		},
		/**
		 * Sends an ajax request based on the parameter of the page.
		 * @param string|_ selector
		 * @param function success The callback to call on success
		 * @returns XMLHttpRequest
		 */
		request: function (url, success, data, type) {
			var elem;
			if (__.isObject(url)) {
				elem = _(url);
				if (!elem.attr('this-load-model') && !elem.attr('this-url'))
					return;
				url = elem.attr('this-url') || elem.attr('this-load-model');
			}
			return ajax({
				type: type || 'get',
				url: this.config.baseUrl + url,
				data: data || {},
				success: function (data) {
					__.callable(success).call(elem || this, data);
					if (elem)
						elem.trigger('load.content.success');
				},
				error: function () {
					if (elem)
						elem.trigger('load.content.error');
				},
				complete: function () {
					if (elem)
						elem.trigger('load.content.complete');
				}
			});
		},
		/**
		 * Checks if the given container is a page container
		 * @param string|_ container
		 * @returns boolean
		 */
		isPage: function (container) {
			return this.is('page', container);
		},
		/**
		 * Checks that the type of container matches the given type
		 * @param string type page|model|collection|form
		 * @param string|_ container
		 * @returns booean
		 */
		is: function (type, container) {
			return _(container).attr('this-type') === type;
		},
		/**
		 * Loads the response data into the container
		 * @param mixed container
		 * @param mixed data Object or data. If object, the array of data key must be set with 
		 * setDataKey()
		 * @param string content Template content to use
		 * @returns ThisApp
		 */
		loadData: function (container, data, content) {
			if (this.config.dataKey)
				data = data[this.config.dataKey];
			var _this = this;
			var variables = content.match(new RegExp(/\{([^}]+)\}/g));
			__.forEach(data, function (i, v) {
				var _temp = _(document.createElement('div'))
						.html(_this.parseData(variables, this, content)),
						children = _temp.children(),
						id = _(container).attr('this-model-uid');

				if (children.length === 1)
					_temp = children;
				_temp.attr('this-model-id', v[id || 'id']);
				_(container).append(_temp);
			});
			return this;
		},
		/**
		 * Parse the given data into the given content based on the given variables
		 * @param array variables
		 * @param array data
		 * @param string content
		 * @returns string
		 */
		parseData: function (variables, data, content) {
			__.forEach(variables, function (i, v) {
				var key = v.replace(/[^a-z0-9_\.]/gi, '');
				content = content.replace(v, key.indexOf('.') !== -1 ?
						deepVariableData(key, data) :
						data[key]);
			});
			return content;
		},
		/**
		 * Outputs an error message to the console if debug is active
		 * @param string msg
		 * @returns app
		 */
		error: function (msg) {
			if (!this.config.debug)
				return this;
			console.error(msg);
		}
	};
})();