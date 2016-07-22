/**
 * Created by Ezra Obiwale <contact@ezraobiwale.com> on 20-July-16.
 */
(function () {
	var __ = {
		anonymous: 0,
		loading: 0,
		processedPage: false,
		init: function (config) {
			this.setup(config);
			if (config.container === '#this-app-container' && !$('#this-app-container').length)
				$('body').prepend('<div id="this-app-container" />');
			$('[this-type]').hide();

			var targetedPage = location.hash.substr(1),
					lastPage = localStorage.getItem('lastPage'),
					pageData = localStorage.getItem('pageData'),
					$startPage;
			if (targetedPage)
				$startPage = $('[this-type="page"][this-id="' + targetedPage + '"]');
			if (!$startPage && lastPage)
				$startPage = $('[this-type="page"][this-id="' + lastPage + '"]');
			if (!$startPage || !$startPage.length)
				$startPage = $('[this-type="page"][this-default-page]');

			if ($startPage.length) {
				$startPage = $startPage.clone();
				if (pageData)
					$startPage.data('object', pageData);
//		localStorage.removeItem('pageData');
				this.processPage($startPage);
			}
			return this;
		},
		setup: function (config) {
			var __config = {
				container: '#this-app-container',
				animationDuration: 500,
				baseUrl: '',
				primaryKey: 'id',
				collectionAfterCreate: true,
				collectionAfterUpdate: true,
				collecitonAfterDelete: true,
				showLoading: function () {
				},
				hideLoading: function () {
				},
				beforePageLoad: function () {
					console.info('before page load');
				},
				afterPageLoad: function () {
					document.title = $(this).attr('this-title');
				},
				beforeUrlLoad: function () {
					console.info('before url load');
				},
				afterUrlLoad: function (x) {
					console.info('after url load');
				},
				beforeResponseParse: function (resp) {
					console.info('before response parse');
				},
				afterResponseParse: function (content) {
					console.info('after response parse');
				},
				beforeDelete: function () {
					console.info('before delete');
				},
				afterDelete: function () {
					console.info('after delete');
				},
				beforeCreate: function () {
					console.info('before create');
				},
				afterCreate: function (resp) {
					console.info('after create');
				},
				beforeUpdate: function () {
					console.info('before update');
				},
				afterUpdate: function (resp) {
					console.info('after update');
				},
				onLoadUrlError: function (e, url) {
					console.error('URL Error: [' + url + '] ', e);
				},
				onDataError: function (message) {
					console.error('Data Error:', message);
				},
				onLoadPageError: function (page_id, message) {
					message = message || 'Page [' + page_id + '] does not exist!';
					console.error('Load Page Error: ' + message);
				}
			};
			this.config = $.extend(__config, config);
			var thisApp = this;
			// monitor history.back
			window.onpopstate = function (e) {
				if (e.state)
					thisApp.restorePage(e.state);
			};
			// monitor page connectors
			$(this.config.container).on('click', '[this-goto]', function (e) {
				e.preventDefault();
				var $target = $('[this-type="page"][this-id="'
						+ $(this).attr('this-goto') + '"]');
				if (!$target.length) {
					thisApp.config.onLoadPageError($(this).attr('this-goto'));
					return true;
				}
				var $page = $target.clone(); // clone for later reuse
				// determine type of action to do in page
				try {
					switch ($(this).attr('this-action')) {
						case 'read':
						case 'view':
							// allow clicking on self to view
							var $model = $(this).attr('this-type') === 'model'
									? $(this) : $(this).closest('[this-type="model"]'),
									$col = $(this).closest('[this-type="collection"]');
							$page.data('object', $model.attr('this-object'));
							if ($col.length)
								$page.attr('this-url', $col.attr('this-url') + $model.attr('this-model-id') + '/');
							break;
						case 'create':
						case 'new':
							if ($(this).attr('href') === '#') {
								var $col = $(this).closest('[this-type="page"]').find('[this-type="collection"]');
								if ($col.length === 1) {
									$(this).attr('href', $col.attr('this-url'));
								}
							}
							$page.attr('this-action', 'create')
									.attr('action', $(this).attr('href'));
							break;
						case 'update':
							var $model = $(this).closest('[this-type="model"]');
							if ($(this).attr('href') === '#') {
								var $cont = $(this).closest('[this-type]'),
										url = $cont.attr('this-url');
								if (!url) {
									$cont = $(this).closest('[this-type="collection"]');
									url = $cont.attr('this-url');
								}
								if (!url) {
									$cont = $(this).closest('[this-type="page"]');
									url = $cont.attr('this-url');
								}
								if (url && $cont.length)
									$(this).attr('href', url + $model.attr('this-model-id') + '/');
							}
							$page.attr('this-action', 'update')
									.attr('action', $(this).attr('href'));
							localStorage.setItem('pageData', $model.attr('this-object'));
							break;
					}
				} catch (e) {
					thisApp.config.onLoadPageError(null, e.message);
				}
				thisApp.processPage($page.attr('this-variables', $(this).attr('this-variables')));
			})
					.on('click', '[this-action="delete"]', function (e) {
						e.preventDefault();
						var $model = $(this).closest('[this-type="model"]');
						if ($(this).attr('href') === '#') {
							var $cont = $(this).closest('[this-type]'),
									url = $cont.attr('this-url');
							if (!url) {
								$cont = $(this).closest('[this-type="collection"]');
								url = $cont.attr('this-url');
							}
							if (!url) {
								$cont = $(this).closest('[this-type="page"]');
								url = $cont.attr('this-url');
							}
							if (url && $cont.length)
								$(this).attr('href', url + $model.attr('this-model-id') + '/');
						}
						thisApp.config.beforeDelete.call(this);
						var $tag = $(this);
						thisApp.ajax('DELETE', $(this).attr('href'), [], function (resp) {
							thisApp.config.afterDelete.call(this, resp);
							if (resp.status) {
								var $rm = $tag.closest('[this-type]'),
										$page = $rm.closest('[this-type="page"]'),
										$col, canBack = false;
								if ($rm.attr('this-collection')) { // deleting from a model
									$col = $('[this-type="collection"][this-id="'
											+ $rm.attr('this-collection')
											+ '"]');
									canBack = true; // if page is empty, go to previous page
								}
								else if ($rm.attr('this-in-collection') === '')
									$col = $rm.closest('[this-type="collection"]');
								if ($col && $col.length) {
									var data = localStorage.getItem('col_' + $col.attr('this-id'));
									if (data) {
										data = JSON.parse(data);
										delete data[$rm.attr('this-model-id')];
										localStorage.setItem('col_' + $col.attr('this-id'), JSON.stringify(data));
										localStorage.setItem('updateCol', $col.attr('this-id'));
									}
								}
								$rm.remove();
								if (canBack && $.trim($page.html()) === '') {
									if (thisApp.config.collectionAfterDelete && $col.length) {
										thisApp.processPage($('[this-load-collection="' + $col.attr('this-id') + '"]').closest('[this-type="page"]').clone());
									}
									localStorage.setItem('cancelForward', true);
									history.back();
								}
							} else {
								thisApp.config.onDataError(resp.message);
							}
						}, function (e, url) {
							thisApp.config.onLoadUrlError.call($tag, e, url);
						});
					})
					.on('submit', 'form', function (e) {
						if ($(this).attr('this-action')) {
							e.preventDefault();
							var $form = $(this),
									$page = $(this).attr('this-type') === 'page' ? $(this) : $(this).closest('[this-type="page"]'),
									action = $page.attr('this-action'),
									create = (action === 'create');
							action = action[0].toUpperCase() + action.substr(1);
							thisApp['before' + action].call(this, $page);
							thisApp.ajax(create ? 'POST' : 'PUT', $form.attr('action') || $page.attr('action'), $(this).serialize(), function (resp) {
								thisApp['after' + action].call($form, resp);
								if (resp.status) {
									var col = $form.attr('this-collection'),
											model = $form.attr('this-model'),
											loadedPage = false;
									localStorage.setItem('updateCol', col);
									// go to collection
									if (col) {
										var data = localStorage.getItem('col_' + col);
										if (data) {
											data = JSON.parse(data);
											data[resp.data[thisApp.config.primaryKey]] = resp.data;
											data = JSON.stringify(data);
											localStorage.setItem('col_' + col, data);
											if ((create && thisApp.config.collectionAfterCreate) || (!create && thisApp.config.collectionAfterUpdate)) {
												thisApp.processPage($('[this-load-collection="' + col + '"]').closest('[this-type="page"]').clone());
												loadedPage = true;
											}
										}
									}
									// go to model
									if (model && !loadedPage) {
										localStorage.setItem('pageData', JSON.stringify(resp.data));
										thisApp.processPage($('[this-load-model="' + model + '"]').closest('[this-type="page"]').clone().data('object', JSON.stringify(resp.data)));
										loadedPage = true;
									}
									// go back in history
									if (!loadedPage) {
										history.back();
									}
								}
								else {
									thisApp.config.onDataError(resp.message);
								}
							}, function (e, url) {
								thisApp.config.onLoadUrlError.call($form, e, url);
							});
						}
						else if ($(this).attr('this-onsubmit')) {
							var func = $(this).attr('this-onsubmit');
							if (window[func] && typeof window[func] === 'function')
								window[func].call(this, e);
						}
					});
		},
		ajax: function (type, url, data, success, error, complete) {
			var thisApp = this;
			return $.ajax({
				type: type,
				url: this.config.baseUrl + url,
				data: data ? data : [],
				success: function (e) {
					if (typeof success === 'function')
						success.call(this, e);
				},
				error: function (e) {
					if (typeof error === 'function')
						error.call(this, e, thisApp.config.baseUrl + url);
				},
				complete: function (e) {
					if (typeof complete === 'function')
						complete.call(this, e);
				},
				dataType: 'json',
				crossDomain: true
			});
		},
		loadPage: function (page_id) {
			if (localStorage.getItem('lastPage') === page_id) {
				location.reload();
				return;
			}
			$page = $('[this-type="page"][this-id="' + page_id + '"]');
			if ($page.length)
				this.processPage($page.clone());
			else
				this.config.onLoadPageError(page_id);
		},
		processPage: function (page) {
			$page = $(page);
			if (!$page.attr('this-id')) {
				this.anonymous++;
				$page.attr('this-id', 'page' + this.anonymous);
			}
			if (false === this.config.beforePageLoad.call($page))
				return;
			var thisApp = this;
			this.processedPage = false;
			this.loading = $page.attr('this-current', '')
					.find('[this-load-collection], [this-load-model], [this-load-template]')
					.each(function () {
						var $load;
						if ($(this).attr('this-load-collection')) {
							$load = $('[this-type="collection"][this-id="' + $(this).attr('this-load-collection') + '"]');
							if (!$load.length)
								thisApp.error('Collection #' + $(this).attr('this-load-collection') + ' not found', $load);
							if (thisApp.loadCollection($page, $load, this))
								return true;
						}
						else if ($(this).attr('this-load-model')) {
							$load = $('[this-type="model"][this-id="' + $(this).attr('this-load-model') + '"]');
							if (!$load.length)
								thisApp.error('Model #' + $(this).attr('this-load-model') + ' not found');
						}
						else if ($(this).attr('this-load-template')) {
							$load = $('[this-type="template"][this-id="' + $(this).attr('this-load-template') + '"]');
							if (!$load.length)
								thisApp.error('Template #' + $(this).attr('this-load-template') + ' not found');
							thisApp.loadTemplate($page, $load, this);
							return true;
						}
						if ($page.data('object')) {
							thisApp.loadData($page, this, $load, JSON.parse($page.data('object')));
						}
						else
							thisApp.loadUrl($page, $load, this);
					}).length;
			$(this.config.container).html($page.fadeIn(this.config.animationDuration));
			this.doneLoading($page);
		},
		error: function (message) {
			if (this.config.debug)
				console.error(message);
		},
		doneLoading: function (page) {
//        this.loading--;
//        console.log('>>', this.loading);
//        if (this.loading === -1)
			this.wrapUp(page);
		},
		wrapUp: function (page) {
			var $page = $(page);
			if (!this.processedPage)
				this.processPageObject($page);
			this.savePage($page.attr('this-id'));
			this.config.afterPageLoad.call($page);
		},
		processPageObject: function ($page) {
			var thisApp = this;
			if ($page.attr('this-action') === 'update') {
				var obj = JSON.parse(localStorage.getItem('pageData'));
				$.each(obj, function (i, v) {
					if (typeof v === 'object') {
						thisApp.deepProcessPageObject(i, v, $page);
						return true;
					}
					$page.find('#' + i).val(v);
				});
			}
			this.processedPage = true;
		},
		deepProcessPageObject: function (name, object, $page) {
			var thisApp = this;
			$.each(object, function (i, v) {
				if (typeof i === 'number') {
					if (typeof v === 'object') {
						thisApp.deepProcessPageObject(name + '[]', v, $page);
						return true;
					}
					$page.find('[name="' + name + '[]"]')[i].value = v;
				} else {
					if (typeof v === 'object') {
						thisApp.deepProcessPageObject(name + '[' + i + ']', v, $page);
						return true;
					}
					$page.find('[name="' + name + '[' + i + ']"]').val(v);
				}
			});
		},
		savePage: function (id) {
			setTimeout(function () {
				window.history[localStorage.getItem('lastPage') === id
						|| localStorage.getItem('cancelForward') ?
						'replaceState' : 'pushState']({page: $(this.config.container).html(), id: id, title: document.title}, document.title, '#' + id);
				localStorage.setItem('lastPage', id);
			}.bind(this), this.config.animationDuration);
			localStorage.setItem('anonymous', this.anonymous);
			localStorage.removeItem('cancelForward');
		},
		restorePage: function (state) {
			this.anonymous = parseInt(localStorage.getItem('anonymous')) || 0;
			if (state) {
				var $page = $(state.page).hide(),
						updateCol = localStorage.getItem('updateCol');
				if (updateCol) {
					var $col = $page.find('[this-type="collection"][this-id="' + updateCol + '"]');
					if ($col.length) {
						var data = localStorage.getItem('col_' + updateCol);
						localStorage.removeItem('updateCol');
						if (data) {
							this.processPage($page.attr('object', data).clone());
							return;
						}
					}
				}
				$(this.config.container).html($page)
						.children().fadeIn(this.config.animationDuration);
				localStorage.setItem('lastPage', state.id);
//			localStorage.removeItem('pageData');
				this.config.afterPageLoad.call($page);
				return true;
			}
		},
		contentReady: function (page, placeholder, content) {
			$(placeholder).replaceWith($(content).fadeIn(this.config.animationDuration));
			this.doneLoading(page);
		},
		parseVariables: function (content, variables) {
			if (variables) {
				variables = typeof variables === 'string' ? JSON.parse(variables) : variables;
				$.each(variables, function (ky, val) {
					content = content.replace(new RegExp('{' + ky + '}', 'g'), val);
				});
				return content;
			}
		},
		loadTemplate: function ($page, obj, placeholder) {
			var $cloned = $(obj).clone();
			$cloned.html(this.parseVariables($cloned.html(), $(placeholder).attr('this-variables')));
			this.contentReady($page, placeholder, $cloned);
		},
		loadCollection: function (page, obj, placeholder) {
			var data = localStorage.getItem('col_' + $(obj).attr('this-id'));
			if (data) {
				data = JSON.parse(data);
				this.contentReady(page, placeholder, this.parseCollection(obj, data).clone);
				return true;
			}
		},
		loadData: function (page, placeholder, obj, data) {
			localStorage.setItem('pageData', JSON.stringify(data));
			this.contentReady(page, placeholder, this.parseModel(obj, data));
		},
		loadUrl: function (page, obj, placeholder) {
			var thisApp = this, calledAfterUrlLoad = false;
			if (!$(obj).attr('this-url'))
				return;
			this.config.beforeUrlLoad.call(obj, page);
			this.ajax('get', $(obj).attr('this-url'), [], function (resp, s, x) {
				thisApp.config.afterUrlLoad.call(obj, x);
				calledAfterUrlLoad = true;
				thisApp.config.beforeResponseParse.call(obj, resp);
				var content = thisApp.parseResponse(obj, resp);
				thisApp.config.afterResponseParse.call(obj, content);
				if (content)
					thisApp.contentReady(page, placeholder, content);
				else
					thisApp.doneLoading(page);
			}, function (e, url) {
				thisApp.config.onLoadUrlError.call(obj, e, url);
				thisApp.doneLoading(page);
			}, function (x) {
				if (!calledAfterUrlLoad)
					thisApp.config.afterUrlLoad.call(obj, x);
			});
		},
		saveCollection: function (obj, data) {
			var id = 'col_' + $(obj).attr('this-id'), _data = localStorage.getItem(id);
			if (_data)
				_data = JSON.parse(_data).concat(data);
			else
				_data = data;
			localStorage.setItem(id, JSON.stringify(_data));
		},
		parseResponse: function (obj, resp) {
			if (resp.status) {
				if ($(obj).attr('this-type') === 'collection') {
					var result = this.parseCollection(obj, resp.data);
					this.saveCollection(obj, result.parsedData);
					return result.clone;
				}
				else
					return this.parseModel(obj, resp.data);
			} else {
				this.config.onDataError.call(obj, resp.message);
			}
		},
		parseCollection: function (obj, data) {
			var content = $(obj).html(),
					$cloned = $(obj).clone(),
					thisApp = this,
					parsedData = {};
			$cloned.html('');
			$.each(data, function (i, v) {
				parsedData[v[thisApp.config.primaryKey]] = v;
				$cloned.append(thisApp.parseModel($(content), v, true));
			});
			return {parsedData: parsedData, clone: $cloned.show()};
		},
		parseModel: function (obj, data, fromCollection) {
			var content = $(obj).html(),
					$cloned = $(obj).clone(),
					thisApp = this;
			$cloned.attr('this-object', JSON.stringify(data))
					.attr('this-model-id', data[this.config.primaryKey]);
			$.each(data, function (key, value) {
				if (typeof value === 'object') { // both arrays and plain objects
					$cloned.html(content);
					var $target = $cloned.find('#' + key);
					if ($target.length) {
						thisApp.parseData($target, value);
						content = $cloned.html();
						return true;
					}
				}
				content = content.replace(new RegExp('{' + key + '}', 'g'), value);
			});
			if (fromCollection)
				$cloned.attr('this-in-collection', '').show();
			else
				localStorage.setItem('pageData', $cloned.attr('this-object'));
			return $cloned.html(content).attr('this-type', 'model');
		},
		parseData: function (obj, data) {
			var content = $(obj).html(),
					thisApp = this;
			$(obj).html('');
			$.each(data, function (key, value) {
				if (typeof value === 'object') { // both arrays and plain objects
					var $target = $(content).find('#' + key);
					if ($target.length) {
						$(obj).append(thisApp.parseData($target, value));
						return true;
					}
				}
				$(obj).append(content.replace(new RegExp('{key}', 'g'), key)
						.replace(new RegExp('{value}', 'g'), value));
			});
			return obj;
		}
	};
	this.ThisApp = function (config) {
		this.version = '1.0';
		__.init(config);
	};
	this.ThisApp.prototype = {
		clearCache: function () {
			localStorage.clear();
		}
	};
})(window);
