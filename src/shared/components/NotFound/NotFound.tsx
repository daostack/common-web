import React from "react";
import { useHistory } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import Button from "../Button/Button";
import "./index.scss";

export default function NotFound() {
  const history = useHistory();
  
  return (
    <div className="page-not-found">
      <img src="/assets/images/404.jpg" alt="404" />
      <h3 className="page-not-found__message">Woops, the page you’re looking for isn’t there</h3>
      <Button onClick={() => history.push(ROUTE_PATHS.HOME)}>Back to Home</Button>
    </div>
  )
}
