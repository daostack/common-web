import React, { FC, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Api } from "@/services";
import { Modal } from "@/shared/components";
import { TextField } from "@/shared/components/Form/Formik";
import { ApiEndpoint } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { EmailType } from "@/shared/interfaces/SendEmail";
import { Button } from "@/shared/ui-kit";
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

  const onSubmit = async (values: JoinWaitlistFormValues) => {
    setLoading(true);

    try {
      await Api.post(ApiEndpoint.SendEmail, {
        senderEmail: values.email,
        senderName: "test",
        text: "test",
        type: EmailType.ContactUsAdmin,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      <h1>Join Waitlist</h1>

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
          />

          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </Form>
      </Formik>
    </Modal>
  );
};

export default JoinWaitlistModal;
