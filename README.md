# ThisJS

Have you ever really wondered why you need to write out a whole lot of classes just 
to use a framework? Wished there was someway to avoid this and still benefit from the advantages of a framework?

This's exactly why `ThisJS` was developed - to cut out the redundancies and 
allow you write the necessary code - [events](./doc/md/events.md).

## Concept

The concept is to not write a single class or other really unnecessary code but 
to only listen to events and respond to them:

1.   Extend the dom with the [`this-*` attributes](./doc/md/attributes.md)

2.   Intialize the app (with or without configuration)

3.   Add event listeners (e.g. before page loads, when page loads, before leaving 
the page, etc). [See more about events here](./doc/md/events.md)
    
4.   Start the app

And that's that - your app works perfectly and beautifully.

## Usage

Add the script to your page

````javascript
<script src="path/to/this.min.js"></script>
````
Initialize the app

````javascript
<script>
    var config = {},
        app = new ThisApp(config);
    app.start();
</script>
````

### The Config Object

[See details here](./doc/md/config.md)

### Methods

[See list here](./doc/md/methods.md)

### Features

Apps use different features and `ThisJS` provides the following features:

-   #### [Pages](./doc/md/features/pages.md)
    
-   #### [Layouts](./doc/md/features/layouts.md)
    
-   #### [Models](./doc/md/features/models.md)
    
-   #### [Collections](./doc/md/features/collections.md)
    
-   #### [Components](./doc/md/features/components.md)

### Others

-   #### [Forms](./doc/md/others/forms.md)
    
-   #### [Autocomplete](./doc/md/others/autocomplete.md)
    
-   #### [Looping](./doc/md/others/looping.md)
    
-   #### [Branching](./doc/md/others/branching.md)
    
-   #### [Helpers](./doc/md/others/helpers.md)
