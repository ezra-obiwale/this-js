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
        if (config.type.toLowerCase() === 'get' && config.data && __this.isObject(config.data) &&
                Object.keys(config.data).length) {
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
                debug: true,
                items: [],
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
                 * Adds an element after the current elements or fetches the sibling after current
                 * items
                 * @param {_}|{HTMLElement}|{String} elem
                 * @returns {_}
                 */
                after: function (elem) {
                    if (!elem) {
                        // Fetch next sibling
                        var siblings = [];
                        this.each(function () {
                            if (this.nextElementSibling)
                                siblings.push(this.nextElementSibling);
                        });
                        return _(siblings, this.debug);
                    }
                    if (!(elem instanceof _))
                        elem = _(elem, this.debug);
                    if (!elem.length)
                        return this;
                    return this.each(function () {
                        var _this = this;
                        elem.each(function () {
                            _this.insertAdjacentElement('afterEnd', this);
                        });
                    });
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
                 * complete (function): Function to call when a response has been received, error or success
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
                 * Append content to the elements
                 * @param mixed content
                 * @returns __
                 */
                append: function (content) {
                    if (!content)
                        return this;
                    var _content = content;
                    if (!(content instanceof _))
                        _content = _(content, this.debug);
                    if (!_content.length && this.isString(content))
                        _content = this.createElement(null, 'span').items[0].innerHTML = content;
                    if (!_content.length)
                        return this;
                    return this.each(function () {
                        var _this = this;
                        _content.each(function () {
                            _this.insertAdjacentElement('beforeEnd', this);
                        });
                    });
                },
                /**
                 * Removes the item at the given index from the given array
                 * @param array array
                 * @param integer index
                 * @returns mixed The removed item
                 */
                arrayRemoveIndex: function (array, index) {
                    return this.tryCatch(function () {
                        return array.splice(index, 1)[0];
                    });
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
                            return index > -1 ? [this.arrayRemoveIndex(array, index)] : [];
                        }
                        else {
                            while (index > -1) {
                                this.arrayRemoveIndex(array, index);
                                index = array.indexOf(item);
                                if (index < 0)
                                    index = array.indexOf(parseInt(item));
                            }
                        }
                        return array;
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
                        if (val !== undefined || __.isObject(attr)) {
                            this.each(function () {
                                if (__.isObject(attr)) {
                                    var __this = this;
                                    __.forEach(attr, function (i, v) {
                                        __this.setAttribute(i, v);
                                    });
                                }
                                else
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
                 * Adds an element before the current elements or fetches the sibling before current 
                 * items
                 * @param {_}|{HTMLElement}|{String} elem
                 * @returns {_}
                 */
                before: function (elem) {
                    if (!elem) {
                        // Fetch previous sibling
                        var siblings = [];
                        this.each(function () {
                            if (this.previousElementSibling)
                                siblings.push(this.previousElementSibling);
                        });
                        return _(siblings, this.debug);
                    }
                    if (!(elem instanceof _))
                        elem = _(elem, this.debug);
                    if (!elem.length)
                        return this;
                    return this.each(function () {
                        var _this = this;
                        elem.each(function () {
                            _this.insertAdjacentElement('beforeBegin', this);
                        });
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
                 * Gets the immediate descendants of the current items
                 * @param string selector
                 * @returns _
                 */
                children: function (selector) {
                    var result = [];
                    this.each(function () {
                        if (selector) {
                            var id = false, query = '', _this = this;
                            if (!this.id) {
                                this.id = 'rANd' + Math.ceil(Math.random() * 100);
                                id = true;
                            }
                            __.forEach(selector.split(','), function (i, sel) {
                                if (query)
                                    query += ',';
                                query += '#' + _this.id + '>' + sel;
                            });
                            result = result.concat(Array.from(document.querySelectorAll(query)));
                            if (id)
                                this.removeAttribute('id');
                            return;
                        }
                        result = result.concat(Array.from(this.children));
                    });
                    return _(result, this.debug);
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
                 * Creates a new element
                 * @param string str
                 * @param string tag The tag to create
                 * @returns _
                 */
                createElement: function (str, tag) {
                    var d = document.createElement(tag || 'div');
                    if (!str)
                        return _(d, this.debug);
                    d.innerHTML = str;
                    return _(Array.from(d.children), this.debug);
                },
                /**
                 * Sets or retrieves a style of the current item(s)
                 * @param {string} attr
                 * @param {string} val
                 * @returns {_}
                 */
                css: function (attr, val) {
                    if (!attr && this.items.length)
                        return this.items[0].style;
                    else if (!val && this.items.length)
                        return this.items[0].style[attr];
                    return this.each(function () {
                        this.style[attr] = val;
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
                 * Clones a new object from the given objects. There can be as many as possible objects to 
                 * clone from
                 * @param object object
                 * @param object _object
                 * @param {Boolean} deep Indicates deep cloning
                 * @returns object The new object
                 */
                extend: function (object, _, deep) {
                    var args = Array.from(arguments),
                            newObject = {},
                            _this = this;
                    this.forEach(args, function (i, o) {
                        if (_this.isArray(o))
                            o = o.reduce(function (o, v, i) {
                                o[i] = v;
                                return o;
                            }, {});
                        if (_this.isObject(o)) {
                            _this.forEach(o, function (i, v) {
                                if (newObject[i] && _this.isObject(newObject[i], true) &&
                                        _this.isObject(v, true) && deep)
                                    newObject[i] = _this.extend(newObject[i], v, deep);
                                else
                                    newObject[i] = v;
                            });
                        }
                    });
                    return newObject;
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
                 * Fetches the item at the given index
                 * @param int index
                 * @returns mixed
                 */
                get: function (index) {
                    return this.items[index];
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
                 * Hides the matched elements
                 * @returns __
                 */
                hide: function () {
                    return this.each(function () {
                        this.style.display = 'none';
                    });
                },
                /**
                 * Set or get the html content of an element
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
                    if (content instanceof _ || (_this.isObject(content)
                            && content['outerHTML'])) {
                        this.html('').append(content);
                        return this;
                    }
                    return this.each(function () {
                        this.innerHTML = content;
                    });
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
                        __this.html(_(elem, _this.debug).html(__this.html()));
                    });
                },
                /**
                 * Checks if the items are of the given selector
                 * @param string selector
                 * @param {Boolean} checkIdOnly Indicates to check the this-id of element
                 * @returns Boolean
                 */
                is: function (selector, checkIdOnly) {
                    if (!this.items.length)
                        return false;
                    if (checkIdOnly && this.items[0].getAttribute('this-id') === selector)
                        return true;
                    var el = this.items[0];
                    return (el.matches || el.matchesSelector || el.msMatchesSelector
                            || el.mozMatchesSelector || el.webkitMatchesSelector
                            || el.oMatchesSelector).call(el, selector);
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
                 * Checks if the given item is an object
                 * @param mixed item
                 * @param boolean allowArray Indicates wether to return array as object too
                 * @returns boolean
                 */
                isObject: function (item, allowArray) {
                    return typeof item === 'object' && (allowArray || !Array.isArray(item));
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
                 * Checks if the given item exists in the given object
                 * @param {mixed} item
                 * @param {object}|{array} object
                 * @returns {Boolean}
                 */
                inObject: function (item, object) {
                    var is = false;
                    this.forEach(object, function (i, v) {
                        if (v === item) {
                            is = true;
                            return false;
                        }
                    });
                    return is;
                },
                /**
                 * Checks if the given key exists in the given object
                 * @param {integer}|{string} key
                 * @param {object}|{array} object
                 * @returns {Boolean}
                 */
                keyExists: function (key, object) {
                    return object.hasOwnProperty(key);
                },
                /**
                 * Adds an event listener
                 * @param string event
                 * @param function callback
                 * @returns __
                 */
                on: function (event, selector, callback) {
                    if (this.isFunction(selector) && !callback) {
                        callback = selector;
                        selector = null;
                    }
                    var _this = this;
                    return this.each(function () {
                        var target = this;
                        _this.forEach(event.split(','), function (i, v) {
                            target.addEventListener(v.trim(), function (e) {
                                // get target from event
                                var _target = e.target;
                                // target is not selector
                                if (selector && _target && !_target.matches(selector)) {
                                    // find target from parents
                                    _target = _target.closest(selector);
                                    // target still not found
                                    if (!_target)
                                        return; // ignore callback
                                }
                                // apply callback on target
                                _this.callable(callback).apply(_target, Array.from(arguments));
                            }, false);
                        });
                    });
                    return this;
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
                 * Prepend content to the elements
                 * @param mixed content
                 * @returns __
                 */
                prepend: function (content) {
                    if (!content)
                        return this;
                    var _content = content;
                    if (!(content instanceof _))
                        _content = _(content, this.debug);
                    if (!_content.length && this.isString(content))
                        _content = this.createElement(null, 'span').items[0].innerHTML = content;
                    if (!_content.length)
                        return this;
                    return this.each(function () {
                        var _this = this;
                        _content.each(function () {
                            _this.insertAdjacentElement('afterBegin', this);
                        });
                    });
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
                 * Calls the given function when the dom has been fully loaded
                 * @param {function} callback
                 * @returns {_}
                 */
                ready: function (callback) {
                    _(document, this.debug).on('DOMContentLoaded', callback);
                    return this;
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
                 * Removes the given attr(s) from elements
                 * @param {string}|{array} attr
                 * @returns ThisApp
                 */
                removeAttr: function (attr) {
                    var _this = this;
                    if (attr && !__.isArray(attr)) {
                        attr = [attr];
                    }
                    return this.each(function () {
                        var __this = this;
                        if (!attr) {
                            _this.forEach(Array.from(this.attributes), function () {
                                __this.removeAttribute(this.name);
                            });
                            return;
                        }
                        __.forEach(attr, function (i, v) {
                            __this.removeAttribute(v);
                        });
                    });
                },
                /**
                 * Removes the given class from matched elements
                 * @param string className
                 * @returns _
                 */
                removeClass: function (className) {
                    var _this = this;
                    return this.each(function () {
                        var __this = this;
                        _this.forEach(className.split(' '), function (i, v) {
                            __this.classList.remove(v);
                        });
                    });
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
                    this.items = replaced;
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
                        var rId = false, query = '', _this = this;
                        if (!this.id) {
                            this.id = 'rANd' + Math.ceil(Math.random() * 100);
                            rId = true;
                        }
                        if (selector) {
                            __.forEach(selector.split(','), function (i, sel) {
                                if (query)
                                    query += ',';
                                query += sel + ':not(#' + _this.id + ')';
                            });
                        }
                        else
                            query = ':not(#' + _this.id + ')';
                        siblings = siblings.concat(_(this.parentElement, this.debug)
                                .children(query).items);
                        if (rId)
                            this.removeAttribute('id');
                    });
                    return _(siblings, this.debug);
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
                 * Set or get the text content of an element
                 * @param mixed content
                 * @returns __
                 */
                text: function (content) {
                    if (content === undefined) {
                        return this.tryCatch(function () {
                            return this.items.length ? this.items[0].innerText : '';
                        });
                    }
                    return this.each(function () {
                        this.innerText = content;
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
                 * Parses a string to object
                 * @param {string} string
                 * @returns {Array|Object}
                 */
                toJSONObject: function (string) {
                    return this.tryCatch(function () {
                        return JSON.parse(string);
                    });
                },
                /**
                 * Parse an object to string
                 * @param {Object} object
                 * @returns {String}
                 */
                toJSONString: function (object) {
                    return this.tryCatch(function () {
                        return JSON.stringify(object);
                    });
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
                },
                /**
                 * Sets the value of a form element
                 * @param mixed value
                 * @returns __|string
                 */
                val: function (value) {
                    var val;
                    this.each(function () {
                        if (value !== undefined) {
                            this.value = value;
                            return;
                        }
                        val = this.value;
                    });
                    return value ? this : val;
                },
                /**
                 * 
                 * @param {_}|{HTMLElement elem
                 * @returns {_}
                 */
                wrap: function (elem) {
                    var _this = this,
                            elem = _(elem, this.debug);
                    return this.each(function () {
                        _(this, _this.debug).before(elem)
                                .before().html(this);
                    });
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
            /**
             * Internal (hidden) methods
             */
            internal = Object.create({
                /**
                 * Binds the target to the model
                 * @param _ _target
                 * @param _ _model
                 * @param boolean ignoreCache Indicates whether to ignore cache
                 * @returns ThisApp
                 */
                bindToModel: function (_target, _model, ignoreCache) {
                    var model_name = _model.is('model') || _model.attr('this-type') === 'model'
                            ? _model.attr('this-id') : _model.attr('this-model'),
                            model;
                    if (!_model.attr('this-mid')) {
                        this.error('Model to bind to does not have an id');
                        return;
                    }
                    if (!ignoreCache)
                        model = this.collection(model_name).model(_model.attr('this-mid'));
                    if (model) {
                        model.bind(_target);
                        _target.trigger('variables.binded', {
                            data: model
                        });
                    }
                    else {
                        var _this = this;
                        this.request(_model, function (data) {
                            data = _this.config.dataKey ? data[_this.config.dataKey] : data;
                            model = new Model(_model.attr('mid'), data, {
                                name: _model.attr('this-id'),
                                app: _this,
                                uid: _model.attr('this-uid') || 'id',
                                url: _model.attr('this-url')
                            });
                            model.bind(_target);
                            _target.trigger('variables.binded', {
                                data: data
                            });
                        });
                    }
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
                    // return the whole store
                    if (!type)
                        return this.store();
                    // get type from store
                    var __data = this.store(type.toLowerCase()) || {};
                    // not saving. get and return type by id
                    if (!data) {
                        if (!id)
                            return __data;
                        return __data ? __data[id] : [];
                    }

                    // saving
                    // update if exists
                    if (update) {
                        // data at id exists already
                        if (__data[id])
                            // data at id has key data. extend new data on it
                            if (__data[id].data)
                                data.data = this.__.extend(__data[id].data, data.data, true);
                        // save data to id
                        __data[id] = data;
                    }
                    else // overwrite otherwise
                        __data[id] = data;

                    // set the length of objects in collection
                    __data[id].length = Object.keys(__data[id].data).length;
                    // save to store
                    this.store(type.toLowerCase(), __data);
                    return this;
                },
                /**
                 * Checks beforeCallbacks for the given action to determine if the action should
                 * be continued
                 * @param {String} action
                 * @param {Array} params Parameters to pass to the callback
                 * @returns {Boolean}
                 */
                canContinue: function (action, params) {
                    var response = this.__.callable(this.beforeCallbacks[action])
                            .apply(this, params);
                    if (response)
                        return response;
                    else
                        return response !== false;
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
                 * Fetches the debug level
                 * @returns {Number}
                 */
                debugLevel: function () {
                    if (this.__.isBoolean(this.config.debug))
                        return this.config.debug ? 3 : 0;
                    return this.config.debug;
                },
                /**
                 * Does the loading
                 * @param {HTMLElement}|{_} container
                 * @param object data
                 * @param string content
                 * @param array variables
                 * @param {boolean} isModel Indicates whether loading a model or not
                 * @returns ThisApp
                 */
                doLoad: function (container, data, content, variables, isModel, level) {
                    if (isModel)
                        content = internal.processExpressions.call(this, content, data);
                    container = this._(container).hide();
                    var _temp = internal.parseData.call(this, data, content, variables, false, isModel),
                            id = container.attr('this-model-uid') || container.attr('this-uid')
                            || 'id';
                    while (level) {
                        _temp = _temp.children();
                        level--;
                    }
                    if (!isModel) {
                        _temp.attr('this-mid', (data[id] || data[id] == 0 ? data[id] : ''))
                                .attr('this-uid', id)
                                .attr('this-type', 'model')
                                .attr('this-in-collection', '')
                                .attr('this-url', container.attr('this-url')
                                        + (data[id] || data[id] == 0 ? data[id] : ''));
                        if (container.attr('this-model'))
                            _temp.attr('this-id', container.attr('this-model'));
                        container.append(_temp.show())
                                .removeClass('loading');
                    }
                    else {
                        container.attr('this-uid', id).attr('this-mid', data[id]);
                        container.html(_temp.html());
                    }
                    return this;
                },
                /**
                 * Parses temporary attributes
                 * @param _ __this
                 * @param boolean noShow Indicates whether not to show the element
                 * @returns object _ The template object
                 */
                doTar: function (__this, noShow) {
                    __this = this._(__this);
                    var tagName = __this.length ? __this.items[0].tagName.toLowerCase() : '',
                            type = __this.attr('this-type') || tagName,
                            tar = type + '#' + __this.attr('this-id');
                    if (this.tar[tar]) {
                        if (type === 'page' && this.tar[tar].reading) {
                            __this.attr('this-reading', true);
                            delete this.tar[tar].reading;
                            this.tar['model#' + __this.find('model,[this-type="model"]')
                                    .attr('this-id')] = this.tar[tar];
                        }
                        else {
                            this.__.forEach(this.tar[tar], function (i, v) {
                                __this.attr('this-' + i, v);
                            });
                        }
                        delete this.tar[tar];
                    }
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
                 * Extends the given layout
                 * @param {_} _layout
                 * @param {boolean} replaceInState
                 * @returns {void}
                 */
                extendLayout: function (_layout, replaceInState) {
                    var __layout = _layout.clone(), _this = this;
                    // load layout assets (css)
                    internal.loadAssets.call(this, __layout);

                    // get existing layout in container
                    _layout = this.reloadLayouts ? _() :
                            this.container.find('layout[this-id="'
                                    + __layout.attr('this-extends')
                                    + '"],[this-type="layout"][this-id="'
                                    + __layout.attr('this-extends') + '"]');
                    // layout doesn't exist in container
                    if (!_layout.length)
                        // get from templates
                        _layout = this.templates.children('[this-type="layouts"] layout[this-id="'
                                + __layout.attr('this-extends') + '"],'
                                + '[this-type="layouts"] [this-type="layout"][this-id="'
                                + __layout.attr('this-extends') + '"]').clone();
                    // doesn't exist in templates
                    if (!_layout.length) {
                        // get from filesystem
                        internal.fullyFromURL.call(this, 'layout', __layout.attr('this-extends'),
                                function (_layout) {
                                    __layout.removeAttr('this-extends');
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
                                    _this.error('Layout [' + __layout.attr('this-extends')
                                            + '] not found!');
                                    __layout.removeAttr('this-extends');
                                    internal.finalizePageLoad.call(_this, __layout, replaceInState);
                                });
                    }
                    else {
                        __layout.removeAttr('this-extends');
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
                                    null, 'text');
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
                 * Fills content variables with data
                 * @param array variables
                 * @param array data
                 * @param string content
                 * @returns string
                 */
                fillVariables: function (variables, data, content) {
                    var _this = this;
                    if (variables && data && content) {
                        this.__.forEach(variables, function (i, v) {
                            var value = internal.getVariableValue.call(_this, v, data);
                            content = content.replace(v, value || value == 0 ? value : v);
                        });
                    }
                    return content;
                },
                /**
                 * Finalizes page load after layouts have been loaded
                 * @param {_} _layout
                 * @param {boolean} replaceInState
                 * @returns {void}
                 */
                finalizePageLoad: function (_layout, replaceInState) {
                    this.removedAssets = {};
                    internal.loadAssets.call(this, _layout);
                    var _this = this;
                    if (_layout && _layout.length) {
//                        if (!this.container.find('layout[this-id="'
//                                + _layout.attr('this-id')
//                                + '"],[this-type="layout"][this-id="'
//                                + _layout.attr('this-id')
//                                + '"]').length)
                        this.container.html(_layout.show());
                        _layout.trigger('layout.loaded');
                    }
                    else
                        this.container.html(this.page);
                    this.page = this.container
                            .find('page[this-id="' + this.page.attr('this-id')
                                    + '"]:not([this-dead]),'
                                    + '[this-type="page"][this-id="'
                                    + this.page.attr('this-id')
                                    + '"]:not([this-dead])')
                            .attr('this-current', '')
                            .removeAttr('this-layout')
                            .show();
                    this.container.find('[this-type]:not([this-type="page"]):not(page)'
                            + ':not(layout):not([this-type="layout"])'
                            + ':not(component):not([this-type="component"])').hide();
                    internal.loadAssets.call(this, this.page, function () {
                        internal.loadComponents.call(this, function () {
                            this.page = internal.doTar.call(this, this.page);
                            var transit = this.__.callable(this.config.transition, true), wait;
                            if (transit)
                                wait = transit.call(null, _this.oldPage.removeAttr('this-current'),
                                        this.page, this.config.transitionOptions);
                            else if (this.__.isString(this.config.transition)) {
                                if (!Transitions[this.config.transition])
                                    this.config.transition = 'switch';
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
                                this.request(this.page.attr('this-url'), function (data) {
                                    _this.page.html(data);
                                    internal.loadModels.call(_this, replaceInState, true);
                                },
                                        function () {
                                        }, null, 'text');
                            }
                            else {
                                internal.loadModels.call(this, replaceInState, true);
                            }
                        }.bind(this));
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
                            pathConfig = this.config.paths[type + 's'],
                            url = pathConfig.dir + id + pathConfig.ext;
                    this.request(url,
                            function (data) {
                                var elem = _this.__.createElement(data);
                                if (type !== 'component') {
                                    if (!elem.length || elem.length > 1 ||
                                            (!elem.is(type) && elem.attr('this-type') !== type))
                                    {
                                        elem = _this._('<div this-type="' + type + '" this-id="'
                                                + id + '" />')
                                                .html(data);
                                    }
                                    elem.attr('this-id', id);
                                    _this.templates.append(elem);
                                }
                                else {
                                    if (elem.length > 1)
                                        elem = _this._('<div/>').html(elem);
                                    if (!elem.attr('this-url'))
                                        elem.attr('this-url', id);
                                    _this.templates.append(_this._('<div this-type="component"'
                                            + ' this-url="' + id + '" />')
                                            .html(elem.clone().removeAttr('this-url')));
                                }
                                _this.__.callable(success).call(this, elem.clone());
                            },
                            function (e) {
                                _this.__.callable(error).call(this, e);
                            }, null, 'text');
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
                    return value || value == 0 ? value : '';
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
                 * Retrieves the value of the variable from the data and filters it if required
                 * @param {string} variable
                 * @param {object} data
                 * @param {Boolean} raw Indicates whether to return value without surrounding span tag
                 * @returns {mixed}
                 */
                getVariableValue: function (variable, data, raw) {
                    var _this = this,
                            vars = variable.replace(/{*}*/g, '')
                            .replace(/\\\|/g, '__fpipe__').split('|'),
                            key = this.__.arrayRemoveIndex(vars, 0), value = this.__.contains(key, '.') ?
                            internal.getDeepValue.call(null, key, data) : data[key];
                    if (value || value == 0)
                        this.__.forEach(vars, function (i, v) {
                            v = v.replace(/__fpipe__/g, '|');
                            var exp = v.split(':'), filter = _this.__.arrayRemoveIndex(exp, 0);
                            if (Filters[filter])
                                value = Filters[filter](value, exp.join(':'));
                            if (!value) /* stop filtering if no value exists anymore */
                                return false;
                        });
                    if (!value && value != 0)
                        return;
                    return value;
                },
                /**
                 * Groups the function output on the console
                 * @param {String} name
                 * @param {Function} func The action to be performed in the group
                 * @param (Boolean) isMethod Indicates whether the group name is a method name
                 * @returns {mixed}
                 */
                groupConsoleOutput: function (name, func, isMethod) {
                    if (isMethod)
                        name += '(...)';
                    if (internal.debugLevel.call(this) >= 2)
                        this.console('group', name);
                    var result = this.tryCatch(this.__.callable(func));
                    if (internal.debugLevel.call(this) >= 2)
                        this.console('groupEnd');
                    return result;
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
                    content = this._('<div/>').html(content);
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
                                if (__this.attr('this-if') && !__this.hasAttr('this-ignore'))
                                {
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
                                else if (__this.attr('this-else-if') && !__this.hasAttr('this-ignore'))
                                {
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
                                else if (__this.hasAttr('this-else') && !__this.hasAttr('this-ignore'))
                                {
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
                 * Checks that the type of container matches the given type
                 * @param string type
                 * @param string|_ container
                 * @returns booean
                 */
                is: function (type, container) {
                    return this._(container).attr('this-type') === type || this._(container).is(type);
                },
                /**
                 * Loads the given type of asset on the given elementF
                 * @param {string} type js|css
                 * @param {string} name Asset filename, or full path to file if remote
                 * @param {_} elem
                 * @param {Function} callback
                 * @returns {internal}
                 */
                loadAsset: function (type, name, elem, callback) {
                    name = name.trim();
                    var url = (name.indexOf('://') !== -1 && name.startsWith('//')) ?
                            name : this.config.paths[type] + name,
                            _this = this;
                    if (type === 'css') {
                        var current = this.container.find('link[this-id="' + name + '"]');
                        // if exists already, mark as current and move to next
                        if (current.length) {
                            current.attr('this-loaded', '');
                            return;
                        }
                        // ensure url ends with .css
                        if (!url.endsWith('.css'))
                            url += '.css';
                        // request new version if debugging
                        if (this.config.debug)
                            url += '?' + Math.round(Math.random() * 99999);
                        // create link
                        var link = this.__.createElement(null, 'link')
                                // add attributes
                                .attr('type', 'text/css')
                                .attr('rel', 'stylesheet')
                                .attr('this-for', elem.attr('this-type'))
                                .attr('this-loaded', '')
                                .attr('this-id', name);
                        this.__.callable(callback).call(this);
                        link.attr('href', url);
                        // prepend link to elem
                        elem.prepend(link);
                    }
                    else if (type === 'js') {
                        var current = this._('script[this-id="' + name + '"][this-app="'
                                + this.container.attr('this-id') + '"]');
                        // if exists already, mark as current and move to next
                        if (current.length) {
                            current.attr('this-loaded', '');
                            this.__.callable(callback).call(this);
                            return;
                        }
                        // ensure url ends with .js
                        if (!url.endsWith('.js'))
                            url += '.js';
                        // request new version if debugging
                        if (this.config.debug)
                            url += '?' + Math.round(Math.random() * 99999);

                        // create script
                        var script = this.__.createElement(null, 'script')
                                // add attributes
                                .attr('type', 'application/javascript')
                                .attr('this-for', elem.attr('this-type'))
                                .attr('this-loaded', '')
                                .attr('this-app', this.container.attr('this-id'))
                                .attr('this-id', name);
                        script.items[0].onload = function () {
                            _this.__.callable(callback).call(_this);
                        };
                        script.attr('src', url);
                        // append script to body
                        this._('body').append(script);
                        return internal;
                    }
                    this.__.callable(callback).call(this);
                    return internal;
                },
                /**
                 * Loads the assets (css|js) for the given element
                 * @param {_} elem
                 * @returns {internal}
                 */
                loadAssets: function (elem, callback) {
                    var _this = this,
                            tagName = elem.length ? elem.items[0].tagName.toLowerCase() : '',
                            elemType = elem.attr('this-type') || tagName,
                            leaveUnrequired;
                    if (elem.attr('this-load-css') && !elem.hasAttr('this-with-css')) {
                        // load comma-separated css files
                        this.__.forEach(elem.attr('this-load-css').split(','),
                                function (i, css) {
                                    internal.loadAsset.call(_this, 'css', css, elem);
                                });
                        elem.attr('this-with-css', '').removeAttr('this-load-css');
                    }

                    // mark all scripts as old by removing attribute `this-loaded`
                    if (!Object.keys(this.removedAssets).length)
                        this._('script[this-app="' + this.container.attr('this-id') + '"]')
                                .removeAttr('this-loaded');

                    if (elem.attr('this-load-js-first') && !elem.hasAttr('this-with-first-js'))
                    {
                        leaveUnrequired = true;
                        var jses = elem.attr('this-load-js-first').split(','),
                                removedAssets = this.removedAssets[elemType];
                        // load comma-separated css files
                        this.__.forEach(jses, function (i, js) {
                            internal.loadAsset.call(_this, 'js', js, elem, function () {
                                // loaded js is last js
                                if (jses.length - 1 === i) {
                                    // remove elem-type css and js files that don't belong to
                                    // the elem type
                                    if (!removedAssets)
                                        _this._('script[this-app="' + _this.container.attr('this-id')
                                                + '"][this-for="' + elemType + '"]:not([this-loaded])')
                                                .remove();
                                    // call callback function
                                    _this.__.callable(callback).call(_this);
                                }
                            });
                        });
                        elem.attr('this-with-first-js', '');
                    }
                    // remove elem-type js files that don't belong to the elem type
                    if (!leaveUnrequired && !this.removedAssets[elemType])
                        this._('script[this-app="' + this.container.attr('this-id')
                                + '"][this-for="' + elemType + '"]:not([this-loaded])')
                                .remove();
                    // indicate that unrequired assets have been removed to avoid removal of currently
                    // required assets
                    this.removedAssets[elemType] = true;
                    if (!leaveUnrequired)
                        this.__.callable(callback).call(this);
                    return internal;
                },
                /**
                 * Loads a collection
                 * @param {_}|{HTMLElement} __this
                 * @param {boolean} replaceState
                 * @param {boolean} looping Indicates whether loading collection in loop of collections.
                 * This means that the count on collections would be reduced by one after loading this.
                 * @param {Object} data The data to load into the collection. If available and a url
                 * exists on __this, it is monitored for changes to the data.
                 * @returns {void}
                 */
                loadCollection: function (__this, replaceState, looping, chain, data) {
                    __this = this._(__this).addClass('loading');
                    // collection must have an id
                    if (!__this.attr('this-id')) {
                        __this.removeClass('loading');
                        if (looping)
                            this.__proto__.collections--;
                        if (chain && !this.collections)
                            internal.loadForms.call(this, null, null, replaceState, chain);
                    }
                    if (!__this.attr('this-model'))
                        __this.attr('this-model', __this.attr('this-id'));
                    // ensure collection content is grouped together
                    if (__this.children().length > 1)
                        __this.innerWrap('<div/>');
                    // cache collection if not exist in dom as unloaded
                    if (!this.templates.children('collection[this-id="' + __this.attr('this-id') +
                            '"],[this-type="collection"][this-id="'
                            + __this.attr('this-id') + '"]').length) {
                        var cache = __this.removeAttr('this-loaded')
                                .removeClass('loading').hide().outerHtml()
                                .replace(/\(\{/g, '__obrace2__').replace(/\}\)/g, '__cbrace2__');
                        this.templates.append(cache);
                    }

                    var _this = this,
                            content = __this.removeAttr('this-cache').html(),
                            model_name = __this.attr('this-model'),
                            model_to_bind = this.container.find('model[this-id="' + model_name
                                    + '"],[this-type="model"][this-id="' + model_name
                                    + '"]');

                    __this = internal.doTar.call(this, __this, true).html('');
                    if (model_name && model_to_bind.length)
                        model_to_bind.attr('this-bind', true);

                    var requestData = {}, save = true, success, error;
                    if (_this.page.attr('this-query')) {
                        requestData['query'] = _this.page.attr('this-query');
                        /* don't save search response requestData */
                        save = false;
                    }
                    if (__this.attr('this-search'))
                        requestData['keys'] = __this.attr('this-search');

                    // callbacks for request
                    success = function (data, uid) {
                        if (uid)
                            __this.attr('this-model-uid', uid);
                        internal.loadData
                                .call(_this, __this, data, content, false, save);
                        __this.attr('this-loaded', '')
                                .trigger('collection.loaded');
                        if (looping)
                            _this.__proto__.collections--;
                        if (chain && !_this.collections)
                            internal.loadForms.call(_this, null, null, replaceState, chain);
                    },
                            error = function () {
                                if (looping)
                                    _this.__proto__.collections--;
                                if (chain && !_this.collections)
                                    internal.loadForms.call(_this, null, null, replaceState, chain);
                            };
                    internal.loadOrRequestData.call(this, {
                        elem: __this,
                        content: content,
                        data: data,
                        success: success,
                        error: error,
                        looping: looping,
                        chain: chain,
                        replaceState: replaceState,
                        requestData: Object.keys(requestData).length ? requestData : null
                    });
                    return this;
                },
                /**
                 * Loads all collections in the current page
                 * @param boolean replaceState
                 * @returns ThisApp
                 */
                loadCollections: function (replaceState, chain) {
                    var _this = this;
                    var collections = this.container.find('collection:not([this-loaded])'
                            + ':not([this-data]),'
                            + '[this-type="collection"]:not([this-loaded])'
                            + ':not([this-data])');
                    this.__proto__.collections += collections.length;
                    if (chain && !collections.length)
                        internal.loadForms.call(this, null, null, replaceState, chain);
                    collections.each(function () {
                        internal.loadCollection.call(_this, this, replaceState, true, chain);
                    });
                    return this;
                },
                /**
                 * Loads a single component
                 * @param {_} __this The component placeholder
                 * @param function callback To be called when all components have been loaded
                 * @param {_} component The component template
                 * @returns {void}
                 */
                loadComponent: function (__this, callback, component) {
                    __this = this._(__this);
                    var _this = this;
                    // component does not exist
                    if (!this._(component).length) {
                        if (__this.attr('this-url')) {
                            var cached = this.templates
                                    .children('component[this-url="' + __this.attr('this-url') + '"],'
                                            + '[this-type="component"][this-url="'
                                            + __this.attr('this-url') + '"]');
                            if (cached.length)
                                internal.loadComponent.call(this, __this, callback, cached.clone()
                                        .removeAttr('this-url'));
                            else {
                                internal.fullyFromURL
                                        .call(_this, 'component', __this.attr('this-url'),
                                                function (data) {
                                                    internal.loadComponent
                                                            .call(_this, __this, callback, _this._(data)
                                                                    .clone());
                                                },
                                                function () {
                                                    _this.__.callable(callback).call(_this);
                                                });
                            }
                        }
                        else {
                            component = this.templates.children('[component[this-id="'
                                    + __this.attr('this-component') + '"],'
                                    + '[this-type="component"][this-id="'
                                    + __this.attr('this-component')
                                    + '"]').clone();
                            if (!component.length) {
                                if (this.__proto__.components)
                                    this.__proto__.components--;
                                if (!this.__proto__.components)
                                    this.__.callable(callback).call(this);
                            }
                            internal.loadComponent.call(_this, __this, callback, component);
                        }
                        return internal;
                    }
                    component = this._(component).clone();
                    if (component.is('component') || component.attr('this-type') === 'component')
                        component.removeAttr('this-url');
                    // load component
                    __this.html(component).trigger('component.loaded').show();
                    if (this.__proto__.components)
                        this.__proto__.components--;
                    if (!this.__proto__.components)
                        this.__.callable(callback).call(this);
                },
                /**
                 * Loads all components in the current page
                 * @param function callback To be called when all components have been loaded
                 * @returns ThisApp
                 */
                loadComponents: function (callback) {
                    var _this = this,
                            components = this.container.find('[this-component]'),
                            loaded = 0;
                    this.__proto__.components += components.length;
                    if (!components.length)
                        this.__.callable(callback).call(this);
                    components.each(function () {
                        internal.loadComponent.call(_this, this, function () {
                            loaded++;
                            if (loaded === components.length)
                                _this.__.callable(callback).call(_this);
                        });
                    });
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
                loadData: function (container, data, content, isModel, save) {
                    container = this._(container);
                    // trigger invalid.response trigger if no data
                    if (!data) {
                        container.trigger('invalid.response');
                        return;
                    }
                    // get variables in content
                    var variables = internal.parseBrackets.call(this, '{{', '}}', content),
                            // model_name for containers, model id for models
                            save_as = container.attr('this-model') || container.attr('this-id'),
                            // default data structure
                            _data = {
                                data: {},
                                // set expiration timestamp to 24 hours
                                expires: new Date().setMilliseconds(1000 * 3600 * 24)
                            };

                    // get expiration if set and data from dataKey if specified
                    if (this.config.dataKey) {
                        // set data expiration timestamp too.
                        if (!isNaN(data.expires)) // expiration is a number. Must be milliseconds
                            _data.expires = new Date().setMilliseconds(1000 * data.expires);
                        else if (this.__.isString(data.expires)) // expiration is a string. Must be date
                            _data.expires = new Date(data.expires).getTime();
                        data = data[this.config.dataKey];
                    }
                    // loading a collection
                    if (this.__.isArray(data) || isModel === false) {
                        // check if can continue with rendering
                        var __data = internal.canContinue
                                .call(this, 'collection.render', [data, container]);
                        // rendering canceled
                        if (!__data) {
                            container.trigger('collection.render.canceled');
                            return this;
                        }
                        // rendering continues. Overwrite data with returned value if object 
                        else if (this.__.isObject(__data, true))
                            data = __data;
                        var _this = this,
                                // filter for the collection
                                filter = container.attr('this-filter'),
                                // for processing table and its descendants' templates
                                level = 0,
                                // the template element
                                child = container.children().get(0),
                                // unique id key for models
                                uid = container.attr('this-model-uid') || 'id',
                                // the url of the collection/model
                                url = container.attr('this-url');
                        if (child) {
                            // process content properly
                            switch (child.tagName.toLowerCase()) {
                                case "td":
                                    level = 3;
                                    content = _this._('<table />').html(content).outerHtml();
                                    break;
                                case "tr":
                                    level = 2;
                                    content = _this._('<table />').html(content).outerHtml();
                                    break;
                            }
                        }
                        this.__.forEach(data, function (index, model) {
                            // if saving data is allowed
                            if (save !== false)
                                // set model into data to save. use uid if available, or else index
                                _data.data[model[uid] || index] = model;
                            // process content as being in a loop
                            var _content = internal.inLoop.call(_this, {
                                index: index,
                                model: model
                            }, filter,
                                    content.replace(/{{_index}}/g, index));
                            // if there's not content, go to the next model
                            if (!_content)
                                return;
                            // process expressions in content
                            _content = _this._(internal.processExpressions.call(_this,
                                    _content, {
                                        index: index,
                                        model: model
                                    }));
                            // uid must exist in model
                            if (!model[uid])
                                model[uid] = index;
                            // continue loading
                            internal.doLoad.call(_this, container, model, _content, variables,
                                    false, level);
                        });
                        // if saving data is allowed
                        if (save !== false) {
                            // save uid
                            _data.uid = container.attr('this-model-uid') || 'id';
                            // save url
                            _data.url = url;
                        }
                    }
                    // loading a model
                    else if (data && isModel) {
                        // check if can continue rendering
                        var __data = internal.canContinue
                                .call(this, 'model.render', [data, container]);
                        // rendering canceled
                        if (!__data) {
                            container.trigger('model.render.canceled');
                            return this;
                        }
                        // continue rendering. update data with returned value if object
                        else if (this.__.isObject(__data))
                            data = __data;
                        // saving is allowed
                        if (save !== false) {
                            save_as = container.attr('this-id');
                            // store data under its uid
                            _data.data[data[container.attr('this-uid') || 'id']] = data;
                            // get url without the model id
                            // split into array by /
                            var _url = container.attr('this-url').split('/');
                            // remove the last value
                            this.__.arrayRemoveIndex(_url, _url.length - 1);
                            // save the url
                            _data.url = _url.join('/') + '/';
                        }
                        // add url to model data for parsing
                        data['_url'] = container.attr('this-url');
                        // continue loading
                        internal.doLoad.call(this, container, data, content, variables, true);
                    }
                    // remove filter attribute and show
                    container.removeAttr('this-filter').show();
                    if (save !== false)
                        internal.cache.call(this, 'model', save_as, _data, true);
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
                        var __this = _this._(this),
                                key = __this.attr('this-is');
                        if (!key)
                            return;
                        var data = _this.__.extend({}, model, true),
                                keys = _this.__.contains(key, '.') ? key.split('.') : [key];
                        _this.__.forEach(keys, function (i, v) {
                            data = data[v];
                        });
                        if (__this.attr('type') === 'radio' || __this.attr('type') === 'checkbox')
                        {
                            // using attribute so that redumping content 
                            // would still work fine
                            if (__this.attr('value') == data || data == on)
                                __this.attr('checked', 'checked');
                            return;
                        }
                        else if (__this.is('select')) {
                            __this.children().each(function () {
                                var val = _this._(this).attr('value') || _this._(this).html().trim();
                                if (val == data)
                                    _this._(this).attr('selected', 'selected');
                                else
                                    _this._(this).removeAttr('selected');
                            });
                            // using attribute so that redumping content 
                            // would still work fine
                            __this.find('[value="' + data + '"]').attr('selected', 'selected');
                            return;
                        }
                        // using attribute so that redumping content 
                        // would still work fine
                        __this.attr('value', data || '');
                    });
                    return this;
                },
                /**
                 * Loads all forms
                 * @param {_} forms Required if to load specific forms
                 * @param object model May be supplied if loading specific forms
                 * @returns {ThisApp}
                 */
                loadForms: function (forms, model, replaceState, chain) {
                    var _this = this, isPage = false;
                    if (!forms) {
                        isPage = this.page.is('form');
                        forms = isPage ? this.page : this.container.find('form');
                    }
                    forms.each(function () {
                        var __this = _this._(this),
                                elements = Array.from(this.elements);
                        // pass form action type from page to form if not exist on form                 
                        if (!__this.hasAttr('this-do') && _this.page.attr('this-do'))
                            __this.attr('this-do', _this.page.attr('this-do'));
                        // is search form. no need loading except for search field
                        if ((__this.attr('this-do') === 'search' ||
                                _this.page.attr('this-do') === 'search') &&
                                _this.page.attr('this-query')) {
                            __this.find('[this-search]').attr('value', _this.page.attr('this-query'));
                            return;
                        }
                        // parse tar
                        internal.doTar.call(_this, __this, true);
                        var mid = __this.attr('this-mid') || _this.page.attr('this-mid'),
                                model_name = __this.attr('this-model') || _this.page.attr('this-model');
                        if (!mid)
                            return;
                        if (!model)
                            model = internal.modelFromStore.call(_this, mid, model_name);
                        internal.loadFormElements.call(_this, elements, model);
                        __this.attr('this-loaded', '').trigger('form.loaded');
                    });
                    if (chain)
                        internal.pageLoaded.call(this, replaceState);
                    return this;
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
                        // get existing layout in container if not asked to reload layouts
                        _layout = this.reloadLayouts ? _layout :
                                this.container.find('layout[this-id="' + layout
                                        + '"],[this-type="layout"][this-id="'
                                        + layout + '"]');
                        // layout does not exist in container
                        if (!_layout.length) {
                            // get layout template
                            _layout = this.templates.children('layout[this-id="'
                                    + layout + '"],'
                                    + '[this-type="layout"][this-id="'
                                    + layout + '"]').clone().attr('this-loaded', '');
                            // layout doesn't exist
                            if (!_layout.length) {
                                internal.fullyFromURL.call(this, 'layout', layout,
                                        function (_layout) {
                                            _layout.removeAttr('this-url')
                                                    .find('[this-content]').html(_this.page);
                                            if (_layout.attr('this-extends'))
                                                internal.extendLayout
                                                        .call(_this, _layout, replaceInState);
                                            else {
                                                internal.finalizePageLoad
                                                        .call(_this, _layout.clone(), replaceInState);
                                            }

                                        },
                                        function () {
                                            _this.error('Layout [' + layout + '] not found!');
                                            internal.finalizePageLoad.call(_this, _layout,
                                                    replaceInState);
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
                                                    internal.extendLayout.call(_this, _layout,
                                                            replaceInState);
                                                else {
                                                    internal.finalizePageLoad.call(_this, _layout,
                                                            replaceInState);
                                                }
                                            },
                                            function () {
                                                _this.error('Layout [' + layout + '] not found!');
                                                internal.finalizePageLoad.call(_this, _layout,
                                                        replaceInState);
                                            },
                                            null, 'text');
                                }
                                else {
                                    _layout.find('[this-content]').html(_this.page);
                                    if (_layout.attr('this-extends'))
                                        internal.extendLayout.call(this, _layout, replaceInState);
                                    else {
                                        internal.finalizePageLoad.call(this, _layout, replaceInState);
                                    }
                                }
                            }
                        }
                        else {
                            _layout.find('[this-content]').html(this.page.show());
                            internal.finalizePageLoad.call(this, _layout, replaceInState);
                        }
                    }
                    else {
                        internal.finalizePageLoad.call(this, _layout, replaceInState);
                    }
                },
                /**
                 * Loads a model on the current page
                 * @param {HTMLElement}|{_} target
                 * @param boolean binding Indicates whether to currently binding model to a collection
                 * @param boolean replaceState Indicates whether to overwrite current state
                 *  after loading model
                 * @returns void
                 */
                loadModel: function (target, data, replaceState, chain, looping) {
                    var __this = this._(target),
                            content = __this.hide().outerHtml(),
                            _this = this,
                            common_selector = '',
                            type = __this.attr('this-type') || __this.get(0).tagName.toLowerCase();
                    if (__this.attr('this-id'))
                        common_selector += '[this-id="' + __this.attr('this-id') + '"]';
                    if (__this.attr('this-model'))
                        common_selector += '[this-model="' + __this.attr('this-model') + '"]';
                    __this = internal.doTar.call(this, __this, true);
                    if (!data && !__this.attr('this-url')) {
                        this.__proto__.models--;
                        if (chain && !this.models)
                            internal.loadCollections.call(this, replaceState, chain);
                        return;
                    }

                    if (this.templates.children(type + common_selector + ',[this-type="' + type + '"]'
                            + common_selector).length) {
                        // necessary in case of binding and target has already been used
                        content = this.templates.children(type + common_selector
                                + ',[this-type="' + type + '"]' + common_selector)
                                .hide().outerHtml();
                    }
                    else { // keep a copy for later use
                        var cache = _this._(content
                                .replace(/\(\{/g, '__obrace2__')
                                .replace(/\}\)/g, '__cbrace2__'));
                        this.templates.append(cache.hide());
                    }
                    __this.replaceWith(content);

                    var success = function (data) {
                        internal.loadData.call(_this, __this, data, content, true, true);
                        __this.attr('this-loaded', '').trigger('model.loaded');
                        _this.__proto__.models--;
                        if (chain && !this.models)
                            internal.loadCollections.call(_this, replaceState, chain);
                    },
                            error = function () {
                                _this.__proto__.models--;
                                if (chain && !this.models)
                                    internal.loadCollections.call(_this, replaceState, chain);
                            };
                    internal.loadOrRequestData.call(this, {
                        elem: __this,
                        content: content,
                        data: data,
                        success: success,
                        error: error,
                        looping: looping,
                        chain: chain,
                        replaceState: replaceState
                    });
                    return __this;
                },
                /**
                 * Loads all models in the current page
                 * @param boolean replaceState
                 * @returns ThisApp
                 */
                loadModels: function (replaceState, chain) {
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
                    if (chain && !models.length)
                        internal.loadCollections.call(this, replaceState, chain);
                    models.each(function () {
                        internal.loadModel.call(_this, this, null, replaceState, chain, true);
                    });
                    return this;
                },
                /**
                 * Loads the given data or requests and loads it.
                 * @param {object} config
                 * @returns {void}
                 */
                loadOrRequestData: function (config) {
                    var _this = this,
                            isCollection = internal.is.call(this, 'collection', config.elem),
                            type = isCollection ? 'collection' : 'model',
                            ignore = _this.page.attr('this-ignore-cache') || '',
                            cached = internal.cache.call(_this, 'model',
                                    config.elem.attr('this-id')),
                            cache = cached && cached.length ? cached.data : null,
                            cache_expired = cached && ((cached.expires && cached.expires < Date.now())
                                    || !cached.expires),
                            fromCache = false;
                    // get model cache
                    if (!isCollection && cache)
                        cache = cache[config.elem.attr('this-mid')];
                    // if no data is provided and collection has url 
                    if (!config.data && config.elem.attr('this-url')
                            // and no cache or cache exists but is expired
                            && (!cache || (cache && cache_expired))
                            && !_this.__.contains(ignore, type + '#'
                                    + config.elem.attr('this-id'))
                            // and transport exists and is online
                            && this.dataTransport && this.transporterOnline) {
                        if (!config.elem.hasAttr('this-no-updates') && this.watchCallback)
                            internal.watch.call(this, config.elem);
                        config.elem.removeAttr('this-no-updates');
                        this.__.callable(this.dataTransport)
                                .call(this, {
                                    action: 'read',
                                    id: config.elem.attr('this-mid'),
                                    url: config.elem.attr('this-url'),
                                    isCollection: isCollection,
                                    success: function () {
                                        _this.__.callable(config.success)
                                                .apply(config.elem, Array.from(arguments));

                                        config.elem.trigger('load.content.success');
                                        config.elem.trigger('load.content.complete');
                                    },
                                    error: function () {
                                        _this.__.callable(config.error)
                                                .apply(config.elem, Array.from(arguments));
                                        config.elem.trigger('load.content.error');
                                        config.elem.trigger('load.content.complete');
                                    }
                                });
                        return this;
                    }
                    // if no data and no explicit ignore-cache on collection config.element 
                    // and cache exists
                    else if (!config.data && cache) {
                        if (config.looping)
                            this.__proto__[type + 's']--;
                        config.data = cache;
                        fromCache = true;
                    }
                    // if data exists
                    if (config.data) {
                        var _data = {};
                        // use dataKey if available
                        if (_this.config.dataKey) {
                            _data[_this.config.dataKey] = config.data;
                            config.data = _data;
                        }
                        // watch for updates
                        internal.watch.call(this, config.elem);
                        // loads the data
                        internal.loadData.call(this, config.elem, config.data, config.content,
                                !isCollection, false);
                        // mark as loaded and trigger event
                        config.elem.attr('this-loaded', '');
                        if (fromCache) {
                            // trigger expired.cache.loaded event
                            if (cache_expired)
                                config.elem.trigger('expired.' + type + '.cache.loaded');
                            // trigger cache.loaded event
                            else
                                config.elem.trigger(type + '.cache.loaded');
                        }
                        // if chaining methods
                        if (config.chain) {
                            // if collection and done with all collections
                            if (isCollection && !this.collections)
                                internal.loadForms.call(this, null, null, config.replaceState,
                                        config.chain);
                            // if model and done with all models
                            else if (!isCollection && !this.models)
                                internal.loadCollections.call(this, config.replaceState,
                                        config.chain);
                        }
                    }
                    // use default request method
                    else if (config.elem.attr('this-url'))
                        _this.request(config.elem.attr('this-url'), config.success, config.error,
                                config.requestData);
                    // Cannot load type. Move on.
                    else {
                        config.elem.trigger(type + '.load.failed');
                        if (config.looping)
                            this.__proto__[type + 's']--;
                        if (config.chain) {
                            // if collection and done with all collections
                            if (isCollection && !this.collections)
                                internal.loadForms.call(this, null, null, config.replaceState,
                                        config.chain);
                            // if model and done with all models
                            else if (!isCollection && !this.models)
                                internal.loadCollections.call(this, config.replaceState,
                                        config.chain);
                        }
                    }
                },
                /**
                 * Loops elem through the given data
                 * @param {type} data
                 * @param {_}|HTLElement elem
                 * @param {string} filter
                 * @param {string} content
                 * @returns {_}
                 */
                loop: function (data, elem, filter, content) {
                    if (!data)
                        return;
                    elem = this._(elem);
                    var child = elem.children().get(0),
                            _this = this,
                            level;
                    if (!content)
                        content = elem.html();
                    if (child) {
                        switch (child.tagName.toLowerCase()) {
                            case "td":
                                level = 3;
                                content = this._('<table />').html(content).outerHtml();
                                break;
                            case "tr":
                                level = 2;
                                content = this._('<table />').html(content).outerHtml();
                                break;
                        }
                    }
                    this.__.forEach(data, function (key, value) {
                        var __data = {
                            key: key,
                            value: value
                        },
                        _content = internal.inLoop.call(_this, __data, filter, content);
                        if (!_content)
                            return;
                        _content = internal.processExpressions.call(_this, _content, __data);
                        var _variables = internal.parseBrackets.call(_this, '{{', '}}', _content),
                                _content = _this._(internal.fillVariables
                                        .call(_this, _variables, __data, _content)
                                        .replace(/{{key}}/g, key));
                        while (level) {
                            _content = _content.children();
                            level--;
                        }
                        elem.append(_content.show());
                    });
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
                        return _collection && _collection.length && ((_collection.expires
                                && _collection.expires > Date.now())
                                || !_collection.expires) ? _collection.data[model_id] : null;
                    });
                },
                /**
                 * Saves a model to a collection store
                 * @param string|int model_id
                 * @param object model
                 * @param string model_name
                 * @param string uid
                 * @returns object|null
                 */
                modelToStore: function (model_name, model_id, model, uid) {
                    return this.tryCatch(function () {
                        var collection = internal.cache.call(this, 'model', model_name)
                                || {data: {}, uid: uid, length: 0};
                        if (!model_id)
                            model_id = model[collection.uid || uid];
                        model = this.__.extend(collection.data[model_id], model, true);
                        collection.data[model_id] = model;
                        internal.cache.call(this, 'model', model_name, collection, false);
                        return model;
                    });
                },
                /**
                 * Called when the target page is not found a page
                 * @param {string} page Page ID
                 * @returns {ThisApp}
                 */
                notAPage: function (page) {
                    this.error('Page [' + page + '] not found');
                    this.container.trigger('page.not.found', {
                        pageId: page
                    });
                    if (this.__.isString(this.notFound)) {
                        page = this.templates.children(internal.selector.call(this, this.notFound
                                .startsWith('page#') ? this.notFound : 'page#' + this.notFound));
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
                        if (!internal.canContinue.call(this, 'page.load', [page.items[0]]))
                        {
                            page.trigger('page.load.canceled');
                            return this;
                        }
                        if (this.page) {
                            this.oldPage = this.page.attr('this-dead', '');
                            if (this.oldPage.attr('this-id') === page.attr('this-id'))
                                replaceInState = true;
                        }
                        if (this.store('last_page') === page.attr('this-id'))
                            replaceInState = true;
                        this.page = page.clone();
                        internal.loadLayouts.call(this, replaceInState);
                    }
                    else {
                        this.error('Load page failed: ' + page.attr('this-id'));
                        page.trigger('page.load.failed');
                    }
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
                 * Called after the page has been fully loaded
                 * @param {Boolean} replaceState Indicates whether to overwrite current state
                 * @param {Boolean} restored Indicates whether the page was only restored and not 
                 * generated
                 * @returns {ThisApp}
                 */
                pageLoaded: function (replaceState, restored) {
                    if (this.__proto__.collections || this.__proto__.models
                            || this.__proto__.components)
                        // still loading. can't mark as loaded
                        return this;

                    var _this = this;
                    // page was just loaded and not restored from history
                    if (!restored) {
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
                        this.container
                                .html(internal.processExpressions.call(this, this.container.html(),
                                        null, true));
                        this.page.attr('this-loaded', '');
                        this.page = this.container.find('page[this-id="' + this.page.attr('this-id')
                                + '"]:not([this-dead]), [this-type="page"][this-id="'
                                + this.page.attr('this-id') + '"]:not([this-dead])');
                        internal.resolveTargetOnPage.call(this);
                        internal.saveState.call(this, replaceState);
                    }
                    // page was restored from history
                    else {
                        this.page.attr('this-restored', '');
                        internal.updatePage.call(this);
                    }
                    if (this.firstPage) {
                        if (restored)
                            // watch collections and models on current page
                            this.container.find('collection[this-loaded],[this-type="collection"]'
                                    + '[this-loaded],model[this-loaded],[this-type="model"]'
                                    + '[this-loaded]').each(function () {
                                internal.watch.call(_this, this);
                            });

                        // get all previously watched collections and models
                        var watching = this.store('watching');
                        if (watching)
                            // watch collections and models not on page
                            this.__.forEach(watching, function (id, obj) {
                                internal.watch.call(_this, _this._('<div this-id="' + id
                                        + '" this-type="' + obj.type + '" this-url="'
                                        + obj.url + '" this-mid="' + obj.mid + '" />'));
                            });
                        delete this.firstPage;
                    }
                    this.store('watching', this.watching);
                    this.page.trigger('page.loaded');
                    // load required js
                    if (this.page.attr('this-load-js')
                            && !this.page.hasAttr('this-with-js')) {
                        var jses = this.page.attr('this-load-js').split(','),
                                removedAssets = this.removedAssets;
                        // load comma-separated css files
                        this.__.forEach(jses, function (i, js) {
                            internal.loadAsset.call(_this, 'js', js, _this.page);
                        });
                        this.page.attr('this-with-first-js', '');
                    }
                    return this;
                },
                /**
                 * Fetches everything between the oBrace and cBrace as an array and trims each
                 * @param {string} oBrace Brace opener e.g. {
                 * @param {string} cBrace Brace closer e.g. }
                 * @param {string} content
                 * @returns {object}
                 */
                parseBrackets: function (oBrace, cBrace, content) {
                    if (!content)
                        return [];
                    return this.__.tryCatch(function () {
                        return content.match(new RegExp(oBrace + '\\s*[^' + cBrace + ']+\\s*'
                                + cBrace, 'gi')) || [];
                    });
                },
                /**
                 * Parse the given data into the given content based on the given variables
                 * @param array|object data
                 * @param string content
                 * @param array variables
                 * @param string|int forCollection If parsing data for a collection model, this is the
                 * index (or id) of the model in the collection
                 * @param boolean isModel Indicates whether parsing data for a model or not
                 * @returns ThisApp
                 */
                parseData: function (data, content, variables, forCollection, isModel) {
                    if (!variables)
                        variables = internal.parseBrackets.call(this, '{{', '}}', content);
                    var _temp, _this = this, custom = false;
                    if (this.__.isString(content)) {
                        content = content.replace(/__obrace2__/g, '({').replace(/__cbrace2__/g, '})');
                        _temp = this._('<div/>').html(content);
                        custom = true;
                    }
                    else {
                        _temp = content;
                    }
                    _temp.find('[this-each]').each(function () {
                        var __this = _this._(this),
                                each = __this.attr('this-each').trim(),
                                _data = data[each],
                                filter = __this.attr('this-filter'),
                                content = __this.removeAttr('this-muted')
                                .html()
                                .replace(/__obrace__/g, '{{').replace(/__cbrace__/g, '}}')
                                .replace(/__obrace2__/g, '({').replace(/__cbrace2__/g, '})');

                        __this.removeAttr('this-filter').html('');
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
                                _data = internal.getVariableValue.call(_this, each, data, true);
                            }
                        }
                        if (!_this.__.isObject(_data, true))
                            return;
                        internal.loop.call(_this, _data, __this, filter, content);
                        __this.removeAttr('this-each');
                    });
                    if (isModel) {
                        _temp.find('collection[this-data],[this-type="collection"][this-data]')
                                .each(function () {
                                    _this._(this).html(this.innerHTML
                                            .replace(/{{/g, '__obrace__')
                                            .replace(/}}/g, '__cbrace__')
                                            .replace(/\({/g, '__obrace2__')
                                            .replace(/}\)/g, '__cbrace2__'));
                                });
                    }
                    if (forCollection) {
                        content = internal.inLoop.call(this, {
                            index: forCollection,
                            model: data
                        }, 'true', _temp.outerHtml());
                        content = internal.processExpressions.call(this, content, {
                            index: forCollection,
                            model: data
                        });
                    }
                    else {
                        content = internal.inLoop.call(this, data, 'true', _temp.outerHtml());
                        content = internal.processExpressions.call(this, content, data);
                    }
                    content = internal.fillVariables.call(this, variables, data, content);
                    _temp.replaceWith(content);
                    if (isModel) {
                        _temp.find('collection[this-data],[this-type="collection"][this-data]')
                                .each(function () {
                                    var __this = _this._(this).html(this.innerHTML
                                            .replace(/__obrace__/g, '{{')
                                            .replace(/__cbrace__/g, '}}')
                                            .replace(/__obrace2__/g, '({')
                                            .replace(/__cbrace2__/g, '})'));
                                    internal.loadCollection.call(_this, __this, false, false, false,
                                            internal.getVariableValue.call(_this,
                                                    __this.attr('this-data'), data, true));
                                });

                    }
                    if (custom)
                        _temp = _temp.children();
                    return _temp.show();
                },
                /**
                 * Processes all expressions in the content
                 * @param {string} content
                 * @param {object} current Object available to expressions
                 * @returns {mixed}
                 */
                processExpressions: function (content, current, removeUnresolved) {
                    var _this = this,
                            exps = internal.getExpressions.call(this, content);
                    this.__.forEach(exps, function (i, v) {
                        _this.tryCatch(function () {
                            content = content.replace(v, eval(v.trim().substr(2, v.trim().length - 4)));
                        }, function (e) {
                            _this.console('error', e.message);
                            if (removeUnresolved)
                                content = content.replace(v, '');
                        });
                    });
                    return content;
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
                 * Removes a model from the given collection
                 * @param string model_name
                 * @param string model_id
                 * @returns ThisApp
                 */
                removeModelFromStore: function (model_name, model_id) {
                    this.tryCatch(function () {
                        var collection = internal.cache.call(this, 'model', model_name);
                        delete collection.data[model_id];
                        internal.cache.call(this, 'model', model_name, collection);
                        return this;
                    });
                },
                /**
                 * Scrolls to the target on page
                 * @returns {void}
                 */
                resolveTargetOnPage: function () {
                    if (!this.target_on_page)
                        return this;
                    this._('#' + this.target_on_page).trigger('click');
                    delete this.target_on_page;
                },
                /**
                 * Restores a saved state
                 * @param object state
                 * @returns ThisApp
                 */
                restoreState: function (state) {
                    var _this = this;
                    if (this.page) {
                        this.page.trigger('page.leave');
                    }
                    this.container.html(state.content);
                    this.page = this.container.find('page[this-id="' + state.id
                            + '"]:not([this-dead]),[this-type="page"][this-id="'
                            + state.id + '"]:not([this-dead])');
                    if (this.config.titleContainer)
                        this.config.titleContainer.html(state.title);
                    this.store('last_page', state.id);
                    this.__proto__.components = 0;
                    this.__proto__.collections = 0;
                    this.__proto__.models = 0;
                    this.removedAssets = {};
                    this.container.find('[this-type="layout"]')
                            .each(function () {
                                internal.loadAssets.call(_this, _this._(this)
                                        .removeAttr('this-with-first-js')
                                        .removeAttr('this-with-js'));
                            });
                    internal.loadAssets.call(this, this.page
                            .removeAttr('this-with-first-js')
                            .removeAttr('this-with-js'), function () {
                        internal.pageLoaded.call(this, null, true);
                    });
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
                    this.__.arrayRemoveIndex(attrs, 0);
                    if (attrs.length)
                        append += '[' + attrs.join('[');
                    return id.length > 1 ? '[this-type="' + id[0] + '"][this-id="' + id[1] + '"]' + append + ',' + id[0] + '[this-id="' + id[1] + '"]' + append : '[this-id="' + id[0] + '"]' + append;
                },
                /**
                 * Setups the app events
                 * @returns ThisApp
                 */
                setup: function () {
                    this.tryCatch(function () {
                        var _this = this;
                        // save page state before leaving
                        this.when('page.leave', 'page', function () {
                            internal.saveState.call(_this, true);
                        });
                        // save page state before leaving
                        this._(window).on('beforeunload', function () {
                            internal.saveState.call(_this, true);
                        });
                        // update debug mode
                        this.__.__proto__.debug = this.config.debug;
                        // ensure paths end with /
                        if (this.config.paths) {
                            this.__.forEach(this.config.paths, function (i, v) {
                                if (_this.__.isString(v) && !v.endsWith('/'))
                                    _this.config.paths[i] += '/';
                                else if (_this.__.isObject(v))
                                    if (v.dir && !v.dir.endsWith('/'))
                                        _this.config.paths[i].dir += '/';
                            });
                        }
                        // create default function to call when a page isn't found
                        if (!this.notFound)
                            this.notFound = function () {
                                if (_this.firstPage) {
                                    if (_this.store('last_page')) {
                                        var last_page = _this.store('last_page');
                                        _this.store('last_page', null);
                                        _this.loadPage(last_page);
                                    }
                                    else if (_this.config.startWith) {
                                        if (this.templates.children('page[this-id="'
                                                + _this.config.startWith
                                                + '"]').length)
                                            _this.loadPage(_this.config.startWith);
                                    }
                                    else {
                                        var startWith = _this._('[this-default-page]');
                                        if (startWith.length)
                                            _this.loadPage(startWith.attr('this-id'));
                                    }
                                }
                            };
                        // look for the app container
                        this.container = this.config.container ?
                                this._('[this-id="' + this.config.container + '"]') :
                                this._('[this-app-container]');
                        // use the body tag if no container is set
                        if (!this.container.length)
                            this.container = this._('body');
                        else if (!this.container.attr('this-id'))
                            this.container.attr('this-id', Math.ceil(Math.random() * 9999));
                        // mark all loaded element's children as loaded too
                        this.container.find('[this-loaded] [this-type], [this-loaded] page,'
                                + '[this-loaded] layout, [this-loaded] component,'
                                + '[this-loaded] model, [this-loaded] collection')
                                .attr('this-loaded', '');
                        if (!this._('[this-type="templates"][this-app="' +
                                this.container.attr('this-id') + '"]').length)
                            this._('body').append('<div this-type="templates" this-app="' +
                                    this.container.attr('this-id') + '" style="display:none"/>');
                        this.templates = this._('[this-type="templates"][this-app="' +
                                this.container.attr('this-id') + '"]')
                                // put all unloaded element into appropriat template section
                                .html(
                                        // hide all types not loaded (pages, models, collections, layouts,
                                        // components, etc)
                                        this.container.find('page:not([this-loaded]),model:not([this-loaded]),'
                                                + 'collection:not([this-loaded]),layout:not([this-loaded]),'
                                                + 'component:not([this-loaded]),'
                                                + '[this-type="page"]:not([this-loaded]),'
                                                + '[this-type="model"]:not([this-loaded]),'
                                                + '[this-type="collection"]:not([this-loaded]),'
                                                + '[this-type="layout"]:not([this-loaded]),'
                                                + '[this-type="component"]:not([this-loaded])')
                                        .hide());
                        if (this.config.titleContainer)
                            this.config.titleContainer = this._(this.config.titleContainer,
                                    this.config.debug);
                        var autocomplete_timeout;
                        this.container
                                /* reload current page or loaded collection|model */
                                .on('click', '[this-reload],[this-reload-page],[this-reload-layouts]',
                                        function (e) {
                                            e.preventDefault();
                                            var __this = _this._(this);
                                            // reload only page
                                            if (__this.hasAttr('this-reload-page')) {
                                                _this.reload();
                                                return;
                                            }
                                            // reload page and layouts
                                            else if (__this.hasAttr('this-reload-layouts')) {
                                                _this.reload(false, true);
                                                return;
                                            }
                                            // If reload has no value
                                            else if (!__this.attr('this-reload')) {
                                                // reload the page and all resources
                                                _this.reload(true);
                                                return;
                                            }
                                            // reload value: collection| 
                                            var reload = __this.attr('this-reload'),
                                                    // template to reload
                                                    toReload = _this.templates.children(internal.selector
                                                            .call(_this, reload)),
                                                    // target to reload
                                                    _reload = _this.container.find(internal.selector
                                                            .call(_this, reload, '[this-loaded]'));
                                            if (!toReload.length) {
                                                _this.error('Reload target not found');
                                                return;
                                            }
                                            if (__this.attr('this-attributes'))
                                                _this.__.forEach(__this.attr('this-attributes').split(';'),
                                                        function (i, v) {
                                                            var attr = v.split(':'),
                                                                    name = _this.__.arrayRemoveIndex(attr, 0);
                                                            attr = attr.join(':');
                                                            toReload.attr(name, attr);
                                                        });
                                            _reload.replaceWith(toReload.clone());
                                            internal.loadCollection.call(_this, _reload, true);
                                        })
                                /* go to the default page */
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
                                            model_id = __this.attr('this-model-id') ||
                                            _model.attr('this-mid'),
                                            url = __this.attr('this-read') || _model.attr('this-url')
                                            || '#',
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.attr('this-goto'));
                                    // keep attributes for page
                                    _this.tar['page#' + goto] = {
                                        reading: true,
                                        url: url
                                    };

                                    // use the last part of the read url if available as the model's id
                                    if (__this.attr('this-read')) {
                                        var split = __this.attr('this-read').split('/');
                                        model_id = split[split.length - 1];
                                    }
                                    _this.tar['page#' + goto]['mid'] = model_id;
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
                                            model_id = __this.attr('this-model-id') ||
                                            model.attr('this-mid'),
                                            model_name = __this.attr('this-model')
                                            || model.attr('this-id'),
                                            url = __this.attr('this-update')
                                            || model.attr('this-url') || '#',
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.attr('this-goto'));
                                    _this.tar['page#' + goto] = {
                                        "do": "update",
                                        mid: model_id,
                                        action: url,
                                        model: model_name
                                    };
                                    if (__this.attr('this-model-uid'))
                                        _this.tar['page#' + goto]['model-uid'] =
                                                __this.attr('this-model-uid');
                                    else if (model.attr('this-uid'))
                                        _this.tar['page#' + goto]['model-uid'] = model.attr('this-uid');
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
                                            url = __this.attr('this-create') || '#';
                                    var goto = internal.pageIDFromLink.call(this,
                                            __this.attr('this-goto'));
                                    _this.tar['page#' + goto] = {
                                        "do": "create",
                                        action: url
                                    };
                                    if (__this.attr('this-model'))
                                        _this.tar['page#' + goto]['model'] = __this.attr('this-model');
                                    if (__this.attr('this-model-uid'))
                                        _this.tar['page#' + goto]['model-uid'] = __this
                                                .attr('this-model-uid');
                                })
                                /*
                                 * CREATE event
                                 * 
                                 * Target must have attributes `this-form`, which is the id of the 
                                 * target form, and `this-create`, which is the url to submit to.
                                 * 
                                 * If CREATION must update model, then attributes 
                                 * `this-model` must be provided unless the target
                                 * form already has the required attributes.
                                 */
                                .on('click', '[this-create][this-form]', function () {
                                    var __this = _this._(this);
                                    _this.container.find('form[this-id="' + __this.attr('this-form')
                                            + '"]')
                                            .removeAttr([
                                                "this-binding", "this-mid", "this-uid", "this-url"
                                            ])
                                            .attr({
                                                "this-do": "create",
                                                "this-action": __this.attr('this-create'),
                                                "this-model": __this.attr('this-model') || '',
                                                "this-model-uid": __this.attr('this-model-uid') || '',
                                                "this-binding": ""
                                            })
                                            .show()
                                            .find('input:not([type="radio"]):not([type="checkbox"])')
                                            .val('');
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
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.attr('this-goto'));
                                    _this.tar['page#' + goto] = {
                                        "do": "delete",
                                        action: url,
                                        uid: uid
                                    };
                                    if (model)
                                        _this.tar['page#' + goto]['model'] = model_name;
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
                                            __this.attr('this-goto'));
                                    if (!_this.tar['page#' + goto])
                                        _this.tar['page#' + goto] = {};
                                    if (__this.attr('this-page-title'))
                                        _this.tar['page#' + goto]['title'] =
                                                __this.attr('this-page-title');
                                    if (__this.attr('this-run'))
                                        _this.tar['page#' + goto]['run'] = __this.attr('this-run');
                                    if (__this.attr('this-ignore-cache'))
                                        _this.tar['page#' + goto]['ignore-cache'] =
                                                __this.attr('this-ignore-cache');
                                    _this.loadPage(goto);
                                    e.stop = true;
                                })
                                /**
                                 * DELETE event
                                 * 
                                 * Transfers the delete action to the bounded element's [this-delete]
                                 * descendant.
                                 */
                                .on('click', '[this-bind][this-delete]', function (e) {
                                    e.stop = true;
                                    e.preventDefault();
                                    var __this = _this._(this),
                                            _model = __this.closest('model,[this-type="model"]');
                                    _this.container.find('[this-id="' + __this.attr('this-bind') + '"]')
                                            .attr({
                                                'this-model': _model.attr('this-id'),
                                                'this-mid': _model.attr('this-mid'),
                                                'this-do': 'delete',
                                                'this-uid': _model.attr('this-uid') || 'id',
                                                'this-action': _model.attr('this-url')
                                            }).show();
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
                                    var __this = _this._(this),
                                            _model = __this.closest('model,[this-type="model"]'),
                                            _do = __this.closest('[this-do="delete"]'),
                                            __model = new Model(_model.attr('this-mid') ||
                                                    _do.attr('this-mid'), {}, {
                                                app: _this,
                                                name: __this.attr('this-model') ||
                                                        _model.attr('this-id') ||
                                                        _do.attr('this-model'),
                                                uid: _model.attr('this-uid') ||
                                                        _do.attr('this-uid') || 'id',
                                                url: __this.attr('this-delete') ||
                                                        _model.attr('this-url') ||
                                                        _do.attr('this-action')
                                            });
                                    if (!internal.canContinue
                                            .call(_this, 'model.delete',
                                                    [__model, _model.items[0]])) {
                                        _model.trigger('delete.canceled');
                                        return;
                                    }
                                    __model.remove({
                                        success: function (data) {
                                            var crudStatus = _this.config.crudStatus;
                                            if ((crudStatus &&
                                                    data[crudStatus.key] === crudStatus.successValue)
                                                    || !crudStatus) {
                                                if (_this.page.attr('this-do') === 'delete')
                                                    _this.back();
                                                else {
                                                    _this.container.find('[this-binding]').hide();
                                                }
                                                __this.trigger('delete.success', {response: this});
                                            }
                                            else
                                                __this.trigger('delete.failed', {response: this});
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
                                 * Click event
                                 * Bind model to target
                                 */
                                .on('click', '[this-bind]', function (e) {
                                    e.preventDefault();
                                    var __this = _this._(this),
                                            bind = __this.attr('this-bind'),
                                            _model = __this.closest('model,[this-type="model"],'
                                                    + '[this-model]');
                                    if (!bind || !_model.length)
                                        return;
                                    var _target = _this.container.find(internal.selector
                                            .call(_this, bind, ':not([this-in-collection])'));
                                    if (!_target.length)
                                        return;
                                    _target.attr('this-model', (_model.attr('this-model')
                                            || _model.attr('this-id'))).attr('this-binding', '');
                                    if (__this.hasAttr('this-read'))
                                        _this.container.find('[this-model="'
                                                + (_model.attr('this-model') || _model.attr('this-id'))
                                                + '"][this-binding]').hide();
                                    else if (__this.hasAttr('this-update'))
                                        _target.attr('this-tar', 'do:update');
                                    else if (__this.hasAttr('this-create'))
                                        _target.attr('this-tar', 'do:create');
                                    internal.bindToModel.call(_this, _target, _model);
                                })
                                /*
                                 * Click event
                                 * Toggles target on and off
                                 */
                                .on('click', '[this-toggle]', function (e) {
                                    e.preventDefault();
                                    _this.container.find(internal.selector.call(_this,
                                            _this._(this).attr('this-toggle'))).toggle();
                                })
                                /*
                                 * Hides target elements
                                 */
                                .on('click', '[this-hide]', function (e) {
                                    e.preventDefault();
                                    _this.container.find(internal.selector.call(_this,
                                            _this._(this).attr('this-hide'))).hide();
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
                                        _this.container.find('[this-binding]').hide();
                                        var form = _target.is('form[this-model="'
                                                + __this.attr('this-model') + '"]') ? _target :
                                                _target.find('form[this-model="'
                                                        + __this.attr('this-model') + '"]');
                                        form.attr('this-do', 'create').attr('this-url',
                                                __this.attr('this-create')).attr('this-binding', '');
                                        if (__this.attr('this-model-uid'))
                                            form.attr('this-model-uid', __this.attr('this-model-uid'));
                                        form.removeAttr('this-mid');
                                        if (form.length)
                                            form.get(0).reset();
                                    }
                                    _target.show();
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
                                            // parse form elements' data into data object
                                            _this.__.forEach(Array.from(this.elements),
                                                    function () {
                                                        if (!this.name)
                                                            return;
                                                        if (this.name.indexOf('[]') !== -1) {
                                                            var name = this.name.replace('[]', '');
                                                            if (!data[name]) {
                                                                data[name] = [];
                                                            }
                                                            data[name].push(this.value);
                                                        }
                                                        else if (this.name.indexOf('[') !== -1)
                                                        {
                                                            var exp = this.name.replace(']', '').split('['),
                                                                    _data = data,
                                                                    lastKey = exp.pop();
                                                            _this.__.forEach(exp, function (i, v)
                                                            {
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
                                            var id = null;
                                            if (__this.attr('this-mid'))
                                                id = __this.attr('this-mid');
                                            else if (_this.page.attr('this-mid'))
                                                id = _this.page.attr('this-mid');
                                            var _model = new Model(id, data, {
                                                app: _this,
                                                name: __this.attr('this-model') ||
                                                        _this.page.attr('this-model'),
                                                uid: __this.attr('this-uid') ||
                                                        __this.attr('this-model-uid') ||
                                                        _this.page.attr('this-model-uid'),
                                                url: __this.attr('this-url') ||
                                                        __this.attr('this-action') ||
                                                        _this.page.attr('this-url') ||
                                                        _this.page.attr('this-action'),
                                                method: method
                                            });
                                            if (!internal.canContinue
                                                    .call(_this, creating ? 'model.create'
                                                            : 'model.update',
                                                            [_model])) {
                                                __this.trigger(creating ? 'model.create.canceled'
                                                        : 'model.update.canceled');
                                                return;
                                            }
                                            _model.save({
                                                method: method,
                                                success: function (data) {
                                                    var model = _this.config.dataKey ?
                                                            data[_this.config.dataKey] : data;
                                                    var crudStatus = _this.config.crudStatus;
                                                    if (((crudStatus &&
                                                            data[crudStatus.key] ===
                                                            crudStatus.successValue)
                                                            || !crudStatus) && model) {
                                                        if (creating) {
                                                            __this.items[0].reset();
                                                            if (!__this.hasAttr('this-binding') &&
                                                                    !__this.closest('[this-binding]')
                                                                    .length)
                                                                _this.back();
                                                            // hide creation form if binding
                                                            else if (__this.hasAttr('this-binding'))
                                                                __this.hide();
                                                        }
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
                                                error: function () {
                                                    __this.trigger('form.submission.error',
                                                            {
                                                                response: this,
                                                                method: method.toUpperCase()
                                                            });
                                                },
                                                complete: function () {
                                                    __this.trigger('form.submission.complete',
                                                            {
                                                                response: this,
                                                                method: method.toUpperCase()
                                                            });
                                                }
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
                                            page = _form.attr('this-type') === 'page' ?
                                            _form : _form.closest('page,[this-type="page"]'),
                                            goto = _form.attr('goto') || page.attr('this-id'),
                                            filter = '', _collection,
                                            /* same page and query. don't duplicate state */
                                            replaceState = _this.page.attr('this-id') === goto &&
                                            _this.page.attr('this-query') === _search.val().trim();
                                    if (keys)
                                        keys = keys.split(',');
                                    _this.__.forEach(keys, function (i, key) {
                                        if (filter)
                                            filter += ' || ';
                                        filter += '_this.__.contains(filters.lcase(model#' + key
                                                + '),filters.lcase("' + _search.val() + '"))';
                                    });

                                    // reload only the collection
                                    if (_form.attr('this-reload')) {
                                        _collection = page.find(internal.selector.call(_this,
                                                _form.attr('this-reload')));
                                        _collection.attr('this-filter', filter).attr('this-search',
                                                keys.join(','));
                                        page.attr('this-query', _search.val().trim());
                                        internal.loadCollection.call(_this, _collection, replaceState);
                                    }
                                    // load a page and the collection in it
                                    else {
                                        goto = internal.pageIDFromLink.call(this, goto);
                                        var _page = _this.templates.children('page[this-id="'
                                                + goto + '"],[this-type="page"][this-id="'
                                                + goto + '"]'),
                                                _component = _page.find('[this-component="'
                                                        + exp[0] + '"]');
                                        _component.attr('this-filter', 'collection#' + exp[0] + ':'
                                                + filter).attr('this-search', 'collection#'
                                                + exp[0] + ':' + keys.join(','));
                                        _this.tar['page#' + goto] = {
                                            query: _search.val().trim()
                                        };
                                        if (_search.attr('this-ignore-cache'))
                                            _this.tar['page#' + goto]['ignore-cache'] =
                                                    _search.attr('this-ignore-cache');
                                        _collection = _page.find(selector);
                                        _collection.attr('this-filter', filter).attr('this-search',
                                                keys.join(','));
                                        _this.loadPage(goto, replaceState);
                                    }
                                })
                                /**
                                 * Autocomplete
                                 */
                                .on('keyup', '[this-autocomplete][this-list]', function () {
                                    clearTimeout(autocomplete_timeout);
                                    var __this = _this._(this),
                                            min_chars = __this.attr('this-min-chars') || 3,
                                            url = __this.attr('this-autocomplete')
                                            || __this.attr('this-url'),
                                            _list = _this.container.find('[this-type="list"][this-id="'
                                                    + __this.attr('this-list') + '"],list[this-id="'
                                                    + __this.attr('this-list') + '"]');
                                    // do nothing if chars are less than required
                                    if (__this.val().length < min_chars)
                                        return;
                                    url += (url.indexOf('?') === -1) ? '?' : '&';
                                    url += 'q=' + __this.val();
                                    autocomplete_timeout = setTimeout(function () {
                                        _this.request(url, function (data) {
                                            internal.loop.call(_this, _this.config.dataKey ?
                                                    data[_this.config.dataKey] : data, _list,
                                                    __this.attr('this-filter'));
                                        });
                                    }, __this.attr('this-delay') || 300);
                                });
                        this.when('page.loaded', 'page', function () {
                            _this.container.find('[this-autocomplete][this-list]')
                                    .each(function () {
                                        var __this = _this._(this),
                                                _list = _this.container.find('[this-type="list"][this-id="'
                                                        + __this.attr('this-list') + '"],list[this-id="'
                                                        + __this.attr('this-list') + '"]');
                                        if (_list.length > 1)
                                            _list.innerWrap('<div />');
                                        _list.children().hide();
                                    });
                        })
                                .when('component.loaded', 'component', function () {
                                    var component = _this._(this);
                                    _this.container.find('[this-autocomplete][this-list]')
                                            .each(function () {
                                                var __this = _this._(this),
                                                        _list = component
                                                        .find('[this-type="list"][this-id="'
                                                                + __this.attr('this-list')
                                                                + '"],list[this-id="'
                                                                + __this.attr('this-list') + '"]');
                                                if (_list.length > 1)
                                                    _list.innerWrap('<div />');
                                                _list.children().hide();
                                            });
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
                 * Updates a retrieved saved page
                 * @returns ThisApp
                 */
                updatePage: function () {
                    var deleted = internal.cache.call(this, 'deleted') || {},
                            created = internal.cache.call(this, 'created') || {},
                            updated = internal.cache.call(this, 'updated') || {},
                            collection = internal.cache.call(this, 'model') || {},
                            _this = this,
                            _collections = this.container.find('collection[this-loaded],'
                                    + '[this-type="collection"][this-loaded]'),
                            _models = this.container.find('model,[this-type="model"]'),
                            touched = {
                                deleted: {},
                                created: false,
                                updated: false,
                                back: false,
                                cancel: false
                            };
                    /* Add created models to collection list */
                    if (_collections.length) {
                        this.__.forEach(created, function (model_name, arr) {
                            var _collection = _this.container.find('collection[this-model="' + model_name
                                    + '"][this-loaded],[this-type="collection"][this-model="'
                                    + model_name + '"][this-loaded]');
                            if (!_collection.length)
                                return;
                            var __collection = collection[model_name],
                                    uid = __collection.uid;
                            _this.__.forEach(arr, function (i, v) {
                                var data = __collection.data[v],
                                        __data = internal.canContinue
                                        .call(_this, 'collection.model.render', [data]);
                                if (!__data) {
                                    _collection.trigger('collection.model.render.canceled');
                                    return;
                                }
                                else if (_this.__.isObject(__data))
                                    data = __data;
                                var tmpl = internal.parseData.call(_this, data,
                                        _this.templates.children('collection[this-model="' + model_name
                                                + '"],[this-type="collection"][this-model="'
                                                + model_name + '"]').children().clone().outerHtml(),
                                        null, v),
                                        action = _collection.attr('this-prepend-new') ?
                                        'prepend' : 'append';
                                _collection[action](tmpl.attr('this-mid', v).attr('this-uid', uid)
                                        .attr('this-type', 'model')
                                        .attr('this-id', model_name)
                                        .attr('this-url', _collection.attr('this-url') + v)
                                        .attr('this-in-collection', '')
                                        .outerHtml());
                                _this.__.arrayRemoveIndex(arr, i);
                            });
                            if (!created[model_name].length)
                                delete created[model_name];
                            touched.created = true;
                        });
                    }
                    if (_models.length) {
                        this.__.forEach(updated, function (model_name, arr) {
                            var _model = _this.container.find('model[this-id="' + model_name
                                    + '"],[this-type="model"][this-id="'
                                    + model_name + '"],'
                                    + 'collection[this-model="' + model_name
                                    + '"]>[this-type="model"],'
                                    + '[this-type="collection"][this-model="' + model_name
                                    + '"]>[this-type="model"]'),
                                    in_collection = false;
                            if (!_model.length)
                                return;
                            _this.__.forEach(arr, function (id, v) {
                                _model.filter(function () {
                                    var __model = _this._(this);
                                    // if model id is the updated id
                                    return (__model.attr('this-mid') == id
                                            // not updated before
                                            && (!__model.hasAttr('this-updated')
                                                    // or updated before
                                                    || (__model.hasAttr('this-updated')
                                                            // but has newer update
                                                            && parseInt(__model.attr('this-updated'))
                                                            < v.timestamp)));
                                }).each(function () {
                                    var __model = _this._(this),
                                            _clone;
                                    if (__model.hasAttr('this-in-collection')) {
                                        in_collection = true;
                                        var _collection = __model.parent();
                                        _clone = _this.templates.children('collection[this-model="'
                                                + _collection.attr('this-model')
                                                + '"],[this-type="collection"][this-model="'
                                                + _collection.attr('this-model') + '"]').children()
                                                .clone();
                                    }
                                    else {
                                        _clone = _this.templates.children('model[this-id="'
                                                + __model.attr('this-id')
                                                + '"],[this-type="collection"][this-id="'
                                                + __model.attr('this-id') + '"]')
                                                .clone();
                                    }
                                    var data = v.data,
                                            __data = internal.canContinue
                                            .call(_this, in_collection ?
                                                    'collection.model.render'
                                                    : 'model.render', [data]);
                                    if (!__data) {
                                        if (in_collection)
                                            _model.parent().trigger('collection.model.render.canceled');
                                        else
                                            _model.trigger('model.render.canceled');
                                        return;
                                    }
                                    else if (_this.__.isObject(__data))
                                        data = __data;
                                    // replace clone model's collections with existing
                                    // model collections
                                    _clone.find('collection,[this-type="collection"]')
                                            .each(function () {
                                                var _cl_col = _this._(this),
                                                        // loaded collection
                                                        selector = 'collection[this-id="'
                                                        + _cl_col.attr('this-id') + '"],'
                                                        + '[this-type="collection"][this-id="'
                                                        + _cl_col.attr('this-id') + '"]',
                                                        _rl_col = _model.find(selector);
                                                if (_rl_col.length)
                                                    _cl_col.replaceWith(_rl_col.clone());
                                                else
                                                    _cl_col.remove();
                                            });
                                    var tmpl = internal.parseData.call(_this, data,
                                            _clone.outerHtml(), null, false, true);
                                    __model.html(tmpl.html()).show()
                                            .attr('this-updated', v.timestamp);
                                });
                            });
                            if (in_collection)
                                delete updated[model_name];
                            touched.updated = true;
                        });
                        this.__.forEach(deleted, function (model_name, arr) {
                            _this.__.forEach(arr, function (i, mid) {
                                var _model = _this.container.find('model[this-id="' + model_name
                                        + '"][this-mid="' + mid + '"],'
                                        + '[this-type="model"][this-id="'
                                        + model_name + '"][this-mid="' + mid + '"],'
                                        + 'collection[this-model="' + model_name
                                        + '"]>[this-type="model"][this-mid="' + mid + '"],'
                                        + '[this-type="collection"][this-model="' + model_name
                                        + '"]>[this-type="model"][this-mid="' + mid + '"]');
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
                                        if (!__model.hasAttr('this-binding')
                                                && _this.page.attr('this-reading')
                                                && _models.length === 1) {
                                            touched.back = true;
                                            return false;
                                        }
                                        else {
                                            __model.removeAttr('this-url').removeAttr('this-mid')
                                                    .html('');
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
                        if (!deleted[mod].length)
                            delete deleted[mod];
                        if (!Object.keys(deleted).length)
                            deleted = null;
                    });
                    if (del)
                        this.store('deleted', deleted);

                    if (touched.back)
                        return this.back();
                    else if (touched.created || touched.updated || touched.deleted) {
                        if (touched.updated)
                            internal.loadForms.call(this);
                        internal.saveState.call(this, true);
                    }
                },
                /**
                 * Watches an element (collection | model) for updates
                 * @param {_} elem
                 * @returns {ThisApp}
                 */
                watch: function (elem) {
                    elem = this._(elem);
                    if (!elem.attr('this-id') || this.watching[elem.attr('this-id')]
                            || !elem.attr('this-url'))
                        return this;
                    var isCollection = internal.is.call(this, 'collection', elem),
                            model_name = elem.attr('this-model') || elem.attr('this-id');
                    this.watching[elem.attr('this-id')] = {
                        type: isCollection ? 'collection' : 'model',
                        url: elem.attr('this-url'),
                        mid: elem.attr('this-mid')
                    };
                    this.__.callable(this.watchCallback)(elem.attr('this-url'),
                            function (resp) {
                                // save model to collection
                                var action = this.store(resp.event) || {};
                                switch (resp.event) {
                                    case 'created':
                                        internal.modelToStore
                                                .call(this, model_name, resp.id, resp.data,
                                                        elem.attr('this-uid') ||
                                                        elem.attr('this-model-uid'));
                                        if (!action[model_name])
                                            action[model_name] = [];
                                        /* Remove model uid if exists to avoid duplicates */
                                        action[model_name] = this.__
                                                .arrayRemoveValue(action[model_name], resp.id, true);
                                        action[model_name].push(resp.id);
                                        break;
                                    case 'updated':
                                        var data = resp.data, id = resp.id;
                                        // if update model, id is model attribute. Update real model
                                        if (!isCollection && elem.attr('this-mid')) {
                                            delete data[elem.attr('this-uid') || 'id'];
                                            var _data = {};
                                            _data[id] = data;
                                            data = _data;
                                            id = elem.attr('this-mid');
                                        }
                                        data = internal.modelToStore
                                                .call(this, model_name, id, data,
                                                        elem.attr('this-uid') ||
                                                        elem.attr('this-model-uid'));
                                        if (!action[model_name])
                                            action[model_name] = {};
                                        action[model_name][id] = {
                                            data: data,
                                            timestamp: Date.now()
                                        };
                                        break;
                                    case 'deleted':
                                        internal.removeModelFromStore.call(this, model_name, resp.id);
                                        if (!action[model_name])
                                            action[model_name] = [];
                                        /* Indicate model as deleted */
                                        action[model_name] = this.__
                                                .arrayRemoveValue(action[model_name], resp.id, true);
                                        action[model_name].push(resp.id);
                                        break;
                                }
                                this.store(resp.event, action);
                                // update current page
                                internal.updatePage.call(this);
                                elem.trigger('updated', {
                                    event: resp.event,
                                    response: resp
                                });
                            }.bind(this));
                    return this;
                }
            }),
            /**
             * Variable filters
             */
            Filters = Object.create({
                /**
                 * Helper function to check array or str and call function only on str
                 * @param {string}|{array} str
                 * @param {string} options
                 * @param {function} funcA Try this function
                 * @param {function} funcB Do this if first failed
                 * @returns {string}|{array}
                 */
                __: function (str, options, funcA, funcB) {
                    if (__.isArray(str)) {
                        var arr = [], _this = this;
                        __.forEach(str, function (i, v) {
                            arr.push(_this.__(v, options, funcA, funcB));
                        });
                        return arr;
                    }
                    else if (__.isString(str)) {
                        options = this.__opts(options);
                        options.unshift(str);
                        return __.tryCatch(function () {
                            return __.callable(funcA).apply(this, options);
                        }.bind(this), function () {
                            return __.callable(funcB).apply(this, options);
                        }.bind(this));
                    }
                },
                /**
                 * Processes options string to array
                 * @param {string} options
                 * @returns {Array}
                 */
                __opts: function (options) {
                    options = options.replace(/\\,/g, '__fcomma__').split(',');
                    __.forEach(options, function (i, v) {
                        options[i] = v.replace(/__fcomma__/g, ',');
                    });
                    return options;
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
                 * Shortcut to ucwords
                 * @param string|array item
                 * @param string options
                 * @returns string|array
                 */
                capitalize: function (item, options) {
                    return this.ucwords(item, options);
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
                 * Shortcut to lowercase()
                 * @param {string} item
                 * @returns {Array}
                 */
                lcase: function (item) {
                    return this.lowercase(item);
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
                 * Performs a replace operation on the given string
                 * @param {string}|{array} str
                 * @param {string} options CSV with 2 values when the first is what to search for 
                 * and the second is the replacement
                 * @returns {String}|{array}
                 */
                replace: function (str, options) {
                    return this.__(str, options,
                            function (str, search, replace) {
                                search = search.replace(/_/g, '-u-');
                                str = str.replace(/_/g, '-u-');
                                var res = str.replace(new RegExp(eval(search), 'g'), replace);
                                return res.replace(/-u-/g, '_');
                            },
                            function (str, search, replace) {
                                return str.replace(new RegExp(search, 'g'), replace);
                            });
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
                 * Splits the str into an array by the given separator
                 * @param {string}|{array} str
                 * @param {string} separator
                 * @returns {Array}                  */
                split: function (str, separator) {
                    return this.__(str, separator, function (str, separator) {
                        return str.split(separator);
                    });
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
                }
            }),
            /**
             * Page transition effects
             * 
             * Effect function would be passed three parameters:
             * 
             * currentPage - current page been navigated away from
             * newPage - new page been navigated to
             * options - POJO of options passed by app developer
             * 
             * The function is expected to return an integer which is the number of seconds to wait
             * before currentPage is removed from the dom
             */
            Transitions = Object.create({
                "switch": function (currentPage, newPage, options) {
                    newPage.show();
                    return 0;
                }
            }),
            /**
             * Model Object
             * @param {string} id The unique id of the model
             * @param {object} attributes Attributues of the model
             * @param {object} props Model properties like name, app (ThisApp), uid, url,
             * collection (Collection)
             * @returns {Model}
             */
            Model = function (id, attributes, props) {
                function toURL(attributes, _key) {
                    var url = '';
                    __.forEach(attributes, function (key, value) {
                        if (_key) // parsing for object
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
                    app: props && props.app ? props.app : null,
                    attributes: __.isObject(attributes) ? attributes : {},
                    id: id, collection: props && props.collection ? props.collection : null,
                    method: props && props.method ? props.method : null,
                    name: props && props.name ? props.name : null,
                    uid: props && props.uid ? props.uid : 'id',
                    url: props && props.url ? props.url : null,
                    /**
                     * Binds the model to the given element
                     * @param {string}|{HTMLElement}|{_} elem
                     * @returns {Model}
                     */
                    bind: function (elem) {
                        elem = this.app._(elem);
                        elem.attr('this-mid', this.id)
                                .attr('this-uid', this.uid)
                                .attr('this-url', this.url);
                        elem = internal.loadModel.call(this.app, elem, this.attributes, false);
                        elem.show();
                        if (!elem.is('form')) {
                            elem.find('form[this-loaded]').remove();
                            elem = elem.find('form');
                            if (!elem.length)
                                return this;
                        }
                        internal.loadForms.call(this.app, elem, this.attributes);
                        return this;
                    },
                    /**
                     * Initailizes Model attributes, creating setters and getters for them.
                     * @param {Object} attr
                     * @returns {void}
                     */
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
                     * Removes the model
                     * @param {Object} config Keys may include cacheOnly (default: FALSE),
                     * method (default: DELETE), success, error, complete
                     * @returns boolean
                     */
                    remove: function (config) {
                        config = this.app.__.extend({}, config);
                        var _this = this;
                        if (!this.app) {
                            console.error('Invalid model object');
                            return false;
                        }
                        else if (!this.name) {
                            _this.app.error('Cannot delete an unnamed model.');
                            return false;
                        }
                        else if (!this.id) {
                            _this.app.error('Cannot delete a model without an id.');
                            return false;
                        }

                        if (config.cacheOnly)
                            internal.removeModelFromStore.call(this.app, this.name, this.id);
                        else if (this.url) {
                            var _success = function (data) {
                                var crudStatus = _this.app.config.crudStatus;
                                if ((crudStatus &&
                                        data[crudStatus.key] === crudStatus.successValue)
                                        || !crudStatus) {
                                    if (!_this.app.watchCallback) {
                                        internal.removeModelFromStore.call(_this.app, _this.name,
                                                _this.id);
                                        var deleted = _this.app.store('deleted') || {};
                                        if (!deleted[_this.name])
                                            deleted[_this.name] = [];
                                        /* Indicate model as deleted */
                                        deleted[_this.name] = _this.app.__
                                                .arrayRemoveValue(deleted[_this.name], _this.id, true);
                                        deleted[_this.name].push(_this.id);
                                        _this.app.store('deleted', deleted);
                                        /* update current page */
                                        internal.updatePage.call(_this.app);
                                    }
                                    if (_this.collection) {
                                        delete _this.collection.models[_this.id];
                                        _this.collection.length--;
                                    }
                                }
                                _this.app.__.callable(config.success).call(this, data);
                                _this.app.__.callable(config.complete).call(this);
                            }, _error = function (e) {
                                _this.app.__.callable(config.error).call(this, e);
                                _this.app.__.callable(config.complete).call(this, e);
                            };
                            if (this.app.dataTransport)
                                this.app.__.callable(this.app.dataTransport)
                                        .call(this.app, {
                                            url: this.url,
                                            id: this.id,
                                            action: 'delete',
                                            success: _success,
                                            error: _error
                                        });
                            else
                                this.app.ajax({
                                    type: config.method || 'delete',
                                    url: _this.app.config.baseURL + _this.url,
                                    success: _success,
                                    error: _error});
                        }
                        else {
                            this.app.error('Cannot remove model from server: No URL supplied.');
                            return false;
                        }
                        return true;
                    },
                    /**
                     * Persists the model. If not exists, it is created.
                     * @param {Object} config Keys may include cacheOnly (default: FALSE),
                     * method (default: PUT|POST), success, error, complete
                     * @returns boolean
                     */
                    save: function (config) {
                        config = this.app.__.extend({}, config);
                        var _this = this, method = this.id ? 'PUT' : 'POST';
                        if (!this.app) {
                            console.error('Invalid model object');
                            return false;
                        }
                        else if (!this.name) {
                            _this.app.error('Cannot save an unnamed model.');
                            return false;
                        }

                        if (this.method)
                            method = this.method;
                        if (this.id && config.cacheOnly)
                            /* save model to collection */
                            internal.modelToStore.call(this.app, this.name, this.id, this.attributes,
                                    this.uid);
                        else if (_this.url) {
                            var _success = function (data, id) {
                                var model = _this.app.config.dataKey ?
                                        data[_this.app.config.dataKey] : data,
                                        crudStatus = _this.app.config.crudStatus;
                                if (((crudStatus &&
                                        data[crudStatus.key] === crudStatus.successValue)
                                        || !crudStatus) && model) {
                                    // Don't cache for update if watching for updates already
                                    if (!_this.app.watchCallback) {
                                        // save model to collection and set whole data as model
                                        model = internal.modelToStore
                                                .call(_this.app, _this.name, _this.id, model,
                                                        _this.uid);
                                        var _action = _this.id ? 'updated' : 'created',
                                                action = _this.app.store(_action) || {};
                                    }
                                    // update model's collection
                                    if (_this.collection && _this.id)
                                        _this.collection.models[_this.id] = model;

                                    // saved existing model for dom update
                                    if (_this.id && !_this.app.watchCallback) {
                                        if (!action[_this.name])
                                            action[_this.name] = {};
                                        action[_this.name][_this.id] = {
                                            data: model,
                                            timestamp: Date.now()
                                        };
                                        _this.app.store(_action, action);
                                    }
                                    // saved new model for dom update
                                    else {
                                        if (!_this.app.watchCallback) {
                                            _this.id = id || model[_this.uid];
                                            // update the url
                                            _this.url += _this.id;
                                            if (!action[_this.name])
                                                action[_this.name] = [];
                                            // Remove model uid if exists to avoid duplicates
                                            action[_this.name] = _this.app.__
                                                    .arrayRemoveValue(action[_this.name],
                                                            _this.id, true);
                                            action[_this.name].push(_this.id);
                                            _this.app.store(_action, action);
                                        }
                                        if (_this.collection)
                                            _this.collection.length++;
                                    }

                                    _this.attributes = model;
                                    // Don't update if watching for updates already
                                    if (!_this.app.watchCallback)
                                        // update current page 
                                        internal.updatePage.call(_this.app);
                                }
                                _this.app.__.callable(config.success).call(_this.app, data);
                                _this.app.__.callable(config.complete).call(_this.app);
                            },
                                    _error = function (e) {
                                        _this.app.__.callable(config.error).call(this, e);
                                        _this.app.__.callable(config.complete).call(this, e);
                                    };
                            if (this.app.dataTransport)
                                this.app.__.callable(this.app.dataTransport)
                                        .call(this.app, {
                                            url: this.url,
                                            id: this.id,
                                            data: this.attributes,
                                            action: this.id ? 'update' : 'create',
                                            success: _success,
                                            error: _error
                                        });
                            else
                                this.app.ajax({
                                    type: config.method || method,
                                    url: _this.app.config.baseURL ? _this.app.config.baseURL +
                                            _this.url : _this.url,
                                    data: this.toURL(),
                                    success: _success,
                                    error: _error
                                });
                            return true;
                        }
                        else {
                            _this.app.error('Cannot save model to server: No URL supplied.');
                        }
                        return false;
                    },
                    /**
                     * Converts the model to a url string
                     * @returns {String}
                     */
                    toURL: function () {
                        return toURL(this.attributes);
                    }
                });
                if (__.isObject(attributes)) {
                    __.forEach(attributes, function (key) {
                        _Model.init(key);
                    });
                }
                _Model.parent = _Model.__proto__;
                delete _Model.parent.init;
                return _Model;
            },
            /**
             * Collection Object
             * @param {object} models Object of objects with keys as ids
             * @param {object} props Object with keys name (of the model), app (ThisApp), 
             * uid, url and length (the number of models present)
             * @returns {Collection}
             */
            Collection = function (models, props) {
                var _Collection = Object.create({
                    app: props && props.app ? props.app : null,
                    current_index: -1,
                    models: __.isObject(models) ? models : {},
                    name: props && props.name ? props.name : null,
                    uid: props && props.uid ? props.uid : 'id',
                    url: props && props.url ? props.url : null,
                    /**
                     * Adds a model to the collection
                     * @param {Object} attributes 
                     * @param {Object} config @see Model.save()
                     * @returns {Model}                      */
                    add: function (attributes, config) {
                        var model = new Model(null, attributes, {
                            name: this.name, app: this.app,
                            uid: this.uid,
                            url: this.url,
                            collection: this
                        });
                        if (model.save(config))
                            return model;
                        return false;
                    },
                    /**
                     * Fetches the current model
                     * @returns {Model}
                     */
                    current: function () {
                        return this.get(this.parent.current_index || 0);
                    },
                    /**
                     * Fetches the first model in the collection
                     * @returns {Model}
                     */
                    first: function () {
                        return this.get(0);
                    },
                    /**
                     * Fetch the model at the index location
                     * @param {integer} index                      * @returns {Model}                      */
                    get: function (index) {
                        var key = Object.keys(this.models)[index];
                        if (key)
                            this.parent.current_index = index;
                        return this.model(key);
                    },
                    /**
                     * Checks whether there's a model after the current one
                     * @returns {Boolean}
                     */
                    hasNext: function () {
                        var current_index = this.parent.current_index,
                                model = this.next();
                        this.parent.current_index = current_index;
                        return model !== null;
                    },
                    /**
                     * Fetches the last model in the collection
                     * @returns {Model}
                     */
                    last: function () {
                        return this.get(this.length - 1);
                    },
                    /**
                     * Fetches a model from the collection
                     * @param {integer}|{string} model_id
                     * @returns {Model}
                     */
                    model: function (model_id) {
                        var _this = this;
                        return model_id && this.models[model_id] ?
                                new Model(model_id, this.models[model_id], {
                                    name: _this.name,
                                    app: _this.app,
                                    uid: _this.uid,
                                    url: _this.url + model_id,
                                    collection: this
                                }) : null;
                    },
                    /**
                     * Fetchs the next model
                     * @returns {Model}
                     */
                    next: function () {
                        return this.get(this.parent.current_index + 1);
                    },
                    /**
                     * Removes the model
                     * @param {integer}|{string} model_id
                     * @param {Object} config @see Model.remove()
                     * @returns {Model}
                     */
                    remove: function (model_id, config) {
                        config = this.app.__.extend({}, config);
                        /* remove all */
                        if (model_id === undefined) {
                            if (config.cacheOnly) {
                                this.app.store(this.name, null);
                                this.models = {};
                                this.length = 0;
                            }
                            else {
                                var _this = this,
                                        _success = function (data) {
                                            if (!_this.app.watchCallback)
                                                _this.app.clearCache('model', _this.name);
                                            _this.models = {};
                                            _this.length = 0;
                                            _this.app.__.callable(config.success).call(_this, data);
                                            _this.app.__.callable(config.complete).call(_this);
                                        }, _error = function (e) {
                                    _this.app.__.callable(config.error).call(_this, e);
                                    _this.app.__.callable(config.complete).call(_this);
                                };
                                if (this.app.dataTransport)
                                    this.__.callable(this.app.dataTransport)
                                            .call(this, {
                                                url: this.url,
                                                action: 'delete',
                                                success: _success, error: _error
                                            });
                                else
                                    this.app.ajax({
                                        url: this.app.config.baseURL + this.url,
                                        type: config.method || 'delete',
                                        success: _success,
                                        error: _error
                                    });
                            }
                            return true;
                        }
                        /* remove one */
                        var model = this.model(model_id);
                        if (!model)
                            return false;
                        model.remove(config);
                        delete this.models[model_id];
                        this.length--;
                        return model;
                    },
                    /**
                     * Rewinds the collection back to the start
                     * @returns {Collection}
                     */
                    rewind: function () {
                        this.parent.current_index = -1;
                        return this;
                    }
                });
                _Collection.length = props && props.length ? props.length : 0;
                _Collection.parent = _Collection.__proto__;
                return _Collection;
            };
    _.prototype = __.__proto__;
    ThisApp = function (config) {
        if (!(this instanceof ThisApp))
            return new ThisApp(config);
        this.version = '1.0';
        if (config && __.isObject(config))
            this.config = this.__.extend(this.config, config, true);
        this.debug(this.config.debug);
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
         * Checks if a transition exists with the given name
         *           * @param string name
         * @returns boolean
         */
        exists: function (name) {
            return Transitions[name] !== undefined;
        },
        /**          * Overwrites a transition type if it already exists and adds it otherwise
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
        }
    };
    /**
     * Filters are applied to variables before rendering      */
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
         * Checks if a filter exists with the given name
         * 
         * @param string name
         * @returns boolean
         */
        exists: function (name) {
            return Transitions[name] !== undefined;
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
        }
    };
    /**
     * Extends the engine
     * @param {object} obj Object of methods to add to the engine
     * @returns {void}
     */
    ThisApp.extend = function (obj) {
        __.forEach(obj, function (i, v) {
            if (!ThisApp.prototype[i])
                ThisApp.prototype[i] = function () {
                    var args = Array.from(arguments);
                    args.unshift(internal);
                    return __.callable(v).apply(this, args);
                };
            else
                console.error('ThisApp.' + i + ' already exists!');
        });
    };
    ThisApp.prototype = {
        __: __,
        /**
         * Callback to call before events happen
         */
        beforeCallbacks: {},
        /**
         * Number of collections still loading
         */
        collections: 0,
        /**
         * Number of components still loading
         */
        components: 0,
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
            baseURL: location.origin + location.pathname,
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
            /** 			 * The transition effect to use between pages
             */
            transition: 'switch',
            /**
             * The options for the transition effect
             */
            transitionOptions: {},
            /** 			 * The default layout for the application
             */
            layout: null,
            /**              * Paths to pages, layouts and components
             */
            paths: {
                pages: {
                    dir: './pages',
                    ext: '.html'
                },
                layouts: {
                    dir: './layouts',
                    ext: '.html'
                },
                components: {
                    dir: './components',
                    ext: '.html'
                },
                js: './assets/js',
                css: './assets/css'
            },
            /**
             * Indicates the status info for crud operations
             */
            crudStatus: {
                key: 'status', // the key that holds the operation status
                successValue: true // the key value that indicates success
            }
        },
        /**
         * App events
         */
        events: [],
        /**
         * Number of models still loading
         */
        models: 0,
        /**
         * Object holding element types whose unrequired assets have been removed for the current page
         */
        removedAssets: {},
        /**
         * Holds values to pass on to target when loaded
         */
        tar: {},
        /**
         * Indicates whether the data transporter is online or not. If not, cached data may be used
         */
        transporterOnline: false,
        /**
         * Array of elements being watched for updates
         */
        watching: {},
        /**
         * Captures the object for manipulation
         * @param mixed selector
         * @param boolean debug
         * @returns _          */
        _: function (selector, debug) {
            return _(selector, debug || this.config.debug);
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
         * complete (function): Function to call when a response has been received, error or success.          * @returns ajax object
         */
        ajax: function (config) {
            return internal.groupConsoleOutput.call(this, 'ajax',
                    function () {
                        if (!this.__.isObject(config)) {
                            this.console('error', 'Method expects an object parameter. '
                                    + typeof config + ' given!');
                            return this;
                        }
                        return this.__.ajax(config);
                    }, true);
        },
        /**
         * Takes the app back one step in history
         * @returns ThisApp
         */
        back: function (e) {
            return internal.groupConsoleOutput.call(this, 'back',
                    function () {
                        if (e && this.__.isObject(e) && e['preventDefault'])
                            e.preventDefault();
                        if (history.length <= 2) {
                            this.home();
                            return;
                        }
                        history.back();
                        return this;
                    }, true);
        },
        /**
         * Registers a callbact to be called before an event happens. If the callback returns false,
         * the event is terminated.
         * @param {string} event
         * @param {function} callback          * @returns {ThisApp}
         */
        before: function (event, callback) {
            return internal.groupConsoleOutput.call(this, 'before',
                    function () {
                        this.beforeCallbacks[event] = callback;
                        return this;
                    }, true);
        },
        /**
         * Fetches a collection of model
         * @param {string} model_name
         * @param {String} url
         * @param {function} success          * @param {function} error
         * @returns {Collection}
         */
        collection: function (model_name, url, data, success, error) {
            return internal.groupConsoleOutput.call(this, 'collection',
                    function () {
                        if (!model_name)
                            return new Collection([], {app: this});
                        if (!data) {
                            var collection = internal.cache.call(this, 'model', model_name);
                            if (collection && collection.data)
                                data = collection.data;
                        }
                        else if (data) {
                            if (this.config.dataKey && !data[this.config.dataKey]) {
                                var _data = {};
                                _data[this.config.dataKey] = data;
                                data = _data;
                            }
                            internal.cache.call(this, 'model', model_name, data);
                        }
                        if (data)
                            return new Collection(data, {
                                name: model_name,
                                app: this, uid: collection.uid || 'id',
                                url: collection.url || null, length: collection.length || 0});
                        else if (this.dataTransport) {
                            var _collection = this.container.find('collection[this-model="'
                                    + model_name
                                    + '"][this-loaded],[this-type="collection"][this-model="'
                                    + model_name
                                    + '"][this-loaded]');
                            if (!_collection.length)
                                _collection = this.container.find('collection[this-id="' + model_name
                                        + '"][this-loaded],[this-type="collection"][this-id="'
                                        + model_name + '"][this-loaded]');
                            if (!_collection.length)
                                _collection = this.container.find('<collection this-model="'
                                        + model_name + '" this-url="'
                                        + (url || model_name) + '" />');
                            _collection.attr('this-no-updates');
                            var _this = this;
                            return this.request(_collection, function (data, uid) {
                                return _this.__.callable(success).call(_this,
                                        new Collection(data, {
                                            name: model_name,
                                            app: _this,
                                            uid: _collection.attr('this-model-uid') || uid || 'id',
                                            url: _collection.attr('this-url'),
                                            length: Object.keys(data).length || 0
                                        }));
                            }, error);
                        }
                    }, true);
        },
        /**
         * The function called when logging a message
         * @param {string} msg
         * @returns {ThisApp}
         */
        console: function (method, param) {
            if (this.config.debug)
                console[method].apply(null, this.__.isArray(param) ? param : [param]);
            return this;
        },
        /**
         * Sets the app debug mode
         * @param boolean debug Default is TRUE
         * @returns ThisApp
         */
        debug: function (debug) {
            return internal.groupConsoleOutput.call(this, 'debug',
                    function () {
                        this.config.debug = debug || false;
                        this.__.__proto__.debug = this.config.debug;
                        return this;
                    }, true);
        },
        /**
         * The function called when an error occurs
         * @param string msg
         * @returns ThisApp
         */
        error: function (msg) {
            this.console('warn', msg);
            return this;
        },
        /**
         * Takes the app forward one step in history
         * @returns ThisApp
         */
        forward: function (e) {
            return internal.groupConsoleOutput.call(this, 'forward',
                    function () {
                        if (e && this.__.isObject(e) && e['preventDefault'])
                            e.preventDefault();
                        history.forward();
                        return this;
                    }, true);
        },
        /**
         * Gets a list of available filters
         * @returns array          */
        getAvailableFilters: function () {
            return internal.groupConsoleOutput.call(this, 'getAvailableFilters',
                    function () {
                        return Object.keys(Filters);
                    }, true);
        },
        /**
         * Gets a list of available transitions
         * @returns array
         */
        getAvailableTransitions: function () {
            return internal.groupConsoleOutput.call(this, 'getAvailableTransitions',
                    function () {
                        return Object.keys(Transitions);
                    }, true);
        },
        /**
         * Returns the app to the home page          * @returns ThisApp
         */
        home: function () {
            return internal.groupConsoleOutput.call(this, 'home',
                    function () {
                        this.loadPage(this.config.startWith ||
                                this.container
                                .find('page[this-default-page]:not([this-current]):not([this-dead]),'
                                        + '[this-type="pages"] [this-default-page]')
                                .attr('this-id'));
                        return this;
                    }, true);
        },
        /**
         * Loads an element (collection, model, component, or layout)
         * @param {HTMLElement}|{_} elem
         * @returns {ThisApp}
         */
        load: function (elem) {
            return internal.groupConsoleOutput.call(this, 'home',
                    function () {
                        var _this = this;
                        this._(elem).each(function () {
                            var type = this.getAttribute('this-type') || this.tagName.toLowerCase(),
                                    method = 'load' + type[0].toUpperCase() + type.substr(1);
                            if (!internal[method])
                                return;
                            internal[method].call(_this, this);
                        });
                        return this;
                    }, true);
        },
        /**
         * Loads the given page
         * @param {string} pageID ID of the page
         * @param {boolean} replaceInState Indicates whether to replace the current page's state with
         * the new page state instead of creating a different state for it.
         * @returns {ThisApp}
         */
        loadPage: function (pageID, replaceInState) {
            return internal.groupConsoleOutput.call(this, 'loadPage',
                    function () {
                        if (!pageID)
                            return;
                        this.oldPage = _();
                        var newPage = this.templates.children('page[this-id="'
                                + pageID + '"],'
                                + '[this-type="page"][this-id="' + pageID + '"]');
                        if (newPage.length > 1) {
                            this.error('Target page matches multiple pages!');
                            return this;
                        }
                        else if (!newPage.length) {
                            if (this.config.paths && this.config.paths.pages) {
                                var _this = this;
                                internal.fullyFromURL.call(this, 'page', pageID,
                                        function (elem) {
                                            internal.pageFound.call(_this, elem, replaceInState);
                                        },
                                        function () {
                                            internal.notAPage.call(_this, pageID);
                                        });
                                return this;
                            }
                            internal.notAPage.call(this, pageID);
                            return this;
                        }
                        this.__proto__.components = 0;
                        this.__proto__.collections = 0;
                        this.__proto__.models = 0;
                        internal.pageFound.call(this, newPage, replaceInState);
                        return this;
                    }, true);
        },
        /**
         * Adds general event listeners
         * @param string event
         * @param string selector Multiple elements may be targeted by separating their selectors
         * by a comma.
         * @param function callback          * @returns ThisApp
         */
        on: function (event, selector, callback) {
            return internal.groupConsoleOutput.call(this, 'on',
                    function () {
                        if (this.running)
                            this.container.on(event, selector, callback);
                        else
                            this.events.push({
                                event: event, selector: selector,
                                callback: callback
                            });
                        return this;
                    }, true);
        },
        /**
         * What to do when the app encounters an error
         * @param function callback
         * @returns ThisApp
         */
        onError: function (callback) {
            return internal.groupConsoleOutput.call(this, 'onError',
                    function () {
                        this.error = function (message) {
                            this.__proto__.error(message);
                            this.__.callable(callback, true).call(this, message);
                        };
                        return this;
                    }, true);
        },
        /**
         * Sets up the function to call when a page is not found
         * @param {function}|{string} callback or id of page to load
         * @returns {ThisApp}
         */
        pageNotFound: function (callback) {
            return internal.groupConsoleOutput.call(this, 'pageNotFound',
                    function () {
                        this.notFound = callback;
                        return this;
                    }, true);
        },
        /**
         * Reloads the current page
         * @param {Boolean} resources Indicates whether to reload all resources as well.
         * @param {Boolean} layouts Indicates whether to reload all layouts as well.
         * @returns {ThisApp}
         */
        reload: function (resources, layouts) {
            return internal.groupConsoleOutput.call(this, 'reload',
                    function () {
                        this.store('last_page', null);
                        if (resources)
                            location.reload();
                        else {
                            this.reloadLayouts = layouts || false;
                            this.loadPage(location.hash.substr(1), true);
                        }
                        return this;
                    }, true);
        },
        /**          
         * Sends an ajax request based on the parameter of the page.
         * @param string selector
         * @param function success The callback to call on success
         * @param function error The callback to call on error
         * @param object|string The data to send with the request
         * @param string responseType The type of response to expect. JSON, TEXT, XML, BLOB, DOCUMENT
         * @returns XMLHttpRequest
         */
        request: function (url, success, error, data, responseType) {
            return internal.groupConsoleOutput.call(this, 'request',
                    function () {
                        if (!url) {
                            this.console('error', 'Method request() expects parameter 1 to be string. '
                                    + typeof url + ' given');
                            return this;
                        }
                        else if (this.__.isObject(url)) {
                            url = url.attr('this-url');
                        }
                        if (!url.startsWith('./') && !url.startsWith('../') && url.indexOf('://') === -1)
                            url = this.config.baseURL + url;
                        return this.ajax({
                            type: 'get',
                            url: url,
                            dataType: responseType || 'json',
                            data: data || {},
                            clearCache: this.config.debug,
                            success: success,
                            error: error
                        });
                    }, true);
        },
        /**
         * Set the base url for the app          * @param string url
         * @returns ThisApp          */
        setBaseUrl: function (url) {
            return internal.groupConsoleOutput.call(this, 'setBaseUrl',
                    function () {
                        this.config.baseURL = url;
                        return this;
                    }, true);
        },
        /**
         * Sets the path to components' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @param (string) ext The extension for components. This should include the dot (.). Default is
         * .html
         * @returns {ThisApp}
         */
        setComponentsPath: function (path, ext) {
            return internal.groupConsoleOutput.call(this, 'setComponentsPath',
                    function () {
                        if (!this.config.paths)
                            this.config.paths = {};
                        this.__proto__.config.paths.components = {
                            dir: path, ext: ext || '.html'
                        };
                        return this;
                    }, true);
        },
        /**
         * Sets the path to css styles' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @returns {ThisApp}
         */
        setCSSPath: function (path) {
            return internal.groupConsoleOutput.call(this, 'setCSSPath',
                    function () {
                        if (!this.config.paths)
                            this.config.paths = {};
                        this.__proto__.config.paths.css = path;
                        return this;
                    }, true);
        },
        /**
         * Sets the key in the response which holds the data array          * @param string key
         * @returns ThisApp
         */
        setDataKey: function (key) {
            return internal.groupConsoleOutput.call(this, 'setDataKey',
                    function () {
                        this.config.dataKey = key;
                        return this;
                    }, true);
        },
        /**
         * Sets the the transport system to use for data connection.
         * @param {function} callback The callback would be passed a single parameter which is an
         * object of configuration for the transportation with keys action (create,update,read,delete),
         * id, url, data (only for create and update), success callback, error callback
         * @returns {ThisApp}          */
        setDataTransport: function (callback) {
            return internal.groupConsoleOutput.call(this, 'setDataTranport',
                    function () {
                        if (callback)
                            this.dataTransport = callback;
                        return this;
                    }, true);
        },
        /**
         * Sets the default layout for the application
         * @param string layout ID of the layout container
         * @returns ThisApp
         */
        setDefaultLayout: function (layout) {
            return internal.groupConsoleOutput.call(this, 'setLayout',
                    function () {
                        this.config.layout = layout;
                        return this;
                    }, true);
        },
        /**
         * Sets the path to js scripts' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @returns {ThisApp}
         */
        setJSPath: function (path) {
            return internal.groupConsoleOutput.call(this, 'setJSPath',
                    function () {
                        if (!this.config.paths)
                            this.config.paths = {};
                        this.__proto__.config.paths.js = path;
                        return this;
                    }, true);
        },
        /**
         * Sets the path to layouts' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @param (string) ext The extension for layouts. This should include the dot (.). Default is
         * .html
         * @returns {ThisApp}
         */
        setLayoutsPath: function (path, ext) {
            return internal.groupConsoleOutput.call(this, 'setLayoutsPath',
                    function () {
                        if (!this.config.paths)
                            this.config.paths = {};
                        this.__proto__.config.paths.layouts = {
                            dir: path,
                            ext: ext || '.html'
                        };
                        return this;
                    }, true);
        },
        /**
         * Sets the path to pages' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @param (string) ext The extension for pages. This should include the dot (.). Default is
         * .html
         * @returns {ThisApp}
         */
        setPagesPath: function (path, ext) {
            return internal.groupConsoleOutput.call(this, 'setPagesPath',
                    function () {
                        if (!this.config.paths)
                            this.config.paths = {};
                        this.__proto__.config.paths.pages = {
                            dir: path,
                            ext: ext || '.html'
                        };
                        return this;
                    }, true);
        },
        /**
         * Sets the container that would always hold the page title
         * @param string container
         * @returns ThisApp
         */
        setTitleContainer: function (container) {
            return internal.groupConsoleOutput.call(this, 'setTitleContainer',
                    function () {
                        this.config.titleContainer = this.running ?
                                this._(container) : container;
                        return this;
                    }, true);
        },
        /**
         * Set the transition to use between pages
         * @param string|func transition To see string options, call method getAvailableTransitions.
         * If function, the function is passed two parameters - the old page and the new page
         * @param object options The options for the transition
         * @returns ThisApp
         */
        setTransition: function (transition, options) {
            return internal.groupConsoleOutput.call(this, 'setTransition',
                    function () {
                        this.config.transition = transition;
                        this.config.transitionOptions = options;
                        return this;
                    }, true);
        },
        /**
         * Initializes the app
         * @param string page The ID of the page
         * @param boolean fromState Indicates whether to load the start page from state if avaiable
         * or regenerate it
         * @returns app
         */
        start: function (page, fromState) {
            return internal.groupConsoleOutput.call(this, 'start',
                    function () {
                        if (this.running)
                            return this;
                        if (page)
                            this.config.startWith = page;
                        this.firstPage = true;
                        internal.setup.call(this);
                        var target_page = internal.pageIDFromLink.call(this, location.hash);
                        if (fromState !== false && history.state &&
                                target_page === this.store('last_page')) {
                            internal.restoreState.call(this, history.state);
                        }
                        else {
                            this.loadPage(target_page || this.config.startWith ||
                                    this.templates.children('page[this-default-page],'
                                            + '[this-type="pages"] [this-default-page]')
                                    .attr('this-id'));
                        }
                        return this;
                    }, true);
        },
        /**
         * Stores or retrieves stored data
         * @param string key
         * @param mixed value
         * @returns Array|Object|ThisApp
         */
        store: function (key, value) {
            return internal.groupConsoleOutput.call(this, 'store',
                    function () {
                        if (!key)
                            return localStorage;
                        if (!value) {
                            if (value === null) {
                                localStorage.removeItem(key);
                                return this;
                            }
                            var data = localStorage.getItem(key),
                                    _data = this.__.toJSONObject(data);
                            return _data || data;
                        }
                        if (this.__.isObject(value, true))
                            value = this.__.toJSONString(value);
                        if (value)
                            localStorage.setItem(key, value);
                        return this;
                    }, true);
        },
        /**
         * Calls the given function in a try...catch block and outputs any errors to the console if 
         * debug mode is enabled.
         * @param {Function} tryFunc
         * @param {Function} catchFunc
         * @returns mixed
         */
        tryCatch: function (tryFunc, catchFunc) {
            return this.__.tryCatch(function () {
                return this.__.callable(tryFunc).call(this);
            }.bind(this),
                    function (e) {
                        if (catchFunc)
                            this.__.callable(catchFunc).call(this, e);
                        else
                            this.error(e);
                    }.bind(this));
        },
        /**
         * Sets a function to call to watch for server side changes to model collections
         * @param {function} callback Function would be passed 3 parameters - url, success callback
         * and error callback
         * @returns {ThisApp}
         */
        watch: function (callback) {
            return internal.groupConsoleOutput.call(this, 'watch',
                    function () {
                        this.watchCallback = callback;
                        return this;
                    }, true);
        },
        /**
         * A shortcut to method on()
         * @param string event
         * @param string target ID of the page to target. It could also be in forms TYPE or TYPE#ID e.g
         * collection#users. This means the target is a collection of id `users`. Target all collection
         * by specifying only collection
         * Multiple elements may be targeted by separating their selectors by a comma.
         * @param function callback          * @returns ThisApp
         */
        when: function (event, target, callback) {
            return internal.groupConsoleOutput.call(this, 'when',
                    function () {
                        var selector = "", targets = target.split(',');
                        if (selector)
                            selector += ', ';
                        this.__.forEach(targets, function (i, v) {
                            switch (target) {
                                case "layout":
                                    selector += 'layout,[this-type="layout"]';
                                    break;
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
                        return this.on(event, selector, callback);
                    }, true);
        }
    };
})();