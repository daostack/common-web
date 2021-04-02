import React from "react";
import { Loader } from "../../../../../shared/components";
import { Discussion } from "../../../../../shared/models";
import "./index.scss";

interface DiscussionDetailModalProps {
  disscussion: Discussion | null;
}

export default function DiscussionDetailModal({ disscussion }: DiscussionDetailModalProps) {
  return !disscussion ? (
    <Loader />
  ) : (
    <div className="discussion-detail-modal-wrapper">
      <div className="left-side">
        <div className="top-side">
          <div className="countdown-wrapper">
            <div className="inner-wrapper">
              <img className="clock-icon" src="/icons/alarm-clock.svg" alt="alarm-clock" />
              <div className="text">Countdown 08:21:13</div>
            </div>
          </div>
          <div className="owner-wrapper">
            <div className="owner-icon-wrapper">
              <img src="http://via.placeholder.com/32x32" alt="owner-pick" />
            </div>
            <div className="owner-name">Kek Cheburekov</div>
            <div className="days-ago">3 days ago</div>
          </div>
          <div className="discussion-information-wrapper">
            <div className="discussion-name">Launch a facebook campaign to raise awareness about the amazon</div>
            <div className="requested-amount">
              Requested amount <div className="amount">500$</div>
            </div>
          </div>
          <div className="line"></div>
        </div>
        <div className="down-side">
          <p className="description">
            Hello, my name is Neville and I am the owner of the marketing agency MZ Studio and I propose to create a FB
            campaign to attract more members. This is divided into 3 steps: 1. Page Creation 2. Advertising 3.
            Administration and Management I can undertake all the work required and have it up and running within a
            week.
          </p>
        </div>
      </div>
      <div className="right-side">
        <div className="chat-wrapper">
          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>

          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>

          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>

          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>
          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>
          <div className="message-wrapper">
            <div className="icon-wrapper">DS</div>
            <div className="message-text">
              <div className="message-name">Denis Stetskov</div>
              <div className="message-content">
                I’ve worked with Neville. He is super professional and creative, we are lucky to have you here! I’ve
                worked with Neville. He is super professional and creative, we are lucky to have you here!
              </div>
            </div>
            <div className="time-wrapper">12.03.21, 14:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
