import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../../../shared/components";
import { CONTACT_EMAIL } from "../../../../../shared/constants";
import { EmailType } from "../../../../../shared/interfaces/SendEmail";
import { sendEmail } from "../../../store/actions";
import "./index.scss";

export default function ContactUs() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = useCallback(() => {
    setSending(true);
    setError("");
    dispatch(sendEmail.request({
      payload: {
        receiver: email,
        type: EmailType.ContactUsAdmin,
        text: description
      },
      callback: (error: Error | null) => {
        if (error) {
          setError(error?.message ?? "Something went wrong :/");
          setSending(false);
          console.error(error?.message);
          return;
        }
        setSending(false);
        // TODO: need to show success. There is no design for that.
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
        {error && <span className="error-message">{error}</span>}
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
