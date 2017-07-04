# Events

With `ThisApp`, everything is event-based. There are two type of events - those that run before an action occurs and those that run after an action occurs.

## Before Events

These run **before** actions occur. Listeners are attached with [`ThisApp.before()`](./methods.md#before).

They include:
    
### Pages (before)

-   #### page.leave

    Called before a page is moved away from. The context is the HTMLElement of the page.

    The expected return is boolean where false means rendering should continue with the received data

    Where the function returns nothing, boolean `TRUE` is assumed.

-   #### page.load
    Called before pages are loaded.

    The function receives a single parameter - the id or url of the page to load

    The expected return is boolean where false means the page should not be loaded.

    Where the function returns nothing, boolean `TRUE` is assumed.
    
### Models (before)

-   #### model.create
    Called before a create request is sent after a form is submitted.. The context
    is the form which was submitted or passed into [`Model.save()`](./js-model.md#save).

    The function receives a parameter - the data object passed into [`Model.save()`](./js-model.md#save).

    The expected return is either an object which appended to the form data
    before sending the request or a boolean where false means sending should be canceled.

    If an object is returned, existing data in the form may be overwritten if
    keys exist as names

    Where the function returns nothing, boolean `TRUE` is assumed.

-   #### model.delete
    Called before a delete request is sent on a model. The context is the HTMLElement
    of the model within which the delete button was clicked.

    The expected return is a boolean where false means rendering should continue
    with the received data.

    Where the function returns nothing, boolean `TRUE` is assumed.

-   #### model.update
    Called before an update request is sent after a form is submitted. The context is the form which was submitted or passed into [`Model.save()`](./js-model.md#save).

    The function receives a parameter - the data object passed into [`Model.save()`](./js-model.md#save)

    The expected return is either an object which appended to the form data before sending the request or a boolean where false means sending should be canceled.

    If an object is returned, existing data in the form may be overwritten if keys exist as names

    Where the function returns nothing, boolean `TRUE` is assumed.

-   #### model.render
    Called before models are rendered. The context is the HTMLElement of the model.

    The function receives a parameter - the object to be loaded as the model.

    The expected return is either an object which overrides the given object or a boolean where false means rendering should continue with the received data

    Where the function returns nothing, boolean `TRUE` is assumed.

### Collections (before)

-   #### collection.model.render
    Called before each model in a collection is rendered. The context is the
    HTMLElement of the model to be rendered.

    The function receives two (2) parameters - the object to be loaded into the
    collection and the HTMLElement of the collection.

    The expected return is either an object which overrides the given object or
    a boolean where false means rendering should continue with the received data.

    Where the function returns nothing, boolean `TRUE` is assumed.

-   #### collection.render
    Called before collections are rendered. The context is the HTMLElement of the collection.

    The function receives a parameter - the object to be loaded as a collection

    The expected return is either an object which overrides the given object or a boolean where false means rendering should continue with the received data

    Where the function returns nothing, boolean `TRUE` is assumed.

### Components (before)

-   ### component.load
    Called before a component is loaded, whether from cache or url. The context is
    component placeholder.

-   ### component.render
    Called before a loaded component is rendered. The method receives the `HTMLElement`
    of loaded component. The context is the component placeholder.
    
### Forms (before)

-   #### form.send
    Called when a form that's not bound to any model but has attribute [`this-handle-submit`](./attributes.md#this-handle-submit) is submitted with valid field entries.

    The context is the form which was submitted

    The expected return is either an object which appended to the form data before sending the request or a boolean where false means sending should be canceled.

    If an object is returned, existing data in the form may be overwritten if keys exist as names

    Where the function returns nothing, boolean `TRUE` is assumed.

## After Events

These run **after** actions occur. Listeners are attached with [`ThisApp.on()`](./methods.md#on) and [`ThisApp.when()`](./methods.md#when).

They include:

### Pages (after)

-   #### page.load.failed
    Triggered when the requested page is found but cannot be loaded

-   #### page.loaded
    Triggered when a page has been fully loaded

### Layouts (after)

-   #### layout.loaded
    Triggered when a loayout has been loaded.

### Models (after)

-   #### delete.complete
    Triggered on a model when a delete request to the server/backend is completed, whether successful or not.

-   #### delete.error
    Triggered on a model when an error occurs with sending a delete request to the server/backend

-   #### delete.failed
    Triggered on a model when a delete request was successfully sent to the server, the response status is greater or equal to 200 and less that 400 BUT the response data IS NOT as expected

-   #### delete.success
    Triggered on a model when a delete request was successfully sent to the server, the response status is greater or equal to 200 and less that 400 AND the response data is as expected

-   #### empty.response
    Triggered on a model when the data returned by a request is empty or null

-   #### expired.model.cache.loaded
    Triggered on a model when an expired model cache was loaded because the device is offline and newer data could not be fetched

-   #### model.bind.failed
    Triggered on a model when a model could not be binded to an element

-   #### model.binded
    Triggered on a model when a model has been binded to an element

-   #### model.cache.loaded
    Triggered on a model when it is loaded from cache

-   #### model.load.failed
    Triggered on a model when it cannot be loaded

-   #### model.loaded
    Triggered on a model when it is loaded from url or within a collection

### Collections (after)

-   #### collection.cache.loaded
    Triggered on a collection when it is loaded from cache

-   #### collection.load.failed
    Triggered on a collection when it cannot be loaded

-   #### collection.loaded
    Triggered on a collection when it is from url/server

-   #### expired.collection.cache.loaded
    Triggered when an expired collection cache was loaded because the device is offline and newer data could not be fetched
        
### Components (after)

-   #### component.loaded
    Triggered on a component when it is loaded
        
### Forms (after)

-   #### create.form.cleared
    Triggered when a link with `this-create` and `this-form` attributes is clicked.

    It clears the form fields.

-   #### form.invalid.submission
    Triggered on a form when it is submitted and all required fields are not filled

-   #### form.loaded
    Triggered on a form when it and all its elements have been loaded

-   #### form.submission.complete
    Triggered on a form when sending its data to the server/backend is completed, whether successful or not.

-   #### form.submission.error
    Triggered on a form when an error occurs with sending the submitted data to the server/backend

-   #### form.submission.failed
    Triggered on a form when its data was successfully sent to the server, the response status is greater or equal to 200 and less that 400 BUT the response data IS NOT as expected

-   #### form.submission.success
    Triggered on a form when its data was successfully sent to the server, the response status is greater or equal to 200 and less that 400 AND the response data is as expected

-   #### form.valid.submission
    Triggered on a form when it is submitted and all required fields are filled properly

### AJAX (after)

-   #### invalid.response
    Triggered when the response from an AJAX request does not match the expected type.

-   #### load.content.complete
    Triggered when an AJAX response has been received. This is called whether the request is successful or fails

-   #### load.content.error
    Triggered when an AJAX response status IS NOT greater or equal to 200 and and less than 400

-   #### load.content.success
    Triggered when an AJAX response status IS greater or equal to 200 and and less than 400

### Lists (after)
-   #### list.emptied
    Triggered on a list when it has been emptied for whatever reasons

-   #### list.loaded
    Triggered on a list when it has been completely loaded with options

-   #### list.no.data
    Triggered on a list when there's no data to load, whether no data returned for the query or the returned data have already been selected.

-   #### list.option.removed
    Triggered on a list option when it is removed by clicking it's descendant with attribute [`this-remove`](./attributes.md#this-remove)

-   #### list.option.selected
    Triggered on a list option when it has been selected

### Misc (after)

-   #### dom.updated
    Triggered on the app container when a collection's or model's dom element has be updated.
