# Forms `<form />`

Forms are usually for [creating](../features/models.md#create) or [updating](../features/models.md#update)
models. The submission of these handled automatically.

For the times when you would want to handle the submissions manually, add attribute
[`this-ignore-submit`](../attributes.md#this-ignore-submit).

## Non-Model Forms

For forms that are not for models, add attribute [`this-handle-submit`](../attributes.md#this-handle-submit)
and the forms' submissions would be available in events as well.

## Events

See events for forms:

- [Before Events](../events.md#forms-before)
- [After Events](../events.md#forms-after)

---
Next: [Autocomplete &rarr;](./autocomplete.md)

See Also:

- [Attributes](../attributes.md#form-attributes)
- [Features](../../../README.md#features)
- [Helpers](../../../README.md#helpers)
- [Finally](../finally.md)