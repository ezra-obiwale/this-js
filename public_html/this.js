/*
 * ThisJS version 1.0.0 (http://thisjs.com)
 * (c) 2016 Ezra Obiwale
 * License (http://thisjs.com/#license)
 */
(function () {
	/**
	 * Creates an AJAX connection
	 * @param object config
	 * @returns ajax object
	 */
	var Ajax = function (config, __) {
		var __this = __ || this;
		function parseData(data) {
			if (!__this.isObject(data))
				return data;
			var str = '';
			__this.forEach(data, function (i, v) {
				if (str)
					str += '&';
				if (__this.isObject(v, true)) {
					var isArray = __this.isArray(v);
					__this.forEach(v, function (j, w) {
						if (j)
							str += '&';
						if (isArray)
							j = null;
						if (__this.isObject(w, true))
							str += i + '[' + j + ']=' + parseData(w);
						else
							str += i + '[' + j + ']=' + encodeURIComponent(w);
					});
				}
				else
					str += i + '=' + encodeURIComponent(v);
			});
			return str;
		}
		config = __this.extend({
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
			progress: function (e, loaded, total) {
			},
			crossDomain: true,
			async: true,
			clearCache: false
		}, config);
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status >= 200 && httpRequest.status < 400) {
					__this.callable(config.success).call(httpRequest, httpRequest.response);
				}
				else {
					__this.callable(config.error).call(httpRequest);
				}
				__this.callable(config.complete).call(httpRequest);
			}
		};
		if (config.clearCache) {
			config.url += ((/\?/).test(config.url) ? "&" : "?") + (new Date()).getTime();
		}
		if (config.type.toLowerCase() === 'get' && config.data && __this.isObject(config.data)) {
			config.url += ((/\?/).test(config.url) ? "&" : "?") + parseData(config.data);
			config.data = null;
		}
		httpRequest.open(config.type.toUpperCase(), config.url, config.async);
		httpRequest.responseType = config.dataType;
		httpRequest.withCredentials = config.crossDomain;
		httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		httpRequest.setRequestHeader('Requested-With', 'XMLHttpRequest');
		if (config.data)
			httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		__this.tryCatch(function () {
			httpRequest.upload.onprogress = function (e) {
				if (e.lengthComputable) {
					__this.callable(config.progress).call(httpRequest, e, e.loaded, e.total);
				}
			};
		});
		httpRequest.send(__this.isObject(config.data) ?
				JSON.stringify(config.data) : config.data);
		return httpRequest;
	},
			__ = Object.create({
				items: [],
				debug: true,
				/**
				 * A shortcut for indexOf. Checks if the given item has the given string
				 * @param string|array item
				 * @param string|array str
				 * @param boolean all Only if str is array and indicates if to match all or at
				 *  least one
				 * @returns booelan
				 */
				contains: function (item, str, all) {
					var _this = this;
					return this.tryCatch(function () {
						if (_this.isObject(item, true)) {
							var found = false;
							_this.forEach(item, function (i, v) {
								if (_this.contains(v, str, all)) {
									found = true;
									return false;
								}
							});
							return found;
						}
						if (this.isString(str))
							return _this.isString(item) && item.indexOf(str) !== -1;
						else if (this.isArray(str)) {
							var found = true;
							this.forEach(str, function (i, v) {
								found = _this.contains(item, v, all);
								if (!all && found) {
									return false;
								}
								else if (all) {
									return found;
								}
							});
							return found;
						}
					});
				},
				/**
				 * Fetches the callable function
				 * @param function|string callback
				 * @param boolean nullable Indicates if to return nullable instead of empty function if 
				 * not callable
				 * @returns function
				 */
				callable: function (callback, nullable) {
					if (this.isFunction(callback)) {
						return callback;
					}
					else if (this.isString(callback)) {
						var split = callback.split('.'), func = window;
						for (var i = 0; i < split.length; i++) {
							if (!func[split[i]]) {
								return this.callable(null, true);
							}
							func = func[split[i]];
						}
						return func === window ? this.callable(null, true) : this.callable(func);
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
				 * Loops through the given array or object and calls the given callback on each item
				 * @param array|object items
				 * @param function|string callback
				 * The function receives two parameters: index and item
				 * The this object is also the item
				 * @returns __
				 */
				forEach: function (items, callback) {
					return this.tryCatch(function () {
						if (this.isObject(items) && items instanceof _)
							items = items.items;
						if (this.isArray(items))
							items.every(function (v, i) {
								return false !== this.callable(callback).call(v, i, v);
							}.bind(this));
						else {
							for (var a in items) {
								if (!items.hasOwnProperty(a))
									continue;
								if (false === this.callable(callback).call(items[a], a, items[a]))
									break;
							}
						}
						return this;
					});
					return this;
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
				 * Checks if the given item is a string
				 * @param mixed item
				 * @returns boolean
				 */
				isString: function (item) {
					return typeof item === 'string';
				},
				/**
				 * Checks whether the given item is boolean
				 * @param {mixed} item
				 * @returns {Boolean}
				 */
				isBoolean: function (item) {
					return item === true || item === false;
				},
				/**
				 * Checks if the given item is a function
				 * @param mixed item
				 * @returns boolean
				 */
				isFunction: function (item) {
					return typeof item === 'function';
				},
				/**
				 * Removes the given item from the given array
				 * @param array array
				 * @param mixed item
				 * @param boolean all Indicates whether to remove all occurrences
				 * @returns array|index Index if removing just one
				 */
				arrayRemoveValue: function (array, item, all) {
					return this.tryCatch(function () {
						var index = array.indexOf(item);
						if (index < 0) {
							index = array.indexOf(parseInt(item));
						}
						if (!all) {
							return index > -1 ? [this.arrayRemove(array, index)] : [];
						}
						else {
							while (index > -1) {
								this.arrayRemove(array, index);
								index = array.indexOf(item);
								if (index < 0)
									index = array.indexOf(parseInt(item));
							}
						}
						return array;
					});
				},
				/**
				 * Removes the item at the given index from the given array
				 * @param array array
				 * @param integer index
				 * @returns mixed The removed item
				 */
				arrayRemove: function (array, index) {
					return this.tryCatch(function () {
						return array.splice(index, 1)[0];
					});
				},
				/**
				 * Shows the matched elements
				 * @returns __
				 */
				show: function () {
					return this.each(function () {
						if (this.style.display === 'none')
							this.style.display = 'inherit';
					});
				},
				/**
				 * Hides the matched elements
				 * @returns __
				 */
				hide: function () {
					return this.each(function () {
						this.style.display = 'none';
					});
				},
				/**
				 * Toggles display of matched elements
				 * @returns _
				 */
				toggle: function () {
					var _this = this;
					this.each(function () {
						if (this.style.display === 'none') {
							_(this, _this.debug).show();
						}
						else {
							_(this, _this.debug).hide();
						}
					});
					return this;
				},
				/**
				 * Checks if an attribute exists
				 * @param string attr
				 * @returns booelan
				 */
				hasAttr: function (attr) {
					return this.tryCatch(function () {
						return this.attr(attr) !== null;
					});
				},
				/**
				 * Sets or gets the attr of the elements
				 * @param string attr
				 * @param mixed val
				 * @returns __|string
				 */
				attr: function (attr, val) {
					return this.tryCatch(function () {
						if (val !== undefined) {
							this.each(function () {
								this.setAttribute(attr, val);
							});
							return this;
						}
						if (!this.items.length)
							return null;
						return attr ? this.items[0].getAttribute(attr)
								: Array.from(this.items[0].attributes);
					});
				},
				/**
				 * Removes the give attr from elements
				 * @param string attr
				 * @returns ThisApp
				 */
				removeAttr: function (attr) {
					return this.each(function () {
						this.removeAttribute(attr);
					});
				},
				/**
				 * Sets/Gets a value into/from the dataset
				 * @param {string} key
				 * @param {mixed} value
				 * @returns {mixed}
				 */
				data: function (key, value) {
					if (value) {
						this.each(function () {
							if (this.dataset)
								this.dataset[key] = value;
						});
						return this;
					}
					if (!this.items.length || !this.items[0].dataset)
						return null;
					value = this.items[0].dataset[key];
					return this.tryCatch(function () {
						return eval(value);
					}, function () {
						return value;
					});
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
							newObject = {},
							newArray = [],
							_this = this;
					this.forEach(args, function () {
						if (_this.isArray(this))
							newArray.concat(this);
						else if (_this.isObject(this)) {
							_this.forEach(this, function (i, v) {
								newObject[i] = v;
							});
						}
					});
					return newArray.length ? newArray : newObject;
				},
				/**
				 * Sends an AJAX request
				 * @param object config
				 * Keys include:
				 * type (string): GET | POST | PATCH | PUT | DELETE
				 * url (string): The url to connect to. Default is current url
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
						url: location.href,
						data: {},
						success: function (data) {
						},
						error: function () {
						},
						complete: function () {
						}
					}, config);
					return Ajax(config, this);
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
					return this.each(function () {
						var target = this;
						_this.forEach(event.split(','), function (i, v) {
							target.addEventListener(v.trim(), function (e) {
								if (selector && e.target && !e.target.matches(selector)) {
									return;
								}
								_this.callable(callback).apply(e.target, Array.from(arguments));
							}, false);
						});
					});
					return this;
				},
				/**
				 * Triggers the given event on current items
				 * @param string event
				 * @param object data custom data to add to the event object
				 * @returns __
				 */
				trigger: function (event, detail) {
					var data = {
						detail: detail,
						cancelable: true,
						bubbles: true
					}, ev = new CustomEvent(event, data);
					return this.each(function () {
						this.dispatchEvent(ev);
					});
				},
				/**
				 * Gets the immediate descendants of the current items
				 * @param string selector
				 * @returns _
				 */
				children: function (selector) {
					var result = [];
					this.each(function () {
						if (selector) {
							var id = false;
							if (!this.id) {
								this.id = 'rANd' + Math.ceil(Math.random() * 100);
								id = true;
							}
							result = result.concat(Array.from(document.querySelectorAll('#'
									+ this.id + '>' + selector)));
							if (id)
								this.removeAttribute('id');
							return;
						}
						result = result.concat(Array.from(this.children));
					});
					return _(result, this.debug);
				},
				/**
				 * Wraps the content of the matched elements with the given elem
				 * @param {string} elem
				 * @returns {_}
				 */
				innerWrap: function (elem) {
					var _this = this;
					return this.each(function () {
						var __this = _(this);
						__this.html(_this.createElement(elem).html(__this.html()));
					});
				},
				/**
				 * Fetches the outer html of the first item
				 * @returns string
				 */
				outerHtml: function () {
					return this.tryCatch(function () {
						return this.items.length ? this.items[0].outerHTML : '';
					});
				},
				/**
				 * Set or get the content of an element
				 * @param mixed content
				 * @returns __
				 */
				html: function (content) {
					if (content === undefined) {
						return this.tryCatch(function () {
							return this.items.length ? this.items[0].innerHTML : '';
						});
					}
					var _this = this;
					return this.each(function () {
						if (content instanceof _) {
							content = content.outerHtml();
						}
						else if (_this.isObject(this.content) && this.content['outerHTML']) {
							content = this.content.outerHTML;
						}
						this.innerHTML = content;
					});
				},
				/**
				 * Prepend content to the elements
				 * @param mixed content
				 * @returns __
				 */
				prepend: function (content) {
					var _this = this;
					return this.each(function () {
						var __this = this,
								doc = document.createElement(this.tagName);
						if (content instanceof _) {
							content.each(function () {
								doc.appendChild(this);
							});
						}
						else if (_this.isObject(content) && content['outerHTML']) {
							doc.appendChild(content);
						}
						else {
							doc.innerHTML = content;
						}
						if (doc.childElementCount) {
							_this.forEach(Array.from(doc.children), function () {
								__this.prepend(this);
							});
						}
						else {
							this.innerHTML = doc.innerHTML + this.innerHTML;
						}
					});
				},
				/**
				 * Append content to the elements
				 * @param mixed content
				 * @returns __
				 */
				append: function (content) {
					var _this = this;
					return this.each(function () {
						var __this = this,
								doc = document.createElement(this.tagName);
						if (content instanceof _) {
							content.each(function () {
								doc.appendChild(this);
							});
						}
						else if (_this.isObject(content) && content['outerHTML']) {
							doc.appendChild(content);
						}
						else {
							doc.innerHTML = content;
						}
						if (doc.childElementCount) {
							_this.forEach(Array.from(doc.children), function () {
								__this.appendChild(this);
							});
						}
						else {
							this.innerHTML += doc.innerHTML;
						}
					});
				},
				/**
				 * Removes an element from the DOM
				 * @returns object The removed element
				 */
				remove: function () {
					var removed = [];
					this.each(function () {
						if (this.parentElement)
							removed.push(this.parentElement.removeChild(this));
					});
					return _(removed, this.debug);
				},
				/**
				 * Clones the first item
				 * @returns _
				 */
				clone: function () {
					return this.tryCatch(function () {
						return _(this.items.length ? this.items[0].cloneNode(true) : [], this.debug);
					});
				},
				/**
				 * Searches the current items for elements that match the given selector
				 * @param string selector
				 * @returns _
				 */
				find: function (selector) {
					var result = [], _this = this;
					this.each(function () {
						if (_this.items.length > 1) {
							result = result.concat(Array.from(this.querySelectorAll(selector)));
						}
						else
							result = Array.from(this.querySelectorAll(selector));
					});
					return _(result, this.debug);
				},
				/**
				 * Filters matched items through the given function
				 * @param function func parameters include index and value
				 * @returns _ Object containing matched items
				 */
				filter: function (func) {
					var _this = this,
							filtered = this.items.filter(function (v, i) {
								func = _this.callable(func);
								return func ? func.call(v, i, v) : true;
							});
					return _(filtered, this.debug);
				},
				/**
				 * Finds the closest object of the given selector
				 * @param string selector
				 * @returns _
				 */
				closest: function (selector) {
					return this.tryCatch(function () {
						return _(this.items.length ? this.items[0].closest(selector) : [], this.debug);
					});
				},
				/**
				 * Fetches the parent of the current items
				 * @returns _
				 */
				parent: function () {
					var parents = [];
					this.each(function () {
						parents.push(this.parentElement);
					});
					return _(parents, this.debug);
				},
				/**
				 * Fetches the item at the given index
				 * @param int index
				 * @returns mixed
				 */
				get: function (index) {
					return this.items[index];
				},
				/**
				 * Replaces current items with the given content
				 * @param mixed content
				 * @returns __
				 */
				replaceWith: function (content) {
					var replaced = [];
					content = _(content, this.debug);
					this.each(function () {
						var _content = content.items[0];
						if (!_content)
							return;
						this.replaceWith(_content);
						replaced.push(_content);
					});
					return _(replaced, this.debug);
				},
				/**
				 * Logs the error message
				 * @param string message
				 * @returns _
				 */
				error: function (message) {
					if (this.debug)
						console.error(message);
					return this;
				},
				/**
				 * Parses a string to object
				 * @param {string} string
				 * @returns {Array|Object}
				 */
				toObject: function (string) {
					return this.tryCatch(function () {
						return JSON.parse(string);
					});
				},
				/**
				 * Parse an object to string
				 * @param {Object} object
				 * @returns {String}
				 */
				toJSON: function (object) {
					return this.tryCatch(function () {
						return JSON.stringify(object);
					});
				},
				/**
				 * Creates a new element
				 * @param string str
				 * @param string tag The tag to create
				 * @returns _
				 */
				createElement: function (str) {
					var d = document.createElement('div');
					d.innerHTML = str;
					return _(Array.from(d.children), this.debug);
				},
				/**
				 * Checks if the items are of the given selector
				 * @param string selector
				 * @returns Boolean
				 */
				is: function (selector) {
					if (!this.items.length)
						return false;
					var el = this.items[0];
					return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
				},
				/**
				 * Sets the value of a form element
				 * @param mixed value
				 * @returns __|string
				 */
				val: function (value) {
					var val;
					this.each(function () {
						if (value) {
							this.value = value;
							return;
						}
						val = this.value;
					});
					return value ? this : val;
				},
				/**
				 * Sets or gets the given property
				 * @param string prop
				 * @param mixed value
				 * @returns __
				 */
				prop: function (prop, value) {
					return this.tryCatch(function () {
						if (value) {
							this.each(function (i, v) {
								v[prop] = value;
							});
							return this;
						}
						return prop && this.items.length ? this.items[0][prop] : null;
					});
				},
				/**
				 * Adds the given class to matched elements
				 * @param string className
				 * @returns _
				 */
				addClass: function (className) {
					var _this = this;
					return this.each(function () {
						var __this = this;
						_this.forEach(className.split(' '), function (i, v) {
							__this.classList.add(v);
						});
					});
				},
				/**
				 * Removes the given class from matched elements
				 * @param string className
				 * @returns _
				 */
				removeClass: function (className) {
					return this.each(function () {
						this.classList.remove(className);
					});
				},
				/**
				 * Checks whether
				 * @param string className
				 * @returns boolean
				 */
				hasClass: function (className) {
					var has = true,
							_this = this;
					this.each(function () {
						if (!this.classList.length ||
								!_this.contains(Array.from(this.classList), className)) {
							has = false;
							return false;
						}
					});
					return has;
				},
				/**
				 * Toggles an element class
				 * @param {string} className
				 * @returns {_}
				 */
				toggleClass: function (className) {
					return this.each(function () {
						var _this = _(this);
						if (_this.hasClass(className))
							_this.removeClass(className);
						else
							_this.addClass(className);
					});
					return this;
				},
				/**
				 * Fetches all siblings of matched elements
				 * @param string selector
				 * @returns _
				 */
				siblings: function (selector) {
					var siblings = [];
					this.each(function () {
						var rId = false;
						if (!this.id) {
							this.id = 'rANd' + Math.ceil(Math.random() * 100);
							rId = true;
						}
						siblings = siblings.concat(_(this.parentElement, this.debug)
								.children((selector || '') + ':not(#' + this.id + ')').items);
						if (rId)
							this.removeAttribute('id');
					});
					return _(siblings, this.debug);
				},
				/**
				 * Calls the given function in a try...catch block and outputs any errors to the console if 
				 * debug mode is enabled.
				 * @param function callback
				 * @param array args Array of parameters to pass into the callback function
				 * @returns mixed
				 */
				tryCatch: function (tryCallback, catchCallback) {
					try {
						return this.callable(tryCallback).call(this);
					}
					catch (e) {
						if (!catchCallback)
							this.error(e.message);
						else
							return this.callable(catchCallback).call(this, e);
					}
				}
			}),
			/**
			 * Creates a wrapper for traversing the DOM
			 * @param {string}|{array}|{HTMLCollection}|{object} selector
			 * If as string, selector contains tags, they are created unattached to the DOM
			 * @param {boolean} debug
			 * @returns {_}
			 */
			_ = function (selector, debug) {
				if (!(this instanceof _)) {
					return new _(selector, debug);
				}
				else if (selector instanceof _) {
					return selector;
				}
				else if (!selector) {
					this.items = [];
				}
				else if (this.isObject(selector)) {
					this.items = selector instanceof HTMLCollection ?
							Array.from(selector) : [selector];
				}
				else if (this.isArray(selector)) {
					this.items = selector;
				}
				else if (this.isString(selector)) {
					var _this = this.createElement(selector);
					if (_this.length)
						return _this;
					this.items = Array.from(document.querySelectorAll(selector));
				}
				else {
					this.error('Invalid selector');
				}
				this.__proto__.debug = debug !== false ? true : false;
				this.length = this.items.length;
				return this;
			},
			internal = Object.create({
				/**
				 * Calls a method of the internals object with the `this` object as the given _this
				 * @param ThisApp _this
				 * @param string method
				 * @param mixed param
				 * @returns mixed
				 */
				call: function (_this, method, param) {
					var args = Array.from(arguments);
					__.arrayRemove(args, 0);
					__.arrayRemove(args, 0);
					return this[method].apply(_this, args);
				},
				/**
				 * Setups the app events
				 * @returns ThisApp
				 */
				setup: function () {
					this.tryCatch(function () {
						var _this = this;
						this.__.__proto__.debug = this.config.debug;
						if (this.config.paths) {
							this.__.forEach(this.config.paths, function (i, v) {
								if (!v.endsWith('/') && i !== 'ext')
									_this.config.paths[i] = v + '/';
							});
						}
						if (!this.notFound)
							this.notFound = function () {
								if (_this.firstPage) {
									if (_this.store('last_page')) {
										_this.store('last_page', null);
										_this.loadPage(_this.store('last_page'));
									}
									else if (_this.config.startWith) {
										if (this._('page[this-id="' + _this.config.startWith
												+ '"]:not([this-current]):not([this-dead]),'
												+ '[this-type="pages"]>[this-id="'
												+ _this.config.startWith + '"]').length)
											_this.loadPage(_this.config.startWith);
									}
									else {
										var startWith = _this._('[this-default-page]');
										if (startWith.length)
											_this.loadPage(startWith.attr('this-id'));
									}
								}
							};
						this.container.find('page,model,collection,layout,component,[this-type]')
								.attr('this-loaded', '');
						if (!this._('[this-type="pages"]').length) {
							this._('body').append('<div this-type="pages" style="display:none"/>')
									.find('[this-type="pages"]')
									.append(this._('[this-type="page"]:not([this-loaded])').hide());
						}
						if (this._('[this-type="component"]').length &&
								!this._('[this-type="components"]').length) {
							this._('body').append('<div this-type="components" style="display:none"/>')
									.find('[this-type="components"]')
									.append(this._('[this-type="component"]').hide());
						}
						if (this._('[this-type="layout"]').length &&
								!this._('[this-type="layouts"]').length) {
							this._('body').append('<div this-type="layouts" style="display:none"/>')
									.find('[this-type="layouts"]')
									.append(this._('[this-type="layout"]:not([this-loaded])').hide());
						}
						this._('page:not([this-loaded]),model:not([this-loaded]),'
								+ 'collection:not([this-loaded]),layout:not([this-loaded]),'
								+ 'component:not([this-loaded]),[this-type]:not([this-loaded])').hide();
						if (this.config.titleContainer)
							this.config.titleContainer = this._(this.config.titleContainer,
									this.config.debug);
						this.container
								.on('click', '[this-reload]', function (e) {
									e.preventDefault();
									var __this = _this._(this);
									// Attribute `this-reload` must not be empty
									if (!__this.attr('this-reload')) {
										_this.error('What to reload isn\'t specified.');
										return;
									}
									// reload value
									var reload = __this.attr('this-reload'),
											// reload template
											toReload = _this._(internal.selector
													.call(_this, reload, ':not([this-loaded])')),
											// reload target
											_reload = _this.page.find(internal.selector
													.call(_this, reload, '[this-loaded]'));
									if (!toReload.length) {
										_this.error('Reload target not found');
										return;
									}
									if (__this.attr('this-attributes'))
										_this.__.forEach(__this.attr('this-attributes').split(';'),
												function (i, v) {
													var attr = v.split(':'),
															name = _this.__.arrayRemove(attr, 0);
													attr = attr.join(':');
													toReload.attr(name, attr);
												});
									_reload.replaceWith(toReload.clone().removeAttr('this-cache'));
									internal.loadCollections.call(_this, true);
								})
								.on('click', '[this-go-home]', function (e) {
									_this.home();
									e.stop = true;
								})
								/* go back event */
								.on('click', '[this-go-back]', function (e) {
									_this.back(e);
									e.stop = true;
								})
								/* go forward event */
								.on('click', '[this-go-forward]', function (e) {
									_this.forward(e);
									e.stop = true;
								})
								/*
								 * READ event
								 * 
								 * Target must have attributes `this-read` and `this-goto`. Attribute 
								 * `this-read` may have the url of the model as its value.
								 * Optionally, target should also have attributes `this-model` and `this-mid`.
								 * The are required if target isn't in a model container.
								 */
								.on('click', '[this-goto][this-read]', function (e) {
									var __this = _this._(this),
											_model = __this.closest('model,[this-type="model"]'),
											_collection = __this.closest('collection,[this-type="collection"]'),
											model_name = __this.attr('this-model') || _model.attr('this-id')
											|| _collection.attr('this-model'),
											model_id = _model.attr('this-mid'),
											url = __this.attr('this-read') || _model.attr('this-url')
											|| '#',
											goto = __this.attr('this-goto').split('#')[0],
											/* new page template */
											page_template = _this._('page[this-id="' + goto
													+ '"]:not([this-current]):not([this-dead]),[this-type="pages"]'
													+ ' [this-id="' + goto + '"]'),
											/* the model container in the page template */
											page_template_model = page_template.find('model[this-id="'
													+ model_name + '"],[this-type="model"][this-id="'
													+ model_name + '"]'),
											/* the model container placeholder in the page template 
											 * needed if exist instead of page_template_model
											 */
											page_template_model_template = page_template
											.find('[this-component="' + model_name + '"]');
									page_template.attr('this-tar', 'reading:true');
									if (page_template_model.length)
										page_template_model.attr('this-url', url).attr('this-mid', model_id);
									else if (page_template_model_template.length)
										page_template_model_template.attr('this-tar', 'url:' + url
												+ ';mid:' + model_id);
								})
								/*
								 * UPDATE event
								 * 
								 * Target must have attributes `this-update` and `this-goto`. `this-update`
								 * may have the url of the model as its value.
								 * 
								 * If target isn't in a model container or intends to update another model 
								 * other than it's container model, it must also have attributes `this-model`
								 * and `this-mid`.
								 * If model is a part of a collection, target must also have attribute.
								 */
								.on('click', '[this-goto][this-update]', function () {
									var __this = _this._(this),
											model = __this.closest('model,[this-type="model"]'),
											model_id = model.attr('this-mid'),
											model_name = __this.attr('this-model')
											|| model.attr('this-id'),
											url = __this.attr('this-update')
											|| model.attr('this-url') || '#',
											tar = 'do:update;mid:' + model_id + ';action:' + url
											+ ';model:' + model_name,
											goto = __this.attr('this-goto').split('#')[0],
											_target = _this._('page[this-id="' + goto
													+ '"]:not([this-current]):not([this-dead]),[this-type="pages"] [this-id="'
													+ goto + '"]');
									if (model.attr('this-uid'))
										tar += ';model-uid:' + model.attr('this-uid');
									if (!_target.is('form'))
										_target = _target.find('form');
									_target.attr('this-tar', tar);
								})
								/*
								 * CREATE event
								 * 
								 * Target must have attributes `this-goto` and `this-create`. Attributes
								 * `this-create` must have the url of the collection as its value.
								 * 
								 * If CREATION must update model, then attributes 
								 * `this-model` must be provided unless the target
								 * form already has the required attributes.
								 */
								.on('click', '[this-goto][this-create]', function () {
									var __this = _this._(this),
											url = __this.attr('this-create') || '#',
											tar = 'do:create;action:' + url,
											goto = __this.attr('this-goto').split('#')[0],
											_target = _this._('[this-id="' + goto + '"]');
									if (__this.attr('this-model'))
										tar += ';model:' + __this.attr('this-model');
									if (__this.attr('this-model-uid'))
										tar += ';model-uid:' + __this.attr('this-model-uid');
									if (!_target.is('form'))
										_target = _target.find('form');
									_target.attr('this-tar', tar);
								})
								/*
								 * DELETE event - Show Page
								 * 
								 * Target must have attributes `this-goto` and `this-delete`. Attributes
								 * `this-delete` must have the url of the model as its value.
								 * 
								 * If DELETE must update model, then attributes 
								 * `this-model` may be provided if target isn't
								 * in a model container or target page doesn't have these attributes.
								 */
								.on('click', '[this-goto][this-delete]', function () {
									var __this = _this._(this),
											model = __this.closest('model,[this-type="model"]'),
											url = __this.attr('this-delete')
											|| model.attr('this-url') || '#',
											model_name = __this.attr('this-model')
											|| model.attr('this-id'),
											uid = model.attr('this-uid'),
											goto = __this.attr('this-goto').split('#')[0],
											tar = 'do:delete;uri:' + url + ';uid:' + uid;
									if (model)
										tar += ';model:' + model_name;
									_this._('[this-id="' + goto + '"]').attr('this-tar', tar);
								})
								/*
								 * Load page
								 * 
								 * Target must have attribute `this-goto`
								 * 
								 * Event page.leave is triggered
								 */
								.on('click', '[this-goto]', function (e) {
									e.preventDefault();
									var __this = _this._(this);
									if (!__this.attr('this-goto'))
										return;
									_this.page.trigger('page.leave');
									var goto = internal.pageIDFromLink.call(this,
											__this.attr('this-goto')),
											page = _this._('page[this-id="' + goto
													+ '"]:not([this-current]):not([this-dead]),[this-type="pages"]'
													+ ' [this-id="' + goto + '"]'),
											tar = page.attr('this-tar') || '';
									if (__this.attr('this-page-title'))
										tar = tar ? tar + ';title:' +
												__this.attr('this-page-title') :
												'title:' + __this.attr('this-page-title');
									if (__this.attr('this-ignore-cache'))
										tar = tar ? tar + ';ignore-cache:' +
												__this.attr('this-ignore-cache')
												: 'ignore-cache:' +
												__this.attr('this-ignore-cache');
									if (tar)
										page.attr('this-tar', tar);
									_this.loadPage(goto);
									e.stop = true;
								})
								/*
								 * DELETE event
								 * 
								 * This is where the actual DELETE request is sent.
								 * 
								 * Target must have attribute `this-delete` which may contain 
								 * the url of the model.
								 * 
								 * If DELETE must update model and/or collection, then attributes 
								 * `this-model` must be provided if target isn't
								 *  within a model or page loaded as a result of a previous 
								 *  delete click.
								 */
								.on('click', '[this-delete]', function (e) {
									if (e.stop)
										return;
									e.preventDefault();
									var __this = _this._(this);
									var _model = __this.closest('model,[this-type="model"]'),
											_do = __this.closest('[this-do="delete"]'),
											__model = new Model({id: _model.attr('this-mid')}, {
												app: _this,
												name: __this.attr('this-model') ||
														_model.attr('this-id') ||
														_do.attr('this-model'),
												uid: _model.attr('this-uid') ||
														_do.attr('this-uid') || 'id',
												url: __this.attr('this-delete') ||
														_model.attr('this-url') ||
														_do.attr('this-uri'),
												method: 'delete'
											});
									if (false === this.__.callable(this.beforeDelete)
											.call(this, __model, _model.items[0])) {
										_model.trigger('delete.canceled');
										return;
									}
									__model.remove(false, function (data) {
										var model = _this.config.dataKey ?
												data[_this.config.dataKey] : data;
										if (model) {
											if (_this.page.attr('this-do') === 'delete')
												_this.back();
											else {
												_this.page.find('[this-binding]').hide();
											}
											__this.trigger('delete.success', {
												response: this,
												responseData: data
											});
										}
										else
											__this.trigger('delete.failed',
													{
														response: this,
														responseData: data
													});
									},
											function () {
												__this.trigger('delete.error', {
													response: this
												});
											},
											function () {
												__this.trigger('delete.complete', {
													response: this
												});
											});
								})
								/*
								 * Click event
								 * Bind model to target
								 */
								.on('click', '[this-bind]', function (e) {
									e.preventDefault();
									var __this = _this._(this),
											bind = __this.attr('this-bind'),
											_model = __this.closest('model,[this-type="model"],[this-model]');
									if (!bind)
										return;
									var _target = _this.page.find(internal.selector
											.call(_this, bind, ':not([this-in-collection])'));
									if (!_target.length)
										return;
									_target.attr('this-model', (_model.attr('this-model')
											|| _model.attr('this-id'))).attr('this-binding', '');
									if (__this.hasAttr('this-read'))
										_this.page.find('[this-model="' + (_model.attr('this-model')
												|| _model.attr('this-id')) + '"][this-binding]').hide();
									if (__this.hasAttr('this-update'))
										_target.attr('this-tar', 'do:update');
									if (__this.hasAttr('this-create'))
										_target.attr('this-tar', 'do:create');
									internal.bindToModel.call(_this, _target, _model,
											__this.attr('this-cache'));
								})
								/*
								 * Click event
								 * Toggles target on and off
								 */
								.on('click', '[this-toggle]', function (e) {
									e.preventDefault();
									_this.container.find(internal.selector.call(_this,
											_this._(this).attr('this-toggle'))).toggle();
									internal.saveState.call(_this, true);
								})
								/*
								 * Hides target elements
								 */
								.on('click', '[this-hide]', function (e) {
									e.preventDefault();
									_this.container.find(internal.selector.call(_this,
											_this._(this).attr('this-hide'))).hide();
									internal.saveState.call(_this, true);
								})
								/*
								 * Shows target elements
								 */
								.on('click', '[this-show]', function (e) {
									e.preventDefault();
									var __this = _this._(this),
											_target = _this.container.find(internal.selector.call(_this,
													__this.attr('this-show')));
									if (__this.attr('this-create')) {
										_this.page.find('[this-binding]').hide();
										var form = _target.is('form[this-model="'
												+ __this.attr('this-model') + '"]') ? _target :
												_target.find('form[this-model="'
														+ __this.attr('this-model') + '"]');
										form.attr('this-do', 'create').attr('this-url',
												__this.attr('this-create')).attr('this-binding', '');
										if (__this.attr('this-model-uid'))
											form.attr('this-model-uid', __this.attr('this-model-uid'));
										form.removeAttr('this-mid');
										form.get(0).reset();
									}
									_target.show();
									internal.saveState.call(_this, true);
								})
								/*
								 * CREATE and UPDATE events
								 * Form submission
								 * 
								 */
								.on('submit', 'form[this-do="create"]:not([this-ignore-submit]),'
										+ ' form[this-do="update"]:not([this-ignore-submit])',
										function (e) {
											e.preventDefault();
											var data = {},
													__this = _this._(this),
													creating = __this.attr('this-do') === 'create',
													method = creating ? 'post' : 'put';
											if (!this.reportValidity()) {
												__this.trigger('form.invalid.submission');
												return;
											}
											__this.trigger('form.valid.submission');
											_this.__.forEach(Array.from(this.elements), function () {
												if (!this.name)
													return;
												if (this.name.indexOf('[]') !== -1) {
													var name = this.name.replace('[]', '');
													if (!data[name]) {
														data[name] = [];
													}
													data[name].push(this.value);
												}
												else if (this.name.indexOf('[') !== -1) {
													var exp = this.name.replace(']', '').split('['),
															_data = data,
															lastKey = exp.pop();
													_this.__.forEach(exp, function (i, v) {
														if (!_data[v])
															_data[v] = {};
														_data = _data[v];
													});
													_data[lastKey] = this.value;
												}
												else {
													data[this.name] = this.value;
												}
											});
											if (__this.attr('this-mid'))
												data['id'] = __this.attr('this-mid');
											var _model = new Model(data, {
												app: _this,
												name: __this.attr('this-model'),
												uid: __this.attr('this-uid'),
												url: __this.attr('this-action') || __this.attr('this-url'),
												method: method
											});
											_model.save(_model.url === null, function (data) {
												var model = _this.config.dataKey ?
														data[_this.config.dataKey] : data;
												if (model) {
													if (creating)
														__this.items[0].reset();
													if (!__this.hasAttr('this-binding') &&
															!__this.closest('[this-binding]').length
															&& creating)
														_this.back();
													__this.trigger('form.submission.success',
															{
																response: this,
																responseData: data,
																method: method.toUpperCase()
															});
												}
												else {
													__this.trigger('form.submission.failed',
															{
																response: this,
																responseData: data,
																method: method.toUpperCase()
															});
												}
											},
													function () {
														__this.trigger('form.submission.error',
																{
																	response: this,
																	method: method.toUpperCase()
																});
													},
													function () {
														__this.trigger('form.submission.complete',
																{
																	response: this,
																	method: method.toUpperCase()
																});
													});
										})
								/*
								 * Search Event
								 * Form submissiom 
								 */
								.on('submit', 'form[this-do="search"]', function (e) {
									e.preventDefault();
									var _form = _this._(this),
											_search = _form.find('[this-search]');
									if (!_search.attr('this-search')) {
										_this.error('Invalid search target');
										return;
									}
									var exp = _search.attr('this-search').split(':'),
											selector = 'collection[this-id="' + exp[0]
											+ '"],[this-type="collection"][this-id="' + exp[0] + '"]',
											keys = exp[1],
											goto = _form.attr('goto') ||
											_form.closest('page,[this-type="page"]').attr('this-id'),
											_page = _this._('page[this-id="' + goto
													+ '"]:not([this-current]):not([this-dead]),[this-type="page"][this-id="'
													+ goto + '"]:not([this-current]):not([this-dead])'),
											_collection = _page.find(selector),
											_component = _page.find('[this-component="' + exp[0] + '"]'),
											filter = '',
											tar = 'query:' + _search.val().trim();
									if (_search.attr('this-ignore-cache'))
										tar += ';ignore-cache:' + _search.attr('this-ignore-cache');
									if (keys)
										keys = keys.split(',');
									_this.__.forEach(keys, function (i, key) {
										if (filter)
											filter += ' || ';
										filter += '_this.__.contains(filters.lcase(model#' + key
												+ '),filters.lcase("' + _search.val() + '"))';
									});
									_page.attr('this-tar', tar);
									_collection.attr('this-filter', filter).attr('this-search',
											keys.join(','));
									_component.attr('this-filter', 'collection#' + exp[0] + ':' + filter)
											.attr('this-search', 'collection#' + exp[0] + ':'
													+ keys.join(','));
									/* same page and query. don't duplicate state */
									var replaceState = _this.page.attr('this-id') === goto &&
											_this.page.attr('this-query') === _search.val().trim();
									_this.loadPage(goto, replaceState);
								});
						/*
						 * Home button event for buttons outside the container
						 */
						this._('[this-go-home]').on('click', function (e) {
							_this.home();
						});
						/*
						 * Back button event for buttons outside the container
						 */
						this._('[this-go-back]').on('click', function (e) {
							if (!e.stop)
								_this.back(e);
						});
						/*
						 * Forward button event for buttons outside the container
						 */
						this._('[this-go-forward]').on('click', function (e) {
							if (!e.stop)
								_this.forward(e);
						});
						/*
						 * State resuscitation
						 */
						this._(window).on('popstate', function (e) {
							if (e.state)
								internal.restoreState.call(_this, e.state);
						});
						/*
						 * Container events activation
						 */
						this.__.forEach(this.events, function () {
							_this.container.on(this.event, this.selector, this.callback);
						});
					});
					this.__proto__.running = true;
					return this;
				},
				/**
				 * Parses the url hash
				 * @returns {string} Target page ID
				 */
				pageIDFromLink: function (link) {
					if (link.startsWith('#'))
						link = link.substr(1);
					var parts = link.split('&');
					if (parts.length > 1)
						this.target_on_page = parts[1];
					return parts[0];
				},
				/**
				 * Scrolls to the target on page
				 * @returns {void}
				 */
				resolveTargetOnPage: function () {
					// @todo
					delete this.target_on_page;
				},
				/**
				 * Binds the target to the model
				 * @param _ _target
				 * @param _ _model
				 * @param boolean ignoreCache Indicates whether to ignore cache
				 * @returns ThisApp
				 */
				bindToModel: function (_target, _model, ignoreCache) {
					this.binding = true;
					var _this = this,
							model_name = _model.is('model') || _model.attr('this-type') === 'model'
							? _model.attr('this-id') : _model.attr('this-model'),
							model;
					if (!_model.attr('this-mid')) {
						this.error('Model to bind to does not have an id');
						return;
					}
					_target.attr('this-mid', _model.attr('this-mid'))
							.attr('this-uid', _model.attr('this-uid'))
							.attr('this-url', _model.attr('this-url'));
					if (!ignoreCache) {
						model = internal.modelFromStore.call(_this, _model.attr('mid'), model_name);
					}
					if (model) {
						internal.bindData.call(_this, model, _target);
						_target.trigger('variables.binded', {
							data: model
						});
					}
					else {
						this.request(_model.attr('this-url'), function (data) {
							data = _this.config.dataKey ? data[_this.config.dataKey] : data;
							internal.bindData.call(_this, data, _target);
							_target.trigger('variables.binded', {
								data: data
							});
						});
					}
					return this;
				},
				/**
				 * Binds the data to the target
				 * @param object data
				 * @param _ _target
				 * @returns ThisApp
				 */
				bindData: function (data, _target) {
					internal.loadModel.call(this, _target, data, true);
					internal.loadForms.call(this, _target.is('form') ? _target
							: _target.find('form'), data);
					return this;
				},
				/**
				 * Parses temporary attributes
				 * @param _ __this
				 * @param boolean noShow Indicates whether not to show the element
				 * @returns object _ The template object
				 */
				doTar: function (__this, noShow) {
					if (__this.attr('this-tar')) {
						var tar = __this.attr('this-tar').split(';');
						this.__.forEach(tar, function (i, v) {
							var split = v.split(':');
							if (split.length < 2)
								return;
							__this.attr('this-' + split[0], split[1]);
						});
					}
					if (!noShow)
						__this.show();
					return __this.removeAttr('this-tar');
				},
				/**
				 * Loads all forms
				 * @returns ThisApp
				 */
				loadForms: function (forms, model) {
					var _this = this, isPage = false;
					if (!forms) {
						isPage = this.page.is('form');
						forms = isPage ? this.page : this.page.find('form');
					}
					forms.each(function (i) {
						var __this = _this._(this),
								elements = Array.from(this.elements);
						if (__this.attr('this-do') === 'search' && _this.page.attr('this-query')) {
							__this.find('[this-search]').val(_this.page.attr('this-query'));
							return;
						}
						if (!isPage) {
							_this._('page[this-id="' + _this.page.attr('this-id')
									+ '"]:not([this-current]):not([this-dead]) form:nth-child(' + (i + 1)
									+ '),[this-type="page"][this-id="'
									+ _this.page.attr('this-id')
									+ '"]:not([this-current]):not([this-dead]) form:nth-child(' + (i + 1) + ')')
									.removeAttr('this-tar');
						}
						internal.doTar.call(_this, __this, true);
						if (!__this.attr('this-mid'))
							return;
						if (!model)
							model = internal.modelFromStore.call(_this,
									__this.attr('this-mid'),
									__this.attr('this-model') || __this.attr('this-id'));
						if (model)
							internal.loadFormElements.call(_this, elements, model);
						__this.attr('this-loaded', '').trigger('form.loaded');
					});
					return this;
				},
				/**
				 * Loads the given form elements with the model
				 * @param array elements
				 * @param object model
				 * @returns ThisApp
				 */
				loadFormElements: function (elements, model) {
					if (!model)
						return;
					var _this = this;
					this.__.forEach(elements, function () {
						var ___this = _this._(this),
								key = ___this.attr('this-is');
						if (!key)
							return;
						var data = _this.__.extend({}, model),
								keys = _this.__.contains(key, '.') ? keys = key.split('.') : keys = [key];
						_this.__.forEach(keys, function (i, v) {
							data = data[v];
						});
						if (___this.attr('type') === 'radio' ||
								___this.attr('type') === 'checkbox') {
							___this.prop('checked', ___this.prop('value') == data);
							return;
						}
						___this.val(data);
					});
					return this;
				},
				/**
				 * Loads all components in the current page
				 * @returns ThisApp
				 */
				loadComponents: function () {
					var _this = this,
							components = this.page.find('[this-component]');
					this.__proto__.components += components.length;
					components.each(function () {
						var __this = _this._(this);
						if (__this.attr('this-url')) {
							_this.request(__this.attr('this-url'), function (data) {
								internal.loadComponent.call(_this, __this, _this._(data), true);
							}, function () {
							}, {}, 'text');
						}
						else {
							var component = _this._('component[this-id="'
									+ __this.attr('this-component')
									+ '"]:not([this-loaded]),[this-type="component"][this-id="'
									+ __this.attr('this-component')
									+ '"]:not([this-loaded]),[this-type="components"]>[this-id="'
									+ __this.attr('this-component') + '"]').clone();
							internal.loadComponent.call(_this, __this, component);
						}
					});
					return this;
				},
				/**
				 * Loads a single component
				 * @param {_} __this
				 * @param {_} component
				 * @returns {void}
				 */
				loadComponent: function (__this, component) {
					var _this = this,
							collection_id;
					if (__this.attr('this-tar'))
						internal.doTar.call(this, component.attr('this-tar',
								__this.attr('this-tar'))).attr('this-loaded', '');
					this.__.forEach(__this.attr(), function (i, attr) {
						if (attr.name === 'this-component' || attr.name === 'this-url')
							return;
						if ((attr.name === 'this-filter' || attr.name === 'this-search')
								&& _this.__.contains(attr.value, ':')) {
							var split = attr.value.split(':'),
									target = _this.__.arrayRemove(split, 0),
									value = split.join(':'),
									selector = '[this-id="' + target + '"]';
							if (_this.__.contains(target, '#')) {
								split = target.split('#');
								selector = split[0] + '[this-id="' + split[1]
										+ '"],[this-type="' + split[0]
										+ '"][this-id="' + split[1] + '"]';
								collection_id = split[1];
							}
							component.find(selector).attr(attr.name, value);
							return;
						}

						component.attr(attr.name, attr.value);
					});
					if (!component.attr('this-type'))
						component.attr('this-type', 'component');
					if (component.attr('this-type') === 'component' || component.is('component')) {
						component.attr('this-loaded', '').show();
					}
					else {// hide non-components, e.g. collection, until system shows them
						component.hide();
					}
					__this.replaceWith(component).trigger('component.loaded');
					this.__proto__.components--;
				},
				/**
				 * Loads all collections in the current page
				 * @param boolean replaceState
				 * @returns ThisApp
				 */
				loadCollections: function (replaceState) {
					var _this = this;
					if (this.components) {
						setTimeout(function () {
							internal.loadCollections.call(_this, replaceState);
						}, 300);
						return;
					}
					var ignore = _this.page.attr('this-ignore-cache') || '',
							collections = this.page.find('collection:not([this-loaded])'
									+ ':not([this-cache]),'
									+ '[this-type="collection"]:not([this-loaded]):not([this-cache])');
					this.__proto__.collections += collections.length;
					collections.each(function () {
						var __this = _this._(this).addClass('loading'),
								content = __this.html(),
								cached = internal.cache.call(_this, 'model',
										__this.attr('this-id')),
								model_name = __this.attr('this-model');
						// cache collection if not exist in dom as unloaded
						if (!_this._('collection[this-id="' + __this.attr('this-id') +
								'"]:not(.loading),[this-type="collection"][this-id="'
								+ __this.attr('this-id') + '"]:not(.loading)').length) {
							_this.page.append(__this.clone().removeAttr('this-loaded')
									.removeClass('loading').attr('this-cache', '').hide());
						}
						__this.removeClass('loading');
						__this.children().attr('this-cache', __this.attr('this-model') || '').hide();
						if (model_name && _this.page.find('model[this-id="' + model_name
								+ '"],[this-type="model"][this-id="' + model_name
								+ '"]').length) {
							_this.page.find('model[this-id="' + model_name
									+ '"],[this-type="model"][this-id="' + model_name + '"]')
									.attr('this-bind', true);
						}
						if (!_this.__.contains(ignore, 'collection#' + __this.attr('this-id'))
								&& cached && cached.length
								&& ((cached.expires && cached.expires < Date.now())
										|| !cached.expires)) {
							_this.__proto__.collections--;
							var data = {};
							if (_this.config.dataKey)
								data[_this.config.dataKey] = cached.data;
							else
								data = cached.data;
							internal.loadData.call(_this, this, data, content, false, false);
							__this.attr('this-loaded', '').trigger('collection.cache.loaded');
							internal.pageLoaded.call(_this, replaceState);
						}
						else {
							var data = {}, save = true;
							if (_this.page.attr('this-query')) {
								data['query'] = _this.page.attr('this-query');
								/* don't save search response data */
								save = false;
							}
							if (__this.attr('this-search')) {
								data['keys'] = __this.attr('this-search');
							}
							_this.request(this, function (data) {
								_this.__proto__.collections--;
								internal.loadData
										.call(_this, this, data, content, false, save);
								__this.attr('this-loaded', '')
										.trigger('collection.loaded');
								internal.pageLoaded.call(_this, replaceState);
							},
									function () {
									}, data);
						}
					});
					return this;
				},
				/**
				 * Loads a model on the current page
				 * @param object _model
				 * @param boolean binding Indicates whether to currently binding model to a collection
				 * @param boolean replaceState Indicates whether to overwrite current state
				 *  after loading model
				 * @returns void
				 */
				loadModel: function (_model, data, replaceState) {
					var __this = this._(_model),
							ignore = this.page.attr('this-ignore-cache') || '',
							content = __this.html(),
							_this = this;
					if (!data && !__this.attr('this-url')) {
						this.__proto__.models--;
						return;
					}
					if (__this.attr('this-tar'))
						internal.doTar.call(this, __this);
					if (__this.siblings('[this-cache="' + __this.attr('this-id') + '"]').length) {
						content = __this.siblings('[this-cache="' + __this.attr('this-id') + '"]').html();
					}
					else
						__this.parent().append('<div this-cache="' + __this.attr('this-id')
								+ '" style="display:none">' + content + '</div>');
					if (!data && !_this.__.contains(ignore, 'model#' + __this.attr('this-id'))) {
						data = internal.modelFromStore.call(this,
								__this.attr('this-mid'), __this.attr('this-id'));
						if (data)
							--this.__proto__.models;
					}
					if (data) {
						if (this.config.dataKey) {
							var _m = {};
							_m[this.config.dataKey] = data;
							data = _m;
						}
						internal.loadData.call(this, __this, data, content, true, false);
						__this.attr('this-loaded', '').trigger('model.cache.loaded');
						internal.pageLoaded.call(this, replaceState);
						return;
					}
					this.request(this, function (data) {
						--_this.__proto__.models;
						internal.loadData.call(_this, this, data, content, true, true);
						__this.attr('this-loaded', '').trigger('model.loaded');
						internal.pageLoaded.call(_this, replaceState);
					});
				},
				/**
				 * Loads all models in the current page
				 * @param boolean replaceState
				 * @returns ThisApp
				 */
				loadModels: function (replaceState) {
					var _this = this;
					if (this.components) {
						setTimeout(function () {
							internal.loadModels.call(_this, replaceState);
						}, 300);
						return;
					}
					var models = this.page
							.find('model:not([this-in-collection]),'
									+ '[this-type="model"]:not([this-in-collection])');
					this.__proto__.models += models.length;
					models.each(function () {
						internal.loadModel.call(_this, this, null, replaceState);
					});
					return this;
				},
				/**
				 * Saves to cache or retrieves from cache
				 * @param string type collection or model
				 * @param string id The id of the collection or model
				 * @param array|object data Data to store
				 * @param boolean update Indicates whether update if exist
				 * @returns ThisApp
				 */
				cache: function (type, id, data, update) {
					/* retrieving */
					if (!type)
						return this.store();
					var __data = this.store(type.toLowerCase()) || {};
					/* retrieving */
					if (!data) {
						if (!id)
							return __data;
						return __data ? __data[id] : [];
					}
					/* saving */
					if (update) {
						if (__data)
							__data[id] = __data[id] ? this.__.extend(__data[id], data) : data;
					}
					else
						__data[id] = data;
					this.store(type.toLowerCase(), __data);
					return this;
				},
				/**
				 * Removes the given object from cache
				 * @param object model
				 * @param string type
				 * @param string id
				 * @returns ThisApp
				 */
				clearCache: function (type, id) {
					if (!type) {
						localStorage.clear();
						return this;
					}
					if (!id) {
						localStorage.removeItem(type.toLowerCase());
						return this;
					}
					var data = internal.cache.call(this, type.toLowerCase());
					delete data[id];
					return this.store(type.toLowerCase(), data);
				},
				/**
				 * Fetches a model from a collection store
				 * @param string model_id
				 * @param string collection_id
				 * @returns object|null
				 */
				modelFromStore: function (model_id, model_name) {
					return this.tryCatch(function () {
						var _collection = internal.cache.call(this, 'model', model_name);
						return _collection.data[model_id];
					});
				},
				/**
				 * Saves a model to a collection store
				 * @param object model
				 * @param string model_name
				 * @param string uid
				 * @returns object|null
				 */
				modelToStore: function (model, model_name, uid) {
					return this.tryCatch(function () {
						var collection = internal.cache.call(this, 'model', model_name)
								|| {data: {}, uid: uid};
						/* model is new */
						if (!collection.data[model[collection.uid || uid]])
							collection.length++;
						collection.data[model[collection.uid || uid]] = model;
						internal.cache.call(this, 'model', model_name, collection);
						return this;
					});
				},
				/**
				 * Removes a model from the given collection
				 * @param string model_id
				 * @param string collection_id
				 * @returns ThisApp
				 */
				removeModelFromStore: function (model_id, collection_id) {
					this.tryCatch(function () {
						var collection = internal.cache.call(this, 'model', collection_id);
						delete collection.data[model_id];
						internal.cache.call(this, 'model', collection_id, collection, true);
						return this;
					});
				},
				/**
				 * Loads a type fully from URL
				 * @param {string} type page || layout || component
				 * @param {string} id
				 * @param {boolean} replaceInState
				 * @returns {void}
				 */
				fullyFromURL: function (type, id, success, error) {
					if (!this.config.paths) {
						this.__.callable(error).call(this);
						return;
					}
					var _this = this,
							url = this.config.paths[type + 's'] + id + this.config.paths.ext;
					if (this.config.debug)
						url += '?' + Math.ceil(Math.random() * 9999);

					this.request(url, function (data) {
						var elem = _this.__.createElement(data);
						if (!elem.length || elem.length > 1 ||
								((!elem.is(type) || elem.attr('this-type') !== type)
										&& elem.hasAttr('this-id') && elem.attr('this-id') !== id)) {
							elem = _this._('<div this-type="' + type + '" this-id="'
									+ id + '" />')
									.html(data);
						}
						if (!elem.attr('this-id'))
							elem.attr('this-id', id);
						_this.__.callable(success).call(this, elem);
					}, function (e) {
						_this.__.callable(error).call(this, e);
					}, {}, 'text');
				},
				/**
				 * Called when the target page is not found a page
				 * @param {string} page Page ID
				 * @returns {ThisApp}
				 */
				notAPage: function (page) {
					this.error('Page [' + page + '] not found');
					if (this.__.isString(this.notFound)) {
						page = this._(internal.selector.call(this, this.notFound
								.startsWith('page#') ? this.notFound : 'page#' + this.notFound,
								':not([this-current]):not([this-dead])'));
						if (!page.length) {
							return this.error('Page [' + this.notFound + '] also not found');
						}
						internal.pageFound.call(this, page, true);
						return this;
					}
					else
						return this.__.callable(this.notFound).call(this, page);
				},
				/**
				 * Called when the target page is found
				 * @param {boolean} replaceInState
				 * @returns {void}
				 */
				pageFound: function (page, replaceInState) {
					if (internal.is.call(this, 'page', page)) {
						if (false === this.__.callable(this.beforePage)
								.call(this, page.items[0])) {
							page.trigger('page.load.canceled');
							return this;
						}
						if (this.page) {
							this.oldPage = this.page.attr('this-dead', '');
							if (this.oldPage.attr('this-id') === page.attr('this-id'))
								replaceInState = true;
						}
						this.page = page;
						if (this.page.attr('this-tar')) {
							var _page = internal.doTar.call(this, this.page.clone());
							this.page.removeAttr('this-tar');
							this.page = _page;
						} else
							this.page = this.page.clone();
						internal.loadLayouts.call(this, replaceInState);
					}
					else {
						this.error('Load page failed: ' + page.attr('this-id'));
						page.trigger('page.load.failed');
					}
				},
				/**
				 * Loads all layouts for the page
				 * @param {boolean} replaceInState
				 * @returns {void}
				 */
				loadLayouts: function (replaceInState) {
					var _layout = _(), _this = this;
					if (this.config.layout || this.page.attr('this-layout')) {
						var layout = this.page.attr('this-layout') || this.config.layout;
						// get existing layout in container
						_layout = this.container.find('layout[this-id="' + layout
								+ '"],[this-type="layout"][this-id="' + layout + '"]');
						_layout.find('[this-content]').html(this.page.show());
						// layout does not exist in container
						if (!_layout.length) {
							// get layout template
							_layout = this._('[this-type="layouts"] layout[this-id="' + layout + '"],'
									+ '[this-type="layouts"] [this-type="layout"][this-id="'
									+ layout + '"]').clone();
							// layout doesn't exist
							if (!_layout.length) {
								internal.fullyFromURL.call(this, 'layout', layout,
										function (_layout) {
											_layout.removeAttr('this-url')
													.find('[this-content]').html(_this.page);
											if (_layout.attr('this-extends'))
												internal.extendLayout
														.call(_this, _layout, replaceInState);
											else
												internal.finalizePageLoad
														.call(_this, _layout, replaceInState);

										},
										function () {
											this.error('Layout [' + layout + '] not found!');
											internal.finalizePageLoad.call(_this, _layout, replaceInState);
										});
							}
							else {
								if (_layout.attr('this-url')) {
									this.request(_layout.attr('this-url'),
											function (data) {
												_layout.removeAttr('this-url')
														.html(data)
														.find('[this-content]')
														.html(_this.page);
												if (_layout.attr('this-extends'))
													internal.extendLayout.call(_this, _layout, replaceInState);
												else
													internal.finalizePageLoad.call(_this, _layout, replaceInState);
											},
											function () {
											},
											{}, 'text');
								}
								else {
									_layout.find('[this-content]').html(_this.page);
									internal.extendLayout.call(this, _layout, replaceInState);
								}
							}

						}
						else
							internal.finalizePageLoad.call(this, _layout, replaceInState);
					}
					else {
						internal.finalizePageLoad.call(this, _layout, replaceInState);
					}
				},
				/**
				 * Extends the given layout
				 * @param {_} _layout
				 * @param {boolean} replaceInState
				 * @returns {void}
				 */
				extendLayout: function (_layout, replaceInState) {
					var __layout = _layout.clone(), _this = this;
					// get existing layout in container
					_layout = this.container.find('layout[this-id="'
							+ __layout.attr('this-extends')
							+ '"],[this-type="layout"][this-id="'
							+ __layout.attr('this-extends') + '"]');
					if (!_layout.length)
						_layout = this._('[this-type="layouts"] layout[this-id="'
								+ __layout.attr('this-extends') + '"],'
								+ '[this-type="layouts"] [this-type="layout"][this-id="'
								+ __layout.attr('this-extends') + '"]').clone();
					if (!_layout.length) {
						internal.fullyFromURL.call(this, 'layout', __layout.attr('this-extends'),
								function (_layout) {
									_layout.removeAttr('this-url')
											.find('[this-content]').html(__layout);
									if (_layout.attr('this-extends'))
										internal.extendLayout
												.call(_this, _layout, replaceInState);
									else
										internal.finalizePageLoad
												.call(_this, _layout, replaceInState);

								},
								function () {
									this.error('Layout [' + __layout.attr('this-extends')
											+ '] not found!');
									internal.finalizePageLoad.call(_this, _layout, replaceInState);
								});
					}
					else {
						if (_layout.attr('this-url')) {
							this.request(_layout.attr('this-url'),
									function (data) {
										_layout.removeAttr('this-url')
												.html(data)
												.find('[this-content]')
												.html(__layout.show());
										if (_layout.attr('this-extends')) {
											internal.extendLayout.call(_this, _layout, replaceInState);
										}
										else {
											internal.finalizePageLoad.call(_this, _layout,
													replaceInState);
										}
									},
									function () {
									},
									{}, 'text');
						}
						else {
							_layout.find('[this-content]')
									.html(__layout.removeAttr('this-extends').show());
							if (_layout.attr('this-extends')) {
								internal.extendLayout.call(this, _layout, replaceInState);
							}
							else {
								internal.finalizePageLoad.call(this, _layout, replaceInState);
							}
						}
					}
				},
				/**
				 * Finalizes page load after layouts have been loaded
				 * @param {_} _layout
				 * @param {boolean} replaceInState
				 * @returns {void}
				 */
				finalizePageLoad: function (_layout, replaceInState) {
					var _this = this;
					if (_layout && _layout.length) {
						if (!this.container.find('layout[this-id="'
								+ _layout.attr('this-id')
								+ '"],[this-type="layout"][this-id="'
								+ _layout.attr('this-id') + '"]').length)
							this.container.html(_layout.show());
					}
					else
						this.container.html(this.page);
					this.page = this.container.find('page:not([this-dead]),'
							+ '[this-type="page"]:not([this-dead])')
							.attr('this-current', '').show();
					var transit = this.__.callable(this.config.transition, true), wait;
					if (transit)
						wait = transit.call(null, _this.oldPage.removeAttr('this-current'), this.page,
								this.config.transitionOptions);
					else if (this.__.isString(this.config.transition)) {
						if (!Transitions[this.config.transition])
							this.config.transition = 'show';
						wait = Transitions[this.config.transition](_this.oldPage
								.removeAttr('this-current'),
								this.page, this.config.transitionOptions);
					}
					setTimeout(function () {
						_this.oldPage.remove();
						delete _this.oldPage;
					}, wait);
					if (this.config.titleContainer)
						this.config.titleContainer.html(this.page.attr('this-title'));
					if (this.page.attr('this-url')) {
						this.request(this.page, function (data) {
							_this.page.html(data);
							internal.loadComponents.call(_this);
							internal.loadCollections.call(_this, replaceInState);
							internal.loadModels.call(_this, replaceInState);
							internal.loadForms.call(_this);
							_this.page.attr('this-loaded', '');
							internal.pageLoaded.call(_this, replaceInState);
						},
								function () {
								}, {}, 'text');
					}
					else {
						internal.loadComponents.call(this);
						internal.loadCollections.call(this, replaceInState);
						internal.loadModels.call(this, replaceInState);
						internal.loadForms.call(this);
						this.page.attr('this-loaded', '');
						internal.pageLoaded.call(this, replaceInState);
					}
				},
				/**
				 * Called after the page has been fully loaded
				 * @param boolean replaceState Indicates whether to overwrite current state
				 * @returns ThisApp
				 */
				pageLoaded: function (replaceState) {
					if (!this.__proto__.collections && !this.__proto__.models &&
							!this.__proto__.components) {
						var _this = this;
						this.container.find('[this-inline-code]').each(function () {
							var __this = _this._(this);
							__this.replaceWith(_this._('<code this-code />').html(__this.html()));
						});
						this.container.find('[this-block-code]').each(function () {
							var __this = _this._(this);
							__this.replaceWith(_this._('<pre />').html(__this.html()))
									.innerWrap('<code this-code />');
						});
						this.container.find('[this-code]').each(function () {
							var __this = _this._(this),
									tags = internal.parseBrackets.call(_this, '<', '>', __this.html()),
									content = __this.html();
							_this.__.forEach(tags, function (i, v) {
								content = content
										.replace(v, '&lt;' + v.substr(1, v.length - 2) + '&gt;');
							});
							content = content.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
							__this.html(content).removeAttr('this-code');
						});
						delete this.firstPage;
						this.page.trigger('page.loaded');
						internal.saveState.call(this, replaceState);
					}
					return this;
				},
				/**
				 * Loads the response data into the container
				 * @param mixed container
				 * @param mixed data Object or data. If object, the array of data key must be set with 
				 * setDataKey()
				 * @param string content Template content to use
				 * @param boolean model Indicates whether the data is just model
				 * @param boolean save Indicates whether to save the data to store or not. Default is TRUE
				 * @returns ThisApp
				 */
				loadData: function (container, data, content, model, save) {
					container = this._(container);
					if (!data) {
						container.trigger('invalid.response');
						return;
					}
					var variables = internal.parseBrackets.call(this, '{{', '}}', content),
							_data = {data: {}, length: 0},
					save_as = container.attr('this-model') || container.attr('this-id');
					if (this.config.dataKey) {
						if (container.attr('this-type') === 'collection') {
							if (!data.expires) // none specified. set default 24 hours
								_data.expires = new Date().setMilliseconds(1000 * 3600 * 24);
							else if (!isNaN(data.expires)) // got a number. Must be milliseconds
								_data.expires = new Date().setMilliseconds(1000 * data.expires);
							else if (this.__isString(data.expires)) // got a string. Must be date
								_data.expires = new Date(data.expires).getTime();
						}
						data = data[this.config.dataKey];
					}
					if (this.__.isArray(data) || model === false) {
						var _this = this,
								filter = container.attr('this-filter');
						this.__.forEach(data, function (index, model) {
							if (save) {
								_data.data[model[container.attr('this-model-uid') || 'id']
										|| index] = model;
								_data.length++;
							}
							var _content = internal.inLoop.call(_this, {
								index: index,
								model: model
							}, filter,
									content.replace(/{{_index}}/g, index));
							if (!_content)
								return;
							_content = internal.processExpressions.call(_this, _content,
									{
										index: index,
										model: model
									});
							internal.doLoad.call(_this, container, model, _content, variables);
						});
						if (container.attr('this-type') === 'collection') {
							_data.uid = container.attr('this-model-uid') || 'id';
							_data.url = container.attr('this-url');
						}
					}
					else if (data && model) {
						if (container.attr('this-type') === 'model' && container.attr('this-id')) {
							save_as = container.attr('this-id');
						}
						if (save)
							_data.data[data[container.attr('this-uid') || 'id']] = data;
						internal.doLoad.call(this, container, data, content, variables);
					}
					container.show();
					if (this.config.cacheData && save !== false)
						internal.cache.call(this, 'model', save_as, _data, true);
					return this;
				},
				/**
				 * Does the loading
				 * @param object container
				 * @param object data
				 * @param string content
				 * @param array variables
				 * @returns ThisApp
				 */
				doLoad: function (container, data, content, variables) {
					container = this._(container);
					var _temp = internal.parseData.call(this, data, content, variables),
							id = container.attr('this-model-uid') || 'id';
					if (internal.is.call(this, 'collection', container)) {
						_temp.attr('this-mid', data[id] || '').attr('this-uid', id)
								.attr('this-type', 'model')
								.attr('this-in-collection', '')
								.attr('this-url', container.attr('this-url')
										+ (data[id] || ''));
						if (container.attr('this-model'))
							_temp.attr('this-id', container.attr('this-model'));
						container.append(_temp.show());
					}
					else {
						container.attr('this-uid', id)
								.attr('this-mid', data[id]);
						container.html(_temp.show().html());
					}
					return this;
				},
				/**
				 * Calls JS eval on the content after parsing it for variables
				 * @param {string} content
				 * @param {object} data
				 * @returns {mixed}
				 */
				eval: function (content, data) {
					var variables = internal.parseBrackets.call(this, '{{', '}}', content);
					content = internal.fillVariables.call(this, variables, data, content);
					return eval(content);
				},
				/**
				 * Fetches everything between the oBrace and cBrace as an array and trims each
				 * @param {string} oBrace Brace opener e.g. {
				 * @param {string} cBrace Brace closer e.g. }
				 * @param {string} content
				 * @returns {array}
				 */
				parseBrackets: function (oBrace, cBrace, content) {
					return this.__.tryCatch(function () {
						return content.match(new RegExp(oBrace + '\\s*[^' + cBrace + ']+\\s*'
								+ cBrace, 'gi')) || [];
					});
				},
				/**
				 * Escapes a regex string
				 * @param {string} str
				 * @returns {string}
				 */
				regEsc: function (str) {
					return str.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
				},
				/**
				 * Fetches all the expressions in the content
				 * @param {string} content
				 * @returns {Array}
				 */
				getExpressions: function (content) {
					var exps = [];
					this.__.forEach(content.split('({'), function (i, v) {
						if (!i)
							return;
						exps.push('({' + v.split('})')[0] + '})');
					});
					return exps;
				},
				/**
				 * Processes all expressions in the content
				 * @param {string} content
				 * @param {object} current Object available to expressions
				 * @returns {mixed}
				 */
				processExpressions: function (content, current) {
					var _this = this,
							exps = internal.getExpressions.call(this, content);
					this.__.forEach(exps, function (i, v) {
						try {
							content = content.replace(v, eval(v.trim().substr(2, v.trim().length - 4)));
						}
						catch (e) {
							_this.error(e.message);
						}
					});
					return content;
				},
				/**
				 * Parse the given data into the given content based on the given variables
				 * @param array|object data
				 * @param string content
				 * @param array variables
				 * @returns ThisApp
				 */
				parseData: function (data, content, variables) {
					if (!variables)
						variables = internal.parseBrackets.call(this, '{{', '}}', content);
					var _temp = this.__.isObject(content) ? content :
							this._('<div/>')
							.html(content),
							_this = this;
					_temp.find('[this-each]').each(function () {
						var __this = _this._(this),
								_data = data[__this.attr('this-each')],
								filter = __this.attr('this-filter'),
								each = __this.attr('this-each').trim(),
								content = __this.removeAttr('this-muted')
								.html()
								.replace(/__obrace__/g, '{{').replace(/__cbrace__/g, '}}')
								.replace(/__obrace2__/g, '({').replace(/__cbrace2__/g, '})');
						__this.html('');
						// this-each is not a model key
						if (!_data) {
							// do each on an expression
							if (each.startsWith('{(')) {
								_data = internal.eval
										.call(_this, each.substr(1, each.length - 2), data);
							}
							// do each on a variable value
							else if (each.startsWith('{{')) {
								// get the value
								_data = internal.getVariableValue.call(_this, each, data);
							}
						}
						if (!_this.__.isObject(_data, true))
							return;
						_this.__.forEach(_data, function (key, value) {
							var __data = {
								key: key,
								value: value
							},
							_content = internal.inLoop.call(_this, __data, filter, content);
							if (!_content)
								return;
							_content = internal.processExpressions.call(_this, _content, __data);
							var _variables = internal.parseBrackets.call(_this, '{{', '}}', _content);
							__this.append(internal.fillVariables
									.call(_this, _variables, __data, _content).replace(/{{key}}/g, key));
						});
						__this.removeAttr('this-each');
					});
					_temp.html(internal.fillVariables.call(this, variables, data, _temp.html()));
					var children = _temp.children();
					if (children.length === 1)
						_temp = children;
					return _temp.show();
				},
				/**
				 * Does things on looped objects
				 * @param {object} current Object containing the key/index and the value/model 
				 * currently being processed
				 * @param {string} filter Expression to evaluate on content
				 * @param {string} content
				 * @returns {_}
				 */
				inLoop: function (current, filter, content) {
					/* evaluates filter */
					if (filter && !eval(filter.trim()))
						return;
					content = this._(document.createElement('div'))
							.html(content);
					var _this = this, level = 0, matched = {};
					content.find('[this-each]').each(function () {
						var __this = _this._(this).attr('this-muted', '');
						__this.html(__this.html()
								.replace(/\{\{/g, '__obrace__')
								.replace(/\}\}/g, '__cbrace__')
								.replace(/\(\{/g, '__obrace2__')
								.replace(/\}\)/g, '__cbrace2__'))
								.find('[this-if], [this-else-if], [this-else]')
								.attr('this-ignore', '');
					});
					content.find('[this-if],[this-else-if],[this-else]')
							.each(function () {
								var __this = _this._(this);
								if (__this.attr('this-if') && !__this.hasAttr('this-ignore')) {
									level++;
									if (eval(__this.attr('this-if').trim())) {
										__this.removeAttr('this-if');
										matched[level] = true;
									}
									else {
										matched[level] = false;
										__this.remove();
									}
									if (__this.hasAttr('this-end-if')) {
										__this.removeAttr('this-end-if');
										delete matched[level];
										level--;
									}
								}
								else if (__this.attr('this-else-if') && !__this.hasAttr('this-ignore')) {
									if (!__.isBoolean(matched[level])) {
										_this.error('Branching error: Else-if without If!');
										return;
									}
									if (matched[level] || !eval(__this.attr('this-else-if').trim()))
										__this.remove();
									else {
										__this.removeAttr('this-else-if');
										matched[level] = true;
									}

									if (__this.hasAttr('this-end-if')) {
										__this.removeAttr('this-end-if');
										delete matched[level];
										level--;
									}
								}
								else if (__this.hasAttr('this-else') && !__this.hasAttr('this-ignore')) {
									if (!__.isBoolean(matched[level])) {
										_this.error('Branching error: Else without If!');
										return;
									}
									if (matched[level])
										__this.remove();
									else
										__this.removeAttr('this-else');
									if (__this.hasAttr('this-end-if'))
										__this.removeAttr('this-end-if');
									delete matched[level];
									level--;
								}
							});
					content.find('[this-ignore]').removeAttr('this-ignore');
					return content.html();
				},
				/**
				 * Retrieves the value of the variable from the data and filters it if required
				 * @param {string} variable
				 * @param {object} data
				 * @returns {mixed}
				 */
				getVariableValue: function (variable, data) {
					var _this = this,
							vars = variable.replace(/{*}*/g, '')
							.replace(/\\\|/g, '__fpipe__').split('|'),
							key = this.__.arrayRemove(vars, 0),
							value = this.__.contains(key, '.') ? internal.getDeepValue.call(null, key, data) : data[key];
					if (!value)
						return;
					this.__.forEach(vars, function (i, v) {
						v = v.replace(/__fpipe__/g, '|');
						var exp = v.split(':'), filter = _this.__.arrayRemove(exp, 0);
						if (Filters[filter])
							value = Filters[filter](value, exp.join(':'));
						if (!value) /* stop filtering if no value exists anymore */
							return false;
					});
					return value;
				},
				/**
				 * Fills content variables with data
				 * @param array variables
				 * @param array data
				 * @param string content
				 * @returns string
				 */
				fillVariables: function (variables, data, content) {
					var _this = this;
					this.__.forEach(variables, function (i, v) {
						var value = internal.getVariableValue.call(_this, v, data);
						content = content.replace(v, value);
					});
					return content;
				},
				/**
				 * Fetches the value of the variable on a deep level
				 * @param string variable May contain dots (.) which denote children keys
				 * @param object data The object from which to get the value
				 * @returns string
				 */
				getDeepValue: function (variable, data) {
					var value = data, vars = __.isObject(variable, true) ? variable : variable.split('.');
					__.forEach(vars, function (i, v) {
						if (!value)
							return false;
						value = value[v];
					});
					return value || '';
				},
				/**
				 * Restores a saved state
				 * @param object state
				 * @returns ThisApp
				 */
				restoreState: function (state) {
					if (this.page) {
						this.page.trigger('page.leave');
					}
					this.container.html(state.content);
					this.page = this.container.find('[this-id="' + state.id + '"]');
					if (this.config.titleContainer)
						this.config.titleContainer.html(state.title);
					this.store('last_page', state.id);
					internal.updatePage.call(this);
					this.page.trigger('page.loaded');
				},
				/**
				 * Updates a retrieved saved page
				 * @returns ThisApp
				 */
				updatePage: function () {
					var deleted = internal.cache.call(this, 'deleted') || {}, created = internal.cache.call(this, 'created') || {}, updated = internal.cache.call(this, 'updated') || {}, collection = internal.cache.call(this, 'model') || {}, _this = this,
							_collections = this.page.find('collection,[this-type="collection"]'),
							_models = this.page.find('model,[this-type="model"]'),
							touched = {
								'deleted': {},
								'created': false, 'updated': false
							};
					/* Add created models to collection list */
					if (_collections.length) {
						this.__.forEach(created, function (model_name, arr) {
							var _collection = _this.page.find('collection[this-model="' + model_name + '"],[this-type="collection"][this-model="' + model_name + '"]');
							if (!_collection.length)
								return;
							var __collection = collection[model_name],
									uid = __collection.uid;
							_this.__.forEach(arr, function (i, v) {
								var tmpl = internal.parseData.call(_this, __collection.data[v],
										_collection.children('[this-cache]').clone()
										.removeAttr('this-cache').outerHtml()),
										action = _collection.attr('this-prepend-new') ?
										'prepend' : 'append';
								_collection[action](tmpl.attr('this-mid', v)
										.attr('this-uid', uid)
										.attr('this-type', 'model')
										.attr('this-id', model_name)
										.attr('this-url', _collection.attr('this-url') + v)
										.attr('this-in-collection', '')
										.outerHtml());
								_this.__.arrayRemove(arr, i);
							});
							if (!created[model_name].length) {
								delete created[model_name];
							}
							touched.created = true;
						});
					}
					if (_models.length) {
						this.__.forEach(updated, function (model_name, arr) {
							var _model = _this.page.find('model[this-id="' + model_name + '"],[this-type="model"][this-id="' + model_name + '"],'
									+ 'collection[this-model="' + model_name + '"]>[this-type="model"],'
									+ '[this-type="collection"][this-model="' + model_name + '"]>[this-type="model"]'),
									in_collection = false;
							if (!_model.length)
								return;
							_this.__.forEach(arr, function (id, v) {
								_model.filter(function () {
									return this.getAttribute('this-mid') === id;
								})
										.each(function () {
											var __model = _this._(this),
													tmpl = internal.parseData.call(_this, v,
															__model.siblings('[this-cache]').clone()
															.removeAttr('this-cache').outerHtml());
											if (__model.hasAttr('this-in-collection')) {
												in_collection = true;
											}
											__model.html(tmpl.html());
										});
							});
							if (in_collection)
								delete updated[model_name];
							touched.updated = true;
						});
						this.__.forEach(deleted, function (model_name, arr) {
							_this.__.forEach(arr, function (i, mid) {
								var _model = _this.page.find('model[this-id="' + model_name + '"][this-mid="' + mid + '"],[this-type="model"][this-id="' + model_name + '"][this-mid="' + mid + '"],'
										+ 'collection[this-model="' + model_name + '"]>[this-type="model"][this-mid="' + mid + '"],'
										+ '[this-type="collection"][this-model="' + model_name + '"]>[this-type="model"][this-mid="' + mid + '"]');
								if (!_model.length)
									return;
								_model.each(function () {
									var __model = _this._(this);
									__model.hide();
									if (__model.hasAttr('this-in-collection')) {
										if (!touched.deleted[model_name]) {
											touched.deleted[model_name] = [];
										}
										touched.deleted[model_name].push(mid);
										__model.remove();
									}
									else {
										if (!__model.attr('this-bind') && this.page.attr('this-reading')
												&& _models.length === 1) {
											touched.back = true;
											return false;
										}
										else {
											__model.removeAttr('this-url').removeAttr('this-mid').html('');
										}

									}
								});
							});
						});
					}

					if (touched.cancel)
						return;
					if (touched.updated)
						this.store('updated', updated);
					if (touched.created)
						this.store('created', created);
					var del = false;
					this.__.forEach(touched.deleted, function (mod, arr) {
						_this.__.forEach(arr, function (i, v) {
							_this.__.arrayRemoveValue(deleted[mod], v);
							del = true;
						});
						/* remove model from deleted if operated on all */
						if (!deleted[mod].length) {
							delete deleted[mod];
						}
					});
					if (del)
						this.store('deleted', deleted);
					internal.loadForms.call(this);
					return touched.back ? this.back() : internal.saveState.call(this, true);
				},
				/**
				 * Saves the app state
				 * @param boolean replace Indicates whether to replace the current state
				 * @returns ThisApp
				 */
				saveState: function (replace) {
					var action = 'pushState';
					if (replace || this.firstPage)
						action = 'replaceState';
					history[action]({
						id: this.page.attr('this-id'),
						title: this.page.attr('this-title'),
						content: this.container.html()
					}, this.page.attr('this-title'), '#'
							+ this.page.attr('this-id'));
					this.store('last_page', this.page.attr('this-id'));
					return this;
				},
				/**
				 * Checks that the type of container matches the given type
				 * @param string type
				 * @param string|_ container
				 * @returns booean
				 */
				is: function (type, container) {
					return this._(container).attr('this-type') === type || this._(container).is(type);
				},
				/**
				 * Fetches the selector for a ThisApp type
				 * @param string id May contain dot (.) in the format type.id
				 * @param string append
				 * @returns string
				 */
				selector: function (id, append) {
					id = id.split('#');
					if (!append)
						append = '';
					var attrs = id[id.length - 1].split('[');
					id[id.length - 1] = attrs[0];
					this.__.arrayRemove(attrs, 0);
					if (attrs.length)
						append += '[' + attrs.join('[');
					return id.length > 1 ? '[this-type="' + id[0] + '"][this-id="' + id[1] + '"]' + append + ',' + id[0] + '[this-id="' + id[1] + '"]' + append : '[this-id="' + id[0] + '"]' + append;
				}
			}),
			Transitions = Object.create({
				show: function (pageOff, pageOn) {
					pageOff.remove();
					pageOn.show();
					return this;
				}
			}),
			Filters = Object.create({
				/**
				 * Changes the item to lower case
				 * @param string|array item
				 * @returns string|array
				 */
				lowercase: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.lcase(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item))
						return item.toLowerCase();
				},
				/**
				 * Changes the item to upper case
				 * @param string|array item
				 * @returns string|array
				 */
				uppercase: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.ucase(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item))
						return item.toUpperCase();
				},
				/**
				 * Shortcut to ucwords
				 * @param string|array item
				 * @param string options
				 * @returns string|array
				 */
				capitalize: function (item, options) {
					return this.ucwords(item, options);
				},
				/**
				 * Shortcut to lcfirst
				 * @param {string} item
				 * @returns {Array}
				 */
				smallize: function (item) {
					return this.lcfirst(item);
				},
				/**
				 * Shortcut to lowercase()
				 * @param {string} item
				 * @returns {Array}
				 */
				lcase: function (item) {
					return this.lowercase(item);
				},
				/**
				 * Shortcut to uppercase()
				 * @param {string} item
				 * @returns {Array}
				 */
				ucase: function (item) {
					return this.uppercase(item);
				},
				/**
				 * Changes the item's first letter to upper case
				 * @param string|array item
				 * @returns string|array
				 */
				ucfirst: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.ucfirst(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item))
						return item[0].toUpperCase() + item.substr(1);
				},
				/**
				 * Changes the item's first letter to lower case
				 * @param string|array item
				 * @returns string|array
				 */
				lcfirst: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.lcfirst(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item))
						return item[0].toLowerCase() + item.substr(1);
				},
				/**
				 * Capitalizes the first letter of each word
				 * @param string|array item
				 * @param string options Only option is - which indicates that first letter after 
				 * hyphens should
				 * be changed to upper case too
				 * @returns string|array
				 */
				ucwords: function (item, options) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.ucwords(v, options);
							arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item))
						return item.replace(options === '-' ? /[^-'\s]+/g : /[^\s]+/g, function (word) {
							return word.replace(/^./, function (first) {
								return first.toUpperCase();
							});
						});
				},
				/**
				 * Changes snake case to camel case
				 * @param string|array item
				 * @param boolean ucfirst
				 * @returns string|array
				 */
				snakeToCamel: function (item, ucfirst) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.snakeToCamel(v, ucfirst);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item)) {
						var _item = item.replace(/(\_\w)/g, function (w) {
							return w[1].toUpperCase();
						});
						return ucfirst ? this.ucfirst(_item) : _item;
					}
				},
				/**
				 * Changes camel case to snake case
				 * @param string|array item
				 * @returns string|array
				 */
				camelToSnake: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.camelToSnake(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item)) {
						var _item = item.replace(/([A-Z])/g, function (i) {
							return '_' + i.toLowerCase();
						});
						return this.lcfirst(_item);
					}
				},
				/**
				 * Changes camel case to hypen case
				 * @param string|array item
				 * @returns string|array
				 */
				camelToHyphen: function (item) {
					var _this = this;
					if (__.isArray(item)) {
						var arr = [];
						__.forEach(item, function (i, v) {
							var _item = _this.camelToSnake(v);
							if (_item)
								arr.push(_item);
						});
						return arr;
					}
					else if (__.isString(item)) {
						var _item = item.replace(/([A-Z])/g, function (i) {
							return '-' + i.toLowerCase();
						});
						return this.lcfirst(_item);
					}
				},
				/**
				 * Checks if the given value contains the given options
				 * @param {string}|{object}|{array} val
				 * @param {string}|{array} options This may be just the value to check for, or if an object, the index
				 * to check. Indexes may be chained with dots (.) if children are objects.
				 * @returns string|object|null
				 */
				contains: function (val, options) {
					if (__.isObject(val, true)) {
						options = options.split(',');
						return this.filter(val, function (v) {
							var search = options[0];
							if (options.length > 1) {
								v = internal.getDeepValue.call(null, options[0], v);
								search = options[1];
							}
							return v && (__.isString(v) || __.isArray(v)) && __.contains(v, search);
						});
					}
					else if (__.isString(val)) {
						return __.contains(val, options) ? val : null;
					}
					return null;
				},
				/**
				 * Filters items out of the object or array
				 * @param object|array obj
				 * @param functionName func
				 * @returns object|array
				 */
				filter: function (obj, func) {
					func = __.callable(func, true);
					if (func) {
						if (__.isArray(obj)) {
							return obj.filter(func);
						}
						else {
							var newObj = {};
							__.forEach(obj, function (i, v) {
								if (true === func.call(null, v, i)) {
									newObj[i] = v;
								}
							});
							return newObj;
						}
					}
					return obj;
				},
				/**
				 * Trims the given string or array of strings
				 * @param {Array}|{String} str
				 * @returns {Array}|{String}
				 */
				trim: function (str) {
					if (__.isArray(str)) {
						var _this = this, arr = [];
						__.forEach(str, function (i, v) {
							arr.push(_this.trim(v));
						});
						return arr;
					}
					else if (__.isString(str))
						return str.trim();
				},
				/**
				 * Splits the str into an array by the given separator
				 * @param {string}|{array} str
				 * @param {string} separator
				 * @returns {Array}
				 */
				split: function (str, separator) {
					return this.__(str, separator, function (str, separator) {
						return str.split(separator);
					});
				},
				/**
				 * Joins the array into a string with the given separator
				 * @param {string}|{array} str
				 * @param {string} separator
				 * @returns {Array}
				 */
				join: function (str, separator) {
					if (!__.isArray(str))
						return str;
					return str.join(separator);
				},
				/**
				 * Performs a replace operation on the given string
				 * @param {string}|{array} str
				 * @param {string} options CSV with 2 values when the first is what to search for 
				 * and the second is the replacement
				 * @returns {String}|{array}
				 */
				replace: function (str, options) {
					return this.__(str, options, function (str, search, replace) {
						return str.replace(search, replace);
					});
				},
				/**
				 * Helper function to check array or str and call function only on str
				 * @param {string}|{array} str
				 * @param {string} options
				 * @param {function} func
				 * @returns {string}|{array}
				 */
				__: function (str, options, func) {
					return __.tryCatch(function () {
						if (__.isArray(str)) {
							var arr = [], _this = this;
							__.forEach(str, function (i, v) {
								arr.push(_this.__(v, options, func));
							});
							return arr;
						}
						else if (__.isString(str)) {
							options = this.__opts(options);
							options.unshift(str);
							return func.apply(this, options);
						}
					}.bind(this));
				},
				__opts: function (options) {
					options = options.replace(/\\,/g, '__fcomma__').split(',');
					__.forEach(options, function (i, v) {
						options[i] = v.replace(/__fcomma__/g, ',');
					});
					return options;
				}
			}),
			Model = function (attributes, props) {
				function toURL(attributes, _key) {
					var url = '';
					__.forEach(attributes, function (key, value) {
						if (_key)
							key = __.isString(key) ? _key + '[' + key + ']' : _key + '[]';
						if (url)
							url += '&';
						if (__.isObject(value, true)) {
							url += toURL(value, key);
						}
						else {
							url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
						}
					});
					return url;
				}
				var _Model = Object.create({
					name: props && props.name ? props.name : null,
					app: props && props.app ? props.app : null,
					uid: props && props.uid ? props.uid : 'id',
					url: props && props.url ? props.url : null,
					collection: props && props.collection ? props.collection : null,
					method: props && props.method ? props.method : null,
					attributes: __.isObject(attributes) ? attributes : {},
					init: function (attr) {
						this['get' + Filters.snakeToCamel(attr, true)] = function () {
							return this.attributes[attr];
						};
						this['set' + Filters.snakeToCamel(attr, true)] = function (val) {
							this.attributes[attr] = val;
							return this;
						};
					},
					/**
					 * Converts the model to a url string
					 * @returns {String}
					 */
					toURL: function () {
						return toURL(this.attributes);
					},
					/**
					 * Persists the model. If not exists, it is created.
					 * @param boolean cacheOnly
					 * @param function success
					 * @param function error
					 * @param function complete
					 * @returns boolean
					 */
					save: function (cacheOnly, success, error, complete) {
						var _this = this, method = _this.attributes.id ? 'PUT' : 'POST';
						if (!_this.app) {
							console.error('Invalid model object');
							return false;
						}
						else if (!_this.name) {
							_this.app.error('Cannot delete model that has no name.');
							return false;
						}

						if (_this.method)
							method = _this.method;
						if (cacheOnly)
							/* save model to collection */
							internal.modelToStore.call(this.app, this.attributes, this.name, this.uid);
						else if (_this.url) {
							_this.app.__.ajax({
								type: method,
								url: _this.app.config.baseURL + _this.url, data: this.toURL(),
								success: function (data) {
									var model = _this.app.config.dataKey ?
											data[_this.app.config.dataKey] : data;
									if (model) {
										/* save model to collection */
										internal.modelToStore.call(_this.app, model, _this.name,
												_this.uid);
										var _action = _this.attributes.id ? 'updated' : 'created', action = _this.app.store(_action) || {}; 		 							/* saved existing model */
										if (_this.attributes.id) {
											if (!action[_this.name])
												action[_this.name] = {};
											action[_this.name][model[_this.uid]] = model;
											_this.app.store(_action, action);
											/* update model's collection */
											if (_this.collection)
												_this.collection.models[_this.attributes.id] = model;
										}
										/* saved new model */
										else {
											/* update the url */
											_this.url += model[_this.uid];
											if (!action[_this.name])
												action[_this.name] = [];
											/* Remove model uid if exists to avoid duplicates */
											action[_this.name] = _this.app.__.arrayRemoveValue(action[_this.name],
													model[_this.uid], true);
											action[_this.name].push(model[_this.uid]);
											_this.app.store(_action, action);
										}
										_this.attributes = model; 										/* update current page */
										internal.updatePage.call(_this.app);
										if (_this.collection) {
											_this.collection.models[model[_this.uid]] = model;
											_this.collection.length++;
										}
									}
									_this.app.__.callable(success).call(this, data);
								},
								error: function (e) {
									_this.app.__.callable(error).call(this, e);
								},
								complete: function (e) {
									_this.app.__.callable(complete).call(this, e);
								}
							});
							return true;
						}
						else {
							_this.app.error('Cannot save model to server: No URL supplied.');
						}
						return false;
					},
					/**
					 * Removes the model
					 * @param boolean cacheOnly
					 * @param function success
					 * @param function error
					 * @param function complete
					 * @returns boolean
					 */
					remove: function (cacheOnly, success, error, complete) {
						var _this = this;
						if (!_this.app) {
							console.error('Invalid model object');
							return false;
						}
						else if (!_this.name) {
							_this.app.error('Cannot delete model that has no name.');
							return false;
						}

						if (cacheOnly)
							internal.removeModelFromStore.call(this.app, this.getId(), this.name);
						else if (_this.url) {
							_this.app.__.ajax({
								type: 'delete',
								url: _this.app.config.baseURL + _this.url, success: function (data) {
									var model = _this.app.config.dataKey ?
											data[_this.app.config.dataKey] : data;
									if (model) {
										_this.attributes = model;
										internal.removeModelFromStore.call(_this.app, model[_this.uid],
												_this.name);
										var __model = _this.app.store('deleted') || {};
										if (!__model[_this.name])
											__model[_this.name] = [];
										/* Indicate model as deleted */
										__model[_this.name] = _this.app.__.arrayRemoveValue(__model[_this.name],
												model[_this.uid], true);
										__model[_this.name].push(model[_this.uid]);
										_this.app.store('deleted', __model);
										if (_this.collection) {
											delete _this.collection.models[model[_this.uid]];
											_this.collection.length--;
										}
										/* update current page */
										internal.updatePage.call(_this.app);
									}
									_this.app.__.callable(success).call(this, data);
								},
								error: function (e) {
									_this.app.__.callable(error).call(this, e);
								},
								complete: function (e) {
									_this.app.__.callable(complete).call(this, e);
								}
							});
						}
						else {
							_this.app.error('Cannot remove model from server: No URL supplied.');
							return false;
						}
						return true;
					}
				});
				if (__.isObject(attributes)) {
					__.forEach(attributes, function (key) {
						_Model.init(key);
					});
				}
				return _Model;
			},
			Collection = function (models, props) {
				var _Collection = Object.create({
					name: props && props.name ? props.name : null,
					app: props && props.app ? props.app : null,
					uid: props && props.uid ? props.uid : 'id',
					url: props && props.url ? props.url : null,
					current_index: -1,
					models: __.isObject(models) ? models : {},
					/**
					 * Fetch the model at the index location
					 * @param {integer} index
					 * @returns {Model}
					 */
					get: function (index) {
						var key = Object.keys(this.models)[index];
						if (key)
							this.__proto__.current_index = index;
						return this.model(key);
					},
					/**
					 * Fetches the first model in the collection
					 * @returns {Model}
					 */
					first: function () {
						return this.get(0);
					},
					/**
					 * Fetches the last model in the collection
					 * @returns {Model}
					 */
					last: function () {
						return this.get(this.length - 1);
					},
					/**
					 * Fetches the current model
					 * @returns {Model}
					 */
					current: function () {
						return this.get(this.__proto__.current_index || 0);
					},
					/**
					 * Fetchs the next model
					 * @returns {Model}
					 */
					next: function () {
						return this.get(this.__proto__.current_index + 1);
					},
					/**
					 * Rewinds the collection back to the start
					 * @returns {Collection}
					 */
					rewind: function () {
						this.__proto__.current_index = -1;
						return this;
					},
					/**
					 * Checks whether there's a model after the current one
					 * @returns {Boolean}
					 */
					hasNext: function () {
						var current_index = this.__proto__.current_index,
								model = this.next();
						this.__proto__.current_index = current_index;
						return model !== null;
					},
					/**
					 * Fetches a model from the collection
					 * @param {integer}|{string} model_id
					 * @returns {Model}
					 */
					model: function (model_id) {
						var _this = this;
						return model_id && this.models[model_id] ?
								new Model(this.models[model_id], {
									name: _this.name,
									app: _this.app,
									uid: _this.uid,
									url: _this.url + model_id,
									collection: this
								}) : null;
					},
					/**
					 * Adds a model to the collection
					 * @param integer|string index
					 * @param boolean cacheOnly
					 * @param function success
					 * @param function error
					 * @param function complete
					 * @returns boolean
					 */
					add: function (attributes, cacheOnly, success, error, complete) {
						var model = new Model(attributes, {
							name: this.name,
							app: this.app,
							uid: this.uid,
							url: this.url,
							collection: this
						});
						return model.save(cacheOnly, success, error, complete);
					},
					/**
					 * Removes the model
					 * @param {integer}|{string} model_id
					 * @param boolean cacheOnly
					 * @param function success
					 * @param function error
					 * @param function complete
					 * @returns boolean
					 */
					remove: function (model_id, cacheOnly, success, error, complete) {
						/* remove all */
						if (model_id === undefined) {
							if (cacheOnly) {
								this.app.store(this.name, null);
								this.models = {};
								this.length = 0;
							}
							else {
								var _this = this;
								this.app.__.ajax({
									url: this.app.config.baseURL + this.url,
									type: 'delete',
									success: function (data) {
										_this.app.store(_this.name, null);
										_this.models = {};
										_this.length = 0;
										_this.app.__.callable(success).call(_this, data);
									},
									error: function (e) {
										_this.app.__.callable(error).call(_this, e);
									},
									complete: function (e) {
										_this.app.__.callable(complete).call(_this, e);
									}
								});
							}
							return true;
						}
						/* remove one */
						var model = this.model(model_id);
						if (!model)
							return false;
						model.remove(cacheOnly, success, error, complete);
						delete this.models[model_id];
						this.length--;
						return true;
					}
				});
				_Collection.length = props && props.length ? props.length : 0;
				return _Collection;
			};
	_.prototype = __.__proto__;
	ThisApp = function (config) {
		if (!(this instanceof ThisApp))
			return new ThisApp(config);
		this.version = '1.0';
		if (config && __.isObject(config)) {
			this.config = this.__.extend(this.config, config);
			if (!_(container, this.config.debug).length) {
				this.error('ThisApp container not found');
			}
		}
		else {
			this.debug(true);
			this.error('ThisApp must be constructed with a configuration object with at least'
					+ ' the target container\'s selector');
		}
	};
	/**
	 * Transitions affect how old pages are exited and new pages are entered
	 */
	ThisApp.Transitions = {
		/**
		 * Adds a transition type if it doesn't exist already
		 * 
		 * @param string name Identifier to the transition. This is also what developers would
		 * supply in the configuration or with method setTransition().
		 * @param function func The function to call when transiting between pages. The old page
		 *  and the new page objects are the first parameters. The options object is the third
		 * and last parameter.
		 * The function should return the milliseconds before the oldPage is removed totally from
		 * the page. This is particularly useful for animated transitions which might take a few
		 * seconds to execute.
		 * @returns {ThisApp.Transitions}
		 */
		add: function (name, func) {
			if (name && func && !Transitions[name]) {
				Transitions[name] = func;
			}
			return this;
		},
		/**
		 * Overwrites a transition type if it already exists and adds it otherwise
		 * 
		 * @param string name Identifier to the transition. This is also what developers would
		 * supply in the configuration or with method setTransition().
		 * @param function func The function to call when transiting between pages. The old page
		 *  and the new page objects are the first parameters. The options object is the third
		 * and last parameter.
		 * The function should return the milliseconds before the oldPage is removed totally from
		 * the page. This is particularly useful for animated transitions which might take a few
		 * seconds to execute.
		 * @returns {ThisApp.Transitions}
		 */
		overwrite: function (name, func) {
			if (name && func) {
				Transitions[name] = func;
			}
			return this;
		},
		/**
		 * Checks if a transition exists with the given name
		 * 
		 * @param string name
		 * @returns boolean
		 */
		exists: function (name) {
			return Transitions[name] !== undefined;
		}
	};
	/**
	 * Filters are applied to variables before rendering
	 */
	ThisApp.Filters = {
		/**
		 * Adds a filter if it doesn't exist already
		 * 
		 * @param string name Identifier to the filter. This is also what developers would pipe
		 * with desired variables.
		 * @param function func The function to call. The first parameter is the value that needs
		 * filtering. The second parameter is the options string for the filter.
		 * The function should return the value after being worked on by the function
		 * @returns {ThisApp.Filters}
		 */
		add: function (name, func) {
			if (name && func && !Filters[name]) {
				Filters[name] = func;
			}
			return this;
		},
		/**
		 * Overwrites a filter if it already exist or adds it otherwise
		 * 
		 * @param string name Identifier to the filter. This is also what developers would pipe
		 * with desired variables.
		 * @param function func The function to call. The first parameter is the value that needs
		 * filtering. The second parameter is the options string for the filter.
		 * The function should return the value after being worked on by the function
		 * @returns {ThisApp.Filters}
		 */
		overwrite: function (name, func) {
			if (name && func) {
				Filters[name] = func;
			}
			return this;
		},
		/**
		 * Checks if a filter exists with the given name
		 * 
		 * @param string name
		 * @returns boolean
		 */
		exists: function (name) {
			return Transitions[name] !== undefined;
		}
	};
	ThisApp.prototype = {
		/**
		 * App events
		 */
		events: [],
		/**
		 * App configuration object
		 */
		config: {
			/**
			 * ID of the page to start the app with
			 */
			startWith: null,
			/** 			 * The base url upon which other urls are built
			 */
			baseURL: location.href,
			/**
			 * Indicates whether the app should run in debug mode or not.
			 */
			debug: false,
			/**
			 * The key in each ajax response which holds the actual object or array of objects
			 */
			dataKey: 'data',
			/**
			 * The selector that holds the title of each page
			 */
			titleContainer: null,
			/** 			 
			 * Indicates whether to cache request response data
			 */
			cacheData: true,
			/** 			 * The transition effect to use between pages
			 */
			transition: 'show',
			/**
			 * The options for the transition effect
			 */
			transitionOptions: {},
			/**
			 * Indicates whether to load 
			 */
			loadFromState: true,
			/** 			 * The default layout for the application
			 */
			layout: null,
			/**
			 * Paths to pages, layouts and components
			 */
			paths: {
				pages: 'pages',
				layouts: 'layouts',
				components: 'components',
				ext: '.html'
			}
		},
		/**
		 * Number of components still loading
		 */
		components: 0,
		/**
		 * Number of collections still loading
		 */
		collections: 0,
		/**
		 * Number of models still loading
		 */
		models: 0,
		__: __, /**
		 * Captures the object for manipulation
		 * @param mixed selector
		 * @param boolean debug
		 * @returns _
		 */
		_: function (selector, debug) {
			return _(selector, debug || this.config.debug);
		},
		/**
		 * Set the base url for the app
		 * @param string url
		 * @returns ThisApp
		 */
		setBaseUrl: function (url) {
			this.config.baseURL = url;
			return this;
		},
		/**
		 * Indicates whether to cache request response data
		 * @param boolean status
		 * @returns ThisApp
		 */
		cacheData: function (status) {
			if (!this.running)
				this.config.cacheData = status;
			return this;
		},
		/**
		 * Sets the app debug mode
		 * @param boolean debug Default is TRUE
		 * @returns ThisApp
		 */
		debug: function (debug) {
			if (!this.running) {
				this.config.debug = debug !== false ? true : false;
				this.__.__proto__.debug = this.config.debug;
			}
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
		 * Sets the container that would always hold the page title
		 * @param string container
		 * @returns ThisApp
		 */
		setTitleContainer: function (container) {
			this.config.titleContainer = this.running ?
					this._(container) : container;
			return this;
		},
		/**
		 * Set the transition to use between pages
		 * @param string|func transition To see string options, call method getAvailableTransitions.
		 * If function, the function is passed two parameters - the old page and the new page
		 * @param object options The options for the transition
		 * @returns ThisApp
		 */
		setTransition: function (transition, options) {
			this.config.transition = transition;
			this.config.transitionOptions = options;
			return this;
		},
		/**
		 * Gets a list of available transitions
		 * @returns array
		 */
		getAvailableTransitions: function () {
			return Object.keys(Transitions);
		},
		/**
		 * Gets a list of available filters
		 * @returns array
		 */
		getAvailableFilters: function () {
			return Object.keys(filters);
		},
		/**
		 * Sets up the app header
		 * @param string component_id
		 * @returns ThisApp
		 */
		header: function (component_id) {
			this.header = this._('component[this-id="' + component_id + '"], ' + '[this-type="components"] [this-id="' + component_id + '"]');
			return this;
		},
		/**
		 * Sets up the app footer
		 * @param string component_id
		 * @returns ThisApp
		 */
		footer: function (component_id) {
			this.footer = this._('component[this-id="' + component_id + '"],'
					+ '[this-type="components"] [this-id="' + component_id + '"]');
			return this;
		},
		/**
		 * Indicates whether the pages should be loaded from state if available. Default is TRUE
		 * @param boolean load
		 * @returns ThisApp
		 */
		loadFromState: function (load) {
			this.config.loadFromState = load !== undefined ? load : true;
			return this;
		},
		/**
		 * Sets the default layout for the application
		 * @param string layout ID of the layout container
		 * @returns ThisApp
		 */
		setLayout: function (layout) {
			this.config.layout = layout;
			return this;
		},
		/**
		 * Sets the extension for pages', layouts' and components' paths
		 * @param {string} ext
		 * @returns {ThisApp}
		 */
		setPathsExtension: function (ext) {
			if (!this.config.paths)
				this.config.paths = {};
			if (!ext.startsWith('.'))
				ext = '.' + ext;
			this.config.paths.ext = ext;
			return this;
		},
		/**
		 * Sets the path to pages' location
		 * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
		 * the path is assumed to follow the set base url.
		 * @returns {ThisApp}
		 */
		setPagesPath: function (path) {
			if (!this.config.paths)
				this.config.paths = {};
			this.__proto__.config.paths.pages = path;
			return this;
		},
		/**
		 * Sets the path to layouts' location
		 * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
		 * the path is assumed to follow the set base url.
		 * @returns {ThisApp}
		 */
		setLayoutsPath: function (path) {
			if (!this.config.paths)
				this.config.paths = {};
			this.__proto__.config.paths.layouts = path;
			return this;
		},
		/**
		 * Sets the path to components' location
		 * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
		 * the path is assumed to follow the set base url.
		 * @returns {ThisApp}
		 */
		setComponentsPath: function (path) {
			if (!this.config.paths)
				this.config.paths = {};
			this.__proto__.config.paths.components = path;
			return this;
		},
		/**
		 * Initializes the app
		 * @param string page The ID of the page
		 * @returns app
		 */
		start: function (page) {
			if (this.running)
				return this;
			if (page)
				this.config.startWith = page;
			this.container = this._(this.config.container).html('');
			this.firstPage = true;
			internal.setup.call(this);
			var target_page = internal.pageIDFromLink.call(this, location.hash);
			if (this.config.loadFromState && history.state && target_page === this.store('last_page')) {
				internal.restoreState.call(this, history.state);
			}
			else {
				this.loadPage(target_page || this.config.startWith ||
						this._('page[this-default-page]:not([this-current]):not([this-dead]), [this-type="pages"] [this-default-page]')
						.attr('this-id'));
			}
			return this;
		},
		/**
		 * Sets the function to call before every page is loaded.
		 * If the function returns false, the action is canceled and page.load.canceled event is
		 * triggered.
		 * @param {function} func
		 * @returns {ThisApp}
		 */
		beforePageLoad: function (func) {
			this.beforePage = func;
			return this;
		},
		/**
		 * Sets the function to call before any model is deleted.
		 * If the function returns false, the action is canceled and delete.cancled event is triggered
		 * @param {function} func
		 * @returns {ThisApp}
		 */
		beforeDeleteModel: function (func) {
			this.beforeDelete = func;
			return this;
		},
		/**
		 * Loads the given page
		 * @param {string} page ID of the page
		 * @param {boolean} replaceInState Indicates whether to replace the current page's state with
		 * the new page state instead of creating a different state for it.
		 * @returns {ThisApp}
		 */
		loadPage: function (page, replaceInState) {
			if (!page)
				return;
			this.oldPage = _();
			var newPage = this._('page[this-id="' + page
					+ '"]:not([this-current]):not([this-dead]),'
					+ '[this-type="pages"]>[this-id="' + page + '"]');
			if (newPage.length > 1) {
				this.error('Target page matches multiple pages!');
				return this;
			}
			if (!newPage.length) {
				if (this.config.paths && this.config.paths.pages) {
					var _this = this;
					internal.fullyFromURL.call(this, 'page', page, function (elem) {
						internal.pageFound.call(_this, elem, replaceInState);
					}, function () {
						internal.notAPage.call(_this, page);
					});
					return this;
				}
				internal.notAPage.call(this, page);
				return this;
			}
			internal.pageFound.call(this, newPage, replaceInState);
			return this;
		},
		/**
		 * Sets up the function to call when a page is not found
		 * @param {function}|{string} callback or id of page to load
		 * @returns {ThisApp}
		 */
		pageNotFound: function (callback) {
			this.notFound = callback;
			return this;
		},
		/**
		 * Returns the app to the home page
		 * @returns ThisApp
		 */
		home: function () {
			this.loadPage(this.config.startWith ||
					this._('page[this-default-page]:not([this-current]):not([this-dead]),[this-type="pages"] [this-default-page]')
					.attr('this-id'));
			return this;
		},
		/**
		 * Takes the app back one step in history
		 * @returns ThisApp
		 */
		back: function (e) {
			if (e && this.__.isObject(e) && e['preventDefault'])
				e.preventDefault();
			if (history.length <= 2) {
				this.home();
				return;
			}
			history.back();
			return this;
		},
		/**
		 * Takes the app forward one step in history
		 * @returns ThisApp
		 */
		forward: function (e) {
			if (e && this.__.isObject(e) && e['preventDefault'])
				e.preventDefault();
			history.forward();
			return this;
		},
		/**
		 * A shortcut to method on()
		 * @param string event
		 * @param string target ID of the page to target. It could also be in forms TYPE or TYPE#ID e.g
		 * collection#users. This means the target is a collection of id `users`. Target all collection
		 * by specifying only collection
		 * Multiple elements may be targeted by separating their selectors by a comma.
		 * @param function callback
		 * @returns ThisApp
		 */
		when: function (event, target, callback) {
			var selector = "", targets = target.split(',');
			if (selector)
				selector += ', ';
			this.__.forEach(targets, function (i, v) {
				switch (target) {
					case "page":
						selector += 'page,[this-type="page"]';
						break;
					case "collection":
						selector += 'collection,[this-type="collection"]';
						break;
					case "model":
						selector += 'model,[this-type="model"]';
						break;
					case "component":
						selector += 'component,[this-type="component"]';
						break;
					default:
						var exp = v.split('#');
						if (exp.length > 1 && exp[0]) {
							selector += '[this-type="' + exp[0] + '"][this-id="' + exp[1] + '"]';
						}
						else {
							selector += '[this-id="' + v + '"]';
						}
				}
			});
			this.events.push({
				event: event, selector: selector,
				callback: callback
			});
			return this;
		},
		/**
		 * Adds general event listeners
		 * @param string event
		 * @param string selector Multiple elements may be targeted by separating their selectors
		 * by a comma.
		 * @param function callback
		 * @returns ThisApp
		 */
		on: function (event, selector, callback) {
			this.events.push({
				event: event, selector: selector,
				callback: callback
			});
			return this;
		},
		/**
		 * What to do when the app encounters an error
		 * @param function callback
		 * @returns ThisApp
		 */
		onError: function (callback) {
			this.error = this.__.callable(callback, true) || this.error;
			return this;
		},
		/**
		 * Sends an ajax request based on the parameter of the page.
		 * @param string|_ selector
		 * @param function success The callback to call on success
		 * @param function error The callback to call on error
		 * @param object|string The data to send with the request
		 * @param string responseType The type of response to expect. JSON, TEXT, XML, BLOB, DOCUMENT
		 * @returns XMLHttpRequest
		 */
		request: function (url, success, error, data, responseType) {
			var elem, _this = this;
			if (this.__.isObject(url)) {
				elem = this._(url);
				if (!elem.attr('this-url')) {
					this.error('Request object must have a `this-url` attribute.');
					return;
				}
				elem.trigger('loading.url');
				url = elem.attr('this-url');
			}
			if (!url.startsWith('./') && !url.startsWith('../') && url.indexOf('://') === -1)
				url = this.config.baseURL + url;
			return this.__.ajax({
				type: 'get',
				url: url,
				dataType: responseType || 'json',
				data: data || {},
				success: function (data) {
					_this.__.callable(success).call(elem || this, data);
					if (elem)
						elem.trigger('load.content.success');
				},
				error: function () {
					_this.__.callable(error).call(elem || this, data);
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
		 * The function called when an error occurs
		 * @param string msg
		 * @returns ThisApp
		 */
		error: function (msg) {
			if (!this.config.debug)
				return this;
			console.error(msg);
		},
		/**
		 * Stores or retrieves stored data
		 * @param string key
		 * @param mixed value
		 * @returns Array|Object|ThisApp
		 */
		store: function (key, value) {
			if (!key)
				return localStorage;
			if (!value) {
				if (value === null) {
					localStorage.removeItem(key);
					return this;
				}
				var data = localStorage.getItem(key),
						_data = this.__.toObject(data);
				return _data || data;
			}
			if (this.__.isObject(value, true))
				value = this.__.toJSON(value);
			if (value)
				localStorage.setItem(key, value);
			return this;
		},
		/**
		 * Calls the given function in a try...catch block and outputs any errors to the console if 
		 * debug mode is enabled.
		 * @param function callback
		 * @param array args Array of parameters to pass into the callback function
		 * @returns mixed
		 */
		tryCatch: function (callback, args) {
			return this.__.tryCatch((this.__.callable(callback)).bind(this), args);
		},
		/**
		 * Reloads the current page
		 * @returns ThisApp
		 */
		reload: function () {
			location.reload();
			return this;
		},
		/**
		 * Fetches a collection of model
		 * @param {string} model_name
		 * @returns {Collection}
		 */
		collection: function (model_name) {
			var collection = internal.cache.call(this, 'model', model_name);
			return new Collection(collection.data, {
				name: model_name,
				app: this,
				uid: collection.uid,
				url: collection.url,
				length: collection.length
			});
		}
	};
})();