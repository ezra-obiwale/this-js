/*
 * ThisJS version 1.0.0 (http://thisjs.com)
 * (c) 2016 Ezra Obiwale
 * License (http://thisjs.com/#license)
 */
(function () {
    var privData = {
        data: {},
        get: function (elem, key) {
            if (!this.data[elem])
                return;
            return this.data[elem][key];
        },
        set: function (elem, key, value) {
            if (!this.data[elem])
                this.data[elem] = {};
            this.data[elem][key] = value;
            return this;
        },
        unset: function (elem, key) {
            if (!this.data[elem])
                return;
            delete this.data[elem][key];
            return this;
        }
    },
            pageAssets = {js: {}, css: {}},
            loadedPageJS = {first: {}, last: {}},
            containedEvents = {};
    FormData.prototype.fromObject = function (object, appendArray) {
        var _this = this;
        function process(data, _key) {
            __.forEach(data, function (key, value) {
                if (_key) // parsing for object
                    key = _key + '[' + (__.isString(key) || !appendArray ? key : '') + ']';
                if (__.isObject(value, true)) {
                    process(value, key);
                }
                else {
                    _this.append(key, value);
                }
            });
            if (_key && data && __.isObject(data, true) && !Object.keys(data).length)
                _this.append(_key, data);
        }
        process(object);
        return this;
    };
    FormData.prototype.toObject = function () {
        var object = {};
        for (var [key, value] of this) {
            var obj = object, last;
            __.forEach(key.split('['), function (i, v) {
                var ky = v.replace(']', '');
                if (!i) {
                    last = ky;
                    return;
                }
                if (!ky || ky.replace(/[^0-9]/g, '') == ky) {
                    if (!__.isArray(obj[last])) {
                        obj[last] = [];
                    }
                    obj = obj[last];
                    if (obj[ky] === undefined) {
                        obj.push(null);
                        last = obj.length - 1;
                    }
                    else {
                        last = ky;
                    }
                }
                else {
                    if (!__.isObject(obj[last], true) || obj[last] === null) {
                        obj[last] = {};
                    }
                    obj = obj[last];
                    last = ky;
                }
            });
            obj[last] = value;
        }
        return object;
    };
    FormData.prototype.toQuery = function () {
        var str = '';
        for (var [key, value] of this) {
            if (str !== '')
                str += '&';
            str += key + '=' + encodeURIComponent(value);
        }
        return str;
    };
    function getElemType(elem) {
        return _(elem).length ?
                (_(elem).this('type') || _(elem).get(0).tagName.toLowerCase())
                : null;
    }
    function getRealData(data) {
        // use dataKey if available
        if (this.config.dataKey) {
            return data[this.config.dataKey];
        }
        else {
            return data;
        }
    }
    function updateLinks() {
        var _this = this;
        // update links
        this.container.find('a[this-goto]').each(function () {
            var _a = _this._(this), href;
            if (_a.hasAttr('href') && _a.attr('href') !== '#')
                return;
            href = '#/' + _a.this('goto');
            if (_a.hasAttr('this-read')) {
                var hrf = '',
                        _model = _a.closest('[this-model]'),
                        _collection = _a.closest('[this-type="collection"],collection');
                if (_a.this('read'))
                    hrf += _a.this('read');
                else if (_model.length) {
                    hrf += _model.this('url');
                }

                if (hrf) {
                    href += '/#/' + (_a.this('model') || _model.this('model')) + '/' + hrf;
                }
            }

            _a.attr('href', href);
        });
    }
    /**
     * Creates an AJAX connection
     * @param object config
     * @returns ajax object
     */
    var Ajax = function (config, app) {
        function parseData(data) {
            if (!__.isObject(data))
                return data;
            var str = '';
            __.forEach(data, function (i, v) {
                if (str)
                    str += '&';
                if (__.isObject(v, true)) {
                    var isArray = __.isArray(v);
                    __.forEach(v, function (j, w) {
                        if (j)
                            str += '&';
                        if (isArray)
                            j = '';
                        if (__.isObject(w, true))
                            str += i + '[' + j + ']=' + parseData(w);
                        else if (('' + w).trim())
                            str += i + '[' + j + ']=' + encodeURIComponent(('' + w).trim());
                    });
                }
                else if (('' + v).trim())
                    str += i + '=' + encodeURIComponent(('' + v).trim());
            });
            return str;
        }
        config = __.extend({
            type: 'get',
            url: location.href,
            data: null,
            dataType: 'json',
            headers: {},
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
        if (app && config.api) {
            var records = internal.record.call(app),
                    key = internal.generateRequestKey.call(app),
                    headers = {},
                    data = {};
            if (false === __.callable(records.secureAPI).call(app, key, headers, data)) {
                return __.callable(config.error).call(httpRequest);
            }
            __.forEach(headers, function (i, v) {
                config.headers[i] = v;
            });
            __.forEach(data, function (i, v) {
                config.data[i] = v;
            });
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status >= 200 && httpRequest.status < 400) {
                    __.callable(config.success).call(httpRequest, httpRequest.response);
                }
                else {
                    __.callable(config.error).call(httpRequest);
                }
                __.callable(config.complete).call(httpRequest);
            }
        };
        if (config.type.toLowerCase() === 'get' && config.data) {
            if (__.isObject(config.data)) {
                if (config.data instanceof FormData)
                    config.data = config.data.toQuery();
                else if (Object.keys(config.data).length)
                    config.data = parseData(config.data);
            }
            if (__.isString(config.data)) {
                if (config.data.startsWith('&') || config.data.startsWith('?'))
                    config.data = config.data.substr(1);
                config.url += ((/\?/).test(config.url) ? "&" : "?") + config.data;
                config.data = null;
            }
        }
        if (config.clearCache) {
            config.url += ((/\?/).test(config.url) ? "&" : "?") + (new Date()).getTime();
        }
        httpRequest.open(config.type.toUpperCase(), config.url, config.async);
        httpRequest.responseType = config.dataType;
        httpRequest.withCredentials = config.crossDomain;
        httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        httpRequest.setRequestHeader('Requested-With', 'XMLHttpRequest');
        if (__.isObject(config.headers)) {
            __.forEach(config.headers, function (key, value) {
                httpRequest.setRequestHeader(key, value);
            });
        }
        // convert data to query string if put or patch
        if (config.type.toLowerCase() === 'put' || config.type.toLowerCase() === 'patch') {
            if (config.data instanceof FormData) {
                config.data = config.data.toQuery();
            }
            else if (__.isObject(config.data)) {
                config.data = parseData(config.data);
            }
        }
        if (__.isObject(config.data) && !(config.data instanceof FormData)) {
            config.data = parseData(config.data);
        }
        if (__.isString(config.data)) {
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        __.tryCatch(function () {
            httpRequest.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    __.callable(config.progress).call(httpRequest, e, e.loaded, e.total);
                }
            };
        });
        httpRequest.send(config.data);
        return httpRequest;
    },
            __ = Object.create({
                debug: true,
                index: 0,
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
                 * data (string|object): The data to send with the request
                 * headers (object): Object of string keys to string values to pass to the request header
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
                    return Ajax(config);
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
                    if (this.isString(content) && !content.trim().startsWith('<'))
                        _content = this.createElement(null, 'span').items[0].innerHTML = content;
                    _content = _(content, this.debug);
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
                 * Sets or gets the attr of the elements
                 * @param {string}|{object} attr
                 * @param {mixed} val
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
                            return;
                        if (!attr)
                            return Array.from(this.items[0].attributes);
                        if (this.items[0].getAttribute(attr) !== null)
                            return this.items[0].getAttribute(attr);
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
                                return this.callable(null, nullable);
                            }
                            func = func[split[i]];
                        }
                        return func === window ? this.callable(null, nullable) : this.callable(func, nullable);
                    }
                    else if (!nullable) {
                        return function () { };
                    }
                    return;
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
                            result = result.concat(Array.from(this.querySelectorAll(query)));
                            if (id)
                                this.removeAttribute('id');
                            return;
                        }
                        result = result.concat(Array.from(this.children));
                    });
                    return _(result, this.debug);
                },
                /**
                 * Generates random string 
                 * @returns {string}
                 */
                randomString: function (len) {
                    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefjhijklmnopqrstuvwxyz',
                            str = '';
                    if (!len)
                        len = 6;
                    while (str.length < len) {
                        str += alpha[Math.floor(Math.random() * 52)];
                    }
                    return str + '-' + Date.now();
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
                    else if (!val && this.items.length && this.items[0].style[attr])
                        return this.items[0].style[attr];
                    else if (!val) {
                        var viewer = this.items[0].ownerDocument.defaultView;
                        if (!viewer || !viewer.opener)
                            viewer = window;
                        return viewer.getComputedStyle(this.items[0])[attr];
                    }
                    this.each(function () {
                        this.style[attr] = val;
                    });
                    return this;
                },
                /**
                 * Sets/Gets a value into/from the dataset
                 * @param {string}|{object} key
                 * @param {mixed} value
                 * @returns {mixed}
                 */
                data: function (key, value) {
                    if (value !== undefined || __.isObject(key)) {
                        this.each(function () {
                            privData.set(this, key, value);
                        });
                        return this;
                    }
                    if (!this.items.length)
                        return;
                    value = privData.get(this.items[0], key);
                    if (value === undefined)
                        value = this.items[0].dataset[key];
                    // ensure that non-string values are returned in their appropriate data types
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
                            newArray = [],
                            _this = this;
                    // deep should be last argument
                    deep = args[args.length - 1];
                    // set to false
                    if (!this.isBoolean(deep))
                        deep = false;
                    this.forEach(args, function (i, o) {
                        if (_this.isArray(o)) {
                            _this.forEach(o, function (j, v) {
                                // not first array param
                                // current is object but not the same as the one
                                // from the existing array
                                if (i && newArray[j]
                                        && ((_this.isArray(newArray[j]) && !_this.isArray(v))
                                                || (_this.isObject(newArray[j]) && !_this.isObject(v))
                                                || (!_this.isObject(newArray[j], true) && !_this.isObject(v, true))
                                                || !deep)) {
                                    // overwrite existing value
                                    newArray[j] = v;
                                }
                                // current is not object or
                                // it is an object but is the first array param
                                // or is an object but not the first and deep not allowed
                                else if (!_this.isObject(v, true) || !i || !deep) {
                                    // append to array
                                    newArray.push(v);
                                }
                                // old and new are the objects and deep is allowed.
                                else {
                                    // overwrite existing value with the extension
                                    // of the exiting with the current
                                    newArray[j] = _this.extend(newArray[j], v, deep);
                                }
                            });
                        }
                        else if (_this.isObject(o)) {
                            _this.forEach(o, function (i, v) {
                                // extend if old and new are object but new isn't an array
                                if (newObject[i] && _this.isObject(newObject[i]) &&
                                        _this.isObject(v) && !_this.isArray(v) && deep)
                                    newObject[i] = _this.extend(newObject[i], v, deep);
                                else
                                    newObject[i] = v;
                            });
                        }
                    });
                    return this.isArray(object)
                            ? newArray : newObject;
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
                        return this.attr(attr) !== null && this.attr(attr) !== undefined;
                    });
                },
                /**
                 * Checks whether
                 * @param string className
                 * @returns boolean
                 */
                hasClass: function (className) {
                    var has = false;
                    if (this.length) {
                        var _this = this,
                                classNames = className.split(' ');
                        this.forEach(Array.from(this.items[0].classList), function (i, v) {
                            var found = 0;
                            _this.forEach(classNames, function (j, w) {
                                if (v === w) {
                                    found++;
                                }
                            });
                            if (found === classNames.length) {
                                has = true;
                                return false;
                            }
                        });
                    }
                    return has;
                },
                /**
                 * Hides the matched elements
                 * @returns __
                 */
                hide: function () {
                    var _this = this;
                    return this.each(function () {
                        var __this = _(this, _this.debug);
                        if (__this.css('display') && __this.css('display') !== 'none')
                            __this.data('display', this.style.display);
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
                 * Checks if the given value exists in the given array
                 * @param {mixed} value
                 * @param {Array} array
                 * @returns boolean
                 */
                inArray: function (value, array) {
                    var clone = this.extend(array);
                    return this.removeArrayValue(clone, value).length > 0;
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
                 * Checks if the given item is a number
                 * @param mixed item
                 * @returns {Boolean}
                 */
                isNumber: function (item) {
                    return !isNaN(item) && !this.isString(item);
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
                 * Returns the next item
                 * @returns {_}
                 */
                next: function () {
                    return _(this.items[this.index++], this.debug);
                },
                /**
                 * Returns the prev item
                 * @returns {_}
                 */
                previous: function () {
                    return _(this.items[--this.index], this.debug);
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
                        _this.forEach(event.replace(',', ' ').split(' '), function (i, v) {
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
                    if (this.isString(content) && !content.trim().startsWith('<'))
                        _content = this.createElement(null, 'span').items[0].innerHTML = content;
                    if (!(content instanceof _))
                        _content = _(content, this.debug);
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
                        if (value !== undefined) {
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
                 * Removes the item at the given index from the given array
                 * @param array array
                 * @param integer index
                 * @returns mixed The removed item
                 */
                removeArrayIndex: function (array, index) {
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
                removeArrayValue: function (array, item, all) {
                    return this.tryCatch(function () {
                        var index = array.indexOf(item), retArr = [];
                        if (index < 0) {
                            index = array.indexOf(parseInt(item));
                        }
                        if (!all) {
                            return index > -1 ? [this.removeArrayIndex(array, index)] : [];
                        }
                        else {
                            while (index > -1) {
                                var value = this.removeArrayIndex(array, index);
                                if (value || value == 0)
                                    retArr.push(value);
                                index = array.indexOf(item);
                                if (index < 0)
                                    index = array.indexOf(parseInt(item));
                            }
                            return retArr;
                        }
                    });
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
                 * Removes a data key
                 * @param {string} key
                 * @returns {ThisApp}
                 */
                removeData: function (key) {
                    return this.each(function () {
                        privData.unset(this, key);
                        delete this.dataset[key];
                    });
                },
                /**
                 * Shortcut to removeAttr('this-*')
                 */
                removeThis: function (attr) {
                    return this.removeAttr('this-' + attr);
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
                            this.id = __.randomString();
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
                    var _this = this;
                    return this.each(function () {
                        var __this = _(this, _this.debug);
                        if (__this.data('display') && __this.data('display') !== 'none') {
                            this.style.display = __this.data('display');
                            __this.removeData('display');
                        }
                        else {
                            this.style.display = '';
                        }
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
                 * Shortcut to calling attr('this-*')
                 */
                this: function (attr, val) {
                    return this.attr('this-' + attr, val);
                },
                /**
                 * Toggles display of matched elements
                 * @returns _
                 */
                toggle: function () {
                    var _this = this;
                    this.each(function () {
                        if (_(this, _this.debug).css('display') === 'none') {
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
                    }, function () {});
                },
                /**
                 * Parse an object to string
                 * @param {Object} object
                 * @returns {String}
                 */
                toJSONString: function (object) {
                    return this.tryCatch(function () {
                        return JSON.stringify(object);
                    }, function () {});
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
                            _(this).attr('value', value);
                            return;
                        }
                        val = this.value;
                    });
                    return value !== undefined ? this : val;
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
                    if (selector.trim().startsWith('<thead') || selector.trim().startsWith('<tbody')) {
                        return this.createElement(selector, 'table');
                    }
                    else if (selector.trim().startsWith('<tr')) {
                        return this.createElement(selector, 'table').children();
                    }
                    else if (selector.trim().startsWith('<td') || selector.trim().startsWith('<th')) {
                        return this.createElement(selector, 'table').children().children();
                    }
                    else if (_this.length) {
                        return _this;
                    }
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
                records: {},
                /**
                 * Binds the target to the model of the given element
                 * @param {_}|{string} _target
                 * @param {_}|{string} _elem
                 * @returns ThisApp
                 */
                bindToElementModel: function (_target, _elem) {
                    _target = this._(_target);
                    _elem = this._(_elem);
                    if (!_target.length || !_elem.length)
                        return this;
                    else if (!_elem.this('mid') ||
                            (!_elem.this('id') && !_elem.this('model'))) {
                        this.error('Element to bind must be already bound to model.');
                        return;
                    }
                    var model_name = _elem.this('model') || _elem.this('id'),
                            _this = this,
                            selector = internal.elementToSelector.call(this, _target, true),
                            _tmpl = this.getCached(selector);
                    if (_tmpl.length) {
                        if (_target.this('tar'))
                            _tmpl.this('tar', _target.this('tar'));
                        _target = _target.replaceWith(_tmpl);
                    }

                    _target = internal.doTar.call(this, _target, true);

                    this.collection(model_name, {
                        success: function (collection) {
                            collection.model(_elem.this('mid'), {
                                url: _elem.this('url'),
                                success: function (model) {
                                    model.bind(_target.this('model', model_name)
                                            .this('mid', _elem.this('mid'))
                                            .this('url', _elem.this('url'))
                                            .this('uid', _elem.this('uid')));
                                }
                            });
                        }
                    });
                    return this;
                },
                /**
                 * Binds an elem to the given object
                 * @param {_}|{HTMLElement} elem
                 * @param {Object} object
                 * @param {string}|{integer} key The unique identifier of the object, if coming
                 * from a list
                 * @returns {_}
                 */
                bindToObject: function (elem, object, callback) {
                    var notWiths = internal.hideNotWiths.call(this, elem);
                    internal.emptyFeatures.call(this, elem);
                    return internal.loadComponents.call(this, function () {
                        return internal.parseData.call(this, object, elem, false, true, function (elem) {
                            internal.loadFormElements.call(this, elem.find('[this-is]'), object);
                            internal.showNotWiths.call(this, elem, notWiths);
                            elem.trigger('model.binded', {
                                data: object
                            });
                            this.__.callable(callback).apply(this, Array.from(arguments));
                        }.bind(this));
                    }.bind(this), elem.find('[this-component]'));
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
                    if (update && __data[id]) {
                        // save data to id
                        __data[id] = this.__.extend(__data[id], data, true);
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
                 * @param {Object} context
                 * @returns {Boolean}
                 */
                canContinue: function (action, params, context) {
                    var response = true;
                    // check callback of page
                    if (this.page && this.beforeCallbacks[this.page.this('id')]) {
                        response = this.__.callable(this.beforeCallbacks[this.page.this('id')][action])
                                .apply(context || this, params);
                    }
                    // check common callback only if page callback didn't return false or doesn't exist
                    if (response !== false && this.beforeCallbacks['___common']) {
                        response = this.__.callable(this.beforeCallbacks['___common'][action])
                                .apply(context || this, params);
                    }
                    return response || response !== false;
                },
                /**
                 * Check if container is a table's descendant tag
                 * and properly parses it.
                 * @param {_}|{string} container
                 * @returns {array}
                 */
                checkTableContent: function (container) {
                    container = this._(container);
                    // for processing table and its descendants' templates
                    var level = 0,
                            // the template element
                            child = container.get(0);
                    if (child) {
                        // process content properly
                        switch (child.tagName.toLowerCase()) {
                            case "td":
                                level = 3;
                                container = this._('<table />').html(container.outerHtml());
                                break;
                            case "tr":
                                level = 2;
                                container = this._('<table />').html(container.outerHtml());
                                break;
                        }
                    }
                    return {
                        level: level,
                        container: container
                    };
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
                 * Called when a component has been loaded
                 * @param {_} components All components being loaded
                 * @param {Function} callback Function to call when all components have been loaded
                 * @param Tracks the remaining components to be loaded befoe callback should be called
                 */
                componentLoaded: function (components, callback, remaining) {
                    if (!remaining)
                        this.__.callable(callback).call(this);
                    else {
                        var _this = this;
                        internal.loadComponent
                                .call(this, components.get(components.length - remaining),
                                        function () {
                                            remaining--;
                                            internal.componentLoaded.call(_this, components, callback, remaining);
                                        });
                    }
                },
                /**
                 * Dispatches a page event for only the page
                 * @param {String} event
                 * @param {Object} anchor
                 * @param {Array} params
                 */
                dispatchEvent: function (event, anchor, params) {
                    return this.__.callable(containedEvents[event][this.page.this('id')])
                            .apply(anchor, params);
                },
                /**
                 * Does the loading
                 * @param {HTMLElement}|{_} container
                 * @param object data
                 * @param string content
                 * @param {boolean} isModel Indicates whether loading a model or not
                 * @param {Function} callback
                 * @returns ThisApp
                 */
                doLoad: function (container, data, content, isModel, level, callback) {
                    container = this._(container).hide();
                    var uid = container.this('model-uid') ||
                            container.this('uid') || '',
                            id = internal.getUIDValue.call(this, data, uid),
                            url = container.this('url') || '',
                            url_parts = url.split('?');
                    url = url_parts[0];
                    if (url && !url.endsWith('/'))
                        url += '/';
                    var _callback = function (_temp) {
                        internal.loadFormElements
                                .call(this, _temp.find('[this-is]'), data);
                        while (level) {
                            _temp = _temp.children();
                            level--;
                        }
                        if (!isModel) {
                            _temp.this('mid', id)
                                    .this('uid', uid)
                                    .this('type', 'model')
                                    .this('in-collection', '');
                            if (!_temp.this('url'))
                                _temp.this('url', url + id);
                            if (container.this('model'))
                                _temp.this('id', container.this('model'));
                            container[container.hasAttr('this-prepend')
                                    ? 'prepend' : 'append'](_temp.show())
                                    .removeThis('loading');
                        }
                        else {
                            container.this('uid', uid).this('mid', id);
                            container.html(_temp.html()).show();
                        }
                        this.__.callable(callback).call(this, container);
                    }.bind(this);
                    internal.parseData
                            .call(this, data, isModel ? container : content, false, isModel, _callback);
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
                    var type = getElemType(__this) || '',
                            tar = type + '#' + __this.this('id');
                    if (this.tar[tar]) {
                        this.__.forEach(this.tar[tar], function (i, v) {
                            __this.this('' + i, v);
                        });
                        delete this.tar[tar];
                    }
                    if (__this.this('tar')) {
                        var tar = __this.this('tar').split(';');
                        this.__.forEach(tar, function (i, v) {
                            var split = v.split(':');
                            if (split.length < 2)
                                return;
                            __this.this('' + split[0], split[1]);
                        });
                    }
                    if (!noShow && type !== 'page')
                        __this.show();
                    return __this.removeThis('tar');
                },
                /**
                 * Converts an element to selector string
                 * @param {_} elem
                 * @param {boolean} ignoreType
                 * @returns {string}
                 */
                elementToSelector: function (elem, ignoreType) {
                    elem = this._(elem);
                    var selector = elem.get(0).tagName.toLowerCase();
                    if (elem.this('id'))
                        selector += '[this-id="' + elem.this('id') + '"]';
                    if (!ignoreType && elem.this('type'))
                        selector += '[this-type="' + elem.this('type') + '"]';
                    if (elem.attr('class'))
                        selector += '.' + elem.attr('class').replace(/\s/g, '.');
                    return selector;
                },
                /**
                 * Empty lists, models and collections in the given elem.
                 * When these are being loaded, their content is gotten from the
                 * templates.
                 * @param {_}|{HTMLElement} elem
                 * @param {boolean} emptyLoaded Indicates whether to empty loaded features as well
                 * @returns {ThisApp}
                 */
                emptyFeatures: function (elem, emptyLoaded) {
                    this._(elem)
                            .find(emptyLoaded ?
                                    'list,collection,[this-type="list"],[this-type="model"],[this-type="collection"]'
                                    : 'list:not([this-loaded]),model:not([this-loaded])'
                                    + ',collection:not([this-loaded]),[this-type="list"]:not([this-loaded])'
                                    + ',[this-type="collection"]:not([this-loaded])')
                            .each(function () {
                                this.innerHTML = '';
                            });
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
                    return this.tryCatch(function () {
                        return eval(content);
                    }, function () {
                        return;
                    });
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
                                    + __layout.this('extends')
                                    + '"],[this-type="layout"][this-id="'
                                    + __layout.this('extends') + '"]');
                    // layout doesn't exist in container
                    if (!_layout.length)
                        // get from templates
                        _layout = this.getCached('[this-type="layouts"] [this-id="'
                                + __layout.this('extends') + '"]', 'layout');
                    // doesn't exist in templates
                    if (!_layout.length) {
                        // get from filesystem
                        internal.fullyFromURL.call(this, 'layout', __layout.this('extends'),
                                function (_layout) {
                                    __layout.removeThis('extends');
                                    _layout.removeThis('url')
                                            .find('[this-content]').html(__layout);
                                    if (_layout.this('extends'))
                                        internal.extendLayout
                                                .call(_this, _layout, replaceInState);
                                    else
                                        internal.finalizePageLoad
                                                .call(_this, _layout, replaceInState);
                                },
                                function () {
                                    _this.error('Layout [' + __layout.this('extends')
                                            + '] not found!');
                                    __layout.removeThis('extends');
                                    internal.finalizePageLoad.call(_this, __layout, replaceInState);
                                });
                    }
                    else {
                        __layout.removeThis('extends');
                        if (_layout.this('url')) {
                            this.request({
                                url: _layout.this('url'),
                                success: function (data) {
                                    _layout.removeThis('url')
                                            .html(data)
                                            .find('[this-content]')
                                            .html(__layout.show());
                                    if (_layout.this('extends')) {
                                        internal.extendLayout.call(_this, _layout, replaceInState);
                                    }
                                    else {
                                        internal.finalizePageLoad.call(_this, _layout,
                                                replaceInState);
                                    }
                                },
                                error: function () {
                                },
                                dataType: 'text'
                            });
                        }
                        else {
                            _layout.find('[this-content]')
                                    .html(__layout.removeThis('extends').show());
                            if (_layout.this('extends')) {
                                internal.extendLayout.call(this, _layout, replaceInState);
                            }
                            else {
                                internal.finalizePageLoad.call(this, _layout, replaceInState);
                            }
                        }
                    }
                },
                /**
                 * Fills an autocomplete list with the data given
                 * @param {string} selector
                 * @param {object} data
                 * @param {string} uid
                 * @param {boolean} emptyList Indicates whether to empty the list
                 * before filling
                 * @returns {array} Array of ids added to the list
                 */
                fillAutocompleteList: function (options) {
                    var _list = this.container.find(options.selector),
                            _this = this,
                            ids = [];
                    if (options.emptyList)
                        _list.html('');
                    // loop through data
                    this.__.forEach(options.data, function (i, v) {
                        // get unique id value
                        var id = internal.getUIDValue.call(_this, v);
                        ids.push(id);
                        _list.append(_this
                                .getCached(options.selector)
                                .children()
                                .removeThis('cache')
                                .this('index', i)
                                .this('key', id));
                        // bind object to element
                        internal.bindToObject
                                .call(_this, _list.children('[this-key="' + id + '"]'), v,
                                        function (elem) {
                                            // avoid showing elem if already
                                            // selected
                                            var selected = _list
                                                    .this('selected') || '';
                                            if (selected.indexOf(id + ',') !== -1)
                                            {
                                                elem.remove();
                                                return;
                                            }
                                            elem.show();
                                        });
                    });
                    if (_list.children(':not([this-cache])').length)
                        _list.show();
                    else
                        _list.hide();
                    return ids;
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
                        this.container.html(_layout.show());
                        _layout.trigger('layout.loaded');
                    }
                    else
                        this.container.html(this.page);
                    this.page = this.container
                            .find('page[this-id="' + this.page.this('id')
                                    + '"]:not([this-dead]),'
                                    + '[this-type="page"][this-id="'
                                    + this.page.this('id')
                                    + '"]:not([this-dead])')
                            .this('current', '')
                            .removeThis('layout').hide();
                    this.container.find('[this-type]:not([this-type="page"]):not(page)'
                            + ':not(layout):not([this-type="layout"])'
                            + ':not(component):not([this-type="component"])').hide();
                    // delete pageModel for last page
                    delete this.pageModel;
                    this.pageIsLoaded = false;
                    // callback for when page assets have been loaded
                    var loadedAssets = function () {
                        internal.loadComponents.call(this, function () {
                            this.page = internal.doTar.call(this, this.page).hide();
                            // load page as model if attached to a model
                            if (this.page.this('url') && this.page.this('model')) {
                                // get page model's collection
                                this.collection(this.page.this('model'), {
                                    success: function (collection) {
                                        collection.model(this.page.this('mid'), {
                                            url: this.page.this('url'),
                                            success: function (model) {
                                                this.pageModel = model;
                                                // load page model. data provided
                                                internal.loadModel.call(this, this.page, function () {
                                                    internal.showPage.call(this, replaceInState);
                                                }.bind(this), model.attributes || {});
                                            }.bind(this),
                                            error: function () {
                                                // load page model. no data provided. request anew
                                                internal.loadModel.call(_this, this.page, function () {
                                                    internal.showPage.call(this, replaceInState);
                                                }.bind(_this), {});
                                            }
                                        });
                                    }.bind(this)
                                });
                            }
                            else {
                                internal.showPage.call(this, replaceInState);
                            }
                        }.bind(this));
                    }.bind(this);
                    // load page content from elsewhere
                    if (this.page.this('path')) {
                        this.request({
                            url: this.page.this('path'),
                            success: function (data) {
                                _this.page.html(data).show()
                                        .find('[this-type]'
                                                + ':not(component):not([this-type="component"])')
                                        .hide();
                                internal.loadAssets.call(_this, _this.page, loadedAssets);
                            },
                            error: function () {
                            },
                            dataType: 'text'
                        });
                    }
                    // just load the page assets
                    else {
                        internal.loadAssets.call(this, this.page, loadedAssets);
                    }
                },
                /**
                 * Loads a type fully from URL
                 * @param {string} type page || layout || component
                 * @param {string} idOrPath
                 * @param {boolean} replaceInState
                 * @returns {void}
                 */
                fullyFromURL: function (type, idOrPath, success, error) {
                    if (!this.config.paths) {
                        this.__.callable(error).call(this);
                        return;
                    }
                    var _this = this,
                            pathConfig = this.config.paths[type + 's'];
                    if (!this.__.isObject(pathConfig)) {
                        this.__callable(error).call(this);
                        return;
                    }
                    var url = pathConfig.dir + idOrPath + pathConfig.ext;
                    this.request({
                        url: url,
                        success: function (data) {
                            var elem = _this.__.createElement(data),
                                    prep4Tmpl = function (elem) {
                                        elem.find('[this-type="collection"]:not([this-model]),collection:not([this-model])')
                                                .each(function () {
                                                    _this._(this).this('model', _this._(this).this('id'));
                                                });
                                        elem.find('[this-type="list"],list')
                                                .each(function () {
                                                    var _list = _this._(this).hide();
                                                    if (_list.hasAttr('this-selection-list'))
                                                        elem.find('[this-type="list"][this-id="'
                                                                + _list.this('selection-list')
                                                                + '"],list[this-id="'
                                                                + _list.this('selection-list')
                                                                + '"]')
                                                                .this('parent-list',
                                                                        _list.this('id'));
                                                });
                                    };
                            // components
                            if (type === 'component') {
                                if (elem.length > 1)
                                    elem = _this._('<div/>').html(elem);
                                elem.this('component-url', idOrPath);
                                prep4Tmpl(elem);
                                _this.addTemplate(_this._('<div this-type="component"'
                                        + ' this-url="' + idOrPath + '" />')
                                        .html(elem.clone().removeThis('url')));
                            }
                            // pages and layouts
                            else {
                                if (!elem.length || elem.length > 1) {
                                    elem = _this._('<div this-type="' + type + '" />')
                                            .html(data);
                                }
                                else if (!elem.is(type) && elem.this('type') !== type) {
                                    elem.this('type', type);
                                }
                                // overwrite id from idOrPath
                                elem.this('id', idOrPath.replace(/\/\\/g, '-'));
                                if (type === 'page') {
                                    if (idOrPath.indexOf('/') !== -1)
                                        elem.this('path', idOrPath);
                                    prep4Tmpl(elem);
                                }
                                _this.addTemplate(elem);
                            }
                            internal.emptyFeatures.call(_this, elem);
                            _this.__.callable(success).call(this, elem.clone());
                        },
                        error: function (e) {
                            _this.__.callable(error).call(this, e);
                        },
                        dataType: 'text'
                    });
                },
                /**
                 * Generates a key for the request
                 */
                generateRequestKey: function () {
                    if (!internal.isRunning.call(this))
                        return;
                    var key = this.__.randomString(12);
                    internal.record.call(this, 'requestKey', key);
                    return key;
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
                 * Fetches and clears the generated request key
                 * @returns {string}
                 */
                getRequestKey: function () {
                    if (!internal.isRunning.call(this))
                        return;
                    var key = internal.record.call(this, 'requestKey');
                    delete internal.records[this.container.this('id')].requestKey;
                    return key;
                },
                /**
                 * Fetches the value of the uid of the given data
                 * @param {object} data
                 * @param {string} uid If not provided, the default in the config is fallen
                 * back to
                 * @returns {mixed}
                 */
                getUIDValue: function (data, uid) {
                    return internal.getDeepValue.call(this, uid || this.config.modelUID, data);
                },
                /**
                 * Retrieves the value of the variable from the data and filters it if required
                 * @param {string} variable
                 * @param {object} data
                 * @returns {mixed}
                 */
                getVariableValue: function (variable, data) {
                    if (!variable)
                        return;
                    var _this = this,
                            vars = variable.replace(/{*}*/g, '')
                            .replace(/\\\|/g, '__fpipe__').split('|'),
                            key = this.__.removeArrayIndex(vars, 0),
                            value = this.__.contains(key, '.') ?
                            internal.getDeepValue.call(null, key, data) : data[key];
                    if (value || value == 0)
                        this.__.forEach(vars, function (i, v) {
                            v = v.replace(/__fpipe__/g, '|');
                            var exp = v.split(':'), filter = _this.__.removeArrayIndex(exp, 0);
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
                 * Hides elements that should not be loaded with the given element
                 */
                hideNotWiths: function (elem) {
                    // hold not withs
                    var _not_with = elem.find('[this-not-with="'
                            + elem.this('model') || elem.this('id')
                            + '"]'),
                            cnt = 0,
                            notWiths = {};
                    if (!elem.this('id'))
                        elem.this('id', this.__.randomString());
                    while (_not_with.length) {
                        var name = elem.this('id') + cnt;
                        notWiths[name] = _not_with.get(0);
                        this._(_not_with.get(0)).replaceWith('<div this-with="'
                                + name + '" />');
                        // find next notWith
                        _not_with = elem.find('[this-not-with="'
                                + elem.this('id') + '"]');
                        cnt++;
                    }
                    return notWiths;
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
                    var good = this.tryCatch(function () {
                        if (filter && !eval(filter))
                            return false;
                        return true;
                    }, function () {
                        return false;
                    });
                    if (!good)
                        return;
                    content = this._('<div/>').html(content);
                    var _this = this, level = 0, matched = {};
                    content.find('[this-each],collection,model,list'
                            + '[this-type="collection"],[this-type="model"],[this-type="list"]')
                            .each(function () {
                                var __this = _this._(this);
                                __this.html(__this.html()
                                        .replace(/\{\{/g, '__obrace__')
                                        .replace(/\}\}/g, '__cbrace__')
                                        .replace(/\(\{/g, '__obrace2__')
                                        .replace(/\}\)/g, '__cbrace2__'));
                                if (__this.this('each')) {
                                    __this.find('[this-if], [this-else-if], [this-else]')
                                            .this('ignore', '').this('muted', '');
                                }
                            });
                    content.find('[this-if],[this-else-if],[this-else]')
                            .each(function () {
                                var __this = _this._(this);
                                if (__this.hasAttr('this-ignore'))
                                    return;
                                else if (__this.this('if'))
                                {
                                    try {
                                        level++;
                                        matched[level] = false;
                                        if (eval(__this.this('if').trim())) {
                                            __this.removeThis('if');
                                            matched[level] = true;
                                        }
                                        else {
                                            __this.remove();
                                        }
                                    }
                                    catch (e) {
                                        __this.remove();
                                    }
                                    if (__this.hasAttr('this-end-if')) {
                                        __this.removeThis('end-if');
                                        delete matched[level];
                                        level--;
                                    }
                                }
                                else if (__this.this('else-if'))
                                {
                                    try {
                                        if (!__.isBoolean(matched[level])) {
                                            _this.error('Branching error: Else-if without If!');
                                            return;
                                        }
                                        if (matched[level] || !eval(__this.this('else-if').trim()))
                                            __this.remove();
                                        else {
                                            __this.removeThis('else-if');
                                            matched[level] = true;
                                        }
                                    }
                                    catch (e) {
                                        __this.remove();
                                    }
                                    if (__this.hasAttr('this-end-if')) {
                                        __this.removeThis('end-if');
                                        delete matched[level];
                                        level--;
                                    }
                                }
                                else if (__this.hasAttr('this-else')) {
                                    try {
                                        if (!__.isBoolean(matched[level])) {
                                            _this.error('Branching error: Else without If!');
                                            return;
                                        }
                                        if (matched[level])
                                            __this.remove();
                                        else {
                                            __this.removeThis('else');
                                        }
                                    }
                                    catch (e) {
                                        __this.remove();
                                    }
                                    if (__this.hasAttr('this-end-if'))
                                        __this.removeThis('end-if');
                                    delete matched[level];
                                    level--;
                                }
                            });
                    content.find('[this-ignore]').removeThis('ignore');
                    return content.html();
                },
                /**
                 * Checks that the type of container matches the given type
                 * @param string type
                 * @param string|_ container
                 * @returns booean
                 */
                is: function (type, container) {
                    return this._(container).this('type') === type || this._(container).is(type);
                },
                /**
                 * Check if an app is running
                 */
                isRunning: function () {
                    var record;
                    if (this.container)
                        record = internal.record.call(this);
                    return record && record.running;
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
                            _this = this,
                            load = function (url) {
                                if (type === 'js') {
                                    eval(pageAssets['js'][url]);
                                }
                                else if (type === 'css') {
                                    elem.prepend('<style type="text/css">' + pageAssets['css'][url] + '</style>');
                                }
                                this.__.callable(callback).call(this, pageAssets[type][url]);
                            }.bind(this);

                    // ensure url ends with .type (.js|.css|...)
                    if (!url.endsWith('.' + type))
                        url += '.' + type;
                    if (!pageAssets[type])
                        pageAssets[type] = {};
                    if (internal.record.call(this, 'debug') || !pageAssets[type][url]) {
                        this.request({
                            dataType: type,
                            url: url,
                            success: function (content) {
                                pageAssets[type][url] = content;
                            },
                            complete: function () {
                                load(url);
                            }
                        });
                    }
                    else {
                        load(url);
                    }
                    return internal;
                },
                /**
                 * Loads the assets (css|js) for the given element
                 * @param {_} elem
                 * @returns {internal}
                 */
                loadAssets: function (elem, callback) {
                    var _this = this,
                            elemType = getElemType(elem) || '',
                            leaveUnrequired;
                    if (elem.this('load-css') && !elem.hasAttr('this-with-css')) {
                        // load comma-separated css files
                        this.__.forEach(elem.this('load-css').split(','),
                                function (i, css) {
                                    internal.loadAsset.call(_this, 'css', css, elem);
                                });
                        elem.this('with-css', '').removeThis('load-css');
                    }

                    // mark all scripts as old by removing attribute `this-loaded`
                    if (!Object.keys(this.removedAssets).length)
                        this._('script[this-app="' + this.container.this('id') + '"]')
                                .removeThis('loaded');
                    if (elem.this('load-js-first') && !loadedPageJS.first[this.page.this('id')])
                    {
                        leaveUnrequired = true;
                        var jses = elem.this('load-js-first').split(','),
                                removedAssets = this.removedAssets[elemType];
                        // load comma-separated css files
                        this.__.forEach(jses, function (i, js) {
                            internal.loadAsset.call(_this, 'js', js, elem, function () {
                                // loaded js is last js
                                if (jses.length - 1 === i) {
                                    // remove elem-type css and js files that don't belong to
                                    // the elem type
                                    if (!removedAssets)
                                        _this._('script[this-app="' + _this.container.this('id')
                                                + '"][this-for="' + elemType + '"]:not([this-loaded])')
                                                .remove();
                                    // call callback function
                                    _this.__.callable(callback).call(_this);
                                }
                            });
                        });
                        loadedPageJS.first[this.page.this('id')] = true;
                    }
                    // remove elem-type js files that don't belong to the elem type
                    if (!leaveUnrequired && !this.removedAssets[elemType])
                        this._('script[this-app="' + this.container.this('id')
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
                 * @param {Function} callback
                 * @param {Object} data The data to load into the collection. If available and a url
                 * exists on __this, it is monitored for changes to the data.
                 * @param {boolean} replaceState
                 * @returns {void}
                 */
                loadCollection: function (__this, callback, data, replaceState) {
                    __this = this._(__this).this('loading', '');
                    // collection must have id
                    if (!__this.this('id')) {
                        __this.removeThis('loading');
                        this.__.callback(callback).call(this);
                        return;
                    }
                    if (!__this.this('model'))
                        __this.this('model', __this.this('id'));
                    // ensure collection content is grouped together
                    if (!__this.hasAttr('this-loaded') && __this.children().length > 1) {
                        __this.innerWrap('<div/>');
                    }
                    // get collection content
                    var content = this.getCached('[this-id="'
                            + __this.this('id') +
                            '"]', 'collection')
                            .children()
                            .clone().removeThis('cache').outerHtml(),
                            _this = this,
                            model_name = __this.this('model'),
                            model_to_bind = this.container.find('model[this-id="' + model_name
                                    + '"],[this-type="model"][this-id="' + model_name
                                    + '"]');
                    __this = internal.doTar.call(this, __this, true);
                    if (!__this.hasAttr('this-paginate') ||
                            !__this.children(':first-child').this('mid')) {
                        __this.html('');
                    }
                    if (model_name && model_to_bind.length)
                        model_to_bind.this('bind', true);
                    var requestData = {}, save = true, success, error;
                    if (_this.page.this('query')) {
                        requestData['query'] = _this.page.this('query');
                        /* don't save search response requestData */
                        save = false;
                    }
                    if (__this.this('search'))
                        requestData['keys'] = __this.this('search');
                    // paginate collection
                    if (__this.hasAttr('this-paginate')) {
                        // update pagination
                        if (!__this.this('pagination-page')) {
                            __this.this('pagination-page', 0);
                        }
                        // add request data with pagination info
                        if (__this.this('pagination-page') !== undefined) {
                            requestData['page'] = parseInt(__this.this('pagination-page')) + 1;
                            __this.this('pagination-page', requestData['page']);
                            // add limit
                            if (__this.this('paginate')) {
                                requestData['limit'] = __this.this('paginate');
                            }
                            else if (this.config.pagination && this.config.pagination.limit) {
                                requestData['limit'] = this.config.pagination.limit;
                            }
                        }
                    }
                    // callbacks for request
                    success = function (data, uid, handled) {
                        if (uid)
                            __this.this('model-uid', uid);
                        if (handled) {
                            _this.__.callable(callback).call(_this, data);
                            return;
                        }
                        internal.loadData
                                .call(_this, __this, data, content, false, save,
                                        function (elem) {
                                            if (elem) {
                                                elem.this('loaded', '')
                                                        .removeThis('loading')
                                                        .trigger('collection.loaded');
                                            }
                                            this.__.callable(callback).call(this, data);
                                        }.bind(_this));
                    },
                            error = function () {
                                // revert pagination page to former page count
                                if (__this.this('pagination-page') !== undefined) {
                                    __this.this('pagination-page', parseInt(__this.this('pagination-page')) - 1);
                                }
                                __this.removeThis('loading');
                                _this.__.callable(callback).call(_this);
                            };
                    internal.loadOrRequestData.call(this, {
                        elem: __this,
                        content: content,
                        data: data,
                        success: success,
                        error: error,
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
                            + ':not([this-data]):not([this-loading]),'
                            + '[this-type="collection"]:not([this-loaded])'
                            + ':not([this-data]):not([this-loading])'),
                            length = collections.length;
                    if (chain && !length)
                        internal.loadForms.call(this, null, null, replaceState, chain);
                    else
                        collections.each(function () {
                            internal.loadCollection.call(_this, this, function () {
                                length--;
                                if (chain && !length)
                                    internal.loadForms.call(this, null, null, replaceState, chain);
                            }.bind(_this), null, replaceState);
                        });
                    return this;
                },
                /**
                 * Loads a single component
                 * @param {_} __this The component placeholder
                 * @param {function} callback To be called when all components have been loaded
                 * @param {_} component The component template
                 * @returns {void}
                 */
                loadComponent: function (__this, callback, component) {
                    __this = this._(__this);
                    var _this = this;
                    // component does not exist
                    if (!component || !this._(component).length) {
                        if (__this.this('url')) {
                            var cached = this
                                    .getCached('[this-url="' + __this.this('url') + '"]', 'component');
                            if (cached.length)
                                internal.loadComponent.call(this, __this, callback, cached.children().clone().show());
                            else {
                                internal.fullyFromURL
                                        .call(_this, 'component', __this.this('url'),
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
                            component = this.getCached('[this-id="'
                                    + __this.this('component') + '"]', 'component');
                            if (!component.length) {
                                this.__.callable(callback).call(this);
                            }
                            else
                                internal.loadComponent.call(this, __this, callback, component);
                        }
                        return internal;
                    }
                    component = this._(component).clone();
                    if (component.is('component') || component.this('type') === 'component')
                        component.removeThis('url');

                    // load component
                    __this.replaceWith(component.show()).trigger('component.loaded');
                    this.__.callable(callback).call(this);
                },
                /**
                 * Loads all components in the current page
                 * @param function callback To be called when all components have been loaded
                 * @returns ThisApp
                 */
                loadComponents: function (callback, components) {
                    var _this = this,
                            components = components || this.container.find('[this-component]'),
                            loaded = 0, length = components.length;
                    if (!length) {
                        this.__.callable(callback).call(this);
                    }
                    else {
                        internal.loadComponent.call(_this, components.get(0), function () {
                            length--;
                            internal.componentLoaded.call(this, components, callback, length);
                        }.bind(this));
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
                 * @param {Function} callback What to do after loading the data
                 * @returns ThisApp
                 */
                loadData: function (container, data, content, isModel, save, callback) {
                    container = this._(container);
                    var hidePaginationBtns = function () {
                        // was paginating
                        if (container.hasAttr('this-paginate')) {
                            // next button
                            var selector = '[this-paginate-next="'
                                    + container.this('id')
                                    + '"],[this-paginate-previous="'
                                    + container.this('id') + '"]',
                                    selector2 = '[this-paginate-next=""],[this-paginate-previous=""]';
                            setTimeout(function () {
                                // hide pagination button selector 
                                this.container.find(selector).hide();
                                // hide sibling buttons
                                container.siblings(selector2).hide();
                            }.bind(this));
                            // reset page index to previous
                            container.this('pagination-page', parseInt(container.this('pagination-page')) - 1);
                        }
                    }.bind(this);
                    // trigger invalid.response trigger if no data
                    if (!data) {
                        hidePaginationBtns();
                        container.trigger('invalid.response');
                        this.__.callable(callback).call(this);
                        return;
                    }
                    // default data structure
                    var _data = {
                        data: {},
                        // set expiration timestamp to 24 hours
                        expires: new Date().setMilliseconds(1000 * 3600 * 24)
                    },
                            real_data = getRealData.call(this, data);
                    // get expiration if set and data from dataKey if specified
                    if (this.config.dataKey) {
                        // set data expiration timestamp too.
                        if (!isNaN(data.expires)) // expiration is a number. Must be milliseconds
                            _data.expires = new Date().setMilliseconds(1000 * data.expires);
                        else if (this.__.isString(data.expires)) // expiration is a string. Must be date
                            _data.expires = new Date(data.expires).getTime();
                        data = real_data;
                    }
                    // trigger empty.response trigger if no data
                    if (!data || !this.__.isObject(data, true) || !Object.keys(data).length) {
                        hidePaginationBtns();
                        container.trigger('empty.response');
                        this.__.callable(callback).call(this);
                        return;
                    }
                    var save_as = container.this('model')
                            || container.this('id'),
                            _callback = function () {
                                container.removeThis('filter').show();
                                if (container.hasAttr('this-static')) {
                                    var id = container.this('id'),
                                            type = getElemType(container);
                                    // replace template with the loaded element
                                    this.replaceCached(type + '[this-id="' + id
                                            + '"],[this-type="' + type + '"][this-id="'
                                            + id + '"]', container.this('loaded', ''));
                                }
                                this.__.callable(callback).apply(this, Array.from(arguments));
                            }.bind(this);
                    // loading a collection
                    if (this.__.isArray(data) || isModel === false) {
                        // check if can continue with rendering
                        var __data = internal.canContinue
                                .call(this, 'collection.render', [data], container.get(0));
                        // rendering canceled
                        if (!__data) {
                            return this;
                        }
                        // rendering continues. Overwrite data with returned value if object 
                        else if (this.__.isObject(__data, true))
                            data = __data;
                        var _this = this,
                                // filter for the collection
                                filter = container.this('filter'),
                                // unique id key for models
                                uid = container.this('model-uid'),
                                // the url of the collection/model
                                url = container.this('url'),
                                tab_cont = internal.checkTableContent.call(this, content),
                                level = tab_cont.level,
                                content = tab_cont.container.outerHtml();
                        this.collectionData = Object.keys(this.cacheTargets || data).length;
                        var done = function () {
                            // was paginating
                            if (container.hasAttr('this-paginate')) {
                                // next button
                                var selector = '[this-paginate-next="'
                                        + container.this('id')
                                        + '"]',
                                        selector2 = '[this-paginate-next=""]';
                                // overwrite is on
                                if ((container.hasAttr('this-paginate-overwrite')
                                        && container.this('paginate-overwrite') === 'true')
                                        || (!container.hasAttr('this-paginate-overwrite')
                                                && this.config.pagination
                                                && this.config.pagination.overwrite)
                                        // and current page is the first
                                        && container.this('pagination-page') === 1) {
                                    // hide previous button too
                                    selector += ',[this-paginate-previous="'
                                            + container.this('id') + '"]';
                                    selector2 += ',[this-paginate-previous=""]';
                                }
                                // hide pagination button selector 
                                this.container.find(selector).hide();
                                // hide sibling buttons
                                container.siblings(selector2).hide();

                                // reset page index to previous
                                container.this('pagination-page', parseInt(container.this('pagination-page')) - 1);
                            }
                        }.bind(this);
                        // data is not empty
                        if (this.collectionData) {
                            // inline overwrite command exist
                            if (container.hasAttr('this-paginate-overwrite')) {
                                // empty collection element if true
                                if (container.this('paginate-overwrite') === 'true') {
                                    container.html('');
                                }
                            }
                            // inline command not exist. check config pagination command
                            else if (this.config.pagination && this.config.pagination.overwrite) {
                                container.html('');
                            }
                            // the indices of the all models in collection
                            var indices = [],
                                    doneLoading = function () {
                                        if (!--this.collectionData) {
                                            delete this.collectionData;
                                            this.__.callable(_callback).call(this, container);
                                        }
                                    }.bind(this);
                            // needed for subsequent pagination attempts
                            this.__.forEach(this.cacheTargets || data, function (_index, _model) {
                                var index, model;
                                if (_this.cacheTargets) {
                                    index = _model;
                                    model = data[index];
                                }
                                else {
                                    model = _model;
                                    index = internal.getUIDValue.call(_this, _model);
                                }
                                var _tmpl = _this._(content),
                                        __data = internal.canContinue
                                        .call(_this, 'collection.model.render', [model, container.get(0)], _tmpl.get(0));
                                // remove model if already exists in collection element
                                container.children('[this-mid="' + index + '"]').remove();
                                // get id from model with uid
                                var id = internal.getUIDValue.call(_this, model, uid);
                                // keep index for later cached pagination
                                indices.push(id || index);
                                // if saving data is allowed
                                if (save !== false) {
                                    // set model into data to save. use id if available,
                                    // or else index
                                    if (container.hasAttr('this-paginate')) {
                                        _data.data[id || index] = _this.__.extend(model, {__page: container.this('pagination-page')});
                                    }
                                    else {
                                        _data.data[id || index] = model;
                                    }
                                }

                                if (!__data) {
                                    doneLoading();
                                    return;
                                }
                                else if (_this.__.isObject(__data))
                                    model = __data;
                                // process content as being in a loop
                                var _content = internal.inLoop.call(_this, {
                                    index: index,
                                    model: model
                                }, filter,
                                        _tmpl.outerHtml().replace(/{{_index}}/g, index));
                                // if there's no content, go to the next model
                                if (!_content) {
                                    _this.__.callable(callback).call(_this);
                                    return;
                                }
                                // process expressions in content
                                _content = _this._(internal.processExpressions.call(_this,
                                        _content, {
                                            index: index,
                                            model: model
                                        }));
                                if (!uid)
                                    uid = _this.config.modelUID;
                                var uid_parts = uid.split('.').reverse(),
                                        _id = {},
                                        top_uid = uid_parts.pop();
                                // uid must exist in model
                                if (!model[top_uid]) {
                                    $.each(uid_parts, function (i, v) {
                                        if (!i)
                                            _id[v] = id || index;
                                        else
                                            _id[v] = _id;
                                    });
                                    model[top_uid] = _id;
                                }
                                // continue loading
                                internal.doLoad.call(_this, container, model, _content,
                                        false, level, doneLoading);
                            });
                            delete this.cacheTargets;

                            var pageIndex = container.this('pagination-page');
                            if (pageIndex !== undefined) {
                                // first page loaded
                                if (pageIndex == 1) {
                                    // hide previous button
                                    this.container.find('[this-paginate-previous="'
                                            + container.this('id') + '"]').hide();
                                    container.siblings('[this-paginate-previous=""]').hide();
                                }
                                // overwrite is one
                                else if ((container.hasAttr('this-paginate-overwrite')
                                        && container.this('paginate-overwrite') === 'true')
                                        || (!container.hasAttr('this-paginate-overwrite')
                                                && this.config.pagination
                                                && this.config.pagination.overwrite)) {
                                    // show previous button
                                    this.container.find('[this-paginate-previous="'
                                            + container.this('id') + '"]').show();
                                    container.siblings('[this-paginate-previous=""]').show();
                                }
                                // show next button
                                this.container.find('[this-paginate-next="'
                                        + container.this('id') + '"]').show();
                                container.siblings('[this-paginate-next=""]').show();
                            }
                            // if saving data is allowed
                            if (save !== false) {
                                // save uid
                                _data.uid = uid;
                                // save url
                                _data.url = url;
                                if (container.hasAttr('this-paginate')) {
                                    // save pagination index
                                    _data.pagination = {};
                                    _data.pagination[pageIndex] = indices;
                                }
                            }
                            // mark pagination done if length of last result is not
                            // equal to the expected limit
                            if ((container.this('paginate') && indices.length != container.this('paginate'))
                                    || (!container.this('paginate') && this.config.pagination
                                            && this.config.pagination.limit && indices.length != this.config.pagination.limit)) {
                                done();
                            }
                        }
                        // data is empty
                        else {
                            done();
                            save = false;
                            delete this.collectionData;
                            this.__.callable(_callback).call(this, container);
                        }
                        if (container.hasAttr('this-paginate')) {
                            this.container.find('[this-paginate-next="'
                                    + container.this('id')
                                    + '"],[this-paginate-previous="'
                                    + container.this('id') + '"]')
                                    .removeAttr('disabled');
                            container.siblings('[this-paginate-next=""],[this-paginate-previous=""]')
                                    .removeAttr('disabled');
                        }
                    }
                    // loading a model
                    else if (data && isModel) {
                        // check if can continue rendering
                        var __data = internal.canContinue
                                .call(this, 'model.render', [data], container.get(0));
                        // rendering canceled
                        if (!__data) {
                            return this;
                        }
                        // continue rendering. update data with returned value if object
                        else if (this.__.isObject(__data))
                            data = __data;
                        // saving is allowed
                        if (save !== false) {
                            var id = internal.getUIDValue
                                    .call(this, data, container.this('uid'));
                            // store data under its uid
                            _data.data[id] = data;
                            // get url without the model id
                            // split into array by /
                            var _url = container.this('url').split('/');
                            // remove the last value
                            this.__.removeArrayIndex(_url, _url.length - 1);
                            // save the url
                            _data.url = _url.join('/') + '/';
                        }
                        // add url to model data for parsing
                        data['_url'] = container.this('url');
                        // continue loading
                        internal.doLoad.call(this, container, data, content, true, null, _callback);
                    }
                    // remove filter attribute and show
                    container.removeThis('filter');
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
                    if (elements.length && model) {
                        var _this = this;
                        this.__.forEach(elements, function () {
                            var __this = _this._(this),
                                    key = __this.this('is');
                            if (!key)
                                return;
                            var data = internal.getVariableValue.call(_this, key, model);
                            if (!data)
                                return;
                            __this.removeThis('is');
                            if (__this.attr('type') === 'radio' || __this.attr('type') === 'checkbox')
                            {
                                // using attribute so that redumping content 
                                // would still work fine
                                if (__this.attr('value') == data || data == on)
                                    __this.attr('checked', 'checked');
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
                            }
                            else if (__this.hasAttr('this-autocomplete')) {
                                var _dropDownList = _this.container
                                        .find('list[this-id="' + __this.this('list')
                                                + '"],[this-type="list"][this-id="'
                                                + __this.this('list') + '"]'),
                                        selectedListSelector = 'list[this-id="'
                                        + _dropDownList.this('selection-list')
                                        + '"],[this-type="list"][this-id="'
                                        + _dropDownList.this('selection-list') + '"]',
                                        _selectedList = _this.container
                                        .find(selectedListSelector);
                                var gotData = function (data) {
                                    var ids = [];
                                    if (data && this.__.isObject(data, true)) {
                                        if (!__this.hasAttr('this-multiple')) {
                                            // ensure data is an array
                                            if (_this.__.isObject(data)) {
                                                data = [data];
                                            }
                                            // data must be a string and therefore the uid
                                            // create an object with the uid => the data
                                            else {
                                                var obj = {},
                                                        uid = _this.config.modelUID || 'id',
                                                        parts = uid.split('.').reverse(),
                                                        last;
                                                _this.__.forEach(parts, function (i, v) {
                                                    if (!Object.keys(obj).length) {
                                                        obj[v] = data;
                                                    }
                                                    else {
                                                        obj[v] = app.__.extend(obj);
                                                        delete obj[last];
                                                    }
                                                    last = v;
                                                });
                                                data = [obj];
                                            }
                                        }
                                        ids = internal.fillAutocompleteList.call(this, {
                                            selector: selectedListSelector,
                                            data: data,
                                            emptyList: true
                                        });
                                    }
                                    _dropDownList.this('selected', ids.join(',') + ',');
                                }.bind(_this);
                                // refill list from provided function
                                if (_selectedList.this('refill')) {
                                    return gotData(_this.__.callable(_selectedList.this('refill'))
                                            .call(this, data));
                                }
                                // refill list from
                                else if (_selectedList.this('refill-url')) {
                                    return _this.request({
                                        dataType: 'json',
                                        type: 'POST',
                                        url: _selectedList.this('refill-url'),
                                        data: {ids: data},
                                        success: function (data) {
                                            gotData(getRealData.call(_this, data));
                                        }
                                    });
                                }
                                gotData(data);
                            }
                            else {
                                // using attribute so that redumping content 
                                // would still work fine
                                __this.attr('value', data || '');
                            }
                        });
                    }
                    return this;
                },
                /**
                 * Loads all forms
                 * @param {_} forms Required if to load specific forms
                 * @param {Object} model Data to load into the forms
                 * @returns {ThisApp}
                 */
                loadForms: function (forms, model, replaceState, chain) {
                    var _this = this, isPage = false;
                    // load all forms in container or page
                    if (!forms) {
                        isPage = this.page.is('form');
                        forms = isPage ? this.page : this.container.find('form');
                    }
                    forms.each(function () {
                        var __this = _this._(this);
                        if (__this.is('form')) {
                            // pass form action type from page to form if not exist on form                 
                            if (!__this.hasAttr('this-do') && _this.page.this('do'))
                                __this.this('do', _this.page.this('do'));
                            // is search form. no need loading except for search field
                            if ((__this.this('do') === 'search' ||
                                    _this.page.this('do') === 'search') &&
                                    _this.page.this('query')) {
                                __this.find('[this-search]').attr('value', _this.page.this('query'));
                                return;
                            }
                            // parse tar
                            internal.doTar.call(_this, __this, true);
                        }
                        var mid = __this.this('mid') || _this.page.this('mid'),
                                model_name = __this.this('model') || _this.page.this('model');
                        if (!mid)
                            return;
                        if (!model)
                            model = internal.modelFromStore.call(_this, mid, model_name);
                        internal.loadFormElements.call(_this, __this.find('[this-is]'), model);
                        __this.this('loaded', '').trigger('form.loaded');
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
                    if (this.config.layout || this.page.this('layout')) {
                        var layout = this.page.this('layout') || this.config.layout;
                        // get existing layout in container if not asked to reload layouts
                        _layout = this.reloadLayouts ? _layout :
                                this.container.find('layout[this-id="' + layout
                                        + '"],[this-type="layout"][this-id="'
                                        + layout + '"]');
                        // layout does not exist in container
                        if (!_layout.length) {
                            // get layout template
                            _layout = this.getCached('[this-id="' + layout + '"]', 'layout')
                                    .this('loaded', '');
                            // layout doesn't exist
                            if (!_layout.length) {
                                internal.fullyFromURL.call(this, 'layout', layout,
                                        function (_layout) {
                                            _layout.removeThis('url')
                                                    .find('[this-content]').html(_this.page);
                                            if (_layout.this('extends'))
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
                                if (_layout.this('url')) {
                                    this.request({
                                        url: _layout.this('url'),
                                        success: function (data) {
                                            _layout.removeThis('url')
                                                    .html(data)
                                                    .find('[this-content]')
                                                    .html(_this.page);
                                            if (_layout.this('extends'))
                                                internal.extendLayout.call(_this, _layout,
                                                        replaceInState);
                                            else {
                                                internal.finalizePageLoad.call(_this, _layout,
                                                        replaceInState);
                                            }
                                        },
                                        error: function () {
                                            _this.error('Layout [' + layout + '] not found!');
                                            internal.finalizePageLoad.call(_this, _layout,
                                                    replaceInState);
                                        },
                                        dataType: 'text'
                                    });
                                }
                                else {
                                    _layout.find('[this-content]').html(_this.page);
                                    if (_layout.this('extends'))
                                        internal.extendLayout.call(this, _layout, replaceInState);
                                    else {
                                        internal.finalizePageLoad.call(this, _layout, replaceInState);
                                    }
                                }
                            }
                        }
                        else {
                            _layout.find('[this-content]').html(this.page);
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
                 * @param {Function} callback
                 * @param boolean binding Indicates whether to currently binding model to a collection
                 * @param boolean replaceState Indicates whether to overwrite current state
                 *  after loading model
                 * @returns void
                 */
                loadModel: function (target, callback, data, replaceState)
                {
                    var __this = this._(target),
                            content = __this.hide().outerHtml(),
                            _this = this,
                            type = getElemType(__this),
                            common_selector = '';
                    __this.this('loading', '')
                            .find('collection,[this-type="collection"]')
                            .this('loading', '');
                    if (__this.this('id'))
                        common_selector += '[this-id="' + __this.this('id') + '"]';
                    else if (__this.this('model'))
                        common_selector += '[this-model="' + __this.this('model') + '"]';
                    __this = internal.doTar.call(this, __this, true);
                    if (!data && !__this.this('url')) {
                        this.__.callable(callback).call(this);
                        return;
                    }

                    if (type !== 'page') {
                        // necessary in case of binding and target has already been used
                        content = __this.html(this.getCached(common_selector, type)
                                .hide().html()).outerHtml();
                    }
                    this.notWiths = internal.hideNotWiths.call(this, __this);
                    if (Object.keys(this.notWiths).length) {
                        content = __this.outerHtml();
                    }
                    var success = function (data, uid, handled) {
                        if (handled) {
                            _this.__.callable(callback).call(_this);
                            return;
                        }
                        internal.loadData.call(_this, __this, data, content, true,
                                // only save the data if not loading page
                                type !== 'page',
                                function (elem) {
                                    if (elem) {
                                        elem.this('loaded', '')
                                                .removeThis('loading')
                                                .trigger('model.loaded')
                                                .show();
                                    }
                                    this.__.callable(callback).call(this, data);
                                }.bind(_this));
                    },
                            error = function () {
                                __this.removeThis('loading');
                                _this.__.callable(callback).call(_this);
                            };
                    internal.loadOrRequestData.call(this, {
                        elem: __this,
                        content: content,
                        data: data,
                        success: success,
                        error: error,
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
                    var models = this.page
                            .find('model:not([this-in-collection]),'
                                    + '[this-type="model"]:not([this-in-collection])'),
                            length = models.length;
                    if (chain && !length)
                        internal.loadCollections.call(this, replaceState, chain);
                    models.each(function () {
                        internal.loadModel.call(_this, this, function () {
                            length--;
                            if (chain && !length)
                                internal.loadCollections.call(this, replaceState, chain);

                        }.bind(_this), {}, replaceState);
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
                            ignore = _this.page.this('ignore-cache') || '',
                            cached = internal.cache.call(_this, 'model',
                                    config.elem.this('model') || config.elem.this('id')),
                            cache = cached && cached.length ? cached.data : null,
                            cache_uid = cached && cached.uid ? cached.uid : null,
                            cache_expired = cached && ((cached.expires && cached.expires < Date.now())
                                    || !cached.expires),
                            fromCache = false;
                    // get model cache
                    if (!isCollection && cache)
                        cache = cache[config.elem.this('mid')];

                    // check pagination page data exists in cached data for collection
                    if (isCollection && config.elem.hasAttr('this-paginate') &&
                            // cached data exists and no pagination exists already
                            cached) {
                        if ((!cached.pagination
                                // or paginaion exists but the page meta doesn't exist yet
                                || cached.pagination[config.elem.this('pagination-page')] === undefined
                                // or paginaion exists and page meta exists but limit has changed
                                || cached.pagination[config.elem.this('pagination-page')].length !== config.requestData.limit))
                            cache = null;
                        else
                            this.cacheTargets = cached.pagination[config.elem.this('pagination-page')];
                    }

                    var success = function () {
                        _this.__.callable(config.success)
                                .apply(config.elem, Array.from(arguments));
                        config.elem.trigger('load.content.success');
                        config.elem.trigger('load.content.complete');
                    }.bind(this);

                    // if no data is provided and collection has url 
                    if (!config.data && config.elem.this('url')
                            // and no cache or cache exists but is expired
                            && (!cache || (cache && cache_expired))
                            && !_this.__.contains(ignore, type + '#'
                                    + config.elem.this('id'))
                            // and transport exists and is online
                            && this.dataTransport && this.transporterOnline) {
                        if (!config.elem.hasAttr('this-no-updates') && this.watchCallback)
                            internal.watch.call(this, config.elem);
                        config.elem.removeThis('no-updates');
                        this.__.callable(this.dataTransport)
                                .call(this, {
                                    action: 'read',
                                    id: config.elem.this('mid'),
                                    url: config.elem.this('url'),
                                    isCollection: isCollection,
                                    data: config.requestData,
                                    success: success,
                                    error: function () {
                                        _this.__.callable(config.error)
                                                .apply(config.elem, Array.from(arguments));
                                        config.elem.trigger('load.content.error');
                                        config.elem.trigger('load.content.complete');
                                    }
                                });
                    }
                    else {
                        // if no data and no explicit ignore-cache on collection config.element 
                        // and cache exists
                        if (!config.data && cache) {
                            if (config.looping)
                                this.__proto__[type + 's']--;
                            config.data = cache;
                            config.uid = cache_uid;
                            fromCache = true;
                        }
                        // if data exists/found
                        if (config.data) {
                            var _data = {};
                            // use dataKey if available
                            if (this.config.dataKey) {
                                _data[this.config.dataKey] = config.data;
                                config.data = _data;
                            }
                            // watch for updates
                            internal.watch.call(this, config.elem);
                            // loads the data
                            internal.loadData.call(this, config.elem, config.data, config.content,
                                    !isCollection, false, function (elem) {
                                        if (elem && fromCache) {
                                            // trigger expired.cache.loaded event
                                            if (cache_expired) {
                                                elem.trigger('expired.' + type + '.cache.loaded');
                                            }
                                            // trigger cache.loaded event
                                            else {
                                                elem.trigger(type + '.cache.loaded');
                                            }
                                            // mark as loaded and trigger event
                                            elem.removeThis('loading').this('loaded', '');
                                        }
                                        this.__.callable(success).call(this, config.data, null, true);
                                    }.bind(this));
                        }
                        // use default request method
                        else if (config.elem.this('url')) {
                            _this.request({
                                type: _this.config.crud.methods.read,
                                url: config.elem.this('url'),
                                success: success,
                                error: config.error,
                                data: config.requestData
                            });
                        }
                        // Cannot load type. Move on.
                        else {
                            this.__.callable(config.error).call(this);
                        }
                    }
                },
                /**
                 * The function called when logging a message
                 * @param {string} method
                 * @param {string}|{array} param
                 * @returns {ThisApp}
                 */
                log: function (method, param) {
                    if (internal.record.call(this, 'debug'))
                        console[method].apply(null, this.__.isArray(param) ? param : [param]);
                    return this;
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
                    if (!content)
                        content = elem.html();
                    var child = this._(content).get(0),
                            _this = this,
                            level;
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
                    content = '<div>' + this._(content).removeThis('cache').show().outerHtml() + '</div>';
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
                        // check for loops within current loop and execute
                        if (_this.__.isObject(value, true)) {
                            _this.__.forEach(value, function (i, v) {
                                if (!_this.__.isObject(v, true))
                                    return;
                                _content.find('[this-each="value.' + i + '"]')
                                        .each(function () {
                                            var __this = _this._(this),
                                                    __content = __this.removeThis('muted')
                                                    .html()
                                                    .replace(/__obrace__/g, '{{')
                                                    .replace(/__cbrace__/g, '}}')
                                                    .replace(/__obrace2__/g, '({')
                                                    .replace(/__cbrace2__/g, '})'),
                                                    __filter = __this.this('filter');
                                            __this.html('');
                                            internal.loop.call(_this, v, this, __filter, __content);
                                            __this.removeThis('each').removeThis('filter');
                                        });
                            });
                        }
                        elem[elem.hasAttr('this-prepend') ? 'prepend' : 'append'](_content.html());
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
                        var _collection = internal.cache.call(this, 'model', model_name),
                                model = _collection && _collection.length && ((_collection.expires
                                        && _collection.expires > Date.now())
                                        || !_collection.expires) ? _collection.data[model_id] : null;
                        if (model)
                            delete model.__page;
                        return model;
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
                modelToStore: function (model_name, model_id, model, uid, expired) {
                    return this.tryCatch(function () {
                        var collection = internal.cache.call(this, 'model', model_name)
                                || {data: {}, uid: uid, length: 0};
                        if (!model_id)
                            model_id = internal.getUIDValue.call[this, model,
                                    collection.uid || uid];
                        if (expired) {
                            collection.expires = Date.now();
                            delete collection.pagination;
                        }
                        model = this.__.extend(collection.data[model_id], model);
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
                        page = this.getCached(internal.selector.call(this, this.notFound
                                .startsWith('page#') ? this.notFound : 'page#' + this.notFound));
                        if (!page.length) {
                            return this.error('Page [' + this.notFound + '] also not found');
                        }
                        internal.pageFound.call(this, page, true);
                        return this;
                    }
                    else {
                        delete this._params;
                        return this.__.callable(this.notFound).call(this, page);
                    }
                },
                /**
                 * Called when the target page is found
                 * @param {boolean} replaceInState
                 * @returns {void}
                 */
                pageFound: function (page, replaceInState) {
                    if (internal.is.call(this, 'page', page)) {
                        if (!internal.canContinue
                                .call(this, 'page.load', [], page.get(0))) {
                            return this;
                        }
                        if (this.page) {
                            this.oldPage = this.page.this('dead', '')
                                    .trigger('page.leave');
                            if (this.oldPage.this('id') === page.this('id'))
                                replaceInState = true;
                        }
                        this.page = page.clone().show();
                        this.params = this._params;
                        delete this._params;
                        internal.loadLayouts.call(this, replaceInState);
                    }
                    else {
                        delete this._params;
                        this.error('Load page failed: ' + page.this('id'));
                        page.trigger('page.load.failed');
                    }
                },
                /**
                 * Parses the url hash
                 * @returns {string} Target page ID
                 */
                pageIDFromLink: function (link) {
                    // get file path if link starts with #
                    if (link.startsWith('#'))
                        link = link.substr(1);
                    // get file path if link still starts with /
                    if (link.startsWith('/'))
                        link = link.substr(1);
                    var parts = link.split('#');
                    this._params = [];
                    // parameters exist
                    if (parts.length > 1) {
                        // remove first / from parameters part
                        if (parts[1].startsWith('/'))
                            parts[1] = parts[1].substr(1);
                        // remove last / from parameters part
                        if (parts[1].endsWith('/'))
                            parts[1] = parts[1].substr(0, parts[1].length - 1);
                        // save parameters
                        this._params = parts[1].split('/');
                    }
                    // remove last / from file path if available
                    return parts[0].endsWith('/') ? parts[0].substr(0, parts[0].length - 1) : parts[0];
                },
                /**
                 * Called after the page has been fully loaded
                 * @param {Boolean} replaceState Indicates whether to overwrite current state
                 * @param {Boolean} restored Indicates whether the page was only restored and not 
                 * generated
                 * @returns {ThisApp}
                 */
                pageLoaded: function (replaceState, restored) {
                    if (this.__proto__.modelCollections)
                        // still loading. can't mark as loaded
                        return this;
                    var _this = this;
                    // page was just loaded and not restored from history
                    if (!restored) {
                        this.restored = false;
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
                            __this.html(content).removeThis('code');
                        });
                        if (this.notWiths) {
                            internal.showNotWiths.call(this, this.page, this.notWiths);
                            delete this.notWiths;
                        }
                        this.page.find('[this-hidden]').hide();
                        this.page.find('[this-type="template"]').remove();
                        internal.saveState.call(this, replaceState);
                    }
                    // page was restored from history
                    else {
                        this.page.this('restored', '');
                        internal.updatePage.call(this, true);
                        this.restored = true;
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
                    // load required if not already loaded js
                    if (this.page.this('load-js')
                            && !loadedPageJS.last[this.page.this('id')]) {
                        var jses = this.page.this('load-js').split(','),
                                removedAssets = this.removedAssets;
                        // load comma-separated css files
                        this.__.forEach(jses, function (i, js) {
                            internal.loadAsset.call(_this, 'js', js, _this.page);
                        });
                        loadedPageJS.last[this.page.this('id')] = true;
                    }
                    this.pageIsLoaded = true;
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
                 * @param {_}|HTMLElement container
                 * @param string|int forCollection If parsing data for a collection model, this is the
                 * index (or id) of the model in the collection
                 * @param boolean isModel Indicates whether parsing data for a model or not
                 * @returns ThisApp
                 */
                parseData: function (data, container, forCollection, isModel, callback)
                {
                    var _this = this, custom = false, tab_cont, level;
                    if (this.__.isString(container)) {
                        container = this._('<div/>').html(container);
                        custom = true;
                    }
                    else {
                        container = this._(container);
                        // for processing table and its descendants' templates
                        tab_cont = internal.checkTableContent.call(this, container);
                        container = tab_cont.container;
                        level = tab_cont.level;
                    }

                    var _each = container.find('[this-each]');
                    while (_each.length) {
                        var __this = _each.next(),
                                each = __this.this('each').trim(),
                                _data = internal.getVariableValue.call(_this, each, data, false),
                                filter = __this.this('filter'),
                                content = __this.removeThis('muted')
                                .html()
                                .replace(/__obrace__/g, '{{').replace(/__cbrace__/g, '}}')
                                .replace(/__obrace2__/g, '({').replace(/__cbrace2__/g, '})');
                        __this.removeThis('filter').html('');
                        // this-each is not a model key
                        if (!_data) {
                            // do each on a variable value
                            if (each.startsWith('{{')) {
                                // get the value
                                _data = internal.getVariableValue.call(_this, each, data, true);
                            }
                            else {
                                // do each on an expression
                                if (each.startsWith('{(')) {
                                    each = each.substr(1, each.length - 2);
                                }
                                _data = internal.eval
                                        .call(_this, each, data);
                            }
                        }
                        if (_this.__.isObject(_data, true)) {
                            internal.loop.call(_this, _data, __this, filter, content);
                        }
                        __this.removeThis('each');
                        _each = container.find('[this-each]');
                    }
                    if (forCollection) {
                        content = internal.inLoop.call(this, {
                            index: forCollection,
                            model: data
                        }, true, container.outerHtml());
                        content = internal.processExpressions.call(this, content, {
                            index: forCollection,
                            model: data
                        });
                    }
                    else {
                        content = internal.inLoop.call(this, data, true, container.outerHtml());
                        content = internal.processExpressions.call(this, content, data);
                    }
                    var variables = internal.parseBrackets.call(this, '{{', '}}',
                            this.__.isString(content) ? content : content.outerHtml());
                    content = internal.fillVariables.call(this, variables, data, content);
                    container.replaceWith(content);
                    var done = function () {
                        if (custom)
                            container = container.children();
                        container.find('[this-muted]').removeThis('muted');
                        while (level) {
                            container = container.children();
                            level--;
                        }
                        this.__.callable(callback).call(this, container);
                    }.bind(this);
                    if (isModel) {
                        var collections = container.find('collection:not([this-loaded]),'
                                + '[this-type="collection"]:not([this-loaded])');
                        if (collections.length) {
                            this.__proto__.modelCollections = collections.length;
                            collections.each(function () {
                                var __this = _this._(this);
                                data = internal.getVariableValue.call(_this,
                                        __this.this('data'), data, true);
                                internal.loadCollection.call(_this, __this, function () {
                                    if (!--this.__proto__.modelCollections) {
                                        delete this.__proto__.modelCollections;
                                        done();
                                    }
                                }, data);
                            });
                            return;
                        }
                    }
                    done();
                    return this;
                },
                /**
                 * Processes all expressions in the content
                 * @param {string} content
                 * @param {object} current Object available to expressions
                 * @returns {mixed}
                 */
                processExpressions: function (content, current, removeUnresolved)
                {
                    var _this = this,
                            exps = internal.getExpressions.call(this, content);
                    this.__.forEach(exps, function (i, v) {
                        _this.tryCatch(function () {
                            content = content.replace(v, eval(v.trim().substr(2, v.trim().length - 4)));
                        }, function (e) {
                            internal.log.call(_this, 'error', e.message);
                            if (removeUnresolved)
                                content = content.replace(v, '');
                        });
                    });
                    return content;
                },
                /**
                 * Fetch current app records
                 * @param {string} key
                 * @praram mixed value
                 * @returns mixed
                 */
                record: function (key, value) {
                    // set a record
                    if (key && value !== undefined && this.container) {
                        internal.records[this.container.this('id')][key] = value;
                        return this;
                    }
                    var records = this.container ? internal.records[this.container.this('id')] : null;
                    return records && key ? records[key] : records;
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
                 * Resets a form wisely without removing values from buttons
                 * and hidden input elements
                 */
                resetForm: function (form) {
                    var _this = this;
                    this._(form)
                            .find('input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="hidden"])'
                                    + ',textarea,select,[this-resettable]')
                            .each(function () {
                                var __this = _this._(this);
                                if (__this.this('resettable')) {
                                    _this.__.forEach(__this.this('resettable').split(';'), function (i, v) {
                                        var part = v.split(':');
                                        __this.attr(part[0], part[1]);
                                    });
                                }
                                if (this.type === 'radio' || this.type === 'checkbox') {
                                    _this._(this).prop('checked', false)
                                            .removeAttr('checked');
                                }
                                this.value = '';
                                if (this.tagName.toLowerCase() === 'select') {
                                    _this._(this).children(':nth-child(1)')
                                            .prop('selected', true)
                                            .attr('selected', 'selected')
                                            .siblings('[selected="selected"]').
                                            prop('selected', false)
                                            .removeAttr('selected');
                                }
                            });
                    return this;
                },
                /**
                 * Restores a saved state
                 * @param object state
                 * @returns ThisApp
                 */
                restoreState: function (state) {
                    var _this = this;
                    this.container.html(state.content);
                    this.page = this.container.find('page[this-id="' + state.id
                            + '"],[this-type="page"][this-id="'
                            + state.id + '"]').removeThis('dead');
                    if (this.config.titleContainer)
                        this.config.titleContainer.html(state.title);
                    this.store('last_page', state.url);
                    this.removedAssets = {};
                    this.container.find('[this-type="layout"]')
                            .each(function () {
                                internal.loadAssets.call(_this, _this._(this));
                            });
                    delete this.pageModel;
                    // page is bound to a model
                    if (this.page.this('mid')) {
                        // save page model for later use in the app
                        this.collection(this.page.this('model'), {
                            success: function (collection) {
                                collection.model(this.page.this('mid'), {
                                    success: function (model) {
                                        this.pageModel = model;
                                    }.bind(this)
                                });
                            }.bind(this)
                        });
                    }
                    internal.loadAssets.call(this, this.page, function () {
                        internal.pageLoaded.call(this, null, true);
                    }.bind(this));
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
                    var url = '#/' + this.page.this('id');
                    if (this.params.length)
                        url += '/#/' + this.params.join('/');
                    history[action]({
                        id: this.page.this('id'),
                        title: this.page.this('title'),
                        content: this.container.html(),
                        url: url
                    }, this.page.this('title'), url);
                    this.store('last_page', url);
                    return this;
                },
                /**
                 * Provide function to ensure api requests are secured by providing either
                 * headers or request body data, or both.
                 * @param {Function} func The function to be called when making api
                 * requests. The function would receive 3 parameters: (string) key, 
                 * (object) header, (object) body
                 * @returns {ThisApp}
                 */
                secureAPI: function (func) {
                    if (internal.isRunning.call(this))
                        return;
                    this.secap = func;
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
                    this.__.removeArrayIndex(attrs, 0);
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
                                        if (this.getCached('[this-id="'
                                                + _this.config.startWith
                                                + '"]', 'page').length)
                                            _this.loadPage(_this.config.startWith);
                                    }
                                    else {
                                        var startWith = _this._('[this-default-page]');
                                        if (startWith.length)
                                            _this.loadPage(startWith.this('id'));
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
                        else if (!this.container.this('id'))
                            this.container.this('id', __.randomString());
                        // setup record for this app
                        internal.records[this.container.this('id')] = {
                            running: true,
                            secureAPI: this.secap || function () {},
                            uploader: this.setup || null
                        };
                        delete this.secap;
                        delete this.setup;
                        // set debug mode
                        internal.record.call(this, 'debug', this.config.debug || false);
                        // mark all loaded element's children as loaded too
                        this.container.find('[this-loaded] [this-type], [this-loaded] page,'
                                + '[this-loaded] layout, [this-loaded] component,'
                                + '[this-loaded] model, [this-loaded] collection')
                                .this('loaded', '');
                        // create templates container if not exists
                        if (!this._('[this-type="templates"][this-app="' +
                                this.container.this('id') + '"]').length)
                            this._('body').append('<div this-type="templates" this-app="' +
                                    this.container.this('id') + '" style="display:none"/>');
                        this.templates = this._('[this-type="templates"][this-app="' +
                                this.container.this('id') + '"]')
                                // put all unloaded element into appropriat template section
                                .html(
                                        // hide all types not loaded (pages, models, collections, layouts,
                                        // components, etc)
                                        this.container.find('page:not([this-loaded]),model:not([this-loaded]),'
                                                + 'collection:not([this-loaded]),layout:not([this-loaded]),list:not([this-loaded]),'
                                                + 'component:not([this-loaded]),'
                                                + '[this-type="page"]:not([this-loaded]),'
                                                + '[this-type="model"]:not([this-loaded]),'
                                                + '[this-type="collection"]:not([this-loaded]),'
                                                + '[this-type="layout"]:not([this-loaded]),'
                                                + '[this-type="list"]:not([this-loaded]),'
                                                + '[this-type="component"]:not([this-loaded])'
                                                + '[this-paginate-next],[this-paginate-previous]')
                                        .hide());
                        // remove templates
                        this.container.find('[this-type="template"]').remove();
                        internal.emptyFeatures.call(this, this.container);
                        if (this.config.titleContainer)
                            this.config.titleContainer = this._(this.config.titleContainer,
                                    internal.record.call(this, 'debug'));
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
                                            else if (!__this.this('reload')) {
                                                // reload the page and all resources
                                                _this.reload(true);
                                                return;
                                            }
                                            // reload value: collection| 
                                            var reload = __this.this('reload'),
                                                    // template to reload
                                                    toReload = _this.getCached(internal.selector
                                                            .call(_this, reload)),
                                                    // target to reload
                                                    _reload = _this.container.find(internal.selector
                                                            .call(_this, reload, '[this-loaded]'));
                                            if (!toReload.length) {
                                                _this.error('Reload target not found');
                                                return;
                                            }
                                            if (__this.this('attributes'))
                                                _this.__.forEach(__this.this('attributes').split(';'),
                                                        function (i, v) {
                                                            var attr = v.split(':'),
                                                                    name = _this.__.removeArrayIndex(attr, 0);
                                                            attr = attr.join(':');
                                                            toReload.attr(name, attr);
                                                        });
                                            _reload.replaceWith(toReload.clone());
                                            internal.loadCollection.call(_this, _reload, null, null, true);
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
                                            _model = __this
                                            .closest('model,[this-type="model"],[this-model][this-binding]'),
                                            model_id = __this.this('model-id') ||
                                            _model.this('mid'),
                                            model_name = __this.this('model') ||
                                            _model.this('model') || _model.this('id'),
                                            url = __this.this('read')
                                            || _model.this('url')
                                            || '#',
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.this('goto')),
                                            // necessary in case goto is a url and not an id
                                            pageId = goto.replace(/\/\\/g, '-');
                                    // keep attributes for page
                                    _this.tar['page#' + pageId] = {
                                        reading: '',
                                        url: url,
                                        model: model_name
                                    };
                                    _this.tar['page#' + pageId]['mid'] = model_id;
                                    __this.this('goto', goto + '/#/' + model_name + '/' + url);
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
                                            model_id = __this.this('model-id') ||
                                            model.this('mid'),
                                            model_name = __this.this('model')
                                            || model.this('id'),
                                            url = __this.this('update')
                                            || model.this('url') || '#',
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.this('goto')),
                                            // necessary in case goto is a url and not an id
                                            pageId = goto.replace(/\/\\/g, '-');
                                    _this.tar['page#' + pageId] = {
                                        "do": "update",
                                        mid: model_id,
                                        action: url,
                                        model: model_name
                                    };
                                    if (__this.this('model-uid'))
                                        _this.tar['page#' + pageId]['model-uid'] =
                                                __this.this('model-uid');
                                    else if (model.this('uid'))
                                        _this.tar['page#' + pageId]['model-uid'] = model
                                                .this('uid');
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
                                            url = __this.this('create') || '#';
                                    var goto = internal.pageIDFromLink.call(this,
                                            __this.this('goto')),
                                            // necessary in case goto is a url and not an id
                                            pageId = goto.replace(/\/\\/g, '-');
                                    _this.tar['page#' + pageId] = {
                                        "do": "create",
                                        action: url
                                    };
                                    if (__this.this('model'))
                                        _this.tar['page#' + pageId]['model'] = __this
                                                .this('model');
                                    if (__this.this('model-uid'))
                                        _this.tar['page#' + pageId]['model-uid'] = __this
                                                .this('model-uid');
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
                                .on('click', '[this-create][this-form]', function ()
                                {
                                    var __this = _this._(this),
                                            selector = 'form[this-id="'
                                            + __this.this('form') + '"]',
                                            _target = _this.container.find(selector)
                                            .removeAttr([
                                                "this-binding", "this-mid", "this-uid",
                                                "this-url"
                                            ]),
                                            _tmpl = _this.getCached(selector),
                                            common_selector = '',
                                            type = getElemType(_target);
                                    _target.html(_tmpl.html());
                                    internal.bindToObject.call(_this, _target, {}, function (elem) {
                                        elem.attr({
                                            "this-do": "create",
                                            "this-action": __this.this('create'),
                                            "this-model": __this.this('model') || '',
                                            "this-model-uid": __this.this('model-uid') || '',
                                            "this-binding": ""
                                        }).show();
                                        internal.resetForm.call(this, elem.get(0));
                                        elem.trigger('create.form.cleared');
                                    }.bind(_this));
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
                                .on('click', '[this-goto][this-delete]', function ()
                                {
                                    var __this = _this._(this),
                                            _model = __this.closest('model,[this-type="model"]'),
                                            url = __this.this('delete')
                                            || _model.this('url') || '#',
                                            model_name = __this.this('model')
                                            || _model.this('id'),
                                            uid = _model.this('uid'),
                                            goto = internal.pageIDFromLink.call(this,
                                                    __this.this('goto')),
                                            // necessary in case goto is a url and not an id
                                            pageId = goto.replace(/\/\\/g, '-');
                                    _this.tar['page#' + pageId] = {
                                        "do": "delete",
                                        action: url,
                                        uid: uid
                                    };
                                    if (_model) {
                                        _this.tar['page#' + pageId]['model'] = model_name;
                                        __this.this('goto', goto + '/#/' +
                                                (_model.this('mid') || __this.this('model-id')));
                                    }
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
                                    if (!__this.this('goto'))
                                        return;
                                    var goto = internal.pageIDFromLink.call(this,
                                            __this.this('goto')),
                                            // necessary in case goto is a url and not an id
                                            pageId = goto.replace(/\/\\/g, '-');
                                    if (!_this.tar['page#' + pageId])
                                        _this.tar['page#' + pageId] = {};
                                    if (__this.this('page-title'))
                                        _this.tar['page#' + pageId]['title'] =
                                                __this.this('page-title');
                                    if (__this.this('ignore-cache'))
                                        _this.tar['page#' + pageId]['ignore-cache'] =
                                                __this.this('ignore-cache');
                                    _this.loadPage(__this.this('goto'));
                                    e.stop = true;
                                })
                                /*
                                 * Click event
                                 * Bind model to target
                                 */
                                .on('click', '[this-bind]', function (e) {
                                    e.preventDefault();
                                    var __this = _this._(this),
                                            bind = __this.this('bind'),
                                            _model = __this.closest('model,'
                                                    + '[this-type="model"],'
                                                    + '[this-model]');
                                    if (!bind || !_model.length)
                                        return;
                                    var _target = _this.container.find(internal.selector
                                            .call(_this, bind, ':not([this-in-collection])'));
                                    if (!_target.length)
                                        return;
                                    _target.this('model', _model.this('model')
                                            || _model.this('id'))
                                            .this('binding', '')
                                            .this('uid', _model.this('uid') || '')
                                            .this('url', _model.this('url') || '')
                                            .removeThis('action');
                                    if (__this.hasAttr('this-read')) {
                                        _this.container.find('[this-model="'
                                                + (_model.this('model')
                                                        || _model.this('id'))
                                                + '"][this-binding]').hide();
                                        if (__this.this('read'))
                                            _target.this('url',
                                                    __this.this('read'));
                                        _target.removeThis('do');
                                    }
                                    else if (__this.hasAttr('this-update')) {
                                        _target.this('tar', 'do:update');
                                        if (__this.this('update'))
                                            _target.this('url',
                                                    __this.this('update'));
                                    }
                                    else if (__this.hasAttr('this-delete')) {
                                        _target.this('tar', 'do:delete');
                                        if (__this.this('delete'))
                                            _target.this('url',
                                                    __this.this('delete'));
                                        __this.this('treated', '');
                                        setTimeout(function () {
                                            __this.removeThis('treated');
                                        });
                                    }
                                    internal.bindToElementModel.call(_this, _target, _model);
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
                                    e.preventDefault();
                                    var __this = _this._(this);
                                    if (__this.hasAttr('this-treated'))
                                        return;
                                    var _model = __this.closest('model,[this-type="model"],'
                                            + '[this-model]'),
                                            _do = __this.closest('[this-do="delete"]'),
                                            model_url = __this.this('delete') ||
                                            _model.this('url') ||
                                            _do.this('action'),
                                            model_id = _model.this('mid') ||
                                            _do.this('mid');
                                    if (!internal.canContinue
                                            .call(_this, 'model.delete',
                                                    [], _model.get(0))) {
                                        return;
                                    }
                                    _this.collection(__this.this('model') ||
                                            _model.this('model') ||
                                            _model.this('id') ||
                                            _do.this('model'), {
                                        uid: _model.this('uid') ||
                                                _do.this('uid'),
                                        success: function (collection) {
                                            collection.model(model_id, {
                                                url: model_url,
                                                success: function (model) {
                                                    model.remove({
                                                        success: function (data) {
                                                            var crudStatus = _this.config.crud.status;
                                                            if ((crudStatus &&
                                                                    data[crudStatus.key] === crudStatus.successValue)
                                                                    || !crudStatus) {
                                                                if (_this.page.this('do') === 'delete'
                                                                        || _model.this('type') === 'page')
                                                                    _this.back();
                                                                else {
                                                                    _this.container.find('[this-model="'
                                                                            + (_model.this('model')
                                                                                    || _model.this('id'))
                                                                            + '"][this-binding]').hide();
                                                                }
                                                                data = getRealData.call(_this, data);
                                                                _model.trigger('delete.success', {
                                                                    response: this,
                                                                    responseData: data,
                                                                    model: model
                                                                });
                                                            }
                                                            else
                                                                _model.trigger('delete.failed', {
                                                                    response: this,
                                                                    model: model
                                                                });
                                                        },
                                                        error: function () {
                                                            _model.trigger('delete.error', {
                                                                response: this,
                                                                model: model
                                                            });
                                                        },
                                                        complete: function () {
                                                            _model.trigger('delete.complete', {
                                                                response: this,
                                                                model: model
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                })
                                /*
                                 * Click event
                                 * Toggles target on and off
                                 */
                                .on('click', '[this-toggle]', function (e) {
                                    e.preventDefault();
                                    _this.container.find(internal.selector.call(_this,
                                            _this._(this).this('toggle'))).toggle();
                                })
                                /*
                                 * Hides target elements
                                 */
                                .on('click', '[this-hide]', function (e) {
                                    e.preventDefault();
                                    _this.__.forEach(_this._(this)
                                            .this('hide').split(','), function (i, v) {
                                        _this.container.find(internal.selector.call(_this,
                                                v.trim())).hide();
                                    });
                                })
                                /*
                                 * Shows target elements
                                 */
                                .on('click', '[this-show]', function (e) {
                                    e.preventDefault();
                                    var __this = _this._(this);
                                    _this.__.forEach(__this.this('show').split(','),
                                            function (i, v) {
                                                var _target = _this.container
                                                        .find(internal.selector.call(_this,
                                                                v.trim()));
                                                if (__this.this('create')) {
                                                    var form = _target.is('form[this-model="'
                                                            + __this.this('model')
                                                            + '"]') ? _target :
                                                            _target.find('form[this-model="'
                                                                    + __this
                                                                    .this('model')
                                                                    + '"]');
                                                    if (form.length) {
                                                        form.this('do', 'create')
                                                                .this('url',
                                                                        __this
                                                                        .this('create'))
                                                                .this('binding', '');
                                                        if (__this.this('model-uid'))
                                                            form.this('model-uid',
                                                                    __this
                                                                    .this('model-uid'));
                                                        form.removeThis('mid');
                                                        internal.resetForm.call(_this, form.get(0));
                                                    }
                                                }
                                                _target.show();
                                            });
                                })
                                /**
                                 * Autocomplete
                                 */
                                .on('keyup,keypress', '[this-autocomplete][this-list]', function (e) {
                                    var __this = _this._(this),
                                            min_chars = __this.this('min-chars') || 3,
                                            url = __this.this('autocomplete')
                                            || __this.this('url'),
                                            _list = _this.container
                                            .find('[this-type="list"][this-id="'
                                                    + __this.this('list')
                                                    + '"],list[this-id="'
                                                    + __this.this('list')
                                                    + '"]');
                                    // list element must exist
                                    if (!_list.length) {
                                        _this.error('List #' + __this.this('list')
                                                + ' not found');
                                        return;
                                    }

                                    // do nothing if chars are less than required
                                    if (__this.val().length < min_chars) {
                                        var _list = _this.container
                                                .find('[this-type="list"][this-id="'
                                                        + __this.this('list')
                                                        + '"],list[this-id="'
                                                        + __this.this('list')
                                                        + '"]');
                                        _list.hide().html('');
                                        __this.removeThis('last-query');
                                        _this.store('autocompleting', null);
                                        clearTimeout(autocomplete_timeout);
                                        return;
                                    }
                                    // block searching for same thing multiple times
                                    else if (__this.val() === __this.this('last-query')) {
                                        // enter button pressed
                                        if (e.keyCode === 13 && _list.children(':not([this-cache])').length) {
                                            // select the first result from the dropdown list
                                            _list.children(':not([this-cache]):first-child').trigger('click');
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }
                                        return;
                                    }
                                    clearTimeout(autocomplete_timeout);
                                    url += (url.indexOf('?') === -1) ? '?' : '&';
                                    url += (__this.this('query-key') || 'q') + '='
                                            + __this.val();
                                    autocomplete_timeout = setTimeout(function () {
                                        __this.this('last-query', __this.val());
                                        _this.request({
                                            url: url,
                                            success: function (data) {
                                                data = getRealData.call(_this, data);
                                                if (!data)
                                                    return;
                                                if (!__this.this('id'))
                                                    __this.this('id', _this.__.randomString());
                                                _list.this('autocompleting',
                                                        __this.this('id'))
                                                        .children().this('cache', '')
                                                        .hide();
                                                internal.fillAutocompleteList
                                                        .call(_this, {
                                                            selector: '[this-type="list"][this-id="'
                                                                    + __this.this('list')
                                                                    + '"],list[this-id="'
                                                                    + __this.this('list')
                                                                    + '"]',
                                                            data: data,
                                                            emptyList: true
                                                        });
                                                _this.store('autocompleting', data);
                                            }
                                        });
                                    }, __this.this('delay') || 300);
                                })
                                .on('click', '[this-autocompleting]>[this-key]', function ()
                                {
                                    var __this = _this._(this),
                                            selectedListSelector = '[this-type="list"][this-id="'
                                            + __this.parent().this('selection-list')
                                            + '"],list[this-id="'
                                            + __this.parent().this('selection-list')
                                            + '"]',
                                            _selectedList = _this.container
                                            .find(selectedListSelector),
                                            elem = _this.getCached(selectedListSelector)
                                            .children(),
                                            list = _this.store('autocompleting') || {},
                                            key = __this.this('key'),
                                            index = __this.this('index'),
                                            _dropDownList = __this.parent(),
                                            _input = _this.container
                                            .find('[this-autocomplete][this-id="'
                                                    + _dropDownList
                                                    .this('autocompleting') +
                                                    '"]');
                                    var data = list[index] || {};
                                    // empty selected list if nothing had
                                    // been selected
                                    if (!_dropDownList.this('selected')) {
                                        _selectedList.html('');
                                    }
                                    internal.bindToObject
                                            .call(_this, elem, data, function (elem) {
                                                elem.removeThis('cache')
                                                        .this('key', key)
                                                        .show();
                                                _dropDownList.this('selected',
                                                        (_dropDownList.this('selected') || '')
                                                        + key + ',');
                                                _selectedList.append(elem).show();
                                                __this.trigger('list.option.selected', {
                                                    data: data,
                                                    selection: elem.get(0),
                                                    autocompleteInput: _input.get(0)
                                                });
                                                if (!_input.hasAttr('this-multiple')) {
                                                    _input.hide();
                                                    _dropDownList.hide();
                                                }
                                                else
                                                    __this.remove();
                                            });
                                })
                                .on('click', 'list[this-parent-list] [this-remove],'
                                        + '[this-type="list"][this-parent-list] [this-remove]',
                                        function () {
                                            var __this = _this._(this).closest('[this-key]'),
                                                    _dropDownList = _this.container
                                                    .find('[this-type="list"][this-id="'
                                                            + __this.parent()
                                                            .this('parent-list')
                                                            + '"],list[this-id="'
                                                            + __this.parent()
                                                            .this('parent-list')
                                                            + '"]');
                                            _dropDownList.this('selected',
                                                    _dropDownList.this('selected')
                                                    .replace(__this.this('key')
                                                            + ',', '')).show();
                                            var _input = _this.container
                                                    .find('[this-autocomplete][this-id="'
                                                            + _dropDownList
                                                            .this('autocompleting') +
                                                            '"]').show();
                                            __this.remove();
                                            if (_input.hasAttr('this-multiple')) {
                                                _input.this('last-query', '')
                                                        .trigger('keyup');
                                            }
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
                                            var __this = _this._(this),
                                                    creating = __this.this('do')
                                                    === 'create',
                                                    method = __this.this('method')
                                                    || (creating ? 'post' : 'put');
                                            if (!this.reportValidity()) {
                                                __this.trigger('form.invalid.submission');
                                                return;
                                            }
                                            __this.trigger('form.valid.submission');
                                            var id = null;
                                            if (__this.this('mid'))
                                                id = __this.this('mid');
                                            _this.collection(__this.this('model') ||
                                                    _this.page.this('model'), {
                                                success: function (collection) {
                                                    collection.model(null, {
                                                        success: function (_model) {
                                                            _model.id = id;
                                                            _model.save({
                                                                form: __this.get(0),
                                                                url: __this.this('url') ||
                                                                        __this.this('action') ||
                                                                        _this.page.this('url') ||
                                                                        _this.page.this('action'),
                                                                ignoreDOM: __this.hasAttr('this-ignore-dom'),
                                                                method: method,
                                                                success: function (data) {
                                                                    var model = getRealData.call(_this, data),
                                                                            crudStatus = _this.config.crud.status;
                                                                    if (((crudStatus &&
                                                                            data[crudStatus.key] ===
                                                                            crudStatus.successValue)
                                                                            || !crudStatus) && model) {
                                                                        if (creating) {
                                                                            internal.resetForm.call(_this, __this.get(0));
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
                                                                                    responseObject: this,
                                                                                    responseData: data,
                                                                                    method: method.toUpperCase(),
                                                                                    create: creating,
                                                                                    model: _model
                                                                                });
                                                                    }
                                                                    else {
                                                                        __this.trigger('form.submission.failed',
                                                                                {
                                                                                    response: this,
                                                                                    responseData: data,
                                                                                    method: method.toUpperCase(),
                                                                                    create: creating,
                                                                                    model: _model
                                                                                });
                                                                    }
                                                                },
                                                                error: function () {
                                                                    __this.trigger('form.submission.error',
                                                                            {
                                                                                response: this,
                                                                                method: method.toUpperCase(),
                                                                                create: creating,
                                                                                model: _model
                                                                            });
                                                                },
                                                                complete: function () {
                                                                    __this.trigger('form.submission.complete',
                                                                            {
                                                                                response: this,
                                                                                method: method.toUpperCase(),
                                                                                create: creating,
                                                                                model: _model
                                                                            });
                                                                }
                                                            });
                                                        },
                                                        error: function () {
                                                            alert('eror')
                                                        }
                                                    });
                                                }
                                            });
                                        })
                                .on('submit', 'form[this-handle-submit]:not([this-do])', function (e) {
                                    e.preventDefault();
                                    var _form = _this._(this);
                                    if (!this.reportValidity()) {
                                        _form.trigger('form.invalid.submission');
                                        return;
                                    }
                                    _form.trigger('form.valid.submission');
                                    var fd = new FormData(this);
                                    var data = internal.canContinue
                                            .call(_this, 'form.send', [], this);
                                    if (!data) {
                                        return;
                                    }
                                    else if (_this.__.isObject(data))
                                        fd.fromObject(data);
                                    _this.request({
                                        url: _form.attr('action'),
                                        type: _form.attr('method'),
                                        dataType: _form.this('response-type'),
                                        data: fd,
                                        success: function (data) {
                                            _form.trigger('form.submission.success', {
                                                response: this,
                                                responseData: data
                                            });
                                        },
                                        error: function () {
                                            _form.trigger('form.submission.error', {
                                                response: this
                                            });
                                        },
                                        complete: function () {
                                            _form.trigger('form.submission.complete', {
                                                response: this
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
                                    if (!_search.this('search')) {
                                        _this.error('Invalid search target');
                                        return;
                                    }
                                    var exp = _search.this('search').split(':'),
                                            selector = 'collection[this-id="' + exp[0]
                                            + '"],[this-type="collection"][this-id="' + exp[0] + '"]',
                                            keys = exp[1],
                                            page = _form.this('type') === 'page' ?
                                            _form : _form.closest('page,[this-type="page"]'),
                                            goto = _form.attr('goto') || page.this('id'),
                                            filter = '', _collection,
                                            /* same page and query. don't duplicate state */
                                            replaceState = _this.page.this('id') === goto &&
                                            _this.page.this('query') === _search.val().trim();
                                    if (keys)
                                        keys = keys.split(',');
                                    _this.__.forEach(keys, function (i, key) {
                                        if (filter)
                                            filter += ' || ';
                                        filter += '_this.__.contains(filters.lcase(model#' + key
                                                + '),filters.lcase("' + _search.val() + '"))';
                                    });
                                    // reload only the collection
                                    if (_form.this('reload')) {
                                        _collection = page.find(internal.selector.call(_this,
                                                _form.this('reload')));
                                        _collection.this('filter', filter).this('search',
                                                keys.join(','));
                                        page.this('query', _search.val().trim());
                                        internal.loadCollection.call(_this, _collection, null, null, replaceState);
                                    }
                                    // load a page and the collection in it
                                    else {
                                        var _goto = internal.pageIDFromLink.call(this, goto),
                                                // necessary in case _goto is a url and not an id
                                                pageId = _goto.replace(/\/\\/g, '-'),
                                                _page = _this.getCached('[this-id="'
                                                        + _goto + '"]', 'page'),
                                                _component = _page.find('[this-component="'
                                                        + exp[0] + '"]');
                                        _component.this('filter', 'collection#' + exp[0] + ':'
                                                + filter).this('search', 'collection#'
                                                + exp[0] + ':' + keys.join(','));
                                        _this.tar['page#' + pageId] = {
                                            query: _search.val().trim()
                                        };
                                        if (_search.this('ignore-cache'))
                                            _this.tar['page#' + pageId]['ignore-cache'] =
                                                    _search.this('ignore-cache');
                                        _collection = _page.find(selector);
                                        _collection.this('filter', filter).this('search',
                                                keys.join(','));
                                        _this.loadPage(goto, replaceState);
                                    }
                                })
                                /**
                                 * Load next set of results on a paginated collection
                                 */
                                .on('click', '[this-paginate-next]', function (e) {
                                    e.preventDefault();
                                    var __this = _this._(this),
                                            _collection;
                                    // collection not specified. Target sibling collection
                                    if (!__this.this('paginate-next'))
                                        _collection = __this.siblings('collection,[this-type="collection"]');
                                    // collection is specified. get it
                                    else
                                        _collection = _this.container.find('collection[this-id="'
                                                + __this.this('paginate-next')
                                                + '"],[this-type="collection"][this-id="'
                                                + __this.this('paginate-next') + '"]');
                                    // collection must have attribute `this-paginate`
                                    if (!_collection.hasAttr('this-paginate'))
                                        return;
                                    __this.attr('disabled', 'disabled');
                                    // load target collection
                                    // page is already set right
                                    _this.load(_collection, function () {
                                        updateLinks.call(this);
                                    }.bind(_this));
                                })
                                /**
                                 * Load previous set of results on a paginated collection
                                 */
                                .on('click', '[this-paginate-previous]', function (e) {
                                    e.preventDefault();
                                    var __this = _this._(this),
                                            _collection;
                                    // collection not specified. Target sibling collection
                                    if (!__this.this('paginate-previous'))
                                        _collection = __this.siblings('collection,[this-type="collection"]');
                                    // collection is specified. get it
                                    else
                                        _collection = _this.container.find('collection[this-id="'
                                                + __this.this('paginate-previous')
                                                + '"],[this-type="collection"][this-id="'
                                                + __this.this('paginate-previous') + '"]');
                                    // if page is 0, can't before to previous anymore
                                    if (_collection.this('pagination-page') == 0
                                            // collection must have attribute `this-paginate`
                                            || !_collection.hasAttr('this-paginate'))
                                        return;
                                    __this.attr('disabled', 'disabled');
                                    // reduce page by 2
                                    _collection.this('pagination-page', parseInt(_collection.this('pagination-page')) - 2);
                                    // load collection
                                    _this.load(_collection, function () {
                                        updateLinks.call(this);
                                    }.bind(_this));
                                })
                                .on('click', '[this-clear-page-cache]', function () {
                                    _this.clearPageCache(_this._(this).this('clear-page-cache') === 'true');
                                });

                        this.when('page.loaded', 'page', function () {
                            if (!_this.page.hasAttr('this-restored'))
                                document.scrollingElement.scrollTop = 0;
                            updateLinks.call(_this);
                        })
                                .when('component.loaded', 'component', function ()
                                {
                                    var elem = _this._(this);
                                    // page is already loaded
                                    if (_this.pageIsLoaded) {
                                        // load unloaded bits
                                        elem.find('[this-type]:not([this-loaded])')
                                                .each(function (i, v) {
                                                    this.load(v, function () {
                                                        updateLinks.call(this);
                                                    }.bind(this));
                                                }.bind(_this));
                                    }
                                });
                        /*
                         * State resuscitation
                         */
                        this._(window).on('popstate', function (e) {
                            if (e.state) {
                                if (this.page) {
                                    this.page.trigger('page.leave');
                                }
                                location.replace(e.state.url);
                                internal.pageIDFromLink.call(this, e.state.url);
                                this.params = this._params;
                                delete this._params;
                                internal.restoreState.call(this, e.state);
                            }
                        }.bind(this));
                        /*
                         * Container events activation
                         */
                        this.__.forEach(this.events, function () {
                            _this.container.on(this.event, this.selector, this.callback);
                        });
                        delete this.__proto__.events;
                    });
                    return this;
                },
                /**
                 * Sets the funtion to call when there are files to be upload in a form
                 * @param {Function} func
                 * @returns {ThisApp}
                 */
                setUploader: function (func) {
                    if (internal.isRunning.call(this))
                        return;
                    this.setup = func;
                    return this;
                },
                /**
                 * Shows the target page and hides the current
                 * @param {boolean} replaceInState Indicates whether to replace
                 * the current page in history or create a new layer
                 * @return {void}
                 */
                showPage: function (replaceInState) {
                    var transit = this.__.callable(this.config.transition, true),
                            wait, _this = this;
                    if (transit)
                        wait = transit.call(null, this.oldPage.removeThis('current'),
                                this.page, this.config.transitionOptions);
                    else if (this.__.isString(this.config.transition)) {
                        if (!Transitions[this.config.transition])
                            this.config.transition = 'switch';
                        wait = Transitions[this.config.transition](this.oldPage
                                .removeThis('current'),
                                this.page, this.config.transitionOptions);
                    }
                    setTimeout(function () {
                        if (this.oldPage)
                            this.oldPage.remove();
                        delete this.oldPage;
                    }.bind(this), this.__.isNumber(wait) ? wait : 0);
                    if (this.config.titleContainer)
                        this.config.titleContainer.html(this.page.this('title'));
                    var features = [];
                    this.container.find('model,[this-type="model"],collection,[this-type="collection"]')
                            .each(function (i) {
                                features.push(this);
                                _this._(this).replaceWith('<div this-feature="' + i + '" />');
                            });
                    var content = internal.inLoop.call(this, {}, true, this.container.html());
                    content = internal.processExpressions.call(this, content, {});
                    this.container.html(content);
                    this.__.forEach(features, function (i, v) {
                        _this.container.find('[this-feature="' + i + '"]')
                                .replaceWith(v);
                    });
                    this.page = this.container.find('page[this-id="' + this.page.this('id')
                            + '"]:not([this-dead]), [this-type="page"][this-id="'
                            + this.page.this('id') + '"]:not([this-dead])');
                    // load models
                    internal.loadModels.call(this, replaceInState, true);
                },
                /**
                 * Shows all hiden elements that were not to be loaded with the 
                 * given element
                 */
                showNotWiths: function (elem, notWiths) {
                    this.__.forEach(notWiths, function (i, v) {
                        elem.find('[this-with="' + i + '"]')
                                .replaceWith(v);
                    });
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
                            _collections = this.container.find('collection,'
                                    + '[this-type="collection"]'),
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
                            var _collection = _this.container.find('collection[this-model="'
                                    + model_name
                                    + '"],[this-type="collection"][this-model="'
                                    + model_name + '"]');
                            if (!_collection.length)
                                return;
                            var __collection = collection[model_name],
                                    uid = __collection.uid || '';
                            _this.__.forEach(arr, function (i, v) {
                                var tmpl = _this.getCached('[this-id="'
                                        + _collection.this('id')
                                        + '"]', 'collection').children(),
                                        action = _collection.this('prepend-new') ?
                                        'prepend' : 'append',
                                        data = __collection.data[v],
                                        __data = internal.canContinue
                                        .call(_this, 'collection.model.render', [data, _collection.get(0)], tmpl.get(0));
                                if (!__data) {
                                    return;
                                }
                                else if (_this.__.isObject(__data))
                                    data = __data;
                                internal.parseData.call(_this, data,
                                        tmpl, true, null,
                                        function (tmpl) {
                                            if (!tmpl.this('url'))
                                                tmpl.this('url', _collection.this('url') + v);
                                            internal.loadFormElements.call(this, tmpl.find('[this-is]'), data);
                                            _collection[action](tmpl.this('mid', v)
                                                    .this('uid', uid)
                                                    .this('type', 'model')
                                                    .this('id', model_name)
                                                    .this('in-collection', '')
                                                    .outerHtml()).show();
                                            this.__.removeArrayIndex(arr, i);
                                        }.bind(_this));
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
                                // update page model if part of update models
                                if (_this.pageModel && _this.pageModel.name === model_name
                                        && _this.pageModel.id === id) {
                                    _this.pageModel.attributes = _this.__.extend(_this.pageModel.attributes, v);
                                }
                                _model.filter(function () {
                                    var __model = _this._(this);
                                    // if model id is the updated id
                                    return (__model.this('mid') == id
                                            // not updated before
                                            && (!__model.hasAttr('this-updated')
                                                    // or updated before
                                                    || (__model.hasAttr('this-updated')
                                                            // but has newer update
                                                            && parseInt(__model.this('updated')) < v.timestamp)));
                                })
                                        .each(function () {
                                            var __model = _this._(this),
                                                    _clone;
                                            if (__model.hasAttr('this-in-collection')) {
                                                in_collection = true;
                                                var _collection = __model.parent();
                                                _clone = _this.getCached('[this-id="'
                                                        + _collection.this('id')
                                                        + '"]', 'collection').children();
                                            }
                                            else {
                                                _clone = _this.getCached('[this-id="'
                                                        + __model.this('id')
                                                        + '"]', 'model');
                                            }

                                            var data = v.data,
                                                    __data = internal.canContinue
                                                    .call(_this, in_collection ?
                                                            'collection.model.render'
                                                            : 'model.render',
                                                            in_collection ? [data, _model.parent()] : [data],
                                                            _clone);
                                            if (!__data) {
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
                                                                + _cl_col.this('id') + '"],'
                                                                + '[this-type="collection"][this-id="'
                                                                + _cl_col.this('id') + '"]',
                                                                _rl_col = _model.find(selector);
                                                        if (_rl_col.length)
                                                            _cl_col.replaceWith(_rl_col.clone());
                                                        else
                                                            _cl_col.remove();
                                                    });
                                            // put back current model's url
                                            _clone.this('url', __model.this('url'));
                                            internal.parseData.call(_this, data,
                                                    _clone, false, true, function (tmpl) {
                                                        internal.loadFormElements.call(_this, tmpl.find('[this-is]'), data);
                                                        __model.html(tmpl.html()).show()
                                                                .this('updated', v.timestamp)
                                                                .this('url', tmpl.this('url'));
                                                    });
                                        });
                            });
                            if (in_collection)
                                delete updated[model_name];
                            touched.updated = true;
                        });
                        this.__.forEach(deleted, function (model_name, arr) {
                            _this.__.forEach(arr, function (i, mid) {
                                var _model = _this.container.find('[this-id="' + model_name
                                        + '"][this-mid="' + mid + '"],'
                                        + '[this-model="' + model_name
                                        + '"][this-mid="' + mid + '"]');
                                if (!_model.length)
                                    return;
                                _model.each(function () {
                                    var __model = _this._(this);
                                    if (__model.hasAttr('this-in-collection')) {
                                        __model.remove();
                                        if (!touched.deleted[model_name]) {
                                            touched.deleted[model_name] = [];
                                        }
                                        touched.deleted[model_name].push(mid);
                                    }
                                    else {
                                        __model.hide();
                                        // delete page model read from another 
                                        // page's collection
                                        if (!__model.hasAttr('this-binding')
                                                && _this.page.this('reading')
                                                && _models.length === 1) {
                                            touched.back = true;
                                            return false;
                                        }
                                        // deleting binded model
                                        else {
                                            __model.removeThis('url')
                                                    .removeThis('mid');
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
                            _this.__.removeArrayValue(deleted[mod], v);
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
                    if (!elem.this('id') || this.watching[elem.this('id')]
                            || !elem.this('url'))
                        return this;
                    var isCollection = internal.is.call(this, 'collection', elem),
                            model_name = elem.this('model') || elem.this('id');
                    this.watching[elem.this('id')] = {
                        type: isCollection ? 'collection' : 'model',
                        url: elem.this('url'),
                        mid: elem.this('mid')
                    };
                    this.__.callable(this.watchCallback)(elem.this('url'),
                            function (resp) {
                                // save model to collection
                                var action = this.store(resp.event) || {};
                                switch (resp.event) {
                                    case 'created':
                                        internal.modelToStore
                                                .call(this, model_name, resp.id, resp.data,
                                                        elem.this('uid') ||
                                                        elem.this('model-uid'));
                                        if (!action[model_name])
                                            action[model_name] = [];
                                        /* Remove model uid if exists to avoid duplicates */
                                        this.__.removeArrayValue(action[model_name], resp.id, true);
                                        action[model_name].push(resp.id);
                                        break;
                                    case 'updated':
                                        var data = resp.data, id = resp.id;
                                        // if update model, id is model attribute. Update real model
                                        if (!isCollection && elem.this('mid')) {
                                            var id = internal.getUIDValue
                                                    .call(this, data, elem.this('uid'));
                                            delete data[id];
                                            var _data = {};
                                            _data[id] = data;
                                            data = _data;
                                            id = elem.this('mid');
                                        }
                                        data = internal.modelToStore
                                                .call(this, model_name, id, data,
                                                        elem.this('uid') ||
                                                        elem.this('model-uid'));
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
                                        this.__.removeArrayValue(action[model_name], resp.id, true);
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
                __factory: function (str, options, funcA, funcB) {
                    if (__.isArray(str)) {
                        var arr = [], _this = this;
                        __.forEach(str, function (i, v) {
                            arr.push(_this.__factory(v, options, funcA, funcB));
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
                    return this.__factory(str, options,
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
                    return this.__factory(str, separator, function (str, separator) {
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
                var _Model = Object.create({
                    app: props && props.app ? props.app : null,
                    attributes: __.isObject(attributes) ? attributes : {},
                    id: id,
                    collection: props && props.collection ? props.collection : null,
                    method: props && props.method ? props.method : null,
                    name: props && props.name ? props.name : null,
                    uid: props && props.uid ? props.uid : '',
                    url: props && props.url ? props.url : null,
                    /**
                     * Binds the model to the given element
                     * @param {string}|{HTMLElement}|{_} elem
                     * @returns {Model}
                     */
                    bind: function (elem) {
                        elem = this.app._(elem);
                        if (!elem.length)
                            return;
                        if (this.id)
                            elem.this('mid', this.id);
                        if (this.uid)
                            elem.this('uid', this.uid);
                        if (this.url)
                            elem.this('url', this.url);
                        var type = getElemType(elem),
                                _template = this.app
                                .getCached('[this-id="' + elem.this('id') + '"]', type);
                        if (_template.length)
                            elem.html(_template.html());
                        internal.bindToObject.call(this.app, elem, this.attributes || {}, function (elem) {
                            elem.show();
                            var attr = {
                                "this-type": "model",
                                "this-uid": this.uid,
                                "this-mid": this.id,
                                "this-url": this.url,
                                "this-model": this.name
                            };
                            if (!elem.is('form')) {
                                elem.attr(attr);
//                                elem.find('form[this-loaded]').remove();
                                var _elem = elem.find('form');
                                if (_elem.length)
                                    elem = _elem;
                            }
                            if (elem.is('form')) {
                                delete attr['this-type'];
                                delete attr['this-id'];
                                elem.attr(attr);
                            }
                        }.bind(this));
                        return this;
                    },
                    /**
                     * Checks if the given key exists in the model
                     * @param {string} key
                     * @returns boolean
                     */
                    has: function (key) {
                        return this.attributes[key] !== undefined;
                    },
                    /**
                     * Initailizes Model attributes, creating setters and getters for them.
                     * @param {Object} attr
                     * @returns {void}
                     */
                    init: function (attr) {
                        this['get' + Filters.snakeToCamel(attr, true)] = function (key) {
                            var value = this.attributes[attr];
                            if (this.app.__.isObject(value, true) && key) {
                                return value[key];
                            }
                            return value;
                        };
                        this['set' + Filters.snakeToCamel(attr, true)] = function (val) {
                            this.attributes[attr] = val;
                            return this;
                        };
                    },
                    /**
                     * Removes the model
                     * @param {Object} config Keys may include cacheOnly (default: FALSE),
                     * url, method (default: DELETE), id, success, error, complete
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
                        var done = function () {
                            // model is a part of a page pagination
                            // sanitize!
                            if (this.attributes.__page) {
                                // get cache
                                var collection = internal.cache.call(this.app, 'model', this.name);
                                // pagination exists
                                if (collection.pagination) {
                                    var page = parseInt(this.attributes.__page),
                                            removed = false,
                                            appended = false,
                                            selector = 'collection[this-model="'
                                            + this.name + '"],[this-type="collection"][this-model="'
                                            + this.name + '"]',
                                            _collection = this.app.container
                                            .find(selector),
                                            cache = this.app.getCached(selector)
                                            .children().this('type', 'model');
                                    // go through all pagination metas
                                    while (collection.pagination[page]) {
                                        if (!removed) {
                                            // remove model id from pagination
                                            this.app.__.removeArrayValue(collection.pagination[page], this.id);
                                            removed = true;
                                        }
                                        else {
                                            // shift first value into last page's pagination meta
                                            if (page > 0) {
                                                var last = collection.pagination[page].shift();
                                                if (!appended) {
                                                    if (!_collection.children('[this-mid="' + last + '"]').length && collection.data[last]) {
                                                        internal.bindToObject.call(this.app, cache, collection.data[last] || {},
                                                                function (elem) {
                                                                    elem.attr({
                                                                        "this-id": this.name,
                                                                        "this-in-collection": "",
                                                                        "this-type": "model",
                                                                        "this-url": this.url.replace(this.id, last),
                                                                        "this-mid": last,
                                                                        "this-uid": this.uid
                                                                    }).show();
                                                                    _collection.append(elem);
                                                                }.bind(this));
                                                        appended = true;
                                                    }
                                                }
                                                collection.pagination[page - 1].push(last);
                                            }
                                        }
                                        page++;
                                    }
                                    // delete last pagination meta if empty
                                    if (!collection.pagination[page - 1].length)
                                        delete collection.pagination[page - 1];
                                    // save collection back to cache
                                    internal.cache.call(this.app, 'model', this.name, collection);
                                    // collection listing is empty
                                    if (!_collection.children(':not([this-cache])').length) {
                                        // reload collection for current page
                                        this.app.load(_collection.this('pagination-page', parseInt(_collection.this('pagination-page')) - 1));
                                    }
                                }
                            }
                        }.bind(this);

                        if (config.cacheOnly) {
                            internal.removeModelFromStore.call(this.app, this.name, this.id);
                            done();
                        }
                        else if (this.url || config.url) {
                            var _success = function (data) {
                                var crudStatus = _this.app.config.crud.status;
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
                                        _this.app.__
                                                .removeArrayValue(deleted[_this.name], _this.id, true);
                                        deleted[_this.name].push(_this.id);
                                        _this.app.store('deleted', deleted);
                                        /* update current page */
                                        internal.updatePage.call(_this.app);
                                        done();
                                    }
                                    if (_this.collection) {
                                        delete _this.collection.models[_this.id];
                                        _this.collection.length--;
                                    }
                                }
                                _this.app.__.callable(config.success).call(this, data);
                                _this.app.__.callable(config.complete).call(this);
                            },
                                    _error = function (e) {
                                        _this.app.__.callable(config.error).call(this, e);
                                        _this.app.__.callable(config.complete).call(this, e);
                                    };
                            if (this.app.dataTransport)
                                this.app.__.callable(this.app.dataTransport)
                                        .call(this.app, {
                                            url: config.url || this.url,
                                            id: config.id || this.id,
                                            action: 'delete',
                                            success: _success,
                                            error: _error
                                        });
                            else
                                this.app.request({
                                    type: config.method || this.app.config.crud.methods.delete,
                                    url: config.url || _this.url,
                                    success: _success,
                                    error: _error
                                });
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
                     * url, data, form, method (default: PUT|POST), success, error, complete
                     * @returns boolean
                     */
                    save: function (config) {
                        if (!this.app) {
                            console.error('Invalid model object');
                            return false;
                        }
                        else if (!this.name) {
                            _this.app.error('Cannot save an unnamed model.');
                            return false;
                        }
                        config = this.app.__.extend({}, config);
                        var data = this.attributes;
                        if (data) {
                            delete data._url;
                            delete data.__page;
                        }
                        data = config.data || data || {};
                        var _data = internal.canContinue
                                .call(this.app, this.id ? 'model.update' : 'model.create',
                                        [data], config.form);
                        if (false === _data) {
                            return;
                        }
                        else if (this.app.__.isObject(_data)) {
                            data = _data;
                        }
                        // no data
                        if ((!data || (this.app.__.isObject(data) && !Object.keys(data).length))
                                // and no form
                                && !config.form) {
                            this.app.error('No data or form to save');
                            this.app.__.callable(config.error).call(this.app);
                            this.app.__.callable(config.complete).call(this.app);
                            return false;
                        }

                        var finalizeSave = function (config, data) {
                            var _this = this,
                                    method = this.id
                                    ? this.app.config.crud.methods.update
                                    : this.app.config.crud.methods.create,
                                    formData = new FormData(config.form).fromObject(data);
                            if (this.method)
                                method = this.method;
                            if (this.id && config.cacheOnly)
                                /* save model to collection */
                                internal.modelToStore.call(this.app, this.name, this.id,
                                        formData.toObject(), this.uid);
                            else if (_this.url || config.url) {
                                var _success = function (data, id) {
                                    if (data) {
                                        var model = getRealData.call(_this.app, data),
                                                crudStatus = _this.app.config.crud.status;
                                        if (((crudStatus &&
                                                data[crudStatus.key] === crudStatus.successValue)
                                                || !crudStatus) && model) {
                                            _this.attributes = model;
                                            id = id || internal.getUIDValue
                                                    .call(_this.app, model, _this.uid);
                                            // Don't cache for update if watching for updates already
                                            if (!_this.app.watchCallback) {
                                                // save model to collection and set whole data as model
                                                model = internal.modelToStore
                                                        .call(_this.app, _this.name, id, model,
                                                                _this.uid, !_this.id &&
                                                                _this.app.container
                                                                .find('collection[this-model="'
                                                                        + _this.name + '"],[this-type="collection"][this-model="'
                                                                        + _this.name + '"]').hasAttr('this-paginate'));
                                                if (!config.ignoreDOM) {
                                                    var _action = _this.id ? 'updated' : 'created',
                                                            action = _this.app.store(_action) || {};
                                                    // saved existing model for dom update
                                                    if (_this.id) {
                                                        if (!action[_this.name])
                                                            action[_this.name] = {};
                                                        action[_this.name][_this.id] = {
                                                            data: model,
                                                            timestamp: Date.now()
                                                        };
                                                    }
                                                    // saved new model for dom update
                                                    else {
                                                        _this.id = id;
                                                        // update the url
                                                        _this.url += _this.id;
                                                        if (!action[_this.name])
                                                            action[_this.name] = [];
                                                        // Remove model uid if exists to avoid duplicates
                                                        _this.app.__
                                                                .removeArrayValue(action[_this.name],
                                                                        _this.id, true);
                                                        action[_this.name].push(_this.id);
                                                    }
                                                    _this.app.store(_action, action);
                                                }
                                                // update current page 
                                                internal.updatePage.call(_this.app);
                                            }
                                            // update model's collection
                                            if (_this.collection) {
                                                _this.collection.models[id] = model;
                                                _this.collection.length++;
                                            }
                                        }
                                        _this.app.__.callable(config.success).call(this, data, id);
                                    }
                                    else {
                                        _this.app.__.callable(config.fail).call(this);
                                    }
                                    _this.app.__.callable(config.complete).call(this);
                                },
                                        _error = function (e) {
                                            _this.app.__.callable(config.error).call(this, e);
                                            _this.app.__.callable(config.complete).call(this, e);
                                        };
                                if (this.app.dataTransport)
                                    this.app.__.callable(this.app.dataTransport)
                                            .call(this.app, {
                                                url: config.url || this.url,
                                                id: this.id,
                                                data: formData,
                                                action: this.id ? 'update' : 'create',
                                                success: _success,
                                                error: _error
                                            });
                                else {
                                    this.app.request({
                                        type: config.method || method,
                                        url: config.url || _this.url,
                                        data: formData,
                                        success: _success,
                                        error: _error
                                    });
                                }
                            }
                            else {
                                _this.app.error('Cannot save model to server: No URL supplied.');
                            }
                        };
                        // saving form while there's an uploader for the app
                        if (config.form && internal.record.call(this.app, 'uploader')) {
                            // get files
                            var files = this.app._(config.form).find('input[type="file"]');
                            if (files.length) {
                                data = data || {};
                                var _this = this;
                                // send them to uploader
                                this.app.__.callable(internal.record.call(this.app, 'uploader'))
                                        .call(config.form, {
                                            modelName: this.name,
                                            files: files.items,
                                            data: this.app.__.extend(data),
                                            id: this.id,
                                            url: this.url,
                                            done: function (_data) {
                                                if (!_data) {
                                                    this.app.__.callable(config.error).call(this.app);
                                                    return;
                                                }
                                                this.app.__.forEach(_data, function (i, v) {
                                                    data[i] = v;
                                                });
                                                finalizeSave.call(this, config, data);
                                            }.bind(this)
                                        });
                                // remove them from form
                                files.remove();
                                return this;
                            }
                        }
                        finalizeSave.call(this, config, data);
                        return this;
                    }
                });
                if (__.isObject(attributes)) {
                    __.forEach(attributes, function (key) {
                        // ignore internal keys
                        if (key.startsWith('__'))
                            return;
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
                    models: __.isObject(models, true) ? models : {},
                    name: props && props.name ? props.name : null,
                    uid: props && props.uid ? props.uid : '',
                    url: props && props.url ? props.url : null,
                    /**
                     * Adds a model to the collection
                     * @param {Object} config @see Model.save()
                     * @returns {Model}
                     */
                    add: function (config) {
                        if (!this.name || !this.url) {
                            this.app.error('Collection must have a name and url');
                            return;
                        }
                        else if (!config || !config.data) {
                            this.app.error('Collection.add() must have an object parameter with key data');
                            return;
                        }
                        var model = new Model(null, config.data, {
                            name: this.name,
                            app: this.app,
                            uid: this.uid,
                            url: this.url,
                            collection: this
                        });
                        if (model.save(config))
                            return model;
                        return false;
                    },
                    /**
                     * Binds the collection to the given element
                     * @param {string}|{HTMLElement}|{_} elem
                     * @returns {Model}
                     */
                    bind: function (elem) {
                        if (!this.name) {
                            this.app.error('Collection must have a name');
                            return;
                        }
                        elem = this.app._(elem);
                        elem.this('model', this.name);
                        if (this.uid)
                            elem.this('model-uid', this.uid);
                        if (this.url)
                            elem.this('url', this.url);
                        internal.loadCollection.call(this.app, elem);
                        return this;
                    },
                    /**
                     * Clears the collection data from app cache
                     */
                    clearCache: function () {
                        return internal.clearCache.call(this.app, 'model', this.name);
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
                     * Loops through models and applies the callback to each
                     * @param {Function} callback
                     * @returns {_Collection}
                     */
                    each: function (callback) {
                        __.forEach(this.models, function (i, v) {
                            __.callable(callback).call(this, i, v);
                        });
                        return this;
                    },
                    /**
                     * Fetch the model at the index location
                     * @param {integer} index                      * @returns {Model}                      */
                    get: function (index) {
                        var key = Object.keys(this.models)[index],
                                model;
                        if (!key)
                            return;
                        this.parent.current_index = index;
                        model = this.models[key];
                        if (model)
                            delete model.__page;
                        return new Model(key, model, {
                            name: this.name,
                            app: this.app,
                            uid: this.uid,
                            url: url,
                            collection: this
                        });
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
                     * Initializes the collection
                     * @param {object} props An object of key to value to set
                     * as the collection's attribues
                     */
                    init: function (props) {
                        var _this = this;
                        __.forEach(props, function (i, v) {
                            _this[i] = v;
                        });
                        return this;
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
                     * @param {Object} Keys include url (string), success (function),
                     * error (function)
                     * @returns {Model}
                     */
                    model: function (model_id, options) {
                        var _this = this, url,
                                options = this.app.__.extend({
                                    success: function (model) {},
                                    error: function (e) {}
                                }, options);
                        if (model_id) {
                            if (options.url) {
                                url = options.url;
                            }
                            else if (this.url) {
                                url = (_this.url.endsWith('/') ?
                                        _this.url : _this.url + '/') + model_id;
                            }
                            if (this.models[model_id]) {
                                var model = this.app.__.extend(this.models[model_id]);
                                delete model.__page;
                                this.app.__.callable(options.success).call(this,
                                        new Model(model_id, model, {
                                            name: _this.name,
                                            app: _this.app,
                                            uid: _this.uid,
                                            url: url,
                                            collection: this
                                        }));
                            }
                            else if (url) {
                                this.app.request({
                                    url: url,
                                    success: function (data) {
                                        data = getRealData.call(this.app, data);
                                        if (data && this.app.__.isObject(data))
                                            delete data.__page;
                                        this.app.__.callable(options.success).call(this,
                                                new Model(model_id, data, {
                                                    name: _this.name,
                                                    app: _this.app,
                                                    uid: _this.uid,
                                                    url: url,
                                                    collection: this
                                                }));
                                    }.bind(this),
                                    error: function (e) {
                                        this.app.__.callable(options.error).call(this, e);
                                    }.bind(this)
                                });
                            }
                            return;
                        }
                        this.app.__.callable(options.success)
                                .call(this.app, new Model(null, null, {
                                    name: this.name,
                                    app: this.app,
                                    uid: this.uid,
                                    url: url,
                                    collection: this
                                }));
                    },
                    /**
                     * Fetchs the next model
                     * @returns {Model}
                     */
                    next: function () {
                        return this.get(this.parent.current_index + 1);
                    },
                    /**
                     * Removes a model
                     * @param {integer}|{string} model_id
                     * @param {Object} options @see Model.remove()
                     * @returns {Model}
                     */
                    remove: function (model_id, options) {
                        var _options = this.app.__.extend({}, options),
                                url;
                        if (options.url) {
                            url = options.url;
                        }
                        else if (this.url) {
                            url = (_this.url.endsWith('/') ?
                                    _this.url : _this.url + '/') + model_id;
                        }
                        _options.url = url;
                        _options.success = function () {
                            delete this.models[model_id];
                            this.length--;
                            this.app.__.callable(options.success)
                                    .apply(this, Array.from(arguments));
                        }.bind(this);
                        /* remove one */
                        this.model(model_id, {
                            url: url,
                            success: function (model) {
                                model.remove(options);
                            }.bind(this)
                        });
                    },
                    /**
                     * Remove all models
                     * @return {boolean}
                     */
                    removeAll: function () {
                        if (!this.url || !this.name) {
                            this.app.error('Invalid url and/or model name!');
                            return;
                        }

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
                                this.app.request({
                                    url: this.url,
                                    type: config.method || this.app.config.crud.methods.delete,
                                    success: _success,
                                    error: _error
                                });
                        }
                        return true;
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
                if (!_Collection.length && props.app.__.isObject(models, true))
                    _Collection.length = Object.keys(models).length;
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
            /** 			 * The base url upon which other urls are built
             */
            baseURL: location.origin + location.pathname,
            /**
             * CRUD settings
             */
            crud: {
                /*
                 * Indicates the status info for crud operations
                 */
                status: {
                    key: 'status', // the key that holds the operation status
                    successValue: true // the key value that indicates success
                },
                /*
                 * CRUD methods
                 */
                methods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PUT',
                    delete: 'DELETE'
                }
            },
            /**
             * The key in each ajax response which holds the actual object or array of objects
             */
            dataKey: 'data',
            /**
             * Indicates whether the app should run in debug mode or not.
             */
            debug: false,
            /** 			 * The default layout for the application
             */
            layout: null,
            /**
             * Default uid for models and collections if not explicitly defined
             */
            modelUID: 'id',
            /**
             * Pagination settings
             */
            pagination: {
                // The number of results to fetch when paginating. 
                // FALSE means no limit should be sent. Useful for when the server
                // takes care of its pagination limit
                limit: 20,
                // FALSE means new data would be appended
                overwrite: false
            },
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
             * ID of the page to start the app with
             */
            startWith: null,
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
            transitionOptions: {}
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
            return _(selector, debug || this.config ? internal.record.call(this, 'debug') : true);
        },
        /**
         * Adds an element to the template collection
         * @param {_}|{HTMLElement} elem
         * @returns {ThisApp}
         */
        addTemplate: function (elem, replace) {
            return this.tryCatch(function () {
                elem = this._(elem).clone();
                var _this = this;
                elem.find('style').each(function () {
                    _this._(this).replaceWith('<div this-type="style">' + this.innerText + '</div>');
                });
                this.templates.append(elem.outerHtml()
                        .replace(/\{\{/g, '__obrace__')
                        .replace(/\}\}/g, '__cbrace__')
                        .replace(/\(\{/g, '__obrace2__')
                        .replace(/\}\)/g, '__cbrace2__'));
                return this;
            });
        },
        /**
         * Takes the app back one step in history
         * @returns ThisApp
         */
        back: function (e) {
            return this.tryCatch(function () {
                if (e && this.__.isObject(e) && e['preventDefault'])
                    e.preventDefault();
                if (history.length <= 2) {
                    return this.home(true);
                }
                else if (internal.canContinue
                        .call(this, 'page.leave', [], this.page.get(0))) {
                    history.back();
                }
                return this;
            });
        },
        /**
         * Registers a callbact to be called before an event happens. If the callback returns false,
         * the event is terminated.
         * @param {string} event
         * @param {function} callback
         * @returns {ThisApp}
         */
        before: function (event, callback) {
            return this.tryCatch(function () {
                this.__.forEach(event.split(','), function (i, v) {
                    if (this.page) {
                        if (!this.beforeCallbacks[this.page.this('id')])
                            this.beforeCallbacks[this.page.this('id')] = {};
                        this.beforeCallbacks[this.page.this('id')][v.trim()] = callback;
                    }
                    else {
                        if (!this.beforeCallbacks['___common'])
                            this.beforeCallbacks['___common'] = {};
                        this.beforeCallbacks['___common'][v.trim()] = callback;
                    }
                }.bind(this));
                return this;
            });
        },
        /**
         * Binds an element to an object
         * @param {_}|{HTMLElement} elem
         * @param {Object} object
         * @param {Funtion} callback
         */
        bindToObject: function (elem, object, callback) {
            return internal.bindToObject.call(this, elem, object, callback);
        },
        /**
         * Clears the cache of all models and collections on the current page
         * @param {boolean} reload Indicates that the elements attached to these
         * models and collections should be reloaded
         * @returns {ThisApp}
         */
        clearPageCache: function (reload) {
            var cleared = {},
                    _this = this,
                    did_page = false;
            this.container.find('[this-model],model:not([this-in-collection]),'
                    + '[this-type="model"]:not([this-in-collection])')
                    .each(function () {
                        var __this = _this._(this),
                                name = __this.this('model') || __this.this('id');
                        _this.collection(name, {
                            success: function (collection) {
                                collection.clearCache();
                                if (__this.this('type') === 'page') {
                                    did_page = true;
                                    return;
                                }
                                // reload element if page's model collection has
                                // not been cleared. Otherwise, don't. Reloading
                                // page would take care of that.
                                if (reload && !did_page) {
                                    _this.load(__this);
                                }
                            }
                        });
                    });
            // cleared page's model collection: reload page
            if (did_page && reload) {
                this.reload();
            }
        },
        /**
         * Fetches a collection of model
         * @param {string} model_name
         * @param {object} config Keys include url (string), data (object|array),
         * success (function), error (function)
         * @returns {Collection}
         */
        collection: function (model_name, config) {
            return this.tryCatch(function () {
                if (!model_name) {
                    this.__.callable(config.success).call(this, new Collection([], {app: this}));
                    return;
                }
                if (!config)
                    config = {};
                var data = config.data;
                if (!data) {
                    var collection = internal.cache.call(this, 'model', model_name);
                    data = [];
                    if (collection) {
                        data = collection.data;
                        if (!config.url)
                            config.url = collection.url;
                        if (!config.uid)
                            config.uid = collection.uid;
                    }
                }
                else if (data) {
                    // ensure data is well packaged for caching
                    if (this.config.dataKey && !data[this.config.dataKey]) {
                        var _data = {};
                        _data[this.config.dataKey] = data;
                        data = _data;
                    }
                    internal.cache.call(this, 'model', model_name, data);
                }
                // data exists and has at least one entry or
                // data doesn't exist and neither does config.url
                if ((data && this.__.isObject(data, true)
                        && Object.keys(data).length) ||
                        !config.url) {
                    this.__.callable(config.success).call(this,
                            new Collection(data, {
                                name: model_name,
                                app: this,
                                uid: config ? config.uid : null,
                                url: config ? config.url : null
                            }));
                }
                else if (model_name && config.url) {
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
                        _collection = this._('<collection this-model="'
                                + model_name + '" this-url="' + config.url + '" />');
                    _collection.this('no-updates', '');
                    var _this = this;
                    this.request({
                        url: _collection,
                        success: function (data, uid) {
                            // trigger invalid.response trigger if no data
                            if (data) {
                                // default data structure
                                var _data = {
                                    data: {},
                                    // set expiration timestamp to 24 hours
                                    expires: new Date().setMilliseconds(1000 * 3600 * 24)
                                },
                                        real_data = getRealData.call(_this, data);
                                // get expiration if set and data from dataKey if specified
                                if (_this.config.dataKey) {
                                    // set data expiration timestamp too.
                                    if (!isNaN(data.expires)) // expiration is a number. Must be milliseconds
                                        _data.expires = new Date().setMilliseconds(1000 * data.expires);
                                    else if (_this.__.isString(data.expires)) // expiration is a string. Must be date
                                        _data.expires = new Date(data.expires).getTime();
                                    data = real_data;
                                }
                                internal.cache.call(_this, 'model', model_name, _data);
                            }

                            _this.__.callable(config.success).call(_this,
                                    new Collection(data, {
                                        name: model_name,
                                        app: _this,
                                        uid: config.uid || _collection.this('model-uid') || uid,
                                        url: config.url || _collection.this('url')
                                    }));
                        },
                        error: config.error
                    });
                }
                return this;
            });
        },
        /**
         * Sets the app debug mode
         * @param boolean debug Default is TRUE
         * @returns ThisApp
         */
        debug: function (debug) {
            this.config.debug = debug || false;
            return this;
        },
        /**
         * The function called when an error occurs
         * @param string msg
         * @returns ThisApp
         */
        error: function (msg) {
            internal.log.call(this, 'warn', msg);
            return this;
        },
        /**
         * Takes the app forward one step in history
         * @returns ThisApp
         */
        forward: function (e) {
            return this.tryCatch(function () {
                if (e && this.__.isObject(e) && e['preventDefault'])
                    e.preventDefault();
                if (!internal.canContinue
                        .call(this, 'page.leave', [], this.page.items[0])) {
                    return this;
                }
                history.forward();
                return this;
            });
        },
        /**
         * Gets a list of available filters
         * @returns array          */
        getAvailableFilters: function () {
            return Object.keys(Filters);
        },
        /**
         * Gets a list of available transitions
         * @returns array
         */
        getAvailableTransitions: function () {
            return Object.keys(Transitions);
        },
        /**
         * Fetches the unique key generated for the last request
         */
        getRequestKey: function () {
            return internal.getRequestKey.call(this);
        },
        /**
         * Fetches a clone of the required elements from the cache collection
         * @param {string} selector
         * @param {string} type The type of element to get. This is the value of
         * the `this-type` of the target element. The attribute is created and 
         * appended to the selector.
         * @returns {_}
         */
        getCached: function (selector, type) {
            return this.tryCatch(function () {
                var _this = this,
                        elem = this._();
                if (type) {
                    var seltr = '';
                    this.__.forEach(selector.split(','), function (i, v) {
                        if (seltr)
                            seltr += ',';
                        var parts = v.split(' '), sel = '';
                        v = parts.pop();
                        if (parts.length)
                            sel += parts.join(' ') + ' ';
                        seltr += sel + v + '[this-type="' + type + '"],' + sel + type + v;
                    });
                    selector = seltr;
                }
                // check in page cache first
                if (this.page) {
                    if (!selector) {
                        selector = 'page[this-id="' + this.page.this('id')
                                + '"],[this-type="page"][this-id="'
                                + this.page.this('id') + '"]';
                    }
                    var selectr = '';
                    this.__.forEach(selector.split(','), function (i, v) {
                        if (selectr)
                            selectr += ',';
                        selectr += 'page[this-id="'
                                + _this.page.this('id') + '"] ' + v
                                + ',[this-type="page"][this-id="'
                                + _this.page.this('id') + '"] ' + v;
                    });
                    elem = this.templates.find(selectr);
                    if (!elem.length)
                        elem = this.templates.children('[this-type="component"]')
                                .find(selector);
                }
                if (!elem.length)
                    elem = this.templates.children(selector);
                elem = elem.clone();
                if (elem.this('type') === 'template')
                    elem.removeThis('type');
                elem.find('[this-type="style"]').each(function () {
                    _this._(this).replaceWith('<style>' + this.innerText + '</style>');
                });
                return this._(elem.outerHtml()
                        .replace(/__obrace__/g, '{{')
                        .replace(/__cbrace__/g, '}}')
                        .replace(/__obrace2__/g, '({')
                        .replace(/__cbrace2__/g, '})'));
            });
        },
        /**
         * Returns the app to the home page
         * @param {Boolean} replaceState Indicates that the current state should
         * be replaced instead of creating a new one
         * @returns ThisApp
         */
        home: function (replaceState) {
            return this.tryCatch(function () {
                this.loadPage(this.config.startWith ||
                        this.container
                        .find('page[this-default-page]:not([this-current]):not([this-dead]),'
                                + '[this-type="pages"] [this-default-page]')
                        .this('id'), replaceState);
                return this;
            });
        },
        /**
         * Loads an element (collection, model, component, or layout)
         * @param {HTMLElement}|{_} elem
         * @param {Function} callback
         * @returns {ThisApp}
         */
        load: function (elem, callback) {
            return this.tryCatch(function () {
                var _this = this;
                this._(elem).each(function () {
                    var type = getElemType(_this._(this)),
                            method = 'load' + type[0].toUpperCase() + type.substr(1),
                            valid = _this.__.inArray(type.toLowerCase(),
                                    ['component', 'collection', 'model']);
                    if (!internal[method])
                        return;
                    internal[method].call(_this, this, callback);
                });
                return this;
            });
        },
        /**
         * Loads the given page
         * @param {string} pageIDorPath ID of the page or the path to the content of the page
         * @param {boolean} replaceState Indicates whether to replace the current page's state with
         * the new page state instead of creating a different state for it.
         * @returns {ThisApp}
         */
        loadPage: function (pageIDorPath, replaceState) {
            return this.tryCatch(function () {
                var last_page = this.store('last_page');
                if (!pageIDorPath || ((last_page === pageIDorPath || last_page === '#/' + pageIDorPath)
                        && !this.firstPage))
                    return this;
                if (this.page && !internal.canContinue
                        .call(this, 'page.leave', [], this.page.items[0])) {
                    return this;
                }
                this.oldPage = _();
                pageIDorPath = internal.pageIDFromLink.call(this, pageIDorPath);
                var newPage = this.getCached('[this-id="' + pageIDorPath + '"]', 'page');
                if (newPage.length > 1) {
                    this.error('Target page matches multiple pages!');
                    return this;
                }
                else if (!newPage.length) {
                    if (this.config.paths && this.config.paths.pages) {
                        var _this = this;
                        internal.fullyFromURL.call(this, 'page', pageIDorPath,
                                function (elem) {
                                    internal.pageFound.call(_this, elem, replaceState);
                                },
                                function () {
                                    internal.notAPage.call(_this, pageIDorPath);
                                });
                        return this;
                    }
                    internal.notAPage.call(this, pageIDorPath);
                    return this;
                }
                internal.pageFound.call(this, newPage, replaceState);
                return this;
            });
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
            return this.tryCatch(function () {
                if (internal.isRunning.call(this)) {
                    if (this.page) {
                        var evt = event.replace(/[^a-z0-9]/gi, '')
                                + selector.replace(/[^a-z0-9]/gi, ''),
                                pageID = this.page.this('id');
                        if (!containedEvents[evt]) {
                            // event has not been handled at all before
                            containedEvents[evt] = {};
                            var _this = this;
                            this.container.on(event, selector, function () {
                                return internal.dispatchEvent.call(_this, evt, this, Array.from(arguments));
                            });
                        }
                        if (!containedEvents[evt][pageID])
                            containedEvents[evt][pageID] = callback;
                    }
                    else {
                        this.container.on(event, selector, callback);
                    }
                }
                else
                    this.events.push({
                        event: event, selector: selector,
                        callback: callback
                    });
                return this;
            });
        },
        /**
         * What to do when the app encounters an error
         * @param function callback
         * @returns ThisApp
         */
        onError: function (callback) {
            this.error = function (message) {
                this.__proto__.error(message);
                this.__.callable(callback, true).call(this, message);
            };
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
         * Reloads the current page
         * @param {Boolean} resources Indicates whether to reload all resources as well.
         * @param {Boolean} layouts Indicates whether to reload all layouts as well.
         * @returns {ThisApp}
         */
        reload: function (resources, layouts) {
            return this.tryCatch(function () {
                var last_page = this.store('last_page');
                this.store('last_page', null);
                if (resources)
                    location.reload();
                else {
                    this.reloadLayouts = layouts || false;
                    if (this.page.hasAttr('this-reading')) {
                        // keep attributes for page
                        this.tar['page#' + this.page.this('id')] = {
                            reading: '',
                            url: this.page.this('url'),
                            model: this.page.this('model'),
                            mid: this.page.this('mid')
                        };
                    }
                    this.loadPage(last_page, true);
                }
                return this;
            });
        },
        /**
         * Replaces cached elements with the given elem
         * @param {String} selector
         * @param {_}|{HTMLElement| elem
         * @returns {ThisApp}
         */
        replaceCached: function (selector, elem) {
            this.templates.find(selector).replaceWith(this._(elem).clone());
            return this;
        },
        /**
         * Sends an AJAX request
         * @param object config
         * Keys include:
         * type (string): GET | POST | PATCH | PUT | DELETE
         * url (string): The url to connect to. Default is current url
         * data (string|object): The data to send with the request
         * headers (object): Object of string keys to string values to pass to the request header
         * success (function): Function to call when a success response is gotten. The response data
         * is passed as a parameter
         * error (function) : Function to call when error occurs
         * complete (function): Function to call when a response has been received, error or success
         * @returns XMLHttpRequest object
         */
        request: function (config) {
            return this.tryCatch(function () {
                if (!this.__.isObject(config)) {
                    internal.log.call(this, 'error', 'Method expects an object parameter. '
                            + typeof config + ' given!');
                    return this;
                }
                var url = config.url;
                config.api = false;
                if (!url) {
                    internal.log.call(this, 'error', 'Method request() expects parameter 1 to be string. '
                            + typeof url + ' given');
                    return this;
                }
                else if (this.__.isObject(url)) {
                    url = url.this('url');
                }
                if (!url.startsWith('./') && !url.startsWith('../') && url.indexOf('://') === -1) {
                    url = this.config.baseURL + url;
                    config.api = true;
                }

                config.type = config.type || 'get';
                config.dataType = config.dataType || 'json';
                config.clearCache = internal.record.call(this, 'debug');
                config.url = url;

                return Ajax(config, this);
            });
        },
        /**
         * Reset an autocomplete input element
         * @param {string} id The id of the element. Could also be a comma-separted
         * list of ids
         * @return {ThisApp}
         */
        resetAutocomplete: function (id) {
            return this.tryCatch(function () {
                if (id) {
                    var selector = '', _this = this;
                    this.__.forEach(id.split(','), function (i, v) {
                        if (i)
                            selector += ',';
                        selector += '[this-id="' + v.trim() + '"][this-autocomplete]';
                    });
                    this.container.find(selector).each(function () {
                        var _input = _(this),
                                _dropdownList = _this.container.find('[this-id="' + _input.this('list')
                                        + '"][this-type="list"],list[this-id="' + _input.this('list')
                                        + '"]'),
                                _selectedList = _this.container.find('[this-id="'
                                        + _dropdownList.this('selection-list')
                                        + '"][this-type="list"],list[this-id="'
                                        + _dropdownList.this('selection-list')
                                        + '"]');
                        _selectedList.html('').hide();
                        _dropdownList.removeThis('selected').html('').hide();
                        _input.val('').trigger('keyup').show();

                    });
                }
                return this;
            });
        },
        /**
         * Provide function to ensure api requests are secured by providing either
         * headers or request body data, or both.
         * @param {Function} func The function to be called when making api
         * requests. The function would receive 3 parameters: (string) key, 
         * (object) header, (object) body
         * @returns {ThisApp}
         */
        secureAPI: function (func) {
            internal.secureAPI.call(this, func);
            return this;
        },
        /**
         * Set the base url for the app          * @param string url
         * @returns ThisApp          */
        setBaseUrl: function (url) {
            this.config.baseURL = url;
            return this;
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
            if (!this.config.paths)
                this.config.paths = {};
            this.__proto__.config.paths.components = {
                dir: path, ext: ext || '.html'
            };
            return this;
        },
        /**
         * Sets the path to css styles' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @returns {ThisApp}
         */
        setCSSPath: function (path) {
            if (!this.config.paths)
                this.config.paths = {};
            this.__proto__.config.paths.css = path;
            return this;
        },
        /**
         * Sets the key in the response which holds the data array          * @param string key
         * @returns ThisApp
         */
        setDataKey: function (key) {
            this.config.dataKey = key;
            return this;
        },
        /**
         * Sets the the transport system to use for data connection.
         * @param {function} callback The callback would be passed a single parameter which is an
         * object of configuration for the transportation with keys action (create,update,read,delete),
         * id, url, data (only for create and update), success callback, error callback
         * @returns {ThisApp}          */
        setDataTransport: function (callback) {
            if (callback)
                this.dataTransport = callback;
            return this;
        },
        /**
         * Sets the default layout for the application
         * @param string layout ID of the layout container
         * @returns ThisApp
         */
        setDefaultLayout: function (layout) {
            this.config.layout = layout;
            return this;
        },
        /**
         * Sets the path to js scripts' location
         * @param {string} path If path DOES NOT start with ./ or ../ or a protocol (e.g. http://),
         * the path is assumed to follow the set base url.
         * @returns {ThisApp}
         */
        setJSPath: function (path) {
            if (!this.config.paths)
                this.config.paths = {};
            this.__proto__.config.paths.js = path;
            return this;
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
            if (!this.config.paths)
                this.config.paths = {};
            this.__proto__.config.paths.layouts = {
                dir: path,
                ext: ext || '.html'
            };
            return this;
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
            if (!this.config.paths)
                this.config.paths = {};
            this.__proto__.config.paths.pages = {
                dir: path,
                ext: ext || '.html'
            };
            return this;
        },
        /**
         * Sets the container that would always hold the page title
         * @param string container
         * @returns ThisApp
         */
        setTitleContainer: function (container) {
            this.config.titleContainer = this._(container);
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
         * Sets the funtion to call when there are files to be upload in a form
         * @param {Function} func
         * @returns {ThisApp}
         */
        setUploader: function (func) {
            this.setup = func;
            internal.setUploader.call(this, func);
            return this;
        },
        /**
         * Initializes the app
         * @param string page The ID of the page
         * @param boolean freshCopy Indicates to ignore copy in histor and 
         * generate a fresh one
         * @returns app
         */
        start: function (page, freshCopy) {
            if (internal.isRunning.call(this))
                return this;
            if (page)
                this.config.startWith = page;
            this.firstPage = true;
            internal.setup.call(this);
            var hash = location.hash,
                    target_page = internal.pageIDFromLink.call(this, hash),
                    params = this.__.extend(this._params);
            if (params.length) {
                // keep attributes for page
                this.tar['page#' + target_page] = {
                    reading: '',
                    model: params.shift(),
                    mid: params[params.length - 1],
                    url: params.join('/')
                };
            }
            if (!freshCopy && history.state &&
                    hash === this.store('last_page')) {
                internal.restoreState.call(this, history.state);
            }
            else {
                this.loadPage((hash && hash !== '#' && hash !== '#/') ? hash :
                        this.config.startWith ||
                        this.getCached('page[this-default-page],'
                                + '[this-type="pages"] [this-default-page]')
                        .this('id'));
            }
            return this;
        },
        /**
         * Stores or retrieves stored data
         * @param string key
         * @param mixed value
         * @returns Array|Object|ThisApp
         */
        store: function (key, value) {
            return this.tryCatch(function () {
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
            });
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
            this.watchCallback = callback;
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
            return this.tryCatch(function () {
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
                        case "list":
                            selector += 'list,[this-type="list"]';
                            break;
                        default:
                            var exp = v.split('#');
                            if (exp.length > 1 && exp[0]) {
                                selector += '[this-type="' + exp[0] + '"][this-id="'
                                        + exp[1] + '"]';
                            }
                            else {
                                selector += '[this-id="' + v + '"]';
                            }
                    }
                });
                return this.on(event, selector, callback);
            });
        }
    };
})();
