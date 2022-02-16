import { sendEmail } from "@/containers/Landing/store/actions";
import { EmailType } from "@/shared/interfaces/SendEmail";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../../../shared/components";
import { CONTACT_EMAIL } from "../../../../../shared/constants";
import "./index.scss";

export default function ContactUs() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(() => {
    setSending(true);
    dispatch(sendEmail.request({
      payload: {
        receiver: email,
        type: EmailType.ContactUsAdmin,
        text: description
      },
      callback: (error) => {
        if (error) {
          console.error(error?.message);
          return;
        }
        console.log("success");
      }
    }))
  }, [dispatch, email, description])

  return (
    <div className="contact-us-wrapper">
      <div className="title">
        <h1>Contact us</h1>
        <div className="email-wrapper">
          <img src={"/icons/email.svg"} alt="envelope" />
          <a href={`mailto:${CONTACT_EMAIL}`}>hi@common.io</a>
        </div>
      </div>
      <div className="form-wrapper">
        <input disabled={sending} type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
        <input disabled={sending} type="email" placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} />
        <textarea disabled={sending} placeholder="Notes" onChange={(e) => setDescription(e.target.value)} />
        <Button
          className="send"
          disabled={!name || !email || !description || sending}
          onClick={handleSend}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
