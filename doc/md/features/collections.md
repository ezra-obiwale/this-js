# Collections `<collection />`

A collection is **a list of models**. Models would at some point or the other need
to be listed out. This could be a list of users or tasks. Any model may be listed,
really.

```javascript
<div this-type="collection" this-id="users" this-model="user" this-url="path/to/users">
    ...
</div>
```

---
**Important Note**:

If attributes [`this-model`](../attributes.md#this-model) is not specified,
the value of attribute [`this-id`](../attributes.md#this-id) doubles as it.

---

## Example Collection

The following is an example of a JSON object collection of user models:

````js
[
    {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "photo": "/path/to/photo/",
        "age": 26
    },
    {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Doe",
        "gender": "Female",
        "photo": "/path/to/photo/",
        "age": 25
    },
    {
        "id": 3,
        "firstName": "Baby",
        "lastName": "Doe",
        "gender": "Male",
        "photo": "/path/to/photo/",
        "age": 4
    }
]
````

---
**Important Note**:

Each model must have a property which uniquely identifies
each model. By default, this is the `id` property but this may be changed
by changing the value of [`config.idKey`](../config.md#idkey).
The change affects the whole app models and collections.

If, however, a collection has a different `idKey` to the config `idKey`,
it can be specified on the collection's element with attribute [`this-id-key`](../attributes.md#this-id-key).

This may also be a property of child object, as is the case of MongoDB i.e. `_id.id`.

---

We may want to just list out the full name of each model:

```html
<ul this-type="collection" this-id="users" this-model="user" this-url="path/to/users">
    <li>
        {{ firstName }} {{ lastName }}
    </li>
</ul>
```

The models would be gotten from the given url, looped over, and rendered with
the single child element of the collection element.

By default, the model child element's url is derived by appending the model's
unique identifier to the collection's url (path/to/users/1). To override this,
specify a [`this-url`](../attributes.md#this-url) attributes on the child element:

```html
<ul this-type="collection" this-id="users" this-model="user" this-url="path/to/users">
    <li this-url="another/path/to/user/{{id}}">
        {{ firstName }} {{ lastName }}
    </li>
</ul>
```

---
**Important Note**:

If there are more than one child element in the collection element, the first one
is taken as the model element and the others are discarded except they are a part
of the special children elements.

---

## Prepend VS Append

By default, collection models are **appended** to the list when rendering. To change
this to **prepend**, add [`this-prepend`](../attributes.md#this-prepend) to the collection
element.

## New Models

When new models are created, they are automatically **appended** to the collection element
when next it is rendered. To **prepend** the model to the collection list, add
[`this-prepend-new`](../attributes.md#this-prepend-new) to the collection element.

## Special Children Elements

These are special elements that can co-exist with the child model element of a
collection and would be rendered.

- First Child

    This indicates that the element must be the first child of the collection list.
    The element must bear attribute [`this-first-child`](../attributes.md#this-first-child).

    This is especially useful for when rendering a collection as a `select` element:

    ```html
    <select this-type="collection" this-id="states" this-model="state" this-url="path/to/states">
        <option this-first-child>-- Select State --</option>
        <option>{{ name }}</option>
    </select>
    ```

- Last Child

    This indicates that the element must be the last child of the collection list.
    The element must bear attribute [`this-last-child`](../attributes.md#this-last-child).

    This is also useful for when rendering a collection as a `select` element
    but a custom option is to be provided:

    ```html
    <select this-type="collection" this-id="states" this-model="state" this-url="path/to/states">
        <option this-first-child>-- Select State --</option>
        <option>{{ name }}</option>
        <option this-last-child>Other</option>
    </select>
    ```
- On Empty

    This indicates the element to render when a collection's url returns an empty
    dataset. Attribute [`this-on-empty`](../attributes.md#this-on-empty) denotes
    it.

    ```html
    <ul this-type="collection" this-id="users" this-model="user" this-url="path/to/users">
        <li>
            {{ firstName }} {{ lastName }}
        </li>
        <li this-on-empty>
            No user found.
        </li>
    </ul>
    ```
- On Emptied

    This indicates the element to render when all models in a collection has been
    delete from the app. Attribute [`this-on-emptied`](../attributes.md#this-on-emptied)
    denotes it.

    ```html
    <ul this-type="collection" this-id="tasks" this-model="task" this-url="path/to/tasks">
        <li>
            {{ title}}
        </li>
        <li this-on-emptied>
            There are no more tasks to do.
        </li>
    </ul>
    ```

---
**Note**:

- All special children elements can be used together in a collection
    element.
- If [`this-first-child`](../attributes.md#this-first-child) and
    [`this-last-child`](../attributes.md#this-last-child)
    are used together on an element, it's only used as the **first child**.
- [`this-on-empty`](../attributes.md#this-on-empty) and
    [`this-on-emptied`](../attributes.md#this-on-emptied)
    can be used together on a single element.

---

## Pagination

Collection listings can be paginated. More often than not, they should be paginated.
To indicate a collection for pagination, use attribute [`this-paginate`](../attributes.md#this-paginate):

```html
    <collection this-id="users" this-model="user" this-url="path/to/users" this-paginate="20">
        ...
    </collection>
```

This would append `limit=20&page=1` to the url.

The value of [`this-paginate`](../attributes.md#this-paginate) overrides the
[`config.pagination.limit`](../config.md#pagination) setting. To use the config
setting, leave the value empty.

### Next and Previous Pages

To load the next and previous pages, add attributes [`this-paginate-next`](../attributes.md#this-paginate-next)
and [`this-paginate-previous`](../attributes.md#this-paginate-previous) to the
respective elements (any element that can be clicked will do). The value of the attributes
should be the id of the collection element.

```html
<a href="#" this-paginate-next="users">
    Next
</a>

<a href="#" this-paginate-previous="users">
    Previous
</a>
```

Pressing a link with [`this-paginate-next`](../attributes.md#this-paginate-next)
would increment the `page` parameter in the `GET` request like so:

    `limit=20&page=2`, `limit=20&page=3`, ... `limit=20&page=N`.

Once a page's response is received with an empty dataset, the button is hidden.

Pressing a link with [`this-paginate-previous`](../attributes#this-paginate-previous)
does the opposite by decreasing the `page` parameter:

    `limit=20&page=N`, `limit=20&page=(N-1)`, ... `limit=20&page=1`.

Once the first page is loaded, the button is hidden.

---
**Note**:

If the links are placed as siblings to the collection element and the attributes
have no value, the sibling collection element is assumed.

---

### Append or Overwrite

By default, pagination pages are set to append to the rendered pages. To change this
so the next page overwrites the previous one, change [`config.pagination.overwrite`](../config.md#pagination)
to true.

## CRUD

All [CRUD operations as listed for models](./models.md#crud) can be done from within
the collection element's child model element.

## Events

See events for collections:

- [Before Events](../events.md#collections-before)
- [After Events](../events.md#collections-after)

---
Next: [Components &rarr;](./components.md)

See Also:

- [Attributes](../attributes.md#collection-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)