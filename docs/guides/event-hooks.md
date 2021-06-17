# Event Hooks

To hook some action to happen when event occurs you need to create event hook handler. Example of hook:

```typescript
export const onCommonCreated: EventHandler = async (data, event) => {
  if (event.type === 'CommonCreated') {
    logger.info('Executing `onCommonCreated`');

    // ... Do some action
  }
};
```

Once the hook is created you need to add it to the hooks array so that it will be picked up when event occurs. To do so
add the exported hook handler to the `eventHookHandlers` in the `worker` project.

```typescript
export const eventHookHandlers: EventHookHandler[] = [
  // ... Hooks
];
```

It is possible to have more than one hook for one event type, but is **not recommended** because it will be harder to
track down what goes wrong