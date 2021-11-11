import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { isMobile } from "../../../../../shared/utils";
import "./index.scss";

interface IntroductionProps {
  setTitle: (title: string) => void;
}

interface SlideOptions {
  imageSrc: string;
  title: string;
  description: string;
}

const SLIDES: SlideOptions[] = [
  {
    imageSrc: '/assets/images/membership-request-introduce.svg',
    title: 'Create a Common',
    description: 'Collaborate on shared agendas by pooling funds and collectively making decisions.',
  },
  {
    imageSrc: '/assets/images/membership-request-funds.svg',
    title: 'Invite members and pool funds',
    description: 'Invite others to join your Common. Easily pool funds from all members and work together to advance your cause.',
  },
  {
    imageSrc: '/assets/images/membership-request-vote.svg',
    title: 'Work as a collective',
    description: 'All members get an equal vote and can take part in the shared effort.',
  },
  {
    imageSrc: '/assets/images/membership-request-membership.svg',
    title: 'Harness the power of communities',
    description: 'There‘s no limit to what we can achieve when working together. By getting everyone involved, more people will actively promote the cause.',
  },
];

export default function Introduction({ setTitle }: IntroductionProps) {
  useEffect(() => {
    setTitle('Create a Common');
  }, []);

  return (
    <div className="create-common-introduction">
      <Swiper pagination={{ clickable: true, bulletActiveClass: 'create-common-introduction__active-bullet' }}>
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.title}>
            <figure className="create-common-introduction__slide">
              <img
                className="create-common-introduction__image"
                src={slide.imageSrc}
                alt={slide.title}
              />
              <figcaption className="create-common-introduction__slide-title">{slide.title}</figcaption>
              <figcaption className="create-common-introduction__slide-description">{slide.description}</figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="button-blue create-common-introduction__button">Continue</button>
    </div>
  );
}
