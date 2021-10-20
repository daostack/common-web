import React from "react";

const ErrorMessage = (error: Error) => <p color={"red"}>{error.message}</p>;

export default ErrorMessage;
