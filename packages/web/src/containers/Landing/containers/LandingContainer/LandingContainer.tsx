import React from "react";
import { useSelector } from "react-redux";
import { MobileLinks } from "../../../../shared/components/MobileLinks";
import { ContactUs } from "../../components/LandingContainer/ContactUs";
import { Commons } from "../../components/LandingContainer/Commons";
import { getScreenSize } from "../../../../shared/store/selectors";
import "./index.scss";
import { ScreenSize } from "../../../../shared/constants";

const LandingContainer = () => {
  const screenSize = useSelector(getScreenSize());

  return (
    <div className="landing-wrapper">
      <section className="landing-top">
        <div className="info">
          <img src="icons/logo-white.svg" alt="logo" width="150px" />
          <h1>
            Launch Collective Action. <br />
            <span className="pink-text">Catalyze a movement</span>
            <br /> together.
          </h1>
          <div className="mobile-apps-wrapper">
            <div className="available-on-label">Available on</div>
            <MobileLinks color="white" />
          </div>
        </div>
        <img
          src={require(`../../assets/images/${
            screenSize === ScreenSize?.Large ? "iphone-full.png" : "iphone-half.png"
          }`)}
          alt="iphone"
          className="iphone-image"
          width="300px"
        />
        <img src={require("../../assets/images/wave-top.svg")} alt="wave" className="wave-top" />
      </section>
      <section>
        <h1>What is Common?</h1>
        <p>
          Common enables large groups of people to collaborate on shared <br /> agendas by pooling funds and
          collectively making decisions. <br />
          <b>Anyone</b> can create a Common, invite thier friends, and work <br /> together to achieve a common goal.
        </p>
        <div className="illustrations-wrapper">
          <div>
            <img src={require("../../assets/images/transparent.svg")} alt="transparent" />
            <h3>Transparent</h3>
            <div>
              Commons are fully-transparent, <br /> including all decsions and funds.
            </div>
          </div>
          <div>
            <img src={require("../../assets/images/collective.svg")} alt="collective" />
            <h3>Collective</h3>
            <div>
              Declare a goal, pool funds, vote <br /> on decisions and expenses.
            </div>
          </div>
          <div>
            <img src={require("../../assets/images/action.svg")} alt="action" />
            <h3>Action</h3>
            <div>
              Any member can propose <br /> projects and use shared funds.
            </div>
          </div>
        </div>
      </section>
      <section className="goal-wrapper">
        <img src={require("../../assets/images/iphone.png")} alt="iphone" width="500px" />
        <div>
          <h1>
            Leverage trust and <br /> transparency to galvanize <br /> massive action.
          </h1>
          <h5>
            The goal of Common is to support large communities that wish to <br /> collaborate on simple, and
            well-defined agendas.
          </h5>
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
        <div>You can start a common for any shared agenda such as...</div>
        <div className="illustrations-wrapper">
          <div>
            <img src={require("../../assets/images/movement.svg")} alt="movement" />
            <h5>Catalyze a Movement</h5>
          </div>
          <div>
            <img src={require("../../assets/images/raise-awareness.svg")} alt="awareness" />
            <h5>Raise Awareness</h5>
          </div>
          <div>
            <img src={require("../../assets/images/neighborhood.svg")} alt="neighborhood" />
            <h5>Start a neighborhood project</h5>
          </div>
          <div>
            <img src={require("../../assets/images/voluneteering.svg")} alt="voluneteering" />
            <h5>Coordinate Voluneteering Work</h5>
          </div>
        </div>
      </section>
      <ContactUs />
      <section className="landing-bottom">
        <h1>Join Common!</h1>
        <span>
          Download the Common app and find <br /> countless opportunities to make a difference.
        </span>
        <MobileLinks color="white" />
      </section>
    </div>
  );
};

export default LandingContainer;
