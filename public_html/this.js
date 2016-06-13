var ThisApp = {
	container: '#this-app-container',
	anonymous: 0,
	animationDuration: 500,
	baseUrl: '',
	primaryKey: 'id',
	prependNew: true,
	collectionAfterCreate: false,
	collectionAfterUpdate: true,
	collectionAfterDelete: true,
	init: function () {
		this.setup();
		if (this.container === '#this-app-container' && !$('#this-app-container').length)
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

		$startPage = $startPage.clone();
		if (pageData)
			$startPage.data('object', pageData);
//		localStorage.removeItem('pageData');
		this.loadPage($startPage);
	},
	setup: function () {
		var thisApp = this;
		window.onpopstate = function (e) {
			if (e.state)
				thisApp.restorePage(e.state);
		};
		$(this.container).on('click', '[this-goto]', function (e) {
			var $target = $('[this-type="page"][this-id="'
					+ $(this).attr('this-goto') + '"]');
			if (!$target.length)
				return true;
			var $page = $target.clone(),
					$tag = $(this);
			e.preventDefault();
			switch ($(this).attr('this-action')) {
				case 'view':
					var $withObject = ($(this).attr('this-type') === 'model')
							? $(this) : $(this).closest('[this-type="model"]');
					$page.data('object', $withObject.attr('this-object'));
					break;
				case 'create':
					$page.attr('this-action', 'create')
							.attr('action', $tag.attr('href'));
					break;
				case 'update':
					$page.attr('this-action', 'update')
							.attr('action', $tag.attr('href'));
					localStorage.setItem('pageData', $tag.closest('[this-type="model"]')
							.attr('this-object'));
					break;
			}
			thisApp.loadPage($page);
		})
				.on('click', '[this-action="delete"]', function (e) {
					e.preventDefault();
					thisApp.beforeDelete.call(this);
					var $tag = $(this);
					thisApp.ajax('DELETE', $(this).attr('href'), [], function (resp) {
						thisApp.afterDelete.call(this, resp);
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
								if (thisApp.collectionAfterDelete && $col.length) {
									thisApp.loadPage($('[this-load-collection="' + $col.attr('this-id') + '"]').closest('[this-type="page"]').clone());
								}
								localStorage.setItem('cancelForward', true);
								history.back();
							}
						} else {
							thisApp.onDataError(resp.message);
						}
					}, function (e) {
						thisApp.onLoadUrlError(e);
					});
				})
				.on('submit', '[this-action="create"],[this-action="update"]', function (e) {
					e.preventDefault();
					var $form = $(this),
							$page = $(this).attr('this-type') === 'page' ? $(this) : $(this).closest('[this-type="page"]'),
							action = $page.attr('this-action'),
							create = (action === 'create');
					action = action[0].toUpperCase() + action.substr(1);
					thisApp['before' + action].call(this);
					thisApp.ajax(create ? 'POST' : 'PUT', $form.attr('action') || $page.attr('action'), $(this).serialize(), function (resp) {
						thisApp['after' + action].call($form, resp);
						if (resp.status) {
							var col = $form.attr('this-collection'),
									model = $form.attr('this-model'),
									loadedPage = false;
							localStorage.setItem('updateCol', col);
							if (col) {
								var data = localStorage.getItem('col_' + col);
								if (data) {
									data = JSON.parse(data);
									data[resp.data[thisApp.primaryKey]] = resp.data;
									data = JSON.stringify(data);
									localStorage.setItem('col_' + col, data);
									if ((create && thisApp.collectionAfterCreate) || (!create && thisApp.collectionAfterUpdate)) {
										thisApp.loadPage($('[this-load-collection="' + col + '"]').closest('[this-type="page"]').clone());
										loadedPage = true;
									}
								}
							}
							if (model && !loadedPage) {
								localStorage.setItem('pageData', JSON.stringify(resp.data));
								thisApp.loadPage($('[this-load-model="' + model + '"]').closest('[this-type="page"]').clone().data('object', JSON.stringify(resp.data)));
							}
						}
						else {
							thisApp.onDataError(resp.message);
						}
					}, function (e) {
						thisApp.onLoadUrlError(e);
					});
				});
	},
	formToObject: function (form) {
		var obj = {}, array = $(form).serializeArray();
		$.each(array, function () {
			if (obj[this.name] !== undefined) {
				if (!obj[this.name].push) {
					obj[this.name] = [obj[this.name]];
				}
				obj[this.name].push(this.value || '');
			} else {
				obj[this.name] = this.value || '';
			}
		});
		return obj;
	},
	ajax: function (type, url, data, success, error, complete) {
		return $.ajax({
			type: type,
			url: this.baseUrl + url,
			data: data ? data : [],
			success: typeof success === 'function' ? success : function () {
			},
			error: typeof error === 'function' ? error : function () {
			},
			complete: typeof complete === 'function' ? complete : function () {
			},
			dataType: 'json',
			crossDomain: true
		});
	},
	loadPage: function (page) {
		$page = $(page);
		if (!$page.attr('this-id')) {
			this.anonymous++;
			$page.attr('this-id', 'page' + this.anonymous);
		}
		this.beforePageLoad.call($page);
		var thisApp = this,
				loading = $page.attr('this-current', '').find('[this-load-collection], [this-load-model]').each(function () {
			var $load;
			if ($(this).attr('this-load-collection')) {
				$load = $('[this-type="collection"][this-id="' + $(this).attr('this-load-collection') + '"]');
				if (!$load.length)
					console.error('Collection #' + $(this).attr('this-load-collection') + ' not found');
				if (thisApp.loadCollection($page, $load, this))
					return true;
			}
			else {
				$load = $('[this-type="model"][this-id="' + $(this).attr('this-load-model') + '"]');
				if (!$load.length)
					console.error('Model #' + $(this).attr('this-load-model') + ' not found');
			}
			if ($page.data('object'))
				thisApp.loadData($page, this, $load, JSON.parse($page.data('object')));
			else
				thisApp.loadUrl($page, $load, this);
		}).length;
		$(this.container).html($page.fadeIn(this.animationDuration));
		if (!loading) { // no collection or model to load
			this.wrapUp($page);
		}
	},
	wrapUp: function () {
		this.processPageObject($page);
		this.savePage($page.attr('this-id'));
		this.afterPageLoad.call($page);
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
					'replaceState' : 'pushState']({page: $(this.container).html(), id: id, title: document.title}, document.title, '#' + id);
			localStorage.setItem('lastPage', id);
		}.bind(this), this.animationDuration);
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
						this.loadPage($page.attr('object', data).clone());
						return;
