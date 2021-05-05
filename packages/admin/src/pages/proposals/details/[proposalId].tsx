import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';
import { Breadcrumbs, Card, Grid, Spacer, Table, Tag, Text, useTheme } from '@geist-ui/react';
import { DollarSign, Trello as Vote, Type, User } from '@geist-ui/react-icons';

import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import { useGetProposalDetailsQuery, GetProposalDetailsQueryResult } from '@core/graphql';

const GetProposalDetails = gql`
  query getProposalDetails($where: ProposalWhereUniqueInput!) {
    proposal(where: $where) {
      id

      join {
        funding
        fundingType
        paymentState
      }

      funding {
        amount
        fundingState
      }

      type

      createdAt
      updatedAt

      votesFor
      votesAgainst

      state

      user {
        id

        firstName
        lastName
      }

      common {
        members {
          userId
        }
      }

      description

      votes {
        id
      }

      #      votes {
      #        outcome
      #        voter {
      #          id
      #
      #          firstName
      #          lastName
      #        }
      #      }
    }
  }
`;

const ProposalDetailsPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();


  const data = useGetProposalDetailsQuery({
    variables: {
      where: {
        id: router.query.proposalId as string
      }
    }
  });

  const transformProposalForDetailsTable = (data) => {
    const { proposal } = data.data;
    const { user: proposer } = proposal;

    return [{
      icon: <Centered content={<User/>}/>,
      item: 'Proposer',
      value: (
        <Link to={`/users/details/${proposer.id}`}>
          {proposer.firstName} {proposer.lastName}
        </Link>
      )
    }, {
      icon: <Centered content={<Type/>}/>,
      item: 'Proposal Type',
      value: proposal.type
    }, ...(proposal.type === 'fundingRequest' ? [{
      icon: <Centered content={<DollarSign/>}/>,
      item: 'Requested amount',
      value: (
        <React.Fragment>
          {proposal.fundingRequest.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </React.Fragment>
      )
    }] : []), ...(proposal.type === 'join' ? [{
      icon: <Centered content={<DollarSign/>}/>,
      item: 'Proposed amount',
      value: (
        <React.Fragment>
          {proposal.join.funding.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </React.Fragment>
      )
    }] : [])];
  };

  const transformDataForVotesTable = (data: GetProposalDetailsQueryResult) => {
    return data.data.proposal.votes.map((vote) => {
      return {
        icon: (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Vote/>
          </div>
        ),

        voter: (
          // <Link to={`/users/details/${vote.voter.id}`}>
          //   {vote.voter.firstName} {vote.voter.lastName}
          // </Link>

          <p>-</p>
        ),

        outcome: (
          // <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          //   {vote.outcome === 'rejected' && (
          //     <XCircle color={theme.palette.error}/>
          //   )}
          //
          //   {vote.outcome === 'approved' && (
          //     <CheckInCircle color={theme.palette.success}/>
          //   )}
          // </div>
          <p>-</p>
        )
      };
    });
  };

  return (
    <React.Fragment>
      {data.data && (
        <React.Fragment>
          {/* --- Header ---  */}
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text h1>
                {data.data.proposal.description}'s details
              </Text>

              <Spacer x={1}/>

              <Tag type={data.data.proposal.state === 'Accepted' ? 'success' : 'error'}>
                {data.data.proposal.state}
              </Tag>
            </div>
            <Breadcrumbs>
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
              <Breadcrumbs.Item>
                <Link to="/proposals">Proposals</Link>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{data.data.proposal.description}</Breadcrumbs.Item>
            </Breadcrumbs>

            <Spacer y={3}/>
          </React.Fragment>

          {/* --- Vitals ---  */}
          <React.Fragment>
            <Text h3>Vitals</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {data.data.proposal.votesFor}
                  </Text>
                  <Text p>Votes for</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {data.data.proposal.votesAgainst}
                  </Text>
                  <Text p>Votes against</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    {data.data.proposal.common.members.length - data.data.proposal.votes.length}
                  </Text>
                  <Text p>Members without vote</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Details ---  */}
          <React.Fragment>
            <Text h3>Proposal Details</Text>

            <Table data={transformProposalForDetailsTable(data)}>
              <Table.Column prop="icon" width={70} label=""/>
              <Table.Column prop="item" label="Property" width={200}/>
              <Table.Column prop="value" label="Value"/>
            </Table>

            <Spacer y={2}/>
          </React.Fragment>

          {/* --- Votes ---  */}
          <React.Fragment>
            <Text h3>Votes</Text>

            <Table data={transformDataForVotesTable(data)}>
              <Table.Column prop="icon" label="" width={70}/>

              <Table.Column prop="voter" label="Voter Name"/>

              <Table.Column prop="outcome" width={100}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  Outcome
                </div>
              </Table.Column>
            </Table>

            <Spacer y={2}/>
          </React.Fragment>

        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProposalDetailsPage;