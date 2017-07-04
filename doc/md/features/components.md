# Components `<component />`

The concept behind components is **reusability**. Often times, models or collections
need be reused on across pages. Instead of rewriting the whole code, components
make it possible to write once and reuse anywhere.

It's use is not limited to collections and models only - components can be used
for any snippet of code that needs to be reused.

```html
<div this-type="component" this-id="user-list">
    <ul this-type="collection" this-id="users" this-model="user" this-url="path/to/users">
        ...
    </ul>
</div>

<component this-id="nav">
    <nav> ... </nav>
</component>
```

To use a component, create placeholders:

```html
<header>
    ...
    <div this-component="nav"></div>
    ...
</header>

<div this-component="user-list"></div>
```

The appropriate components would be loaded and the placeholders replaced with them.

---
**Important Note**:

The placeholders would be replaced with the actual component. Therefore, it is
useless to style the placeholders or expect anything of them. They are only placeholders.

---

## From File

If you decide to go [structural](../finally.md#structured-approach) and have components
on individual files, provide the url to the file instead of the id of the component:

```html
<div this-component this-url="user-list"></div>
```

This indicates that there's a file named `user-list.html` in the [components' directory](../config.md#paths)
whose content would be loaded and replaced the placeholder with it.

## Events

See events for components:

- [After Events](../events.md#components-after)

---
Next: [Forms &rarr;](../others/forms.md)

See Also:

- [Attributes](../attributes.md#component-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)