//						data = JSON.parse(data);
//						$.each($col.find('[this-model-id]'), function () {
//							if (!data[$(this).attr('this-model-id')])
//								$(this).remove();
//						});
					}
				}
			}
			$(this.container).html($page)
					.children().fadeIn(this.animationDuration);
			localStorage.setItem('lastPage', state.id);
//			localStorage.removeItem('pageData');
//			this.afterPageLoad.call($page);
			return true;
		}
	},
	contentReady: function (page, placeholder, content) {
		$content = $(content);
		$(placeholder).replaceWith($content
				.data({
					thisUrl: $content.attr('this-url')
				})
				.removeAttr('this-url')
				.fadeIn(this.animationDuration));
		this.wrapUp($page);
	},
	showLoading: function () {

	},
	hideLoading: function () {

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
		this.beforeUrlLoad.call(obj);
		this.ajax('get', $(obj).attr('this-url'), [], function (resp, s, x) {
			thisApp.afterUrlLoad.call(obj, x);
			calledAfterUrlLoad = true;
			thisApp.beforeResponseParse.call(obj, resp);
			var content = thisApp.parseResponse(obj, resp);
			thisApp.afterResponseParse.call(obj, content);
			if (content)
				thisApp.contentReady(page, placeholder, content);
		}, function (e) {
			thisApp.onLoadUrlError.call(obj, e);
		}, function (x) {
			if (!calledAfterUrlLoad)
				thisApp.afterUrlLoad.call(obj, x);
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
			this.onDataError.call(obj, resp);
		}
	},
	parseCollection: function (obj, data) {
		var content = $(obj).html(),
				$cloned = $(obj).clone(),
				thisApp = this,
				parsedData = {};
		$cloned.html('');
		$.each(data, function (i, v) {
			parsedData[v[thisApp.primaryKey]] = v;
			$cloned.append(thisApp.parseModel($(content), v, true));
		});
		return {parsedData: parsedData, clone: $cloned.show()};
	},
	parseModel: function (obj, data, fromCollection) {
		var content = $(obj).html(),
				$cloned = $(obj).clone(),
				thisApp = this;
		$cloned.attr('this-object', JSON.stringify(data))
				.attr('this-model-id', data[this.primaryKey]);
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
	onLoadUrlError: function (e) {
		console.error('URL Error: ' + e.responseText);
	},
	onDataError: function (message) {
		console.error('Data Error:', message);
	}
};