import React, { FC } from "react";
import peopleOnCubesImageSrc from "@/shared/assets/images/peolpe-on-cubes.svg";
import "./index.scss";

const ImagineSection: FC = () => (
  <section className="landing-imagine-section">
    <div className="landing-imagine-section__content">
      <img
        className="landing-imagine-section__image"
        src={peopleOnCubesImageSrc}
        alt="People"
      />
      <div className="landing-imagine-section__info-wrapper">
        <h2 className="landing-imagine-section__title">Imagine</h2>
        <p className="landing-imagine-section__description">
          Humanity’s greatest achievements were made by massive collaborations.
          We enter a new era of trust and collaboration.
        </p>
        <p className="landing-imagine-section__description">
          Imagine you could easily and quickly fuel a movement, by letting the
          people in your community decide what is important.
        </p>
        <p className="landing-imagine-section__description">
          With Common, you can.
        </p>
        <p className="landing-imagine-section__description">
          Common empowers groups to collaborate with no single organizer. It’s
          an online platform that makes it easy to pool funds together, and
          decide collaboratively how to spend it.
        </p>
        <p className="landing-imagine-section__description">
          We enter a new era of trust and collaboration.
        </p>
      </div>
    </div>
  </section>
);

export default ImagineSection;
