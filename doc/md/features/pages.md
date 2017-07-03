# Pages `<page />`

A page is any element with `this-type="page"` or `page` tag. All pages must have an id.

```html
<div this-type="page" this-id="home">
    ...
</div>


<page this-id="help">
    ...
</page>
```

## Single Page Applications (SPAs)

Bulding SPAs is just a breeze. All that's needed is to

1. Create the app container;
2. Add pages (with unique ids) to the container; and
3. Indicate the default page.

```html
<div this-app-container>
    <div this-type="page" this-id="home" this-default-page>
        ...
    </div>
    <page this-id="about">
        ...
    </page>
    <page this-id="contact">
        ...
    </page>
</div>
```

## From file

If you decide to go [structural](../finally.md#structured-approach), you should
provide the path to the page file with [`this-path`](../attributes.md#this-path):

```html
<div this-type="page" this-id="from-file" this-path="path/to/page/file"></div>
```

The file's content would be loaded into the element and processed as a page.

---
**Important Note**:

DO NOT USE [`this-url`](../attributes.md#this-url). It is reserved for another purpose.

---

## Page-Only Assets

### JavaScript files

While `ThisJS` is all about events, some events are only specific to a
page and should not be put in the main script. Even though these can be
in the main script, it sometimes make more sense for each to stand on its
own.

For example, different pages may do different things when the page is loaded.
Putting this in the main script requires using if-else or switches instead of 
rewriting the whole listener:

```javascript
<!-- main.js -->

app.when('click', 'page a', function () {
    switch(app.page.this('id')) {
        case 'home':
            // ...
            break;
        case 'about':
            // ...
            break;
        case 'contact':
            // ...
            break;
    }
});
```

While this would work fine, for modular purposes and better structure, each
page may have its own `JavaScript` file and run its own event listener:

```javascript
<!-- home.js -->
app.when('click', 'page#home a', function () {
    // do something for home page only
});

<!-- about.js -->
app.when('click', 'page#about a', function () {
    // do something for about page only
});

<!-- contact.js -->
app.when('click', 'page#contact a', function () {
    // do something for contact page only
});
```

    Note: The 3 event listeners above can also be put exactly like that in the
    main script.

To load the scripts whenever the pages load, use the [`this-load-js`](../attributes.md#this-load-js) attribute:

```html
    <page this-id="home" this-load-js="home">
        ...
    </page>
    <page this-id="about" this-load-js="about">
        ...
    </page>
    <page this-id="contact" this-load-js="contact">
        ...
    </page>
```

This loads the script when the page has been fully loaded. This means that
event [`page.loaded`](../events.md#page-loaded)
would never be fired from within the script.

To load the script before the page loads at all, use attribute [`this-load-js-first`](../attributes.md#this-load-js-first)
instead.

    Note: <script></script> in pages are not recognized as scripts but as normal tags. Use custom script files instead.

### Cascading Style Sheets (CSS)

Just like scripts, some styles are only needed for a page as well. While
these can directly be put on the pages as `<style>...</style>`, they may also
be put in separate `.css` files and loaded into the page with attribute [`this-load-css`](../attributes.md#this-load-css).

### Important Note

Do not add the file extension when using the attriutes, i.e. `this-load-js="home"`
instead of `this-load-js="home.js"`.

## Events

There are a few events for pages:

- [Before Events](../events.md#pages-before)
- [After Events](../events.md#pages-after)

---

Next: [Layouts  &rarr;](./layouts.md)


See Also:

- [Attributes](../attributes.md#page-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)
