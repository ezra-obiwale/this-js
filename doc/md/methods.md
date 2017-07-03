# ThisApp Methods

The following methods are available to your app when you initialize `ThisApp`:

**Note**: `_` means an HTMLElement wrapped with `this._()`. Everywhere it's used 
as a parameter type, the actual HTMLElement can be used instead.

-   <a class="anchor" name="_">**_**</a> ( element: `string` | `array` | `HTMLElement` ) : `_`
    
    Wraps the HTMLElement or array of objects in an object which provides methods 
    to manipulate the items provided. [See available methods here](./_.md)

-   <a class="anchor" name="addToCache">**addToCache**</a> ( element: `_` ) : `ThisApp`
    
    Adds an element to the cache collection for later reuse
    
-   <a class="anchor" name="back">**back**</a> ( ) : ThisApp
    
    Takes the app back one step in history
    
-   <a class="anchor" name="before">**before**</a> ( event: `string`, callback: `function` ) : `ThisApp`
    
    Registers a callback to be called before an event happens. If the callback 
    returns false, the event is terminated. [See list of available events here](./events.md#before-events)
    
-   <a class="anchor" name="bindToObject">**bindToObject**</a> (  element:  `_`, object:  `object`, callback: `function` ) : `Promise`
    
    Binds an element to an object. This will bind every model property in the element 
    to the corresponding key on the object provided and calls the callback function 
    when done with the bounded element has the only parameter.
    [See more about models](./features/models.md)

-   <a class="anchor" name="clearDOMCache">**clearDOMCache**</a> () : `ThisApp`
    
    Clears all the cached DOM elements.
    
-   <a class="anchor" name="clearPageCache">**clearPageCache**</a> ( reload: `boolean` ) : `ThisApp`
    
    Clears the cache of all models and collections on the current page. If parameter 
    is `true`, models and collections on the page would be reloaded afterwards.
    
-   <a class="anchor" name="collection">**collection**</a> ( modelName: `string`, options: `object` ) : `Promise`
    
    Fetches a model's [collection object](./js-collection.md).
    
-   <a class="anchor" name="debug">**debug**</a> ( mode: `boolean` ) : `ThisApp`
    
    Sets the app debug mode. If called without a parameter, `true` is assumed.
    
-   <a class="anchor" name="fillAutocompleteList">**fillAutocompleteList**</a> ( list: `_` | `string`, data: `object` | `array`, idKey: `string`, filter: `string` ) : `ThisApp`
    
    Fills an [autocomplete](./others/autocomplete.md) list with the data given.
    
-   <a name="forward">**forward**</a> ( ) : `ThisApp`

    Takes the app forward one step in history
    
-   <a name="getCached">**getCached**</a> ( selector: `string` | `_`, type: `string` ) : `ThisApp`
    
    Fetches a clone of the required elements from the cache collection

-   <a name="home">**home**</a> ( replaceState: `boolean` ) : `ThisApp`
    
    Returns the app to the home page.
    
    If parameter is `true`, the current page is lost in history and replaced with 
    the home page.

-   <a name="load">**load**</a> ( element: `_`, data: `object`, callback: `function` ) : `Promise`

    Loads any feature element that can be on the page (collection, model, component).
    
    The callback function is called after the element has been loaded.

-   <a name="loadPage">**loadPage**</a> ( pageIdOrPath: `string`, replaceState: `boolean` ) : `ThisApp`

    Loads the given page.
    
    If `replaceState` is `true`, the current page is lost in history and replaced with 
    the given page.

-   <a name="on">**on**</a> ( event: `string`, selector: `string`, callback: `function` ) : `ThisApp`

    Adds event listeners to elements in the app container.
    [See list of available events here](./events.md#after-events)

-   <a name="onError">**onError**</a> ( callback: `function` ) : `ThisApp`

    Accepts a function to call whenever any error occurs in the lifetime of the app.
    
    The function passed a `string` error message or an object in case of a `catch`.

-   <a name="pageNotFound">**pageNotFound**</a> ( callback: `function` | `string` ) : `ThisApp`

    Sets up the function to call when a page is not found. Alternatively, a string 
    id of page to load could be passed in.
    
    If `callback` is a function, the function is given the string page id.

-   <a name="promise">**promise**</a> ( func: `function` ) : `Promise`

    Creates a promise while ensuring the function's context is ThisApp. The provided 
    is provided with parameters `resolve` and `reject` which both are functions to 
    be called on success or failed processing within `func` respectively.

-   <a name="reload">**reload**</a> ( layoutsToo: `boolean` ) : `ThisApp`

    Reloads the current page. If paramater is `true`, then the layouts are reloaded 
    as well.

-   <a name="replaceCached">**replaceCached**</a> ( selector: `string`, element: `_` ) : `ThisApp`

    Replaces cached elements (identified by `selector`) with the given element.

-   <a name="request">**request**</a> ( config: `string` | `object` ) : `Promise`

    Sends an AJAX request. 
    
    If parameter is string, it is the url and a `GET` request is sent to the url 
    expecting a `json` response.
    
    The config should extend the JSON object below:
    
    ```json
    {
        "type': "GET", // POST | PATCH | PUT | DELETE
        "url": location.href, // The url to connect to. Default is current url
        "dataType": "json", // The expected response type
        "withCredentials": null, // Boolean. Indicates whether to send request with credientials or not.
        "async": true, // Asyncronous request or not
        "data": {}, // The object or query string data to send with the request. This may also be an instance of FormData
        "headers": {}, // Object of string keys to string values to pass to the request header
        "success": function(){}, // Function to call when a success response is gotten. The response data is passed as a parameter
        "error": function(){} // Function to call when error occurs
    }
    ```

-   <a name="resetAutocomplete">**resetAutocomplete**</a> ( id: `string` ) : `ThisApp`

    Reset an autocomplete input element. The parameter should be a single id of the
    element with `this-autocomplete` attribute and a comma-separated list of such ids.

-   <a name="secureAPI">**secureAPI**</a> ( func: `function` ) : `ThisApp`

    Function call before all api requests are sent. You can set/overwrite request
    headers and data api here.
    
    Parameters are `object` headers, `object` data and `object` options.
    
    `options` override the options set in `request()`

-   <a name="setBaseURL">**setBaseURL**</a> ( url: `string` ) : `ThisApp`

    Set the base url for the app.

-   <a name="setComponentsPath">**setComponentsPath**</a> ( path: `string`, fileExtension: `string`, minification: `object` ) : `ThisApp`

    Sets the path from where to load components from. Parameter `fileExtension` 
    indicates the file extension for components. Default is `html`

    The minification object has the following defaults:

    ```json
    {
        "prod": false, // use minified in production
        "dev": false, // use minified in developement (when debug:true)
        "subdir": "" // subdirectory containing minified files
    }
    ```

-   <a name="setCSSPath">**setCSSPath**</a> ( path: `string`, minification: `object` ) : `ThisApp`

    Sets the path from where to load CSS files from.

    The minification object has the following defaults:

    ```json
    {
        "prod": false, // use minified in production
        "dev": false, // use minified in developement (when debug:true)
        "subdir": "" // subdirectory containing minified files
    }
    ```

-   <a name="setDataKey">**setDataKey**</a> ( dataKey: `string` ) : `ThisApp`

    Sets the key in the response object which holds the data array. Default is `data`

-   <a name="setDataTransport">**setDataTransport**</a> ( func: `function` ) : `ThisApp`

    Sets the the transport system to use for data connection.
    
    The function would be passed an `object` parameter which has the following keys
    in addition to those in `request()`:
    
    ```json
    {
        // ...
        "action": "", // create | read | update | delete | autocomplete | handled-submit
        "elem": _, // Available only when action is read
        "id": "", // Available only when action is update
        "isCollection": true, // or false. Available when loading a collection or a model
        "form": HTMLFormElement, // Available when submitting a form
    }
    ```

-   <a name="setDefaultLayout">**setDefaultLayout**</a> ( id: `string` ) : `ThisApp`

    Sets the default layout for the application

-   <a name="setJSPath">**setJSPath**</a> ( path: `string`, minification: `object` ) : `ThisApp`

    Sets the path from where to load JavaScript files from.

    The minification object has the following defaults:

    ```json
    {
        "prod": false, // use minified in production
        "dev": false, // use minified in developement (when debug:true)
        "subdir": "" // subdirectory containing minified files
    }
    ```

-   <a name="setLayoutsPath">**setLayoutsPath**</a> ( path: `string`, fileExtension: `string`, minification: `object` ) : `ThisApp`

    Sets the path from where to load layouts from. Parameter `fileExtension` 
    indicates the file extension for layouts. Default is `html`

    The minification object has the following defaults:

    ```json
    {
        "prod": false, // use minified in production
        "dev": false, // use minified in developement (when debug:true)
        "subdir": "" // subdirectory containing minified files
    }
    ```

-   <a name="setPagesPath">**setPagesPath**</a> ( path: `string`, fileExtension: `string`, minification: `object` ) : `ThisApp`

    Sets the path from where to load pages from. Parameter `fileExtension` 
    indicates the file extension for pages. Default is `html`

    The minification object has the following defaults:

    ```json
    {
        "prod": false, // use minified in production
        "dev": false, // use minified in developement (when debug:true)
        "subdir": "" // subdirectory containing minified files
    }
    ```

-   <a name="setStore">**setStore**</a> ( func: `function` ) : `ThisApp`

    Sets the client side store/db to use in the app. The default store is localStorage.
    
    The function must take a `string` value which is the name of the collection and 
    return a collection object with the methods as explained on [`store()`](#store)

-   <a name="setTitleContainer">**setTitleContainer**</a> ( selector: `string` ) : `ThisApp`

    Sets the container that would always hold the current page's title as it is 
    being loaded.

-   <a name="setTransition">**setTransition**</a> ( transition:  `string` | `function`, options: `object` ) : `ThisApp`

    Set the transition effect to use between pages. The default is 'switch'.
    [See more about transitions](./transitions.md)

-   <a name="setUploader">**setUploader**</a> ( func: `function` ) : `ThisApp`

    Sets the function to call when there are files to be uploaded in a form.
    
    The function is called with an object parameter:
    
    ```json
    {
        "modelName": "", // the model on which the upload action is being carried out
        "files": [], // ann array of all file elements in the form,
        "data": {}, // a copy of the data gotten from the form
        "id": "#", // the id of the model, if updating one
        "url": "...", // the url of the model
        // This function must be called when upload is done. The form data 
        // would be updated with the data object passed into this function. 
        // The second parameter should be a function to call in case saving the model
        // fails. Here, the uploaded file may be deleted.
        "done": function( data:  `object`, cancelUpload: `function` )
    }
    ```

-   <a name="start">**start**</a> ( pageId: `string`, freshCopy: `boolean` ) : `ThisApp`

    Starts the app.
    
    If `pageId` is provided, the page is loaded and set as the home page. 
    If `freshCopy` is true, a fresh copy of the page is rendered. Otherwise, a 
    copy from history is rendered, if available.

-   <a name="store">**store**</a> ( collectionName: `string` ) : `Store`
        
    Fetches the store object for the given `collectionName`.
    
    The store object has the following methods:
        
    -   **find** ( id: `string` | `int` )
        Returns a single model if id is provided.
        Otherwise, it returns the whole collection object.
        
    -   **save** ( data: `object`, id: `string` | `int`, overwrite: `booelan` ) - 
        Saves the data and returns the id if none was specified. Otherwise, the 
        data after being saved is returned.
        
        If overwrite is `true`, any existing data at the id would be overwritten.
        
    -   **saveMany** ( data: `object` | `array`, idKey: `string`, overwrite: `boolean` )
        Saves a list data objects to the store.
        
        If `idKey` is not provided, `id` is assumed.
        
    -   **remove** ( id: `string` )
        Removes the object from the store and returns the removed object.
        
    -   **drop** ( )
        Removes the collection entirely from the store.
        
-   <a name="tryCatch">**tryCatch**</a> ( tryFunc: `function`, catchFunc: `function` ) : `ThisApp`

    Calls the given function in a try...catch block and outputs any errors to the console if 
    debug mode is enabled.

-   <a name="watch">**watch**</a> ( func: `function` ) : `ThisApp`

    The provided function is called is called when models and collections are 
    rendered for the server to be watched for changes to these.

    The function receives two parameters:

    -  `object` **config** - The config representing the endpoint to be watched

        ```json
        {
            "type": "...", // model or collection
            "url": "...", // the url for the model or collection
            "mid": "#", // the id of the model
            "modelName": "..." // the model name
        }
        ```

    -   `function` **callback** ()
        To be called when a change occurs on the server on a watched element/endpoint.
        This will update both the DOM elements whenever they are rendered and also
        update the store.

        The function expects a single object parameter:

        ```json
        {
            "event": "...", // created, updated, deleted
            "id": "..", // the id of the model acted upon. This must be returned for all events
            "data": {} // the created or updated data object
        }
        ```

-   <a name="when">**when**</a> ( event: `string`, selector: `string`, callback: `function` ) : `ThisApp`

    A handy shortcut to method [`on()`](#on) for [features](../../README.md#features).

    Instead of writing

    ```javascript
    on('page.loaded', '[this-type="page"][this-id="default"]', function(){})
    ```

    Write

    ```javascript
    when('page.loaded', 'page#default', function(){})
    ```

    ---
    **Note**: 
    1.  This is only possible for features i.e. pages, layouts, models, 
        collections and list.
    2.  It would also work for anything that has attributes `this-id` and/or `this-type`
    3.  It can also be used for blanketting features, i.e. without using id
    4.  It also accepts multiple targets separated by commas
    ---
