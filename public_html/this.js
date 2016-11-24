/* global BreakException */
(function () {
    /**
     * Creates an AJAX connection
     * @param object config
     * @returns ajax object
     */
    var ajax = function (config, __) {
        var __this = __ || this;
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
                } else {
                    __this.callable(config.error).call(httpRequest);
                }
                __this.callable(config.complete).call(httpRequest);
            }
        };
        if (config.clearCache) {
            config.url += ((/\?/).test(config.url) ? "&" : "?") + (new Date()).getTime();
        }
        httpRequest.open(config.type.toUpperCase(), config.url, config.async);
        httpRequest.responseType = config.dataType;
        httpRequest.withCredentials = config.crossDomain;
        httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        httpRequest.setRequestHeader('Requested-With', 'XMLHttpRequest');
        if (config.data && __.isString(config.url)) {
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        __this.tryCatch(function () {
            httpRequest.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    __this.callable(config.progress).call(httpRequest, e, e.loaded, e.total);
                }
            };
        });
        httpRequest.send(config.data);
        return httpRequest;
    },
            __ = Object.create({
                items: [],
                debug: true,
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
                    var index = array.indexOf(item);
                    if (index < 0) {
                        index = array.indexOf(parseInt(item));
                    }
                    if (!all) {
                        return index > -1 ? this.arrayRemove(array, index) : [];
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
                },
                /**
                 * Removes the item at the given index from the given array
                 * @param array array
                 * @param integer index
                 * @returns mixed The removed item
                 */
                arrayRemove: function (array, index) {
                    return array.splice(index, 1);
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
                        return attr ? this.items[0].getAttribute(attr) : Array.from(this.items[0].attributes);
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
                    return ajax(config, this);
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
                        this.addEventListener(event, function (e) {
                            if (selector && e.target && !e.target.matches(selector)) {
                                return;
                            }
                            _this.callable(callback).apply(e.target, Array.from(arguments));
                        }, false);
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
                    return _([], this.debug);
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
                            doc.innerHTML = content.outerHtml();
                        }
                        else if (_this.isObject(this.content) && this.content['outerHTML']) {
                            doc.innerHTML = this.content.outerHTML;
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
                            doc.innerHTML = content.outerHtml();
                        }
                        else if (_this.isObject(this.content) && this.content['outerHTML']) {
                            doc.innerHTML = this.content.outerHTML;
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
                            Array.from(this.querySelectorAll(selector))
                                    .map(function (v) {
                                        this.push(v);
                                    }, result);
                        }
                        else
                            result = Array.from(this.querySelectorAll(selector));
                    });
                    return _(result, this.debug);
                    return _([], this.debug);
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
                    return _(this.items[index], this.debug);
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
                    var exp = selector.split('#'),
                            is = true,
                            _this = this,
                            classes = Array.from(this.items[0].attributes).join('.');
                    this.forEach(exp, function (i, v) {
                        var spl = v.split('.');
                        _this.forEach(spl, function (j, w) {
                            if (!j) {
                                if (!i && w) { // selector has tag name
                                    is = _this.items[0].tagName.toLowerCase() === w.toLowerCase();
                                    return is;
                                }
                                else if (i && w) { // selector has id
                                    is = _this.items[0].id === w;
                                    return is;
                                }
                            }
                            else { // check classes
                                is = classes.indexOf('.' + w) !== -1;
                                return is;
                            }
                        });
                        return is;
                    });
                    return is;
                },
                /**
                 * Sets the value of a form element
                 * @param mixed value
                 * @returns __|Array
                 */
                val: function (value) {
                    var vals = [];
                    this.each(function () {
                        if (value) {
                            this.value = value;
                            return;
                        }
                        vals.push(this.value);
                    });
                    return value ? this : vals;
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
                    return this.each(function () {
                        this.classList.add(className);
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
                    var has = true;
                    this.each(function () {
                        if (!this.classList.length || Array.from(this.classList).indexOf(className) < 0) {
                            has = false;
                            return false;
                        }
                    });
                    return has;
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
                tryCatch: function (callback, args) {
                    try {
                        return this.callable(callback).apply(this, args || []);
                    }
                    catch (e) {
                        this.error(e.message);
                    }
                }
            }),
            _ = function (selector, debug) {
                if (selector instanceof _) {
                    return selector;
                }
                else if (!(this instanceof _)) {
                    return new _(selector, debug);
                }
                else if (!selector) {
                    this.items = [];
                }
                else if (this.isObject(selector)) {
                    this.items = selector instanceof HTMLCollection ? Array.from(selector) : [selector];
                }
                else if (this.isArray(selector)) {
                    this.items = selector;
                }
                else {
                    var obj = __.createElement(selector);
                    return obj.length ? obj : _(document, debug).find(selector);
                }
                this.debug = debug || false;
                this.length = this.items.length;
                return this;
            },
            deepVariableData = function (variable, data) {
                var value = data, vars = variable.split('.');
                __.forEach(vars, function (i, v) {
                    value = value[v];
                });
                return value || '';
            },
            internals = {
            },
            transition = {
                show: function (pageOff, pageOn) {
                    pageOff.remove();
                    pageOn.show();
                    return this;
                }
            };
    filters = {
        // string filters
        /**
         * Changes the string to lower case
         * @param string str
         * @returns string
         */
        lcase: function (str) {
            if (typeof str !== 'string')
                return str;
            return str.toLowerCase();
        },
        /**
         * Changes the string to upper case
         * @param string str
         * @returns string
         */
        ucase: function (str) {
            if (typeof str !== 'string')
                return str;
            return str.toUpperCase();
        },
        /**
         * Capitalizes the first letter of each word
         * @param string str
         * @param string options Only option is - which indicates that first letter after hyphens should
         * be changed to upper case too
         * @returns string
         */
        ucwords: function (str, options) {
            if (typeof str !== 'string')
                return str;
            return str.replace(options === 'hyphens' ? /[^-'\s]+/g : /[^\s]+/g, function (word) {
                return word.replace(/^./, function (first) {
                    return first.toUpperCase();
                });
            });
        },
        // mixed data type filters
        /**
         * Checks if the given value contains the given options
         * @param mixed val
         * @param string options This may be just the value to check for, or if an object, the index
         * to check. Indexes may be chained with dots (.) if children are objects.
         * @returns string|object|null
         */
        contains: function (val, options) {
            if (__.isObject(val, true)) {
                options = options.split(',');
                return this.filter(val, function (v) {
                    var search = options[0];
                    if (options.length > 1) {
                        v = deepVariableData(options[0], v);
                        search = options[1];
                    }
                    return v && (__.isString(v) || __.isArray(v)) && v.indexOf(search) !== -1;
                });
            }
            else if (__.isString(val)) {
                return val.indexOf(options) !== -1 ? val : null;
            }
            return null;
        },
        // array|object filters
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
        }
    };
    _.prototype = __;
    ThisApp = function (container, debug) {
        if (!(this instanceof ThisApp))
            return new ThisApp(container);
        this.version = '1.0';
        this.debug(debug);
        this._container = container;
        if (!_(container, this.config.debug).length) {
            this.error('App container not found');
        }
        return this;
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
            /**
             * The base url upon which other urls are built
             */
            baseUrl: location.href,
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
            /**
             * The transition effect to use between pages
             */
            transition: 'show',
            /**
             * The options for the transition effect
             */
            transitionOptions: {}
        },
        /**
         * Number of collections still loading
         */
        collections: 0,
        /**
         * Number of models still loading
         */
        models: 0,
        __: __,
        /**
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
            this.config.baseUrl = url;
            return this;
        },
        /**
         * Indicates the page to start the app with
         * @param string page ID of the page
         * @returns ThisApp
         */
        startWith: function (page) {
            if (!this.running)
                this.config.startWith = page;
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
                this.__.debug = this.config.debug;
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
            return Object.keys(transition);
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
            this.header = this._('component[this-id="' + component_id + '"], '
                    + '[this-type="components"] [this-id="' + component_id + '"]');
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
         * The function to call before every delete request is sent
         * @param function callback
         * @returns ThisApp
         */
        beforeDelete: function (callback) {
            this.before_delete = this.__.callable(callback);
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
            if (this.running)
                return this;
            if (config)
                this.config = this.__.extend(this.config, config);
            this.container = this._(this._container);
            delete this._container;
            this.setup();
            var target_page = location.hash.substr(1);
            if (history.state && target_page === this.store('last_page')) {
                this.restoreState(history.state);
            }
            else {
                this.loadPage(target_page || this.config.startWith ||
                        this._('page[this-default-page]:not(.current):not(.dead), [this-type="pages"] [this-default-page]')
                        .attr('this-id'));
            }
            return this;
        },
        /**
         * Setups the app events
         * @returns ThisApp
         */
        setup: function () {
            this.tryCatch(function () {
                this.__.debug = this.config.debug;
                this._('page,[this-type="page"],[this-type="pages"],[this-type="pages"]>*,'
                        + '[this-type="components"],[this-type="components"] [this-type="model"]'
                        + ',[this-type="components"] [this-type="collection"],collection,model')
                        .hide();
                if (this.config.titleContainer)
                    this.config.titleContainer = this._(this.config.titleContainer, this.config.debug);
                var _this = this;
                this.container
                        .on('click', '[this-go-home]', function (e) {
                            _this.home();
                            e.stop = true;
                        })
                        // go back event
                        .on('click', '[this-go-back]', function (e) {
                            _this.back(e);
                            e.stop = true;
                        })
                        // go forward event
                        .on('click', '[this-go-forward]', function (e) {
                            _this.forward(e);
                            e.stop = true;
                        })
                        /*
                         * READ event
                         * 
                         * Target must have attributes `this-read` and `this-goto`. Attribute 
                         * `this-read` may have the url of the model as its value.
                         * Optionally, target should also have attributes `this-model` and `this-model-id`.
                         * The are required if target isn't in a model container.
                         */
                        .on('click', '[this-read]', function (e) {
                            var __this = _this._(this),
                                    model = __this.closest('model,[this-type="model"]'),
                                    collection = __this.closest('collection,[this-type="collection"]'),
                                    model_name = __this.attr('this-model') || collection.attr('this-model'),
                                    model_id = __this.attr('this-model-id') || model.attr('this-mid'),
                                    url = __this.attr('this-read') || model.attr('this-url') || '#';
                            if (__this.attr('this-goto')) {
                                // new page template
                                var page_template = _this._('page[this-id="' + __this.attr('this-goto')
                                        + '"]:not(.current):not(.dead),[this-type="pages"] [this-id="'
                                        + __this.attr('this-goto') + '"]'),
                                        // the model container in the page template
                                        page_template_model = page_template.find('model[this-id="'
                                                + model_name + '"],[this-type="model"][this-id="'
                                                + model_name + '"]'),
                                        // the model container placeholder in the page template
                                        // needed if exist instead of page_template_model
                                        page_template_model_template = page_template
                                        .find('[this-component="' + model_name + '"]');
                                page_template.attr('this-tar', 'reading:true')
                                if (page_template_model.length)
                                    page_template_model.attr('this-url', url).attr('this-mid', model_id);
                                else if (page_template_model_template.length)
                                    page_template_model_template.attr('this-tar', 'url:' + url
                                            + ';mid:' + model_id);
                            }
                            else if (model.length && model.hasClass('in-collection')) {
                                e.preventDefault();
                                model.attr('this-binded', true).siblings().removeAttr('this-binded');
                                var _model = _this.page.find('model[this-id="' + model_name
                                        + '"][this-bind],[this-type="model"][this-id="' + model_name
                                        + '"][this-bind]')
                                        .attr('this-url', url).attr('this-mid', model_id);
                                _this.loadModel(_model, true, true);
                            }
                        })
                        /*
                         * UPDATE event
                         * 
                         * Target must have attributes `this-update` and `this-goto`. `this-update`
                         * may have the url of the model as its value.
                         * 
                         * If target isn't in a model container or intends to update another model 
                         * other than it's container model, it must also have attributes `this-model`
                         * and `this-model-id`.
                         * If model is a part of a collection, target must also have attribute 
                         * `this-collection`.
                         * Target may have attribute `this-method` if to use other request method
                         * aside PUT, which is the default for updates.
                         */
                        .on('click', '[this-goto][this-update]', function () {
                            var __this = _this._(this),
                                    model = __this.closest('model,[this-type="model"]'),
                                    model_id = __this.attr('this-model-id') || model.attr('this-mid'),
                                    model_name = __this.attr('this-model') || model.attr('this-id'),
                                    collection = __this.attr('this-collection') ||
                                    model.attr('this-collection'),
                                    url = __this.attr('this-update') || model.attr('this-url') || '#',
                                    tar = 'do:update;model-id:' + model_id + ';action:' + url
                                    + ';model:' + model_name;
                            if (collection)
                                tar += ';collection:' + collection;
                            if (__this.attr('this-method'))
                                tar += ';method:' + __this.attr('this-method');
                            if (model.attr('this-uid'))
                                tar += ';model-uid:' + model.attr('this-uid');
                            var _target = _this._('page[this-id="' + __this.attr('this-goto')
                                    + '"]:not(.current):not(.dead),[this-type="pages"] [this-id="'
                                    + __this.attr('this-goto') + '"]');
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
                         * If CREATION must update model and/or collection, then attributes 
                         * `this-model` and/or `this-collection` must be provided unless the target
                         * form already has the required attributes.
                         */
                        .on('click', '[this-goto][this-create]', function () {
                            var __this = _this._(this),
                                    url = __this.attr('this-create') || '#',
                                    tar = 'do:create;action:' + url;
                            if (__this.attr('this-model'))
                                tar += ';model:' + __this.attr('this-model');
                            if (__this.attr('this-colleciton'))
                                tar += ';collection:' + __this.attr('this-collection');
                            if (__this.attr('this-model-uid'))
                                tar += ';model-uid:' + __this.attr('this-model-uid');
                            var _target = _this._('[this-id="' + __this.attr('this-goto') + '"]');
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
                         * If DELETE must update model and/or collection, then attributes 
                         * `this-model` and/or `this-collection` may be provided if target isn't
                         * in a model container or target page doesn't have these attributes.
                         */
                        .on('click', '[this-goto][this-delete]', function () {
                            var __this = _this._(this),
                                    model = __this.closest('model,[this-type="model"]'),
                                    url = __this.attr('this-delete') || model.attr('this-url') || '#',
                                    collection = __this.attr('this-collection') ||
                                    model.attr('this-collection') ||
                                    model.closest('collection,[this-type="collection"').attr('this-id'),
                                    model_name = __this.attr('this-model') || model.attr('this-id') ||
                                    __this.closest('collection,[this-type="collection"]').attr('this-model'),
                                    uid = model.attr('this-uid') || collection.attr('this-model-uid');
                            tar = 'do:delete;uri:' + url + ';uid:' + uid;
                            if (model)
                                tar += ';model:' + model_name;
                            if (collection)
                                tar += ';collection:' + collection;
                            _this._('[this-id="' + __this.attr('this-goto') + '"]')
                                    .attr('this-tar', tar);
                        })
                        /*
                         * Load page
                         * 
                         * Target must have attribute `this-goto`
                         * 
                         * Event leave.page is triggered
                         */
                        .on('click', '[this-goto]', function (e) {
                            e.preventDefault();
                            _this.page.trigger('leave.page');
                            var __this = _this._(this),
                                    page = _this._('page[this-id="' + __this.attr('this-goto')
                                            + '"]:not(.current):not(.dead),[this-type="pages"] [this-id="'
                                            + __this.attr('this-goto') + '"]'),
                                    tar = page.attr('this-tar') || '';
                            if (__this.attr('this-page-title'))
                                tar = tar ? tar + ';title:' + __this.attr('this-page-title') :
                                        'title:' + __this.attr('this-page-title');
                            if (__this.attr('this-ignore-cache'))
                                tar = tar ? tar + ';ignore-cache:' + __this.attr('this-ignore-cache')
                                        : 'ignore-cache:' + __this.attr('this-ignore-cache');
                            if (tar)
                                page.attr('this-tar', tar);
                            _this.loadPage(__this.attr('this-goto'));
                            e.stop = true;
                        })
                        /*
                         * DELETE event
                         * 
                         * This is where the actual DELETE request is sent.
                         * 
                         * Target must have attribute `this-delete` which may contain the url of the
                         * model.
                         * 
                         * If DELETE must update model and/or collection, then attributes 
                         * `this-model` and/or `this-collection` must be provided if target isn't
                         *  within a model or page loaded as a result of a previous delete click.
                         */
                        .on('click', '[this-delete]', function (e) {
                            if (e.stop)
                                return;
                            e.preventDefault();
                            var __this = _this._(this);
                            if (__this.attr('this-call-before') && false === _this.__
                                    .callable(__this.attr('this-call-before').call(__this)))
                                return;
                            __this.trigger('before.delete');
                            var model = __this.closest('model,[this-type="model"]'),
                                    _do = __this.closest('[this-do="delete"]'),
                                    model_id = __this.attr('this-model') || model.attr('this-id') ||
                                    _do.attr('this-model'),
                                    collection_id = __this.attr('this-collection') ||
                                    model.attr('this-collection') ||
                                    _do.attr('this-collection'),
                                    url = __this.attr('this-delete') || model.attr('this-url') ||
                                    _do.attr('this-uri'),
                                    uid = model.attr('this-uid') || _do.attr('this-uid') || 'id';
                            _this.__.ajax({
                                type: 'delete',
                                url: _this.config.baseUrl + url,
                                success: function (data) {
                                    var model = _this.config.dataKey ?
                                            data[_this.config.dataKey] : data;
                                    if (model) {
                                        if (collection_id) {
                                            _this.removeModelFromCollectionStore(model[uid], collection_id);
                                        }
                                        if (model_id) {
                                            var _model = _this.store('deleted') || {};
                                            if (!_model[model_id])
                                                _model[model_id] = [];
                                            // Remove model uid if exists to avoid duplicates
                                            _model[model_id] = _this.__
                                                    .arrayRemoveValue(_model[model_id], model[uid], true);
                                            _model[model_id].push(model[uid]);
                                            _this.store('deleted', _model);
                                        }
                                        if (_this.page.attr('this-do') === 'delete')
                                            _this.back();
                                        else
                                            _this.updatePage();
                                    }
                                    __this.trigger('delete.success', {
                                        response: this,
                                        responseData: data
                                    });
                                },
                                error: function () {
                                    __this.trigger('delete.error', {
                                        response: this
                                    });
                                },
                                complete: function () {
                                    __this.trigger('delete.complete', {
                                        response: this
                                    });
                                }
                            });
                        })
                        /*
                         * CREATE and UPDATE events
                         * Form submission
                         * 
                         */
                        .on('submit', 'form[this-do]', function (e) {
                            e.preventDefault();
                            var data = '',
                                    __this = _this._(this),
                                    creating = __this.attr('this-do') === 'create',
                                    method = creating ? 'post' : 'put';
                            if (!this.checkValidity()) {
                                __this.trigger('form.invalid.submission');
                                return;
                            }
                            __this.trigger('form.valid.submission');
                            _this.__.forEach(Array.from(this.elements), function () {
                                if (!this.name)
                                    return;
                                if (data)
                                    data += '&';
                                data += this.name + '=' + encodeURIComponent(this.value).replace(' ', '+');
                            });
                            _this.__.ajax({
                                type: __this.attr('this-method') || method,
                                url: _this.config.baseUrl + __this.attr('this-action'),
                                data: data,
                                success: function (data) {
                                    var model = _this.config.dataKey ? data[_this.config.dataKey] : data;
                                    if (model) {
                                        var _action = creating ? 'created' : 'updated',
                                                action = _this.store(_action) || {},
                                                collection_id = __this.attr('this-collection'),
                                                model_id = __this.attr('this-model'),
                                                uid = __this.attr('this-model-uid') || 'id';
                                        // save created or updated model to collection
                                        if (collection_id) {
                                            _this.saveModelToCollectionStore(model, collection_id, uid);
                                            if (creating) {
                                                if (!action[collection_id])
                                                    action[collection_id] = [];
                                                // Remove model uid if exists to avoid duplicates
                                                action[collection_id] = _this.__
                                                        .arrayRemoveValue(action[collection_id],
                                                                model[uid], true);
                                                action[collection_id].push(model[uid]);
                                                _this.store(_action, action);
                                            }
                                        }
                                        // save updated model
                                        if (model_id && !creating) {
                                            if (!action[model_id])
                                                action[model_id] = {};
                                            action[model_id][model[uid]] = model;
                                            _this.store(_action, action);
                                        }
                                        if (creating)
                                            _this.back();
                                    }
                                    __this.trigger('form.submission.success', {
                                        response: this,
                                        responseData: data
                                    });
                                },
                                error: function () {
                                    __this.trigger('form.submission.error', {
                                        response: this
                                    });
                                },
                                complete: function () {
                                    __this.trigger('form.submission.complete', {
                                        response: this
                                    });
                                }
                            });
                        });
                /*
                 * Back button event
                 */
                this._('[this-go-home]').on('click', function (e) {
                    _this.home();
                });
                this._('[this-go-back]').on('click', function (e) {
                    if (!e.stop)
                        _this.back(e);
                });
                /*
                 * Forward button event 
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
                        _this.restoreState(e.state);
                });
                /*
                 * Container events activation
                 */
                this.__.forEach(this.events, function () {
                    _this.container.on(this.event, this.selector, this.callback);
                });
            });
            this.running = true;
            return this;
        },
        /**
         * Loads the given page
         * @param string page ID of the page
         * @returns ThisApp
         */
        loadPage: function (page) {
            this.firstPage = !this.container.html();
            var oldPage;
            if (this.page) {
                oldPage = this.page.addClass('dead');
            }
            this.page = this._('page[this-id="' + page + '"]:not(.current):not(.dead),'
                    + '[this-type="pages"]>[this-id="' + page + '"]');
            if (!this.page) {
                this.container.trigger('page.not.found');
                return;
            }
            var _this = this;
            if (this.is('page', this.page)) {
                if (this.page.attr('this-tar')) {
                    var _page = this.doTar(this.page.clone());
                    this.page.removeAttr('this-tar');
                    this.page = _page;
                }
                this.page.trigger('page.before.load');
                this.page = this.container.append(this.page.clone().addClass('current'))
                        .find('page.current:not(.dead),[this-type="page"].current:not(.dead)');
                var transit = this.__.callable(this.config.transition, true),
                        wait;
                if (transit)
                    wait = transit.call(null, oldPage.removeClass('.current'), this.page,
                            this.config.transitionOptions);
                else if (this.__.isString(this.config.transition)) {
                    if (!transition[this.config.transition])
                        this.config.transition = 'show';
                    wait = transition[this.config.transition](oldPage.removeClass('.current'), this.page,
                            this.config.transitionOptions);
                }
                setTimeout(function () {
                    oldPage.remove();
                }, wait);
                if (this.config.titleContainer)
                    this.config.titleContainer.html(this.page.attr('this-title'));
                if (this.page.attr('this-url')) {
                    this.request(this.page, function (data) {
                        _this._(this).html(data);
                        _this.loadComponents()
                                .loadCollections()
                                .loadModels()
                                .loadForms()
                                .pageLoaded();
                    }, {}, 'text');
                }
                else {
                    this.loadComponents()
                            .loadCollections()
                            .loadModels()
                            .loadForms()
                            .pageLoaded();
                }
            }
            else {
                this.error('Load page failed: ' + this.page.attr('this-id'));
                this.page.trigger('page.load.failed');
            }
            return this;
        },
        /**
         * Parses temporary attributes
         * @param _ __this
         * @returns object _ The template object
         */
        doTar: function (__this) {
            if (__this.attr('this-tar')) {
                var tar = __this.attr('this-tar').split(';');
                this.__.forEach(tar, function (i, v) {
                    var split = v.split(':');
                    if (split.length < 2)
                        return;
                    __this.attr('this-' + split[0], split[1]);
                });
            }
            return __this.removeAttr('this-tar').show();
        },
        /**
         * Loads all forms on the current page
         * @returns ThisApp
         */
        loadForms: function () {
            var forms = this.page.is('form') ? this.page : this.page.find('form'),
                    _this = this;
            forms.each(function (i) {
                var __this = _this._(this).show(),
                        elements = Array.from(this.elements),
                        model;
                if (!_this.page.is('form')) {
                    _this._('page[this-id="' + _this.page.attr('this-id')
                            + '"]:not(.current):not(.dead) form:nth-child(' + (i + 1)
                            + '),[this-type="page"][this-id="'
                            + _this.page.attr('this-id')
                            + '"]:not(.current):not(.dead) form:nth-child(' + (i + 1) + ')')
                            .removeAttr('this-tar');
                    _this.doTar(__this);
                }
                if (__this.attr('this-model-id') && __this.attr('this-collection')) {
                    model = _this.getModelFromCollectionStore(__this.attr('this-model-id'),
                            __this.attr('this-collection'));
                    if (model)
                        _this.loadFormElements(elements, model);
                }
                else if (__this.attr('this-action')) {
                    _this.request(__this.attr('this-action'), function (data) {
                        _this.loadFormElements(elements, _this.config.dataKey ?
                                data[_this.config.dataKey] : data);
                    });
                }

            });
            return this;
        },
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
                        keys = key.indexOf('.') !== -1 ? keys = key.split('.') : keys = [key];
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
        },
        /**
         * Loads all components in the current page
         * @returns ThisApp
         */
        loadComponents: function () {
            var _this = this;
            this.container.find('[this-component]').each(function () {
                var __this = _this._(this),
                        component = _this._('component[this-id="' + __this.attr('this-component')
                                + '"]:not(.loaded),[this-type="components"]>[this-id="'
                                + __this.attr('this-component') + '"]').clone();
                if (__this.attr('this-tar'))
                    _this.doTar(component.attr('this-tar', __this.attr('this-tar')))
                            .addClass('loaded');
                __this.replaceWith(component).trigger('component.loaded');
            });
            return this;
        },
        /**
         * Loads all collections in the current page
         * @returns ThisApp
         */
        loadCollections: function () {
            var _this = this,
                    ignore = _this.page.attr('this-ignore-cache') || '',
                    collections = this.page.find('collection,[this-type="collection"]')
                    .each(function () {
                        var __this = _this._(this),
                                content = __this.html(),
                                cached = _this.cache('collection', __this.attr('this-id')),
                                model_id = __this.attr('this-model');
                        __this.children().attr('this-cache', '').hide();
                        if (model_id && _this.page.find('model[this-id="' + model_id
                                + '"],[this-type="model"][this-id="' + model_id + '"]').length) {
                            _this.page.find('model[this-id="' + model_id
                                    + '"],[this-type="model"][this-id="' + model_id + '"]')
                                    .attr('this-collection', __this.attr('this-id'))
                                    .attr('this-bind', true);
                        }
                        if (ignore.indexOf('collection.' + __this.attr('this-id')) === -1 && cached
                                && ((cached.expires && cached.expires < Date.now())
                                        || !cached.expires)) {
                            --_this.collections;
                            var data = {};
                            if (_this.config.dataKey)
                                data[_this.config.dataKey] = cached.data;
                            else
                                data = cached.data;
                            _this.loadData(this, data, content, false, false);
                            __this.trigger('loaded.cache');
                            _this.pageLoaded();
                        }
                        else {
                            _this.request(this, function (data) {
                                --_this.collections;
                                _this.loadData(this, data, content, false, true);
                                _this.pageLoaded();
                            });
                        }
                    }).length;
            this.collections += collections;
            return this;
        },
        /**
         * Loads a model on the current page
         * @param object _model
         * @param boolean binding Indicates whether to currently binding model to a collection
         * @param boolean replaceState Indicates whether to overwrite current state after loading model
         * @returns void
         */
        loadModel: function (_model, binding, replaceState) {
            var __this = this._(_model),
                    ignore = this.page.attr('this-ignore-cache') || '',
                    content = __this.html(),
                    _this = this;
            if (!binding && __this.attr('this-bind')) {
                this.models--;
                return;
            }
            if (__this.siblings('[this-cache]').length) {
                content = __this.siblings('[this-cache]').html();
            }
            else
                __this.parent().append('<div this-cache style="display:none">'
                        + content + '</div>');
            if (ignore.indexOf('model.' + __this.attr('this-id')) === -1) {
                var model;
                if (__this.attr('this-collection')) {
                    model = this.getModelFromCollectionStore(__this.attr('this-mid'),
                            __this.attr('this-collection'));
                }
                else {
                    model = this.cache('model', __this.attr('this-id'));
                }
                if (model) {
                    if (!binding)
                        --this.models;
                    if (this.config.dataKey) {
                        var _m = {};
                        _m[this.config.dataKey] = model;
                        model = _m;
                    }
                    this.loadData(__this, model, content, true, false);
                    __this.trigger('loaded.cache');
                    this.pageLoaded(replaceState);
                    return;
                }
            }
            this.request(this, function (data) {
                --_this.models;
                _this.loadData(this, data, content, true, true);
                _this.pageLoaded(replaceState);
            });
        },
        /**
         * Loads all models in the current page
         * @returns ThisApp
         */
        loadModels: function () {
            var _this = this,
                    models = this.container
                    .find('model:not(.in-collection),[this-type="model"]:not(.in-collection)')
                    .each(function () {
                        _this.loadModel(this);
                    }).length;
            this.models += models;
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
            // retrieving
            if (!type)
                return this.store();
            var __data = this.store(type.toLowerCase()) || {};
            // retrieving
            if (!data) {
                if (!id)
                    return __data;
                return __data ? __data[id] : [];
            }
            // saving
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
            var data = this.cache(type.toLowerCase());
            delete data[id];
            return this.store(type.toLowerCase(), data);
        },
        /**
         * Fetches a model from a collection store
         * @param string model_id
         * @param string collection_id
         * @returns object|null
         */
        getModelFromCollectionStore: function (model_id, collection_id) {
            return this.tryCatch(function () {
                var _collection = this.cache('collection', collection_id);
                return _collection.data[model_id];
            });
        },
        /**
         * Saves a model to a collection store
         * @param object model
         * @param string collection_id
         * @param string uid
         * @returns object|null
         */
        saveModelToCollectionStore: function (model, collection_id, uid) {
            return this.tryCatch(function () {
                var collection = this.cache('collection', collection_id) || {data: {}, uid: uid};
                collection.data[model[collection.uid || uid]] = model;
                this.cache('collection', collection_id, collection);
                return this;
            });
        },
        /**
         * Removes a model from the given collection
         * @param string model_id
         * @param string collection_id
         * @returns ThisApp
         */
        removeModelFromCollectionStore: function (model_id, collection_id) {
            this.tryCatch(function () {
                var collection = this.cache('collection', collection_id);
                delete collection.data[model_id];
                this.cache('collection', collection_id, collection, true);
                return this;
            });
        },
        /**
         * Returns the app to the home page
         * @returns ThisApp
         */
        home: function () {
            this.loadPage(this.config.startWith ||
                    this._('page[this-default-page]:not(.current):not(.dead),[this-type="pages"] [this-default-page]')
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
         * Restores a saved state
         * @param object state
         * @returns ThisApp
         */
        restoreState: function (state) {
            if (this.page) {
                this.page.trigger('leave.page');
            }
            this.container.html(state.content);
            this.page = this.container.find('[this-id="' + state.id + '"]');
            if (this.config.titleContainer)
                this.config.titleContainer.html(state.title);
            this.store('last_page', state.id);
            this.updatePage();
            this.page.trigger('page.loaded');
        },
        /**
         * Updates a retrieved saved page
         * @returns ThisApp
         */
        updatePage: function () {
            var deleted = this.cache('deleted') || {},
                    created = this.cache('created') || {},
                    updated = this.cache('updated') || {},
                    collection = this.cache('collection') || {},
                    _this = this,
                    _collections = this.page.find('collection,[this-type="collection"]'),
                    _models = this.page.find('model,[this-type="model"]'),
                    touched = {
                        'deleted': {},
                        'created': false,
                        'updated': false
                    };

            // Add created models to collection list
            if (_collections.length) {
                this.__.forEach(created, function (id, arr) {
                    var _collection = _this.page.find('collection[this-id="' + id
                            + '"],[this-type="collection"][this-id="' + id + '"]');
                    if (!_collection.length)
                        return;
                    var __collection = collection[id],
                            uid = __collection.uid;
                    _this.__.forEach(arr, function (i, v) {
                        var tmpl = _this.parseData(__collection.data[v],
                                _collection.children('[this-cache]').clone()
                                .removeAttr('this-cache').outerHtml()),
                                action = _collection.attr('this-prepend-new') ? 'prepend' : 'append';
                        _collection[action](tmpl.attr('this-mid', v)
                                .attr('this-uid', uid)
                                .attr('this-type', 'model')
                                .attr('this-url', _collection.attr('this-url') + v)
                                .addClass('in-collection')
                                .outerHtml());
                        _this.__.arrayRemove(arr, i);
                    });
                    if (!created[id].length) {
                        delete created[id];
                    }
                    touched.created = true;
                });
            }
            if (_models.length) {
                this.__.forEach(updated, function (model_name, arr) {
                    var _model = _this.page.find('model[this-id="' + model_name
                            + '"],[this-type="model"][this-id="' + model_name + '"],'
                            + 'collection[this-model="' + model_name + '"]>[this-type="model"],'
                            + '[this-type="collection"][this-model="' + model_name
                            + '"]>[this-type="model"]'),
                            in_collection = false;
                    if (!_model.length)
                        return;

                    _this.__.forEach(arr, function (id, v) {
                        _model.filter(function () {
                            return this.getAttribute('this-mid') === id;
                        })
                                .each(function () {
                                    var __model = _this._(this),
                                            tmpl = _this.parseData(v,
                                                    __model.siblings('[this-cache]').clone()
                                                    .removeAttr('this-cache').outerHtml());
                                    if (__model.hasClass('in-collection')) {
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
                        var _model = _this.page.find('model[this-id="' + model_name
                                + '"][this-mid="' + mid + '"],[this-type="model"][this-id="' + model_name
                                + '"][this-mid="' + mid + '"],'
                                + 'collection[this-model="' + model_name
                                + '"]>[this-type="model"][this-mid="' + mid + '"],'
                                + '[this-type="collection"][this-model="' + model_name
                                + '"]>[this-type="model"][this-mid="' + mid + '"]');
                        if (!_model.length)
                            return;
                        _model.each(function () {
                            var __model = _this._(this);
                            __model.hide();
                            if (__model.hasClass('in-collection')) {
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
                // remove model from deleted if operated on all
                if (!deleted[mod].length) {
                    delete deleted[mod];
                }
            });
            if (del)
                this.store('deleted', deleted);
            this.loadForms();
            return touched.back ? this.back() : this.saveState(true);
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
            }, this.page.attr('this-title'), '#' + this.page.attr('this-id'));
            this.store('last_page', this.page.attr('this-id'));
            return this;
        },
        /**
         * Listens to the given event on the given target
         * @param string event
         * @param string target ID of the page to target. It could also be in forms TYPE or TYPE#ID e.g
         * collection#users. This means the target is a collection of id `users`. Target all collection
         * by specifying only collection
         * Multiple elements may be targeted by separating them with a comma.
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
                event: event,
                selector: selector,
                callback: callback
            });
            return this;
        },
        /**
         * Adds general event listeners
         * @param string event
         * @param string selector
         * @param function callback
         * @returns ThisApp
         */
        on: function (event, selector, callback) {
            this.events.push({
                event: event,
                selector: selector,
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
         * Called after the page has been fully loaded
         * @param boolean replaceState Indicates whether to overwrite current state
         * @returns ThisApp
         */
        pageLoaded: function (replaceState) {
            if (!this.collections && !this.models) {
                this.saveState(replaceState);
                delete this.firstPage;
                this.page.trigger('page.loaded');
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
            return this.__.ajax({
                type: type || 'get',
                url: this.config.baseUrl + url,
                data: data || {},
                success: function (data) {
                    _this.__.callable(success).call(elem || this, data);
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
         * Parse the given data into the given content based on the given variables
         * @param array|object data
         * @param string content
         * @param array variables
         * @returns ThisApp
         */
        parseData: function (data, content, variables) {
            if (!variables)
                variables = this.getVariables(content);
            var _temp = this._(document.createElement('div'))
                    .html(content),
                    _this = this;
            _temp.find('[this-loop]').each(function () {
                var __this = _this._(this),
                        _data = data[__this.attr('this-loop')],
                        content = __this.html();
                __this.html('');
                if (!_this.__.isObject(_data, true))
                    return;
                _this.__.forEach(_data, function (i, v) {
                    __this.append(content.replace(/\{key\}/g, i).replace(/\{value\}/g, v));
                });
            });
            _temp.html(this.fillVariables(variables, data, _temp.html()));
            var children = _temp.children();
            if (children.length === 1)
                _temp = children;
            return _temp.show();
        },
        /**
         * Fetches the variables in a string
         * @param string content
         * @returns array
         */
        getVariables: function (content) {
            return content.match(new RegExp(/\{([^}]+)\}/g));
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
            var variables = this.getVariables(content),
                    _data = {data: {}},
            type = container.attr('this-type'),
                    id = container.attr('this-id');
            if (this.config.dataKey) {
                if (type === 'collection' && data.expires)
                    _data.expires = new Date(data.expires);
                data = data[this.config.dataKey];
            }
            if (this.__.isArray(data) || model === false) {
                var _this = this;
                this.__.forEach(data, function (i, v) {
                    if (save)
                        _data.data[v[container.attr('this-model-uid') || 'id']] = v;
                    _this.doLoad(container, v, content, variables);
                });
                if (type === 'collection') {
                    _data.uid = container.attr('this-model-uid') || 'id';
                }
            }
            else if (data && model) {
                if (type === 'model' && container.attr('this-collection')) {
                    id = container.attr('this-collection');
                    type = 'collection';
                }
                if (save)
                    _data.data[data[container.attr('this-uid') || 'id']] = data;
                this.doLoad(container, data, content, variables);
            }
            container.show();

            if (this.config.cacheData && save !== false)
                this.cache(type, id, _data, true);
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
            var _temp = this.parseData(data, content, variables),
                    id = this._(container).attr('this-model-uid');
            if (this.is('model', container)) {
                container.attr('this-uid', id || 'id')
                        .attr('this-mid', data[id || 'id']);
                container.html(_temp.show().html());
            }
            else {
                _temp.attr('this-mid', data[id || 'id'])
                        .attr('this-uid', id || 'id')
                        .attr('this-type', 'model')
                        .addClass('in-collection')
                        .attr('this-url', container.attr('this-url') + data[id || 'id']);
                container.append(_temp.show());
            }
            return this;
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
                var vars = v.replace(/[\{\}]/gi, '').split('|'),
                        key = _this.__.arrayRemove(vars, 0),
                        value = key.indexOf('.') !== -1 ?
                        deepVariableData(key, data) :
                        data[key];
                _this.__.forEach(vars, function (i, v) {
                    var exp = v.split(':'), filter = _this.__.arrayRemove(exp, 0);
                    if (filters[filter])
                        value = filters[filter](value, exp.join(':'));
                    if (!value) // stop filtering if no value exists anymore
                        return false;
                });
                content = content.replace(v, value);
            });
            return content;
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
        }
    };
    ThisApp.extend = {
        /**
         * Transitions affect how old pages are exited and new pages are entered
         */
        transition: {
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
             * @returns {ThisApp.extend.transition}
             */
            add: function (name, func) {
                if (name && func && !transition[name]) {
                    transition[name] = func;
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
             * @returns {ThisApp.extend.transition}
             */
            overwrite: function (name, func) {
                if (name && func) {
                    transition[name] = func;
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
                return transition[name] !== undefined;
            }
        },
        /**
         * Filters are applied to variables before rendering
         */
        filters: {
            /**
             * Adds a filter if it doesn't exist already
             * 
             * @param string name Identifier to the filter. This is also what developers would pipe
             * with desired variables.
             * @param function func The function to call. The first parameter is the value that needs
             * filtering. The second parameter is the options string for the filter.
             * The function should return the value after being worked on by the function
             * @returns {ThisApp.extend.transition}
             */
            add: function (name, func) {
                if (name && func && !filters[name]) {
                    filters[name] = func;
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
             * @returns {ThisApp.extend.transition}
             */
            overwrite: function (name, func) {
                if (name && func) {
                    filters[name] = func;
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
                return transition[name] !== undefined;
            }
        }
    };
})();