# ThisApp Methods

The following methods are available to your app when you initialize `ThisApp`:

**Note**: `_` means an HTMLElement wrapped with `this._()`. Everywhere it's used 
as a parameter type, the actual HTMLElement can be used instead.

-   <a class="anchor" name="_">**_**</a> ( `string` | `array` | `HTMLElement` element ) : `_`

    Wraps the HTMLElement or array of objects in an object which provides methods 
    to manipulate the items provided. [See available methods here](./_.md)

-    <a class="anchor" name="addToCache">**addToCache**</a> ( `_` element ) : `ThisApp`

    Adds an element to the cache collection for later reuse
    
-    <a class="anchor" name="back">**back**</a> ( ) : ThisApp

    Takes the app back one step in history
    
-    <a class="anchor" name="before">**before**</a> ( `string` event, `function` callback ) : `ThisApp`

    Registers a callback to be called before an event happens. If the callback 
    returns false, the event is terminated.
    [See list of available events here](./events.md#before-events)
    
-    <a class="anchor" name="bindToObject">**bindToObject**</a> ( `_`  element, `object` object, `function` callback ) : `Promise`

    Binds an element to an object. This will bind every model property in the element 
    to the corresponding key on the object provided and calls the callback function when done with the bounded element has the only parameter.
    [See more about models](./features/models.md)

-    <a class="anchor" name="clearPageCache">**clearPageCache**</a> ( `boolean` reload ) : `ThisApp`

    Clears the cache of all models and collections on the current page. If parameter 
    is `true`, models and collections on the page would be reloaded.
    
-    <a class="anchor" name="collection">**collection**</a> ( `string` modelName, `object` options ) : `Promise`

    Fetches a model's collection
    
-    <a class="anchor" name="debug">**debug**</a> ( `boolean` mode ) : `ThisApp`

    Sets the app debug mode. If called without a parameter, `true` is assumed.
    
-    <a class="anchor" name="fillAutocompleteList">**fillAutocompleteList**</a> ( `_` | `string` list, `object` | `array` data, `string` idKey, `string` filter ) : `ThisApp`

    Fills an autocomplete list with the data given.
    
