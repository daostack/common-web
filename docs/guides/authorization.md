# Authorization Guide

Authorization refers to the process that determines what a user is able to do. In our case the authorization is
performed in the `graphlq` package. To perform authorization checks you need to pass authorize function to the field
that should be protected. To get the currently authenticated user ID you can call `getUserId` function on the context
object. Example of authorized resolver:

```typescript
export const GetNotificationsQuery = queryField('notifications', {
  type: list('Notification'),
  description: 'List of all notifications, readable only by the admin',
  args: {
    paginate: nonNull(
      arg({
        type: 'PaginateInput'
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.notification.read');
  },
  resolve: (root, args, ctx) => {
    // ...logic
  }
});
```

In the example above we just check whether the user has admin permission for reading the notifications. If we want to
also allow the user, owner of the notification, to read it we can do:

```typescript
export const UserNotificationsExtension = extendType({
  type: 'User',
  definition(t) {
    t.nonNull.list.nonNull.field('notifications', {
      complexity: 10,
      type: 'Notification',
      authorize: async (root, args, ctx) => {
        return root.id === (await ctx.getUserId());
      },
      args: {
        // ...args declaration
      },
      resolve: (root, args) => {
        // ...logic
      }
    });
  }
});
```

Here we perform authorization based on the resource