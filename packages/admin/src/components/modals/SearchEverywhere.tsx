import React from 'react';
import { Text, Keyboard, Modal, Spacer, useTheme, Input, Tabs, Spinner, useInput } from '@geist-ui/react';
import { Search } from '@geist-ui/react-icons';
import { gql } from '@apollo/client';
import { useCommonSearchLazyQuery, useUserSearchLazyQuery, useProposalSeachLazyQuery } from '@core/graphql';
import { useRouter } from 'next/router';
import { SearchResultProps, SearchResult } from '@components/SearchResult';

const CommonSearch = gql`
  query commonSearch($where: CommonWhereInput) {
    commons(where: $where) {
      id

      name
      description
    }
  }
`;

const UserSearch = gql`
  query userSearch($where: UserWhereInput) {
    users(where: $where) {
      id

      email

      firstName
      lastName
    }
  }
`;

const ProposalSearch = gql`
  query proposalSeach($where: ProposalWhereInput) {
    proposals(where: $where) {
      id

      title
      description

      type
    }
  }
`;

export const SearchEverywhere = () => {
  const { palette } = useTheme();
  const router = useRouter();

  const { state: query, setState: setQuery, bindings } = useInput('');


  const [searchUsers, { data: users, loading: usersLoading }] = useUserSearchLazyQuery();
  const [searchCommons, { data: commons, loading: commonsLoading }] = useCommonSearchLazyQuery();
  const [searchProposals, { data: proposals, loading: proposalsLoading }] = useProposalSeachLazyQuery();

  const [results, setResults] = React.useState<SearchResultProps[]>([]);
  const [scope, setScope] = React.useState<string>('all');
  const [open, setOpen] = React.useState<boolean>();
  const [selected, setSelected] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      if (query && !query.startsWith('/')) {
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

        if (scope === 'proposals' || scope === 'all') {
          searchProposals({
            variables: {
              where: {
                OR: [{
                  title: {
                    contains: query
                  }
                }, {
                  description: {
                    contains: query
                  }
                }]
              }
            }
          });
        }

        if (scope === 'users' || scope === 'all') {
          searchUsers({
            variables: {
              where: {
                OR: [{
                  firstName: {
                    contains: query
                  }
                }, {
                  lastName: {
                    contains: query
                  }
                }, {
                  email: {
                    contains: query
                  }
                }]
              }
            }
          });
        }
      }
    }, 500);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(timer);
    };
  }, [query, scope]);

  React.useEffect(() => {
    const res: SearchResultProps[] = [];

    if (!query.startsWith('/')) {
      if (scope === 'all' || scope === 'commons') {
        commons?.commons?.map(c => {
          res.push({
            type: 'common',
            data: {
              id: c.id,

              title: `Common ${c.name}`,
              subtitle: c.description || 'This common has no description'
            }
          });
        });
      }

      if (scope === 'all' || scope === 'users') {
        users?.users?.map(u => {
          res.push({
            type: 'user',
            data: {
              id: u.id,

              title: `User ${u.firstName} ${u.lastName}`,
              subtitle: u.email
            }
          });
        });
      }

      if (scope === 'all' || scope === 'proposals') {
        proposals?.proposals?.map(p => {
          res.push({
            type: 'proposal',
            data: {
              id: p.id,

              title: p.title,
              subtitle: `Proposal of type ${p.type}`
            }
          });
        });
      }
    }

    setResults(res.sort(() => (Math.random() > .5) ? 1 : -1));
  }, [commons, users, proposals, scope]);

  React.useEffect(() => {
    setLoading(
      commonsLoading ||
      proposalsLoading ||
      usersLoading
    );
  });

  React.useEffect(() => {
    setSelected(0);
  }, [query]);


  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();

        setSelected((ps) => {
          if (ps === 0) {
            return results.length - 1;
          } else {
            return ps - 1;
          }
        });
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        setSelected((ps) => {
          if (ps === (results.length - 1)) {
            return 0;
          } else {
            return ps + 1;
          }
        });
      }

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

  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (query.startsWith('/')) {
          event.preventDefault();

          if (query.startsWith('/c')) {
            setScope('commons');
            setQuery('');
          }

          if (query.startsWith('/u')) {
            setScope('users');
            setQuery('');
          }

          if (query.startsWith('/p')) {
            setScope('proposals');
            setQuery('');
          }

          if (query.startsWith('/a')) {
            setScope('all');
            setQuery('');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyboardEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [query]);


  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSelected(0);
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
            autoFocus
            width="100%"
            icon={<Search/>}
            iconRight={
              (loading && query) && (
                <Spinner/>
              )
            }
            placeholder="Write your query"
            {...bindings}
          />

          <div
            style={{
              marginTop: '1rem',
              height: '50vh',
              overflow: 'auto'
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

            {query && results && results
              .map((r, i) => (
                <SearchResult {...r} selected={i === selected} onNavigate={onClose} key={r.data.id}/>
              ))}
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
        >
          Search
        </Text>

        <Spacer x={7}/>

        <div style={{ margin: '0 3px' }}>
          <Keyboard command>K</Keyboard>
        </div>
      </div>
    </React.Fragment>
  );
};