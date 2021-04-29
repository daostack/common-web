import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import { gql } from '@apollo/client';
import {
  Spacer,
  Text,
  Grid,
  Card,
  Breadcrumbs,
  Table,
  Tag,
  Pagination,
  Tooltip,
  useClipboard,
  useToasts
} from '@geist-ui/react';
import {
  ChevronLeftCircleFill,
  ChevronRightCircleFill,
  ExternalLink,
  User,
  Copy,
  Trash2 as Trash
} from '@geist-ui/react-icons';

import { Link } from 'components/Link';
import { CommonSettings } from '@components/CommonSettings';

const GetCommonDetailsQuery = gql`
  query getCommonDetails($commonId: ID!, $page: Int!) {
    common(where: {
      id: $commonId
    }) {
      name

      createdAt
      updatedAt

      balance
      raised

      members {
        createdAt
        userId

        user {
          firstName
          lastName
        }
      }

      proposals {
        id

        type


        fundingRequest {
          amount
        }

        join {
          fundingType
          funding
        }

        description {
          description
        }
      }
    }
  }
`;

const CommonDetailsPage: NextPage = () => {
  // State
  const [membersPage, setMembersPage] = React.useState<number>(1);
  const [proposalsPage, setProposalsPage] = React.useState<number>(1);

  // Hooks
  const router = useRouter();
  const clipboard = useClipboard();
  const [_, setToast] = useToasts();
  const data = useGetCommonDetailsQuery({
    variables: {
      commonId: router.query.commonId as string || '',
      page: proposalsPage
    }
  });

  // Helpers
  const getPagesCount = (array: any[], perPage = 10): number => {
    return Math.ceil(array.length / perPage);
  };

  const transformMembersForTable = (data: GetCommonDetailsQueryResult) => {
    const common = data.data.common;
    const members = data.data.common.members
      .slice((membersPage - 1) * 10, 10);

    return members.map((member) => ({
      userId: (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Tooltip text={member.userId}>
            <User/>
          </Tooltip>
        </div>
      ),
      joinedAt: member.joinedAt
        ? new Date(member.joinedAt).toLocaleDateString()
        : 'No data available',
      name: `${member.user.firstName} ${member.user.lastName[0]}.`,
      roles: (
        <React.Fragment>
          {member.userId === common.metadata.founderId && (
            <Tag>
              Founder
            </Tag>
          )}
        </React.Fragment>
      ),

      actions: (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip text={'Copy user ID'} enterDelay={1000}>
            <div onClick={copyUserId(member.userId)}>
              <Copy/>
            </div>
          </Tooltip>

          <Tooltip text={'Go to user\'s profile'} enterDelay={1000}>
            <Link to={`/users/details/${member.userId}`} Icon={ExternalLink}/>
          </Tooltip>

          <Tooltip text={'Remove user from the common'} enterDelay={1000}>
            <Link to={``} Icon={Trash}/>
          </Tooltip>
        </div>
      )
    }));
  };

  const transformProposalsForTable = (data: GetCommonDetailsQueryResult) => {
    const proposals = data.data.common.proposals;

    return proposals.map((proposal) => ({
      id: proposal.id,

      description: proposal.description,

      type: proposal.type === 'fundingRequest' ? (
        <Tag type="success">Funding Request</Tag>
      ) : (
        <Tag type="warning">Join Request</Tag>
      ),

      actions: (
        <React.Fragment>
          <React.Fragment>
            <Tooltip text={'Go to proposal\'s details'} enterDelay={1000}>
              <Link to={`/proposals/details/${proposal.id}`} Icon={ExternalLink}/>
            </Tooltip>
          </React.Fragment>
        </React.Fragment>
      )
    }));
  };

  // Actions

  const onMembersPageChange = (val: number): void => {
    setMembersPage(val);
  };

  const copyUserId = (userId: string): () => void => {
    return () => {
      clipboard.copy(userId);

      setToast({
        text: 'Successfully copied the user ID'
      });
    };
  };

  return (
    <React.Fragment>
      <Spacer y={1}/>

      {data.error && data.error.message.includes('Cannot find common with identifier') && (
        <ErrorPage
          statusCode={404}
          title="Cannot find the requested common"
        />
      )}

      {data.data && (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text h1>
              {data.data.common.name}'s details
            </Text>

            <Spacer x={1}/>

            <Tag>{data.data.common.metadata.contributionType}</Tag>

            <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
              {router.query.commonId && (
                <CommonSettings commonId={router.query.commonId as string}/>
              )}
            </div>
          </div>
          <Breadcrumbs>
            <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Link to="/commons">Commons</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>[{data.data.common.name}]</Breadcrumbs.Item>
          </Breadcrumbs>

          <Spacer y={3}/>

          <React.Fragment>
            <Text h3>Vitals</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {(data.data.common.members.length)}
                  </Text>
                  <Text p>Members</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {data.data.common.openJoinRequests}
                  </Text>
                  <Text p>Open join request</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {data.data.common.openFundingRequests}
                  </Text>
                  <Text p>Open funding request</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Common Details</Text>

            <Table data={[
              { item: 'Created At', value: new Date(data.data.common.createdAt).toLocaleString() },
              { item: 'Updated At', value: new Date(data.data.common.updatedAt).toLocaleString() },
              { item: 'Byline', value: data.data.common.metadata.byline },
              { item: 'Description', value: data.data.common.metadata.description },
              { item: 'Founder', value: data.data.common.metadata.founderId }
            ]}>
              <Table.Column prop="item" label="Property" width={200}/>
              <Table.Column prop="value" label="Value"/>
            </Table>

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Financials</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1>
                    {(data.data.common.balance / 100)
                      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                  <Text p>Current common balance</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1>
                    {(data.data.common.raised / 100)
                      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Text>
                  <Text p>Total raised by the common</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Members</Text>

            <Table data={transformMembersForTable(data)}>
              <Table.Column prop="userId" label="" width={70}/>
              <Table.Column prop="name" label="Member Name"/>
              <Table.Column prop="joinedAt" label="Joined At"/>
              <Table.Column prop="roles" label="Roles"/>
              <Table.Column prop="actions" label="Actions" width={100}/>
            </Table>

            {getPagesCount(data.data.common.members) > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Pagination count={getPagesCount(data.data.common.members)} onChange={onMembersPageChange}>
                  <Pagination.Next><ChevronRightCircleFill/></Pagination.Next>
                  <Pagination.Previous><ChevronLeftCircleFill/></Pagination.Previous>
                </Pagination>
              </div>
            )}

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Proposals</Text>

            {(proposalsPage === 1 && data.data.common.proposals.length === 0) ? (
              <Text p>The common has no proposals</Text>
            ) : (
              <React.Fragment>
                <Table data={transformProposalsForTable(data)}>
                  <Table.Column prop="id" label="Proposal ID"/>
                  <Table.Column prop="type" label="Proposal Type"/>
                  <Table.Column prop="actions" label="Actions" width={100}/>
                </Table>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  height: 40
                }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => {
                    if (proposalsPage > 1) {
                      setProposalsPage(proposalsPage - 1);
                    }
                  }}>
                    <ChevronLeftCircleFill color="primary"/>
                  </div>

                  <Text style={{ margin: '0 15px' }}>
                    Page {proposalsPage}
                  </Text>

                  <div style={{ cursor: 'pointer' }} onClick={() => {
                    if (data.data.common.proposals.length === 10) {
                      setProposalsPage(proposalsPage + 1);
                    }
                  }}>
                    <ChevronRightCircleFill/>
                  </div>

                </div>
              </React.Fragment>
            )}

            <Spacer y={2}/>
          </React.Fragment>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CommonDetailsPage;