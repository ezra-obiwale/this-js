# ThisJS
A javascript framework that cuts away redundancies and repetitions by focusing on the DOM and the server.

## Usage
Add the script to your page

````javascript
<script src="path/to/this.min.js"></script>
````
Initialize the app

````javascript
<script>
    var config = {};
    var app = new ThisApp(config);
</script>
````

### The Config Object
[See full details here](https://github.com/ezra-obiwale/this-js/blob/master/config.md)

### Methods

-   **addToCache** (`_` | `HTMLElement` elem) : `ThisApp`
    Adds an element to the cache collection for later reuse
-   **back** () : ThisApp
    Takes the app back one step in history
-   **before** (`string` event, `function` callback)
    Registers a callback to be called before an event happens. If the callback returns false, the event is terminated.
    [See full list of events here](https://github.com/ezra-obiwale/this-js/blob/master/doc/json/before-events.json)
-   **bindToObject** ({_}|{HTMLElement} elem, `object` object, `function` callback)
    Binds an element to an object
-   