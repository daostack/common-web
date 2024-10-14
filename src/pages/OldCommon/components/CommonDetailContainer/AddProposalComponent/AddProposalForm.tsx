import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { getBankDetails } from "@/pages/OldCommon/store/actions";
import { Button, ButtonIcon, Loader, ModalFooter } from "@/shared/components";
import {
  CurrencyInput,
  LinksArray,
  TextField,
} from "@/shared/components/Form/Formik";
import {
  URL_REGEXP,
  MAX_LINK_TITLE_LENGTH,
  AllocateFundsTo,
} from "@/shared/constants";
import { useImageSizeCheck } from "@/shared/hooks";
import DeleteIcon from "@/shared/icons/delete.icon";
import { Common, Currency } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import { uploadFile } from "@/shared/utils/firebaseUploadFile";
import { MAX_PROPOSAL_TITLE_LENGTH } from "./constants";
import { CreateFundsAllocationFormData } from "./types";

const validationSchema = Yup.object({
  description: Yup.string().required("Field required"),
  title: Yup.string()
    .required("Field required")
    .max(MAX_PROPOSAL_TITLE_LENGTH, "Title too long"),
  links: Yup.array()
    .of(
      Yup.object().shape(
        {
          title: Yup.string().when("value", (value: string) => {
            if (value) {
              return Yup.string()
                .max(MAX_LINK_TITLE_LENGTH, "Entered title is too long")
                .required("Please enter link title");
            }
          }),
          value: Yup.string().when("title", (title: string) => {
            if (title) {
              return Yup.string()
                .matches(URL_REGEXP, "Please enter correct URL")
                .required("Please enter a link");
            }
          }),
        },
        [["title", "value"]],
      ),
    )
    .required("Please add at least 1 link")
    .min(1, "Please add at least 1 link"),
});

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface AddProposalFormInterface {
  common: Common;
  saveProposalState: (payload: CreateFundsAllocationFormData) => void;
  addBankDetails: () => void;
  hidden?: boolean;
}

