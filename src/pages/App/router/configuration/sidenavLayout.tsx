import React from "react";
import { ROUTE_PATHS, SIDENAV_ID } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: SidenavLayout,
  routes: [
    {
      path: ROUTE_PATHS.TEST,
      exact: true,
      component: () => (
        <div>
          <header>
            <a
              href={`#${SIDENAV_ID}`}
              id="sidenav-button"
              className="hamburger"
              title="Open Menu"
              aria-label="Open Menu"
            >
              Open Sidenav
            </a>
            <h1>Site Title</h1>
          </header>

          <article>
            <h2>Totam Header</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum
              consectetur, necessitatibus velit officia ut impedit veritatis
              temporibus soluta? Totam odit cupiditate facilis nisi sunt hic
              necessitatibus voluptatem nihil doloribus! Enim.
            </p>
          </article>
        </div>
      ),
    },
  ],
};
