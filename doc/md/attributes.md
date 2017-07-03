# Extended DOM Attributes

The `this-*` attributes extend the DOM from being ordinary to being extraordinary
and to help to make your life a lot easier.

## Rationale

Since the DOM does representation perfectly, why not extend it to also consider
factors when rendering? That's what `ThisJS` has done.

## Sections

### this-app-container
This indicates the container within which the app should be rendered. If no
element with such attribute is found, one is created.

Navigate to any specific attributes with these links:

-   [Common Attributes](#common-attributes)
-   [Page Attributes](#page-attributes)
-   [Layout Attributes](#layout-attributes)
-   [Model Attributes](#model-attributes)
-   [Collection Attributes](#collection-attributes)
-   [Component Attributes](#component-attributes)
-   [Form Attributes](#form-attributes)
-   [Branching Attributes](#branching-attributes)
-   [Looping Attributes](#looping-attributes)
-   [Autocompleting Attributes](#autocompleting-attributes)
-   [Helper Attributes](#helper-attributes)

## Common Attributes

-   ### this-binding
    **For internal use only**

    Indicates that an element is bound to a model.

-   ### this-default-transport
    Indicates that the [feature element](../../README.md#features) should be loaded with the
    default data transport instead of the custom provided transport.

-   ### this-delete
    If the element also has attribute `this-goto`, it would load the target page. If the element
    does not have attribute `this-goto`, the deletion is effected

    It must also have a `this-model` attribute.

    This is the D in CRUD.

    The value can be the resource url or empty. If empty, the url would be the container model's url.

-   ### this-filter
    Used with collections, lists and loops.

    The expression filters the items to display. The expression is provided with variable `current`
    which holds the current item in the iteration

    If iterating a collection or list, `current` has attributes `index` and `model`

    If iterating a loop, `current` has attributes `key` and `value`

    If the expression fails, the value is skipped.

    A function may be called in the expression. The function must however return
    `TRUE` or `FALSE` which indicates that the model/value should be operated on or skipped respectively

    Example: `functionName(current)`

-   ### this-id
    The id of the element. On a collection, if `this-model` is not provided, this is assumed as it.

-   ### this-load-css
    Applicable to pages and layouts, it holds css files to load with it.

    To load multiple files, provide a comma-separated list of file names.

-   ### this-load-js
    Applicable to pages and layouts, loads the given js file **after** the feature has been loaded.

    To load multiple files, provide a comma-separated list of file names.

-   ### this-model
    The name of the model to bind an element to. This is necessary to clearly
    differentiate entity types from one another.

    On a collection, if the attribute is not provided, the `this-id` value is assumed.

-   ### this-load-js-first
    Applicable to pages and layouts, loads the given js file **before** the feature is been loaded.

    To load multiple files, provide a comma-separated list of file names.

-   ### this-prepend
    Indicates that each model/item in the collection/loop/list should be prepended to the container.

-   ### this-type
    The type of element it is. The may be any of `page`, `layout`, `model`, `collection`, `component` or `list`

-   ### this-url
    This is the url from which the content of an element should be loaded. This
    is applicable to all features except `pages`


## Page Attributes

-   ### this-default-page
    Indicates a page as the default page to load if no page is specified with
    the [`start()`](./methods.md#start). As such, only one page should be tagged as default.

    Having multiple pages with the attribute throws an error and no page is loaded.

    It takes no value.

-   ### this-layout
    The id of the layout a page should use. If none is specified, [`config.defaultLayout`](./config.md#defaultlayout)
    is used if specified. And if that isn't specified either, the page is loaded
    without a layout.

-   ### this-path
    The url from which the page content should be loaded. DO NOT USE `this-url`.

-   ### this-no-layout
    Indicates that the page should be loaded without a layout. It takes no value.

    This is more important when [`config.defaultLayout`](./config.md#defaultlayout)
    has been set but is not needed for the page.

-    ### this-title
    Holds the title of the page


## Layout Attributes

-   ### this-content
    Marks an element in the layout as that within which pages

-   ### this-extends
    A layout can extend another layout. This here holds the name of the target layout a layout is extending.


## Model Attributes

-   ### this-in-collection
    **For internal use only**

    Indicates that a model element is within a collection element.

-   ### this-mid
    **For internal use only**

    The unique id of a particular model, usually used on collection model elements.

-   ### this-read

    This is the R in CRUD.

    Used together with `this-goto` within a model, it indicates that the page
    being link would read the model within which is the current element.
    The value then can be empty.

    However, if another model is to be read and not the one within which the
    link is, then the value is the url of the model and the model name must be
    also provided with the attribute `this-model`.


## Collection Attributes

-    ### this-data
     Used when a collection is in a model and the model has the collection data in it.

     The value is the attribute name of the model which holds the data.

-    ### this-first-child
     Used on a **child of a collection**, it indicates that the child be the
     first element of the collection.

     This is particularly useful when the collection is rendered as a `select`
     element and an empty value is needed at the top.

-    ### this-id-key
     The name of the model key which serves as the unique identifier. Every
     element with `this-model` should have one.

     If none is specified, `id` is assumed.

-    ### this-last-child
     Used on a **child of a collection**, it indicates that the child be the
     last element of the collection.

-   ### this-no-data-key
    Used when a [`config.dataKey`](./config.md#dataKey) is set but the current
    collection does not use any data key.

-    ### this-on-emptied
     Used on a **child of a collection**, it indicates that the child should be
     shown if all models in the collection have been deleted.

-    ### this-on-empty
     Used on a **child of a collection**, it indicates that the child should be
     shown if the collection is empty, i.e. has no data when loaded.

-    ### this-paginate
     Indicates that the collection should be paginated.

     Value is the number of results to show per page.

     If no value is provided, [`config.pagination.limit`](./config.md#pagination)
    applies.

-    ### this-pagination-overwrite
     Indicates that new page results should overwrite existing collection content
     instead of appending to it.

-    ### this-prepend-new
     Indicates that newly created models should be prepended to the collection
     listing instead of appended, which is the default.

-    ### this-static
     This indicates that the collection should only be loaded once in the lifetime of the app.

     When the collection is made [a component](./features/components.md), it can
     then be used severally on the same page and even other pages without reloading.


## Component Attributes

-   ### this-component
    This indicates the placeholder for a component. The value is the id of the
    component to load.

    If the component needs to be loaded from file, the value may be empty but
    attribute `this-url` must be provided.


## Form Attributes

-   ### this-action
    Indicates where the form should submit to. Value must be a URL.

-   ### this-handle-submit
    Used on forms that are not bound to any model and it indicates that the
    submission should be handled via ajax with the appropriate form events triggered.

    The regular form attributes are used.

-   ### this-ignore-dom
    Indicates that successful submissions should not update the model elements
    the form acted upon in the case of an update.

-   ### this-ignore-submit
    Used on forms that are bound to a model, it indicates that the form should
    not be processed normally when submitted.

    This means that the form would be handled manually.

-   ### this-is
    This is used on **form elements**.

    Binds a property of the model to a form element. The value should be the name
    of the model's property.

    If the value of the property is an object or array, children value can be
    targeted by connecting the properties with dots (.).

    For example, say there's an object
    `{name: {first: \"John\", last: \"Doe\"},hobbies: [\"Reading\", \"Playing the guitar\"]}`,
    `this-is` value could be `name.first`, `name.last`, `hobbies.0`, `hobbies.1`

    The form must be bound to a model with attribute `this-model`.

-   ### this-resettable
    Used on any element within a form and indicates that the element should be
    reset when other form elements are being reset.

    Value can be a semi-colon separated string of attribute:value to be set when
    resetting the form.

    For example, on an image, the value may be 'src:/path/to/default/image.jpg;class:default

    If value is empty, it is treated like other forms and the `value` attribute
    is set to empty

-   ### this-search
    Used on an input element with a type that can take text inputs i.e. `text` or `search`

    Input element's form parent/ancestor must have `this-do` with value of 'search'

    The value is a string in the format COLLECTION_ID:comma,separated,keys,to,search
    which indicates the collection to search and the keys to search on the collection.

    These keys would be sent to the server as comma-separated too.

## Link Attributes

-   ### this-attributes
    Works with `this-reload`. Indicates that when clicked, the target of `this-reload`
    should be reloaded with the value of `this-attributes` as the target's attributes

    The value should contain attributes to pass onto the target in the format ATTR:VALUE.

    Multiple ATTR:VALUE pairs should be separated by a semi-colon (;), just like the `style` attribute.

-   ### this-bind
    Used with `this-bind-to`, it is the child key of the model to bind to the target element.

    If this is not specified, the whole model would be bound to the target element.

-   ### this-bind-to
    Binds an element's model (or child attribute) to the element whose id is
    specified as the value of the attribute.

    All variables in the element would be parsed based on the binded model

    This is only possible if the target element is on the same page as the link
    that connects it to a model. If they are on different pages, use `this-read`
    and `this-goto` instead.

-   ### this-create
    May be used together with `this-goto` or `this-bind`. It must also have a `this-model` attribute.

    It indicates that the target page/container is or contains a form which would
    create a model. This is the C in CRUD.

    The value can be the resource url or empty. If empty, the url would be
    autogenerated from the model's url

-   ### this-form
    This is the id of the form to target

    Combined with `this-create`, clicking the element prepares and opens the given
    form for model creation.

    The form must exist in the current page and would be loaded in the same page.

-   ### this-go-back
    Navigates the app back in history.

-   ### this-go-forward
    Navigates the app forward in history

-   ### this-go-home
    Navigates the app to the home page

-   ### this-goto
    Creates a link to another page and holds the id of, name of, or path to, the
    page to load when the element is clicked.

-   ### this-ignore-cache
    Used with `this-goto`, it indicates that the target should not be loaded from
    cache but from the server

    The value would be in the format TYPE#ID e.g. collection#users.

    When it is used on pages, it takes no value and indicates that the page's
    model should be loaded from the server.

-   ### this-page-title
    Used with `this-goto`, it holds the title for the target page

    If the page already has a `this-title` attribute, it is overriden.

-   ### this-paginate-next
    Indicates that the next page on the target collection should be fetched.

    Value is the id of the target collection.

    If no value is provided, the sibling collection is targeted.

-   ### this-paginate-previous
    Indicates that the previous page on the target collection should be displayed.
    This is need if the collection has `this-paginate-overwrite`

    Value is the id of the target collection.

    If no value is provided, the sibling collection is targeted.

-   ### this-reload
    When clicked, the target should be reloaded. To be reloaded, `this-attributes`
    must be applied.

    Value is the id of the target collection or model.

    If no value is specified, `location.reload()` is called.

-   ### this-reload-page
    Reloads the page only.

-   ### this-reload-layouts
    Reloads the page and loaded layouts.

-   ### this-update
    Used together with `this-goto` and within a model, it indicates that the
    page is, or contains, a form which would update the model within which is
    the current element. This is the U in CRUD.

    The value can be the resource url or empty. If empty, the url would be
    autogenerated from the model's url.


## Branching Attributes

-   ### this-else
    The default option when all others have failed. Requires no value and if
    provided, it is ignored.

    Element will only remain if `this-if` and `this-else-if` expressions fail
    otherwise, it is removed.

-   ### this-else-if
    Value is an expression to that should result in `true` or `false`.

    This an option which comes after previous option(s) and expression will
    only be executed if the `this-if` and previous `this-else-if` expressions fail

    If expression passes, the element stays in the DOM otherwise, it is removed.

    If this ends the branching, i.e. no `this-else` is given, add attribute `this-end-if`

    **Note**: The expression should not be surrounded by ({...}). This is known
    to cause issues.

-   ### this-end-if
    Indicates the end of a branching. It is only required on `this-if` or the `this-else-if`
    that concludes the branching.

    If the branching includes a `this-else` element, there's no need for `this-end-if` then.

    **Note**: If `this-end-if` is added when a `this-else` element exists for the
    same level of branching, the `this-else` will not be considered and may throw an error.

-   ### this-if
    Starts branching. The value should be the logical expression to check

    This can be used with `this-else-if` and/or `this-else` elements. If neither
    is required, then the element must also have `this-end-if` attribute to mark
    it as a standalone branching.

    If the expression passes, then the element stays and `this-else-if` and
    `this-else` elements are removed.

    **Note**: The expression should not be surrounded by ({...}). This is known
    to cause issues.


## Looping Attributes

-   ### this-repeat-for
    Indicates that the value is to be looped over. The value could be an attribute
    of a model/value if the value is an object or array, a parsed variable, or a
    direct array.

    To iterate over an iterateable value of a model/value, just supply the attribute
    name to the value WITHOUT PARENTHESIS.

    To iterate over a parsed variable, put the variable in-between double curly
    brackets e.g. {{variable}}. The variable may very well be filtered as with
    normal variables.

    To iterate over a direct array, surround the array with ({ and }).

    Lastly, a range may be supplied with `...` notation e.g. `1...10,2` which
    means to loop from 1 to 10 in steps of 2. If the step is omitted, 1 is assumed.

    Each loop item may be filtered with `this-filter`.

    Within each loop, variables `key` and `value` are available.

## Autocompleting Attributes

-   ### this-autocomplete
    Indicates that the input field should be autocompleted from the given url.
    Value is the URL.

-   ### this-delay
    This is the amount of time to wait after the user stops typing before trying
    to autocompleting the entry. This is in milliseconds

-   ### this-key
    This holds the unique key that identifies each suggested item when autocompleting.

    This is usually the unique id of the model applied to the suggestion item from the
    array list gotten from the server"

-   ### this-list
    This is the id of target list element to hold the list of found suggestions.

-   ### this-min-chars
    This is the minimum number of characters the user must have entered before
    autocompleting kicks in.

-   ### this-multiple
    This indicates that multiple suggestions can be selected instead of the default one

-   ### this-query-key
    This is the GET parameter key on which to send the user entry when autocompleting.
    Defaults to `q` if not provided.

-   ### this-remove
    Placed on a link within a selection list, it removes the list option and
    triggers `list.option.removed` on it.

-   ### this-scoped
    Adding this atribute to the autocomplete input element indicates the scope
    within which autocomplete lists should be found.

    The value of the attribute should be the selector of the element which contains
    both the autocomplete input element and its lists. By default, this is the
    app container.

    If the value is empty, the immediate parent of the autocomplete input element
    is assumed.

-   ### this-value-key
    The key in the data object whose value should be set into the autocomplete
    input field as its value.

    This is needed if the autocomplete dropdown list does not have a selection list and the 
    autocomplete field should be filled with the value a selection is made.

## Lists

Lists are used with autocomplete to list items found.

-   ### this-fill
    Used on selection lists for autocomplete input elements and contains the
    name of the function to call to get the data to process from.

    The first parameter is the data gotten from the model while the second
    parameter is the function to call with the refined data after processing.

    For this to happen, the autocomplete input element must have a `this-is`
    attribute whose value holds the key which holds a list of already selected ids.

-   ### this-fill-url
    Used on selection lists for autocomplete input elements and holds the url
    from which the data to load as default when loading form elements from a model.

    A post request is sent to the provided link with a data object having a single
    key `ids` which is an array of ids found in the default value for the input element.

    For this to happen, the autocomplete input element must have a `this-is`
    attribute whose value holds the key which holds a list of already selected ids.

-   ### this-selection-list
    Used on the autocomplete list and specifies the list where selected list
    options are added to.

    Holds the id of the list element that would hold selected suggestion(s)

## Helper Attributes

-   ### this-block-code
    Indicates the content is a block of code and should be wrapped in
    `&lt;pre&gt;&lt;code&gt;`

-   ### this-clear-page-cache
    Triggers `ThisApp.clearPageCache()`.

    If value is `true`, the current page is also reloaded after all cache has
    been cleared.

-   ### this-code
    Indicates that the content should be parsed code by replacing < with
    &amp;lt; and > with &amp;gt;

-   ### this-hidden
    Makes the element hidden when loaded.

-   ### this-hide
    When an element with this attribute is clicked, the target element is hidden.

    The value is the id of the target element.

    Multiple elements can also be targeted by separating their id's with comma.

    This can also be used with select options. They must however have attribute
    `value` set. 

-   ### this-ignore
    Indicates that the feature should not be loaded when loading the
    [feature](../../README.md#features) within which it is placed.

-   ### this-inline-code
    Indicates the content is an inline code and should be wrapped in `&lt;code&gt;`

-   ### this-loaded
    **For internal use only**

    Indicates a loaded [feature](../../README.md#features) element.

-   ### this-not-with
    This indicates the container's content should not be loaded with the specified model.

    The value is the id of the model.

    In case where there are descendant models, the value may be a comma-separated
    list of model ids.

    While this is like `this-ignore`, this is different in that `this-ignore` is
    on feature element while `this-not-with` an be on any element.

-   ### this-reset
    When used on an element, it indicates that any time the element or any of its
    ancestors is being loaded, it should be reloaded from cache.

    This is very useful for reloading a list within a model when the object being
    listed might have changed.

    By default, models and collections are reset.

-   ### this-show
    When an element with this attribute is clicked, the target element is shown.

    The value is the id of the target element.

    Multiple elements can also be targeted by separating their id's with comma.

    This can also be used with select options. They must however have attribute
    `value` set.

-   ### this-tar
    **For internal use only**
    Temporary attribute which holds other attributes. This is given to a template
    element. When the template is parsed, the attribute value is parsed and passed on
    to the parsed element after which it is removed.

-   ### this-toggle
    Toggles the display of the target element on/off. The value is the id of the
    element. This can also be used with select options.

-   ### this-trigger
    Triggers an event when the element is clicked. The value contains two parts
    separated my a colon (:) - `event:target`.

    The event is the event that should be triggered while target is the element
    on which the event should be triggered. If no target is specified, the current
    element is the target.

    The target description is the same as the selector described with [`ThisApp.when()`](./methods.md#when).

    Multiple events can be triggered by separating each `event:target` pair by
    a semi-colon (;), i.e. `event:target;event2:target2;...`
