import { getCommonPagePath } from "@/shared/utils";
import { Item } from "./components/ProjectsTree/types";

const IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_01.png?alt=media";

export const ITEMS: Item[] = [
  {
    id: "space-1",
    name: "Space 1",
    image: IMAGE_URL,
    path: getCommonPagePath("space-1"),
  },
  {
    id: "space-2",
    name: "Space 2",
    image: IMAGE_URL,
    path: getCommonPagePath("space-2"),
    items: [
      {
        id: "space-2.1",
        name: "Space 2.1",
        image: IMAGE_URL,
        path: getCommonPagePath("space-2.1"),
        notificationsAmount: 7,
        items: [
          {
            id: "space-2.1.1",
            name: "Space 2.1.1",
            image: IMAGE_URL,
            path: getCommonPagePath("space-2.1.1"),
            items: [
              {
                id: "space-2.1.1.1",
                name: "Space 2.1.1.1",
                image: IMAGE_URL,
                path: getCommonPagePath("space-2.1.1.1"),
              },
              {
                id: "space-2.1.1.2",
                name: "Space 2.1.1.2",
                image: IMAGE_URL,
                path: getCommonPagePath("space-2.1.1.2"),
                hasMembership: false,
                items: [
                  {
                    id: "space-2.1.1.2.1",
                    name: "Space nested long long long",
                    image: IMAGE_URL,
                    path: getCommonPagePath("space-2.1.1.2.1"),
                    notificationsAmount: 2,
                    hasMembership: false,
                  },
                  {
                    id: "space-2.1.1.2.2",
                    name: "Space 2.1.1.2.2",
                    image: IMAGE_URL,
                    path: getCommonPagePath("space-2.1.1.2.2"),
                    hasMembership: false,
                  },
                ],
              },
            ],
          },
          {
            id: "space-2.1.2",
            name: "Space 2.1.2",
            image: IMAGE_URL,
            path: getCommonPagePath("space-2.1.2"),
          },
        ],
      },
    ],
  },
  {
    id: "space-3",
    name: "Space 3",
    image: IMAGE_URL,
    path: getCommonPagePath("space-3"),
  },
];
