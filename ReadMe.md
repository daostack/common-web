This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the tests.

### `yarn run test:watch`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Project architecture
Check out structure of the `components` folder [here](./docs/page-structure.md).

## Testing

For testing purposes we are using **React Testing Library**. The main idea of this library is to avoid testing implementation details or testing again the logic of a nested component which already is covered by tests.

️Please read small instruction from the library regarding writing the tests: [link 1](https://testing-library.com/docs/#what-you-should-avoid-with-testing-library) and [link 2](https://testing-library.com/docs/guiding-principles) ❗️️️

[Here](https://kentcdodds.com/blog/testing-implementation-details) is a good article about why testing of implementation details is not good.

Of course, sometimes it is necessary to know something about the inner logic and here we can just mock it to use our [logic from the tests](./src/pages/MyAccount/components/Billing/BankAccount/BankAccount.spec.tsx#L14-L56).

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
