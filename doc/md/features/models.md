# Models `<model />`

A model represents different parts of your application. More often than not, 
it represents a table row or collection node in your database.

## Operations

With `ThisJS`, there is no need to create a model object in JavaScript - the DOM
is good enough!

### Example Model

The following is an example of a JSON object model which represents a user:

````javascript
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "photo": "/path/to/photo/",
    "age": 26
}
````

The following is how to represent the model in the DOM:

````html
<!-- method 1 -->
<div this-type="model" this-id="user">
    ...
</div>

<!-- method 2 -->
<model this-id="user">
    ...
</model>
````

By specifying attribute [`this-type`](../attributes.md#this-type) as model, you
mark the element as representing an object.

All models must have an id which differentiates one model apart from the other,
thus attribute [`this-id`](../attributes.md#this-id) must be specified.

### Model Properties

To show the properties of the model on the page:

````html
<table this-type="model" this-id="user">
    <tbody>
        <tr>
            <td rowspan="4"><img src="{{ photo }}" alt="User Photo" /></td>
        </tr>
        <tr>
            <td>First Name:</td><td>{{ firstName }}</td>
        </tr>
        <tr>
            <td>Last Name:</td><td>{{ lastName }}</td>
        </tr>
        <tr>
            <td>Gender:</td><td>{{ gender }}</td>
        </tr>
        <tr>
            <td>Age:</td><td>{{ age }}</td>
        </tr>
    </tbody>
</table>
````

### Property Filters

Filters act on model properties to render them in a more specific way. For example:

````html
{{ firstName | ucase }}
````

would apply the `ucase` filter on the `firstName` property of the model and render
the result.

To apply a filter, specify the name of the filter separated from the property name
by a pipe (`|`). Multiple filters can be applied to a property like thus:

````html
{{ firstName | ucase | replace=John:Jane }}
````

#### Filter Parameters

As seen from above, some filters take parameters while others don't.

---
**Important Note:**

- Parameters are separated from the filter name by the equal sign (`=`)
- Multiple parameters can be provided and must be separated by semicolons (`;`)
- Where a parameter has parts (as seen for filter `replace` in the example above),
  the parts must be separated by colons (`:`).
---

The example below achieves the same result as the one above:

````html
{{ firstName | ucase | replace=o:a;n:e;h:n }}
````

[See full list of filters](./model-filters.md)

### Raw JavaScript Operations

It is also possible to use model properties in computations within the model.
For example, to get the year of birth from our [example model](#example-model),
we would need to process the `age` property:

```html
<table>
    <tbody>
        <!-- continuing from previous rendering -->
        <tr>
            <td>Birth Year:</td><td>({ getBirthYear(current) })</td>
        </tr>
    </tbody>
</table>

<script>
function getBirthYear(model) {
    var ageToYearTime = 60 * 60 * 24 * 365 * 1000 * model.age,
        birthYearTime = Date.now() - ageToYearTime;
    return new Date(birthYearTime).getFullYear();
}
</script>

```

In the above example, function `getBirthYear` accepts a model and uses its `age`
property to calculate the birth year which it then returns.

By wrapping JavaScript expressions in `({ ... })`, it can be placed anywhere
in the DOM and would be executed as such.

So, calling the function became a matter of wrapping it in the braces.

Every model is available to be called within expressions as `current`.

For instance, `({ console.log(current) })` would log the model to the console
and render the returned response which is `undefined`.

    The birth year can also be gotten without the function by making the function into a single line of code: 
    
    ({ new Date(Date.now() - 60 * 60 * 24 * 365 * 1000 * current.age).getFullYear() })

## CRUD

Of course, new models would need to be created and old ones acted on.

### Create

Creating new models involves forms. To create a new user, the following form would
be created as you would normally, no special markings:

```html
<form this-id="create-user">
    <div>
        <label>
            Picture:
            <input type="file" name="photo" />
        </label>
    </div>
    <div>
        <label>
            First Name:
            <input type="text" name="firstName" />
        </label>
    </div>
    <div>
        <label>
            Last Name:
            <input type="text" name="lastName" />
        </label>
    </div>
    <div>
        Gender:
        <label><input type="radio" name="gender" value="Male" /> Male</label>
        <label><input type="radio" name="gender" value="Female" /> Female</label>
    </div>
    <div>
        <label>
            Age:
            <input type="number" min="1" max="120" name="age" />
        </label>
    </div>
    <button type="submit">Save</button>
</form>
```
The only thing that differentiates the form from the usual form is the [`this-id`](../attributes.md#this-id)
attribute given to identify it.
All that's required now is to create a link to connect to the form:

```html
<a href="#" this-create="users/" this-model="user" this-form="create-user">
    Create New User
</a>
```

#### Explanation

- Attribute [`this-create`](../attributes.md#this-create) indicates the action
    to be carried out is `create` while providing the `url` to
    which the model should be submitted.
- Attribute [`this-model`](../attributes.md#this-model) indicates that it's going
    to create a `user` model
- Attribute [`this-form`](../attributes.md#this-form) indicates the form to use
    for the action.

    Note: [`this-form`](../attributes.md#this-form) means that the form is on the same page as the link. If the form is on another page, use attribute [`this-goto`](../attributes.md#this-goto) instead.

When the link is clicked, the form's fields are cleared of all entries and
set up to `create` model `user`.

On a successful submission and creation, the form is hidden.

If however attribute [`this-goto`](../attributes.md#this-goto) is used in place
of [`this-form`](../attributes.md#this-form), the page which
bears the link is returned to on a `successful` creation.

### Read

Reading can be done in two ways:

1. From within the model

    This is done from within the model summary, usually a listing, to a fuller
    representation of it. As such, place the a link anywhere within the model's DOM
    representation like so:

    ```html
    <model this-id="user">
        ...
        <a href="#" this-read this-bind-to="user-details">
            View User
        </a>
        ...
    </model>
    ```

    #### Explanation

    - Attribute [`this-read`](../attributes.md#this-read) indicates that a read action
        should be initialized when the link is clicked
    - Attribute [`this-bind-to`](../attributes.md#this-bind-to) indicates an element
        with attribute [`this-id`](../attributes.md#this-id)="user-details" would be
        bound to the model from within which the link was clicked.

        Note: attribute [`this-bind-to`](../attributes.md#this-bind-to) indicates that
        the element being bound to (#user-details) is on the same page as the link.
        If the element is on another page, use attribute [`this-goto`](../attributes.md#this-goto)
        instead. The whole page would be marked as reading the model.

2. From anywhere

    Reading a model from anywhere requires that the link describes the
    model fully so that the right model can be fetched and rendered:

    ```html
    <a href="#" this-read="url/to/model" this-bind-to="user-details" this-model-id="123" this-model="user">
        View User
    </a>
    ```

    #### Explanation

    - Attribute [`this-read`](../attributes.md#this-read) indicates that a read action
        should be initialized when the link is clicked and also holds the url to
    the model
    - Attribute [`this-bind-to`](../attributes.md#this-bind-to) indicates an element
        with attribute [`this-id`](../attributes.md#this-id)="user-details" would be
        bound to the model from within which the link was clicked.

        Note: attribute [`this-bind-to`](../attributes.md#this-bind-to) indicates that
        the element being bound to (#user-details) is on the same page as the link.
        If the element is on another page, use attribute [`this-goto`](../attributes.md#this-goto)
        instead. The whole page would be marked as reading the model.
    - Attribute [`this-model`](../attributes.md#this-model) indicates the model to read
    - Attribute [`this-model-id`](../attributes.md#this-model-id) indicates the
        model's id

## Update

Updating a model requires mapping a model to a form and changing the attributes
in there. Use attribute [`this-is`](../attributes.md#this-is) to map a form element
to model's property:

```html
<form this-id="update-user">
    <div>
        <label>
            Picture:
            <img this-is="photo" />
            <input type="file" name="photo" />
        </label>
    </div>
    <div>
        <label>
            First Name:
            <input type="text" name="firstName" this-is="firstName" />
        </label>
    </div>
    <div>
        <label>
            Last Name:
            <input type="text" name="lastName" this-is="lastName" />
        </label>
    </div>
    <div>
        Gender:
        <label><input type="radio" name="gender" value="Male" this-is="gender" /> Male</label>
        <label><input type="radio" name="gender" value="Female" this-is="gender" /> Female</label>
    </div>
    <div>
        <label>
            Age:
            <input type="number" min="1" max="120" this-is="age" name="age" />
        </label>
    </div>
    <button type="submit">Update</button>
</form>
```

The link to initiate the update is exactly as described for [Reading](#read) above.
The only change is that, instead of [`this-read`](../attributes.md#this-read), use
[`this-update`](../attributes.md#this-update).

### Uploading Files

`ThisJS` provides method [setUploader ( )](../methods.md#setUploader) for custom
file uploading process. This allows for uploading files to 3rd-party applications
like AWS while still saving the file information with the rest of the data.

Alternatively, if no custom uploader is set, a `multipart/form-data` request is
sent using JavaScript's `FormData` object. This way, the files are sent alongside
the other data and the same server is expected to process the upload.

## Delete

To delete an object, a link must be provided in the model's DOM representation as such:

```html
<model this-id="user">
    ...
    <a href="#" this-delete>Delete User</a>
    ...
</model>
```

Clicking on the link would send a `DELETE` request to the model's url. Attribute
[`this-delete`](../attributes.md#this-delete) may also hold a url for the deletion
if not to use the model's.

However, since confirmations are usually required for deletions, [`this-bind-to`](../attributes.md#this-bind-to)
can be used with [`this-delete`](../attributes.md#this-delete) while another link
with just [`this-delete`](../attributes.md#this-delete) should be provided in the
bound element for the actual deletion:

```html
<model this-id="user">
    ...
    <a href="#" this-delete this-bind-to="confirm-delete">
        Delete User
    </a>
    ...
</model>

<div this-id="confirm-delete">
    Are you sure you want to delete the user?
    <a href="#">
        Cancel
    </a>
    <a href="#" this-delete>
        Continue
    </a>
</div>
```

**Note**: attribute [`this-bind-to`](../attributes.md#this-bind-to) indicates that
the element being bound to (#confirm-delete) is on the same page as the link.
If the element is on another page, use attribute [`this-goto`](../attributes.md#this-goto)
instead. The whole page would be marked as for deleting the model.

## CRUD METHODS

By default, all CRUD methods are RESTful:


Action | Method
---------|----------
 Create | POST
 Read | GET
 Update | PUT
 Delete | DELETE

These can be overriden by changing the [`config.crud.methods`](../config.md#crud) option.
This would override all CRUD operations for the app.

To only change for a specific operation and on the fly, add attribute [`this-method`](../attributes.md#this-method)
to the link with the desired method as the value.

## Caching

By default, all models are cached in the [store](../methods.md#store). This helps
to achieve offline manipulations.

To turn off caching, set property of [`config.cacheData`](../config.md#cachedata)
to `false`.

## JavaScript Model

Models are not limited only to the DOM but can also be used in JavaScript as
well. For instance, when a page acts on a model, either [reading](#read), [updating](#update)
or [deleting](#delete), the page's model is accessible on [`ThisApp.pageModel`](../finally.md#pageModel).
Details about the model is [here](../js-model.md).

However, any model can be accessed via JavaScript. [Here's how](../js-collection.md#model).

## Events

See events for models:

- [Before Events](../events.md#models-before)
- [After Events](../events.md#models-after)

---

Next: [Collections &rarr;](./collections.md)

See Also:

- [Attributes](../attributes.md#model-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)