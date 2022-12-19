import { ROUTE_PATHS } from "@/shared/constants";
import { Item } from "./components/ProjectsTree/types";

const IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media";

export const ITEMS: Item[] = [
  {
    id: "project-1",
    name: "Project 1",
    image: IMAGE_URL,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-1"),
  },
  {
    id: "project-2",
    name: "Project 2",
    image: IMAGE_URL,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2"),
    items: [
      {
        id: "project-2.1",
        name: "Project 2.1",
        image: IMAGE_URL,
        path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1"),
        notificationsAmount: 7,
        items: [
          {
            id: "project-2.1.1",
            name: "Project 2.1.1",
            image: IMAGE_URL,
            path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1.1"),
            items: [
              {
                id: "project-2.1.1.1",
                name: "Project 2.1.1.1",
                image: IMAGE_URL,
                path: ROUTE_PATHS.COMMON_DETAIL.replace(
                  ":id",
                  "project-2.1.1.1",
                ),
              },
              {
                id: "project-2.1.1.2",
                name: "Project 2.1.1.2",
                image: IMAGE_URL,
                path: ROUTE_PATHS.COMMON_DETAIL.replace(
                  ":id",
                  "project-2.1.1.2",
                ),
                hasMembership: false,
                items: [
                  {
                    id: "project-2.1.1.2.1",
                    name: "Project nested long long long",
                    image: IMAGE_URL,
                    path: ROUTE_PATHS.COMMON_DETAIL.replace(
                      ":id",
                      "project-2.1.1.2.1",
                    ),
                    notificationsAmount: 2,
                    hasMembership: false,
                  },
                  {
                    id: "project-2.1.1.2.2",
                    name: "Project 2.1.1.2.2",
                    image: IMAGE_URL,
                    path: ROUTE_PATHS.COMMON_DETAIL.replace(
                      ":id",
                      "project-2.1.1.2.2",
                    ),
                    hasMembership: false,
                  },
                ],
              },
            ],
          },
          {
            id: "project-2.1.2",
            name: "Project 2.1.2",
            image: IMAGE_URL,
            path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-2.1.2"),
          },
        ],
      },
    ],
  },
  {
    id: "project-3",
    name: "Project 3",
    image: IMAGE_URL,
    path: ROUTE_PATHS.COMMON_DETAIL.replace(":id", "project-3"),
  },
];
