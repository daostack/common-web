import React, { FC, useState } from "react";
import { useFormikContext } from "formik";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RecipientType } from "@/shared/constants";
import { PlusIcon } from "@/shared/icons";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { AddRecipientModal } from "../AddRecipientModal";
import styles from "./AddRecipient.module.scss";

export type Recipient = {
  recipient: string;
  amount: number | null;
  currency: string | null;
  goalOfPayment: string;
};

const defaultData: Recipient[] = [
  {
    recipient: "",
    amount: null,
    currency: null,
    goalOfPayment: "",
  },
];

const columnHelper = createColumnHelper<Recipient>();

const columns = [
  columnHelper.accessor("recipient", {
    header: () => "Recipient",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    id: "amount",
    header: () => "Amount",
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("currency", {
    header: () => "Currency",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("goalOfPayment", {
    header: () => "Goal of payment",
    cell: (info) => info.renderValue(),
  }),
];

const AddRecipient: FC = () => {
  const { setFieldValue } = useFormikContext<NewProposalCreationFormValues>();
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState(() => [...defaultData]);
  const iconEl = <PlusIcon className={styles.icon} strokeWidth={2} />;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = (
    values: Recipient,
    recipientId: string,
    recipientType: RecipientType,
  ) => {
    setData([values]);
    setFieldValue("recipientInfo", {
      goalOfPayment: values.goalOfPayment,
      currency: values.currency,
      amount: values.amount,
      recipientType,
      recipientId,
    });
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td key={cell.id}>
                  {index === 0 && !cell.getValue() ? (
                    <Button
                      className={styles.addRecipientButton}
                      onClick={handleOpen}
                      variant={ButtonVariant.PrimaryPurple}
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
      />
    </div>
  );
};

export default AddRecipient;
