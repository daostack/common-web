import React from "react";
import { useSelector } from "react-redux";
import { MobileLinks } from "../../../../shared/components/MobileLinks";
import { ContactUs } from "../../components/LandingContainer/ContactUs";
import { Commons } from "../../components/LandingContainer/Commons";
import { getScreenSize } from "../../../../shared/store/selectors";
import "./index.scss";
import { Colors, ScreenSize } from "../../../../shared/constants";

const LandingContainer = () => {
  const screenSize = useSelector(getScreenSize());

  return (
    <div className="landing-wrapper">
      <section className="landing-top">
        <div className="info">
          <img src="icons/logo-all-white.svg" alt="common logo" className="logo" />
          <span className="main-title">Launch Collective Action.</span>
          <div className="dynamic-text-wrapper">
            <span className="dynamic-text one">Catalyze a movement</span>
            <span className="dynamic-text two">Fund Independent Journalism</span>
            <span className="dynamic-text three">Start a Neighborhood Project</span>
          </div>
          <span className="main-title">Together.</span>
          <div className="mobile-apps-wrapper">
            <div className="available-on-label">Available on</div>
            <MobileLinks color={Colors.white} />
          </div>
          <div className={screenSize === ScreenSize.Large ? "iphone-image full" : "iphone-image half"} />
        </div>
        <img src="assets/images/wave-top.svg" alt="wave" className="wave-top" />
      </section>
      <section>
        <h1>What is Common?</h1>
        <p>
          Common enables large groups of people to collaborate on shared <br /> agendas by pooling funds and
          collectively making decisions. <br /> <br />
          <b>Anyone</b> can create a Common, invite thier friends, and work <br /> together to achieve a common goal.
        </p>
        <div className="illustrations-wrapper-1">
          <div>
            <img src="assets/images/transparent.svg" alt="transparent" />
            <h2>Transparent</h2>
            <div>
              Commons are fully-transparent, <br /> including all decsions and funds.
            </div>
          </div>
          <div>
            <img src="assets/images/collective.svg" alt="collective" />
            <h2>Collective</h2>
            <div>
              Declare a goal, pool funds, vote <br /> on decisions and expenses.
            </div>
          </div>
          <div>
            <img src="../../assets/images/action.svg" alt="action" />
            <h2>Action</h2>
            <div>
              Any member can propose <br /> projects and use shared funds.
            </div>
          </div>
        </div>
      </section>
      <section className="goal-wrapper">
        <img src="assets/images/iphone.png" alt="iphone" className="half-iphone" />
        <div>
          <h1>
            Leverage <span className="purple-text">trust</span> and <br />
            <span className="purple-text">transparency</span> to galvanize <br /> massive action.
          </h1>
          <b>
            The goal of Common is to support large communities that wish to <br /> collaborate on simple, and
            well-defined agendas.
          </b>
          <p>
            Humanity's greatest achievements were made by massive <br /> collaborations. Common empowers groups to
            collaborate with no <br /> single organizer. And when every member gets an equal part in <br /> every step
            of the process, we enter a new era of trust and <br /> collaboration.
          </p>
        </div>
      </section>
      <section>
        <Commons />
      </section>
      <section>
        <h1>What's Calling You?</h1>
        <b>You can start a common for any shared agenda such as...</b>
        <div className="illustrations-wrapper-2">
          <div>
            <img src="assets/images/movement.svg" alt="movement" />
            <h5>Catalyze a Movement</h5>
          </div>
          <div>
            <img src="assets/images/raise-awareness.svg" alt="awareness" />
            <h5>Raise Awareness</h5>
          </div>
          <div>
            <img src="assets/images/neighborhood.svg" alt="neighborhood" />
            <h5>
              Start a neighborhood <br /> project
            </h5>
          </div>
          <div>
            <img src="assets/images/voluneteering.svg" alt="voluneteering" />
            <h5>
              Coordinate Voluneteering <br /> Work
            </h5>
          </div>
        </div>
      </section>
      <ContactUs />
      <section className="landing-bottom">
        <h1>Join Common!</h1>
        <span>
          Download the Common app and find <br /> countless opportunities to make a difference.
        </span>
        <MobileLinks color={Colors.white} />
      </section>
    </div>
  );
};

export default LandingContainer;
