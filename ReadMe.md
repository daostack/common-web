This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the tests.

### `npm run test:watch`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Testing

For testing purposes we are using **React Testing Library**. The main idea of this library is to avoid testing implementation details or testing again the logic of a nested component which already is covered by tests.

️Please read small instruction from the library regarding writing the tests: [link 1](https://testing-library.com/docs/#what-you-should-avoid-with-testing-library) and [link 2](https://testing-library.com/docs/guiding-principles) ❗️️️

[Here](https://kentcdodds.com/blog/testing-implementation-details) is a good article about why testing of implementation details is not good.

Of course, sometimes it is necessary to know something about the inner logic and here we can just mock it to use our [logic from the tests](./src/containers/MyAccount/components/Billing/BankAccount/BankAccount.spec.tsx#L14-L56).

Cases where we need to test calls to BE, test store changing after BE call, test redirecting, etc... is more related to integration tests, which our project doesn't use.

### Unit testing

What we should test:

- utils or any helpers we are writing for our components;
- components, which are units on our pages. It is hard to write unit tests for the components which use under the hood some other components and have some logic with those components. To test such components we should use integration tests. But we still can cover by unit tests nested components;
- cases where we use different logic based on user viewport (desktop or mobile);
- reducers.

### How to write test

Create a new file near the file you are going to test. Use the same file name, but add `spec` before the extension.

Examples:
- `formatDate.ts` -> `formatDate.spec.ts`
- `Button.ts` -> `Button.spec.ts`

If you need to mock something you can create a file in [utils/tests](./src/shared/utils/tests) and import a newly created file in the [setupTests.ts](./src/shared/utils/tests/setupTests.ts) file.

## Run the project with local Back-end
1. Check out [common-backend](https://github.com/daostack/common-backend) repository and follow the `Installation` and `public Dev env` sections to run the project in the dev mode;
2. Go to the [controller](https://github.com/daostack/common-backend/blob/dev/functions/src/users/controllers/create.ts#L20-L27) for user creation. Look for the `if` statement `process.env.NODE_ENV !== 'local'` and remove `else` part, as well as `if` check (leave the code which is in that `if` block);
3. Open [package.json](./package.json) file and change `REACT_APP_ENV=dev` to `REACT_APP_ENV=local` in the `start` script.
4. `yarn start`

## Supporters Flow
The documentation is [here](./docs/supporters-flow.md).
