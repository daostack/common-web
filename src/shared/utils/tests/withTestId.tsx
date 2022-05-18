import React, { ComponentType, FC } from "react";

interface Options {
  shouldWrapChildren?: boolean;
}

const TestIdWrapper: FC<{ testId: string }> = ({ testId, children }) => (
  <div data-testid={testId}>{children}</div>
);

const withTestId = <P extends Record<string, any>>(
  testId: string,
  WrappedComponent?: ComponentType<P>,
  options: Options = {}
): FC<P> => {
  const { shouldWrapChildren = false } = options;
  const displayName =
    WrappedComponent?.displayName || WrappedComponent?.name || "Component";

  const Wrapper: FC<P> = (props) => {
    if (!WrappedComponent) {
      return <TestIdWrapper testId={testId} />;
    }
    if (!shouldWrapChildren) {
      return (
        <TestIdWrapper testId={testId}>
          <WrappedComponent {...props} />
        </TestIdWrapper>
      );
    }

    return (
      <WrappedComponent {...props}>
        <TestIdWrapper testId={testId}>{props.children}</TestIdWrapper>
      </WrappedComponent>
    );
  };

  Wrapper.displayName = `withTestId(${displayName})`;

  return Wrapper;
};

export default withTestId;
