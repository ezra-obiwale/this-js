# Layouts `<layouts />`

More often than not, there are elements that are common to pages,
e.g. headers, navigation, footers, etc and only a section of pages are really different.

It is best that these sections be written just once and reused on each of these pages.
This has the advantage of editing once and reflecting across all pages.

This can be acheived with `layouts`:

```html
<div this-type="layout" this-id="main">
    ...
    <div this-content></div>
    ...
</div>

<!-- or -->

<layout this-id="main">
    ...
    <div this-content></div>
    ...
</layout>
```

Pages would be loaded into the element with attribute [`this-content`](../attributes.md#this-content).
This allows for other elements to go around the dynamic part of the page.

## Page + Layout

Using a layout on a page is as simple as specifying the `id` of the layout on
the page element:

```html
<page this-id="home" this-layout="main">
    ...
</page>
```

## Multiple Pages + 1 Layout

Of course, when a layout bears the header, navigation and footer, it is going
to be used by most, if not all, pages. As such, it becomes super inconvenient
having to specify the layout on all pages.

To take care of this, set the layout id as the [`config.defaultLayout`](../config.md#defaultLayout)
or with the [setDefaultLayout( ... )](../methods.md#setDefaultLayout) method.

## From File

If you decide to go [structural](../finally.md#structured-approach), the layout
would be loaded from the file and processed as an on-page layout would be.

## Extending Layouts

A layout can extend another layout. A practical use case is if there are different
navigation links for different sets of pages while they all share the same header
and footer.

To achieve this, the layout tag should use attribute [`this-extends`](../attributes.md#this-extends):

```html
<layout this-id="regular-user" this-extends="main">
    <nav>...</nav>
    <div this-content></div>
</layout>

<layout this-id="admin-user" this-extends="main">
    <nav>...</nav>
    <div this-content></div>
</layout>
```

## Events

There are a few events for layouts:

- [After Events](../events.md#layouts-after)

---

Next: [Models &rarr;](./models.md)

See Also:

- [Attributes](../attributes.md#layout-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)