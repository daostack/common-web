import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useFormikContext } from "formik";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RecipientType, ScreenSize } from "@/shared/constants";
import { PlusIcon } from "@/shared/icons";
import { Edit2Icon } from "@/shared/icons";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { Common, CommonMemberWithUserInfo } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { AddRecipientModal } from "../AddRecipientModal";
import { FormValues } from "../AddRecipientModal/AddRecipientModal";
import styles from "./AddRecipient.module.scss";

export type Recipient = {
  recipient: string;
  amount: number | null;
  currency: string | null;
  goalOfPayment: React.ReactNode;
  edit: React.ReactNode;
};

const defaultData: Recipient[] = [
  {
    recipient: "",
    amount: null,
    currency: null,
    goalOfPayment: null,
    edit: null,
  },
];

const columnHelper = createColumnHelper<Recipient>();

const baseColumns = [
  columnHelper.accessor("recipient", {
    header: () => "Recipient",
    cell: (info) => info.getValue(),
    size: 160,
  }),
  columnHelper.accessor("amount", {
    id: "amount",
    header: () => "Amount",
    cell: (info) => info.getValue(),
    size: 70,
  }),
];

const dekstopColumns = [
  columnHelper.accessor("currency", {
    header: () => "Currency",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    size: 70,
  }),
  columnHelper.accessor("goalOfPayment", {
    header: () => "Goal of payment",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("edit", {
    header: () => "",
    cell: (info) => info.renderValue(),
  }),
];

const AddRecipient: FC = () => {
  const { setFieldValue } = useFormikContext<NewProposalCreationFormValues>();
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState(() => [...defaultData]);
  const [recipientData, setRecipientData] = useState<FormValues>();
  const screenSize = useSelector(getScreenSize());
  const isDesktopView = screenSize === ScreenSize.Desktop;

  const columns = isDesktopView
    ? baseColumns.concat(dekstopColumns)
    : baseColumns;

  const isFilledTable = !!recipientData;
  const iconEl = <PlusIcon className={styles.icon} strokeWidth={2} />;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = (values: FormValues) => {
    const recipient =
      values.recipientType === RecipientType.Member
        ? `${(values.recipient as CommonMemberWithUserInfo).user.firstName} ${
            (values.recipient as CommonMemberWithUserInfo).user.lastName
          }`
        : (values.recipient as Common).name;
    const recipientId = (
      values.recipientType === RecipientType.Member
        ? (values.recipient as CommonMemberWithUserInfo).user.uid
        : (values.recipient as { id: string }).id
    ) as string;

    setRecipientData(values);
    setData([
      {
        recipient,
        amount: values.amount ?? 0,
        currency: values.currency!.label,
        goalOfPayment: (
          <div className={styles.goalCell}>{values.goalOfPayment}</div>
        ),
        edit: <Edit2Icon className={styles.editIcon} />,
      },
    ]);
    setFieldValue("recipientInfo", {
      goalOfPayment: values.goalOfPayment,
      currency: values.currency?.label,
      amount: values.amount,
      recipientType: values.recipientType,
      recipientId,
    });
    setOpen(false);
  };

  const handleOpen = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={styles.tableHeader} key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tableBody}>
          {table.getRowModel().rows.map((row) => (
            <tr
              className={isFilledTable ? styles.clickableRow : ""}
              key={row.id}
              onClick={isFilledTable ? handleOpen : undefined}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td className={styles.tableCell} key={cell.id}>
                  {index === 0 && !cell.getValue() ? (
                    <Button
                      className={styles.addRecipientButton}
                      onClick={handleOpen}
                      variant={ButtonVariant.PrimaryPink}
                      size={ButtonSize.Medium}
                      leftIcon={iconEl}
                    >
                      Add recipient
                    </Button>
                  ) : (
                    <>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <AddRecipientModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initData={recipientData}
      />
    </div>
  );
};

export default AddRecipient;
