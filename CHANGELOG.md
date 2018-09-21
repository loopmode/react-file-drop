# react-file-drop changelog

### v0.4.5

-   Update @loopmode/events 1.0.4

### v0.4.4

-   Use es5 target for TS compiler again
-   Update @loopmode/events

### v0.4.3

-   Use fewer global event listeners (via `@loopmode/events`)

### v0.4.2

-   Prevent default events when disabled

### v0.4.1

-   Add disabled prop

### v0.4.0

-   Accept not just files, but any drops.
-   Provide third argument `details` to `onDrop` callback

### v0.3.0

-   Add `innerComponent` and `outerComponent` render props

### v0.2.0

-   Rewrite in Typescript
-   Add React 16 support
-   Add IE 11 support
-   Add file-type-checking (only allow dragging/dropping of actual files, according to event.dataTransfer.types)
-   Remove functionality where user can "cancel" a drag event on the frame
-   Remove AMD/standalone support (I think the time has come)
-   Remove disableDoubleDrop prop
-   Remove targetAlwaysVisible prop
