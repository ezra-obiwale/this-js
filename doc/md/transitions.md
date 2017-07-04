# Transitions

These are how moving from a page to another is carried out.

By default, the only transition available is `switch` which simple switches from
one page to the other without any effect. This is also the default transition.

## Custom Transitions

It is possible to add custom transitions to use instead of the default. `ThisApp.Transitions()`
returns an [Extender](../extender.md) object for extending transitions.

When extending, you should specifiy a `name` for the transition and a function
to be called whenever a transition is to take place.

The name would be specified as [`config.transition`](../config.md#transition)
while the function would be called with 3 paramters:

    (oldPage, newPage, options)

The options would be the whatever is specified as [`config.transitionOptions`](../config.md#transitionOptions)'s
value.

### Returned Value

By default, the `newPage` is shown immediately after the transition function
has been called. In some cases, this might not be ideal as the animation may
still be in progress.

In such cases, return a integer `milliseconds` after which the `newPage` should
be shown.

If anything else but an integer is returned, it is ignored and the `newPage` is
shown immediately.