import React from 'react';

import { Modal, Text } from '@geist-ui/react';

interface ICreateBankAccountModalProps {
  open: boolean;

  onCreated?: (bankAccountId: string) => void;
  onAbandon?: () => void;
}

export const CreateBankAccount: React.FC<ICreateBankAccountModalProps> = ({ open, onCreated, onAbandon }) => {
  return (
    <Modal open={open} onClose={onAbandon} width="800px">
      <div style={{ textAlign: 'start' }}>
        <Text h2>Create new bank account</Text>
      </div>

      <Modal.Action passive onClick={onAbandon}>Cancel</Modal.Action>
      <Modal.Action loading>Create</Modal.Action>
    </Modal>
  );
};

