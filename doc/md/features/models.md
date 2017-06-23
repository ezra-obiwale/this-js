# Models `<model />`

A model represents different parts of your application. More often than not, they represent a table row or collection node in your database.

## Operations

With `ThisJS`, there is no need to create a model object in javascript - the DOM is good enough.

### Example Model

The following is an example of a model as it would look like in javascript:

````javascript
// Model User
{
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    photo: "/path/to/photo/"
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

By specifying attribute `type` as model, you mark the element as representing an object. 

All models must have an id which differentiates one model apart from the other, 
thus attribute `id` must be specified.

**Important!** - Subsequently, method 2 would be used in all examples where 
possible but note that everything also applies to method 1.

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
    </tbody>
</table>
````
** ... **

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

Important thins to know:

- Parameters are separated from the filter name by the equal sign (`=`)
- Multiple parameters can be provided and must be separated by semicolons (`;`)
- Where a parameter has parts (as seen for filter `replace` in the example above), 
  the parts must be separated by colons (`:`)

The example below achieves the same result as the one above:

````html
{{ firstName | ucase | replace=o:a;n:e;h:n }}
````

[See full list of filters](./model-filters.md)