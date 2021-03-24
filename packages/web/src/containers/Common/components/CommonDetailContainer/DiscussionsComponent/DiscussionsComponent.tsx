import React from "react";
import "./index.scss";

export default function DiscussionsComponent() {
  return (
    <div className="discussions-component-wrapper">
      <div className="discussion-item-wrapper">
        <div className="discussion-top-bar">
          <div className="img-wrapper">
            <img src="https://picsum.photos/40/40" alt="kek" />
          </div>
          <div className="creator-information">
            <div className="name">Peter Parkey</div>
            <div className="days-ago">3 days ago</div>
          </div>
        </div>
        <div className="discussion-content">
          <div className="title">How about planting trees in india as well?</div>
          <div className="description">
            I was thinking we should do some work on this and expand to new forests. They need us and our trees. Mother
            Nature does a lot of tree planting ably aided by the wind, rain, and critters, both feathered and furry.
            However, she would probably appreciate some assistance from us, humans.
          </div>
          <div className="read-more">Read More</div>
          <div className="line"></div>
        </div>
        <div className="bottom-content">
          <div className="discussion-count">
            <img src="/icons/discussions.svg" alt="discussions" />
            <div className="count">123</div>
          </div>
          <div className="view-all-discussions">View discussions</div>
        </div>
      </div>
      <div className="discussion-item-wrapper">
        <div className="discussion-top-bar">
          <div className="img-wrapper">
            <img src="https://picsum.photos/40/40" alt="kek" />
          </div>
          <div className="creator-information">
            <div className="name">Peter Parkey</div>
            <div className="days-ago">3 days ago</div>
          </div>
        </div>
        <div className="discussion-content">
          <div className="title">How about planting trees in india as well?</div>
          <div className="description">
            I was thinking we should do some work on this and expand to new forests. They need us and our trees. Mother
            Nature does a lot of tree planting ably aided by the wind, rain, and critters, both feathered and furry.
            However, she would probably appreciate some assistance from us, humans.
          </div>
          <div className="read-more">Read More</div>
          <div className="line"></div>
        </div>
        <div className="bottom-content">
          <div className="discussion-count">
            <img src="/icons/discussions.svg" alt="discussions" />
            <div className="count">123</div>
          </div>
          <div className="view-all-discussions">View discussions</div>
        </div>
      </div>
    </div>
  );
}
