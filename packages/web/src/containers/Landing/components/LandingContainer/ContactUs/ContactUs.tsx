import React, { useState } from "react";
import "./index.scss";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="contact-us-wrapper">
      <div className="title">
        <h1>Contact us</h1>
      </div>
      <div className="form-wrapper">
        <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} />
        <textarea placeholder="What's on your mind?" onChange={(e) => setDescription(e.target.value)} />
        <button className="button-blue" disabled={!name || !email || !description}>
          Send
        </button>
      </div>
    </div>
  );
}