export const AddProposalForm = ({
  common,
  saveProposalState,
  addBankDetails,
  hidden = false,
}: AddProposalFormInterface) => {
  const dispatch = useDispatch();
  const { checkImageSize } = useImageSizeCheck();
  const [isAmountAdded, addAmountToValidation] = useState(false);
  const [showFileLoader, setShowFileLoader] = useState(false);
  const [schema, setSchema] = useState(validationSchema);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFile] = useState<
    { title: string; value: string }[]
  >([]);
  const [hasBankDetails, setHasBankDetails] = useState<boolean | null>(null);

  /**
   * For now we fetch the bank details only here.
   * It's very likely that we'll need this information somewhere else in the app
   * so maybe we can fetch this info on the app start and save it in the Redux?
   */
  useEffect(() => {
    dispatch(
      getBankDetails.request({
        callback: (error) => {
          if (error) {
            console.error(error);
            setHasBankDetails(false);
            return;
          }
          setHasBankDetails(true);
        },
      }),
    );
  }, [dispatch, hidden]);

  const [formValues] = useState<CreateFundsAllocationFormData>({
    id: "",
    discussionId: "",
    title: "",
    description: "",
    links: [{ title: "", value: "" }],
    images: [],
    amount: { amount: 0, currency: Currency.ILS },
    to: AllocateFundsTo.Proposer,
  });

  useEffect(() => {
    if (common && common.balance && !isAmountAdded) {
      const amount = Yup.object({
        amount: Yup.number().max(
          common.balance.amount / 100,
          `This amount exceeds the current balance of the Common (${formatPrice(
            common?.balance,
          )}). Please select a lower amount or wait for the Common to raise more funds.`,
        ),
      });
      const validationSchema = schema.concat(amount);
      setSchema(validationSchema);
      addAmountToValidation(true);
    }
  }, [common, schema, isAmountAdded]);

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    if (!checkImageSize(file.name, file.size)) {
      return;
    }

    setSelectedFiles((selectedFiles) => [...selectedFiles, file]);
  };

  const removeFile = (index: number) => {
    const f = [...uploadedFiles];
    f.splice(index, 1);
    setUploadedFile(f);
  };

  useEffect(() => {
    (async () => {
      if (selectedFiles.length) {
        setShowFileLoader(true);
        const files = await Promise.all(
          selectedFiles.map(async (file: File) => {
            const downloadURL = await uploadFile(file.name, "public_img", file);
            return { title: file.name, value: downloadURL };
          }),
        );

        setUploadedFile((f) => [...f, ...files]);
        setShowFileLoader(false);
        setSelectedFiles([]);
      }
    })();
  }, [selectedFiles]);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        const proposalId = uuidv4();
        const discussionId = uuidv4();
        saveProposalState({ ...values, images: uploadedFiles, id: proposalId, discussionId });
      }}
      initialValues={formValues}
      validateOnChange={true}
      validateOnBlur={false}
      validateOnMount={false}
      isInitialValid={false}
    >
      {(formikProps) => (
        <div className={classNames("add-proposal-wrapper", { hidden })}>
          <div className="common-title">{common.name}</div>
          <div className="add-proposal-title">New proposal</div>
          <div className="add-proposal-description">
            Proposals let the group to make decisions together.
          </div>
          <div className="add-proposal-form-wrapper">
            <TextField
              id="title"
              label="Title"
              name={"title"}
              placeholder={"Briefly describe your proposal"}
              value={formikProps.values.title}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              isRequired={true}
              maxLength={MAX_PROPOSAL_TITLE_LENGTH}
            />
            <div className="funding-request-wrapper">
              <div className="funding-input-wrapper">
                <CurrencyInput
                  className="funding-request-wrapper__currency-input"
                  id="funding"
                  name="amount"
                  label="Funding amount requested"
                  placeholder={formatPrice(
                    { amount: 0 },
                    {
                      shouldRemovePrefixFromZero: false,
                    },
                  )}
                />
              </div>
              <div className="funding-description">
                Leave as ₪0 if no funds are requested. <br /> Common balance:
                {formatPrice(common.balance)}
              </div>
            </div>
            {hasBankDetails === false && (
              <div className="add-bank-details-wrapper">
                <img
                  src="/icons/add-proposal/illustrations-full-page-transparent.svg"
                  alt=""
                />
                <div className="add-bank-details-content">
                  <div className="add-bank-details-content-text">
                    You must provide bank account details in order to receive
                    funds
                  </div>
                  <button onClick={addBankDetails}>Add Bank Account</button>
                </div>
              </div>
            )}
            <div className="proposal-description-wrapper">
              <TextField
                id="description"
                label="Description"
                name={"description"}
                placeholder={
                  "What exactly do you plan to do and how? How does it align with the Common's agenda and goals?"
                }
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isTextarea={true}
                isRequired
              />
            </div>
            <div className="add-additional-information">
              <div className="links-wrapper">
                <input
                  id="file"
                  type="file"
                  onChange={selectFiles}
                  accept={ACCEPTED_EXTENSIONS}
                  style={{ display: "none" }}
                />
                <div
                  className="link"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  <img
                    src="/icons/add-proposal/icons-picture.svg"
                    alt="icons-pic"
                  />
                  <span>Add image</span>
                </div>
              </div>
              <div className="additional-content-wrapper">
                <div className="files-preview">
                  {uploadedFiles.map((f, i) => (
                    <div className="file-item" key={f.value}>
                      <img src={f.value} alt={i.toString()} />
                      <ButtonIcon
                        className="file-item__remove-button"
                        onClick={() => removeFile(i)}
                      >
                        <DeleteIcon className="file-item__delete-icon" />
                      </ButtonIcon>
                    </div>
                  ))}
                  {showFileLoader && (
                    <div className="file-item">
                      <Loader />
                    </div>
                  )}
                </div>
                <div className="additional-links">
                  <LinksArray
                    name="links"
                    values={formikProps.values.links}
                    errors={formikProps.errors.links}
                    touched={formikProps.touched.links}
                    maxTitleLength={MAX_LINK_TITLE_LENGTH}
                    className="create-common-general-info__text-field"
                    itemClassName="create-common-general-info__links-array-item"
                  />
                </div>
              </div>
            </div>
            <div className="proposal-note-wrapper">
              <div className="note-title">Please note:</div>
              <div className="note-text">
                <img
                  src="/icons/add-proposal/icons-warning.svg"
                  alt="icons-warning"
                />
                Other proposals might be accepted and make the balance
                insufficient for the amount requested.
              </div>
            </div>
            {!hidden && (
              <ModalFooter sticky>
                <div className="action-wrapper">
                  <Button
                    disabled={!formikProps.isValid || !hasBankDetails}
                    onClick={formikProps.submitForm}
                  >
                    Create proposal
                  </Button>
                </div>
              </ModalFooter>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
};
