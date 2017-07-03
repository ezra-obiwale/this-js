# Finally

Here are some final things to know and do.

## Notable Attributes

## Structured Approach

Instead of having all the features on the single page, a more structured approach
could be taken.

By default, the following structure is expected:

```
Root directory
    |
    |--- components/
    |
    |--- pages/
    |
    |--- layouts/
    |
    |--- assets/
            |
            |--- js/
            |
            |--- css/
```

By default as well, `components`, `pages` and `layouts` files are expected to 
have `.html` extensions while `js` and `css` files are `.js` and `.css` respectively.

The defaults can be changed in the [config object](./config.md) or with the
 appropriate methods - [setComponentsPath(...)](./methods.md#setComponentsPath), 
 [setPagesPath(...)](./methods.md#setPagesPath), [setLayoutsPath(...)](./methods.md#setLayoutsPath),
[setJSPath(...)](./methods.md#setJSPath) and [setCSSPath(...)](./methods.md#setPagesPath).

Each of these directories should contain the corresponding type of feature.