import React, { FC } from "react";

// Component is fully taken from the Slate example: https://github.com/ianstormtaylor/slate/blob/main/site/examples/inlines.tsx
const InlineChromiumBugfix: FC = () => {
  return (
    <span contentEditable={false} style={{ fontSize: 0 }}>
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  );
};

export default InlineChromiumBugfix;
