import React from 'react';
import { Text, Keyboard, Modal, Spacer, useTheme } from '@geist-ui/react';

export const SearchEverywhere = () => {
  const { palette } = useTheme();

  const [open, setOpen] = React.useState<boolean>();

  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === 'KeyK') {
        event.preventDefault();

        onOpen();
      } else if (event.key === 'Escape') {
        event.preventDefault();

        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyboardEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, []);


  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={onClose}>
        <Modal.Content
          style={{
            padding: '0 2rem'
          }}
        >
          <Text h1>Search</Text>

          <p>Full search is coming soon.</p>
        </Modal.Content>
      </Modal>

      <div
        onClick={onOpen}
        style={{
          border: `solid 1px ${palette.border}`,
          display: 'flex',
          alignItems: 'center',
          height: '40px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        <Text
          style={{
            margin: '0 10px',
            color: palette.accents_4
          }}
        >Search</Text>

        <Spacer x={7}/>

        <div style={{ margin: '0 3px' }}>
          <Keyboard command>K</Keyboard>
        </div>
      </div>
    </React.Fragment>
  );
};