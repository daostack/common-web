import React from 'react';

import { Modal, Text } from '@geist-ui/react';

interface ICreateBankAccountModalProps {
  open: boolean;

  onCreated?: (bankAccountId: string) => void;
  onAbondon?: () => void;
}

export const CreateBankAccount: React.FC<ICreateBankAccountModalProps> = ({ open, onCreated, onAbondon }) => {
  return (
    <Modal open={open} onClose={onAbondon} width="800px">
      <div style={{ textAlign: 'start' }}>
        <Text h2>Create new bank account</Text>
      </div>

      <Modal.Action passive onClick={onAbondon}>Cancel</Modal.Action>
      <Modal.Action loading>Create</Modal.Action>
    </Modal>
  );
};

