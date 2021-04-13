import React from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { ContactUs } from "../../components/LandingContainer/ContactUs";
import "./index.scss";

const LandingContainer = () => {
  return (
    <div className="landing-wrapper">
      <h1>What is Common?</h1>
      <p>
        Common enables large groups of people to collaborate on shared agendas by pooling funds and collectively making
        decisions. <br />
        <b>Anyone</b> can create a Common, invite thier friends, and work together to achieve a common goal.
      </p>
      <div className="illustrations-wrapper">
        <div>
          <img src={require("../../assets/images/transparent.svg")} alt="transparent" />
          <h3>Transparent</h3>
          <div>Commons are fully-transparent, including all decsions and funds.</div>
        </div>
        <div>
          <img src={require("../../assets/images/collective.svg")} alt="collective" />
          <h3>Collective</h3>
          <div>Declare a goal, pool funds, vote on decisions and expenses.</div>
        </div>
        <div>
          <img src={require("../../assets/images/action.svg")} alt="action" />
          <h3>Action</h3>
          <div>Any member can propose projects and use shared funds.</div>
        </div>
      </div>
      <div className="goal-wrapper">
        <img src={require("../../assets/images/iphone.svg")} alt="iphone" />
        <div>
          <h1>Leverage trust and transparency to galvanize massive action.</h1>
          <h5>
            The goal of Common is to support large communities that wish to collaborate on simple, and well-defined
            agendas.
          </h5>
          <p>
            Humanity's greatest achievements were made by massive collaborations. Common empowers groups to collaborate
            with no single organizer. And when every member gets an equal part in every step of the process, we enter a
            new era of trust and collaboration.
          </p>
        </div>
      </div>
      <h1>Featured Commons</h1>
      <div>Browse some of the emerging groups on the Common app</div>
      <Link className="button-blue" to={ROUTE_PATHS.COMMON_LIST}>
        Explore all commons
      </Link>
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
      <ContactUs />
    </div>
  );
};

export default LandingContainer;
