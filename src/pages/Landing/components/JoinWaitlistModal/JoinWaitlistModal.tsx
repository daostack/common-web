import React, { FC, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Api } from "@/services";
import { Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { TextField } from "@/shared/components/Form/Formik";
import { ApiEndpoint } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { EmailType } from "@/shared/interfaces/SendEmail";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import styles from "./JoinWaitlistModal.module.scss";

interface JoinWaitlistFormValues {
  email: string;
}

const INITIAL_VALUES: JoinWaitlistFormValues = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const JoinWaitlistModal: FC<Pick<ModalProps, "isShowing" | "onClose">> = ({
  isShowing,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [errorText, setErrorText] = useState("");

  const onSubmit = async (values: JoinWaitlistFormValues) => {
    setLoading(true);
    setErrorText("");

    /**
     * We use the SendEmail endpoint here.
     * The new form requires only 'email' so we give temporary values in the other fields
     * to satisfy the request body.
     */
    try {
      await Api.post(ApiEndpoint.SendEmail, {
        senderEmail: values.email,
        senderName: "JoinWaitlist",
        text: "Join Waitlist",
        type: EmailType.ContactUsAdmin,
      });
      setLoading(false);
      setJoined(true);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setErrorText("Something went wrong...");
    }
  };

  const handleClose = () => {
    setJoined(false);
    setErrorText("");
    onClose();
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={handleClose}
      mobileFullScreen
      className={styles.modal}
    >
      <div className={styles.title}>Join Waitlist</div>
      <div className={styles.subTitle}>
        Add your email and we will back to you soon
      </div>

      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <TextField
            required
            id="email"
            name="email"
            label="email"
            placeholder="example@email.com"
            disabled={loading || joined}
          />

          <Button
            type="submit"
            disabled={loading || joined}
            className={styles.sendButton}
            variant={ButtonVariant.PrimaryPink}
          >
            {loading ? "Sending..." : joined ? "Joined waiting list" : "Send"}
          </Button>
        </Form>
      </Formik>
      {errorText && <ErrorText className={styles.error}>{errorText}</ErrorText>}
    </Modal>
  );
};

export default JoinWaitlistModal;
