import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SwiperCore, { Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";

import { Loader } from "../../../../../shared/components";
import { ROUTE_PATHS, ScreenSize } from "../../../../../shared/constants";
import { Common } from "../../../../../shared/models";
import {
  getLoading,
  getScreenSize,
} from "../../../../../shared/store/selectors";
import { CommonListItem } from "@/containers/Common/components";
import "./index.scss";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import { getCommonsList } from "../../../../Common/store/actions";
import { selectCommonList } from "../../../../Common/store/selectors";

SwiperCore.use([Pagination]);

export default function Commons() {
  const commons = useSelector(selectCommonList());
  const loading = useSelector(getLoading());
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  document.documentElement.style.setProperty("--swiper-theme-color", "#000000");

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  const featuredCommons = commons
    .filter((common) => common.register === "registered")
    .slice(0, 8)
    .map((common: Common) => {
      if (screenSize === ScreenSize.Desktop) {
        return <CommonListItem common={common} key={common.id} />;
      }
      return (
        <SwiperSlide className="swiper-slide" key={common.id}>
          <CommonListItem common={common} />
        </SwiperSlide>
      );
    });

  return (
    <div className="commons-wrapper">
      <h1>Featured Commons</h1>
      <span className="bold-text">
        Browse some of the emerging groups on the Common app
      </span>

      {loading ? (
        <Loader />
      ) : screenSize === ScreenSize.Desktop ? (
        <div className="featured-commons">{featuredCommons}</div>
      ) : (
        <div>
          <Swiper
            slidesPerView={"auto"}
            centeredSlides={true}
            spaceBetween={20}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {featuredCommons}
          </Swiper>
        </div>
      )}

      <Link
        className="button-blue explore-commons"
        to={ROUTE_PATHS.COMMON_LIST}
      >
        Explore all commons
      </Link>
    </div>
  );
}
