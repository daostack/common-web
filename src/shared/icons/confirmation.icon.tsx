import React, { ReactElement } from "react";

interface ConfirmationIconProps {
  className?: string;
}

export default function ConfirmationIcon({
  className,
}: ConfirmationIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="92"
      height="92"
      viewBox="0 0 92 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.1643 24.9155C62.5704 26.2918 62.9218 23.4306 62.7691 35.9772C62.7572 36.9538 61.8899 37.7366 60.8318 37.7257C59.7737 37.7147 58.9256 36.9141 58.9375 35.9375C58.9375 35.9375 58.8753 35.715 58.7961 33.6108L58.7676 32.9084C58.696 31.2624 58.6005 29.8991 58.4828 28.8621L58.4376 28.4887C58.3967 28.1719 58.3539 27.8964 58.3103 27.6659L58.2556 27.414L57.8598 27.3237L57.5754 27.27C56.7208 27.1179 55.5351 26.9824 54.0857 26.8708C51.5065 26.6722 48.1912 26.5571 44.7099 26.5393L43.7567 26.5368C39.9311 26.5368 36.2415 26.6541 33.4278 26.8708L32.3913 26.9588L31.4599 27.0552C31.0216 27.1053 30.6251 27.1583 30.2739 27.2138L29.9381 27.27C29.7372 27.3058 29.5585 27.3418 29.4041 27.3772L29.2407 27.4175L29.2255 27.4797C29.1775 27.6814 29.1288 27.9293 29.0809 28.2193L29.0332 28.5232C28.9076 29.3645 28.7939 30.4598 28.6948 31.7717L28.6135 32.9482L28.5241 34.53C28.372 37.5465 28.2847 41.1755 28.2712 44.9552V47.0235L28.2858 49.0674L28.3148 51.0648C28.3687 54.0176 28.47 56.7572 28.6135 59.0305L28.7382 60.7559L28.83 61.7714C28.8777 62.2511 28.9277 62.6881 28.9801 63.0795L29.0332 63.4555C29.0806 63.7732 29.129 64.05 29.1773 64.282L29.2771 64.7044L29.3437 64.7234C30.9879 65.1671 38.5485 65.6171 46.892 65.3537L48.0053 65.3137C49.0624 65.271 49.957 66.0273 50.0033 67.003C50.0497 67.9787 49.2303 68.8044 48.1731 68.8472L46.1602 68.9177L44.1471 68.9668C34.3279 69.1534 27.8775 68.5591 26.3492 67.0632C23.8003 64.5682 23.8003 27.4105 26.3492 24.9155C28.9584 22.3615 58.5551 22.3615 61.1643 24.9155Z"
        fill="currentColor"
      />
      <path
        d="M58.9375 40.25C63.701 40.25 67.5625 44.0233 67.5625 48.678C67.5625 51.1189 66.5006 53.3175 64.8035 54.8566L66.5762 63.5244C66.8172 64.7017 66.0358 65.847 64.8309 66.0825C64.2882 66.1885 63.7246 66.0931 63.25 65.8149L60.4167 64.1537C59.5062 63.6199 58.3688 63.6199 57.4583 64.1537L54.625 65.8149C53.5714 66.4326 52.2048 66.0987 51.5726 65.0692C51.2879 64.6055 51.1903 64.0547 51.2988 63.5244L53.0715 54.8566C51.3744 53.3175 50.3125 51.1189 50.3125 48.678C50.3125 44.0233 54.174 40.25 58.9375 40.25Z"
        fill="currentColor"
      />
      <path
        d="M44.2734 35.7656V37.582C44.9844 37.6055 45.5977 37.6836 46.1133 37.8164C46.6289 37.9492 47.0547 38.125 47.3906 38.3438C47.7266 38.5547 47.9727 38.8008 48.1289 39.082C48.293 39.3633 48.375 39.6641 48.375 39.9844C48.375 40.4922 48.1562 40.9102 47.7188 41.2383C47.2812 41.5664 46.6211 41.7305 45.7383 41.7305C45.7383 41.4961 45.7109 41.2422 45.6562 40.9688C45.6016 40.6953 45.5156 40.4336 45.3984 40.1836C45.2812 39.9258 45.1289 39.6953 44.9414 39.4922C44.7617 39.2812 44.5391 39.1172 44.2734 39V43.6758C44.3203 43.6992 44.4102 43.7383 44.543 43.793C44.6758 43.8398 44.7852 43.8828 44.8711 43.9219C45.6055 44.2109 46.2344 44.5078 46.7578 44.8125C47.2812 45.1172 47.707 45.4492 48.0352 45.8086C48.3711 46.168 48.6133 46.5586 48.7617 46.9805C48.918 47.3945 48.9961 47.8555 48.9961 48.3633C48.9961 48.9727 48.8867 49.5391 48.668 50.0625C48.457 50.5781 48.1484 51.0352 47.7422 51.4336C47.3438 51.832 46.8516 52.1602 46.2656 52.418C45.6797 52.668 45.0156 52.8359 44.2734 52.9219V55.8984H42.9258V52.9688C42.0117 52.9453 41.2383 52.8281 40.6055 52.6172C39.9727 52.4062 39.457 52.1406 39.0586 51.8203C38.668 51.5 38.3867 51.1445 38.2148 50.7539C38.043 50.3633 37.957 49.9805 37.957 49.6055C37.957 49.2539 38.0195 48.957 38.1445 48.7148C38.2773 48.4727 38.4492 48.2773 38.6602 48.1289C38.8711 47.9727 39.1094 47.8594 39.375 47.7891C39.6484 47.7188 39.9297 47.6836 40.2188 47.6836C40.2188 48.2852 40.2812 48.8203 40.4062 49.2891C40.5391 49.7578 40.7227 50.1602 40.957 50.4961C41.1992 50.8242 41.4844 51.0898 41.8125 51.293C42.1484 51.4961 42.5195 51.6289 42.9258 51.6914V46.5117L42.5156 46.3477C41.75 46.0352 41.1094 45.7188 40.5938 45.3984C40.0859 45.0781 39.6719 44.7383 39.3516 44.3789C39.0391 44.0117 38.8164 43.6172 38.6836 43.1953C38.5508 42.7734 38.4844 42.3047 38.4844 41.7891C38.4844 41.2109 38.5938 40.6836 38.8125 40.207C39.0312 39.7227 39.3359 39.3008 39.7266 38.9414C40.1172 38.582 40.582 38.2891 41.1211 38.0625C41.668 37.8281 42.2695 37.6758 42.9258 37.6055V35.7656H44.2734ZM46.1484 49.4414C46.1484 48.9336 45.9922 48.5 45.6797 48.1406C45.3672 47.7812 44.8984 47.4375 44.2734 47.1094V51.6445C44.875 51.5117 45.3359 51.2461 45.6562 50.8477C45.9844 50.4492 46.1484 49.9805 46.1484 49.4414ZM41.2969 40.7812C41.2969 40.9922 41.3203 41.1953 41.3672 41.3906C41.4141 41.5859 41.5 41.7773 41.625 41.9648C41.75 42.1445 41.918 42.3242 42.1289 42.5039C42.3398 42.6758 42.6055 42.8516 42.9258 43.0312V38.8828C42.457 38.9688 42.0664 39.1719 41.7539 39.4922C41.4492 39.8047 41.2969 40.2344 41.2969 40.7812Z"
        fill="currentColor"
      />
    </svg>
  );
}
