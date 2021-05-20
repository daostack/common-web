import React from 'react';
import { Text, Keyboard, Modal, Spacer, useTheme, Input, Tabs, Spinner } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import { gql } from '@apollo/client';
import { useCommonSearchLazyQuery } from '@core/graphql';

const CommonSearch = gql`
  query commonSearch($where: CommonWhereInput) {
    commons(where: $where) {
      id

      name
      description
    }
  }
`;

export const SearchEverywhere = () => {
  const { palette } = useTheme();

  const [searchCommons, { data: commons, loading: commonsLoading }] = useCommonSearchLazyQuery();

  const [scope, setScope] = React.useState<string>('all');
  const [query, setQuery] = React.useState<string>();
  const [open, setOpen] = React.useState<boolean>();

  React.useEffect(() => {
    if (query) {
      if (scope === 'commons' || scope === 'all') {
        searchCommons({
          variables: {
            where: {
              name: {
                contains: query
              }
            }
          }
        });
      }
    }
  }, [query, scope]);

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
      <Modal
        open={open}
        onClose={onClose}
        width="800px"
      >
        <Modal.Content
          style={{
            padding: '0 2rem'
          }}
        >
          <Input
            width="100%"
            icon={<Search/>}
            iconRight={
              commonsLoading && (
                <Spinner/>
              )
            }
            placeholder="Write your query"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <div
            style={{
              minHeight: '50vh'
            }}
          >
            <Tabs
              value={scope}
              onChange={setScope}
              style={{
                margin: '1rem 0'
              }}
            >
              <Tabs.Item label={<>All</>} value="all"/>
              <Tabs.Item label={<>Commons</>} value="commons"/>
              <Tabs.Item label={<>Proposals</>} value="proposals"/>
              <Tabs.Item label={<>Users</>} value="users"/>
            </Tabs>

            {!query && (
              <div
                style={{
                  height: '80%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text>Write something to search {scope}...</Text>
              </div>
            )}

            {query && commonsLoading && (
              <div
                style={{
                  height: '80%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text>Searching {scope} for {query}...</Text>
              </div>
            )}

            {query && (scope === 'commons' || scope === 'all') && (
              <React.Fragment>
                {commons?.commons?.map((c) => (
                  <div>
                    {c.name}
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
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