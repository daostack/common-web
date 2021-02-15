import React from 'react';
import { NextPage } from 'next';

import { Breadcrumbs, Text, Spacer, Grid, Card, Table, Tooltip, useTheme, Button } from '@geist-ui/react';
import { Circle, Home, User, ExternalLink, CheckInCircleFill } from '@geist-ui/react-icons';

import { Link } from '@components/Link';
import { withPermission } from '../../helpers/hoc/withPermission';
import { gql } from '@apollo/client';
import { useGetPayoutsPageDataQuery, ProposalFundingState, GetPayoutsPageDataQueryResult } from '@graphql';
import { HasPermission } from '@components/HasPermission';
import { useRouter } from 'next/router';
import { Centered } from '@components/Centered';

const PayoutsQuery = gql`
  query getPayoutsPageData($fundingState: ProposalFundingState, $fundingRequestPage: Int) {
    proposals(
      type: fundingRequest
      page: $fundingRequestPage
      fundingState: $fundingState
    ) {
      id

      commonId
      proposerId

      type
      
      description {
        title
      }

      fundingRequest {
        amount
      }

      createdAt
      updatedAt

      state
      fundingState
    }
  }
`;

const PayoutsPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();

  const data = useGetPayoutsPageDataQuery({
    variables: {
      fundingState: ProposalFundingState.Available
    }
  });

  // --- State
  const [selectedProposals, setSelectedProposals] = React.useState<string[]>([]);

  // --- Helpers
  const isSelectedProposal = (proposalId: string): boolean => {
    return selectedProposals.includes(proposalId);
  };

  const isCreatePayoutBatchButtonDisabled = (): boolean => {
    return !selectedProposals.length;
  };

  const calculateSelectedProposalsSum = (): string => {
    const proposals = data.data.proposals;
    let sum = 0;

    proposals.forEach((proposal) => {
      if (selectedProposals.includes(proposal.id)) {
        sum += proposal.fundingRequest.amount;
      }
    });

    return (sum ? sum / 100 : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const toggleSelectedProposal = (proposalId: string): void => {
    if (isSelectedProposal(proposalId)) {
      setSelectedProposals(
        selectedProposals.filter((p) => p !== proposalId)
      );
    } else {
      setSelectedProposals([
        ...selectedProposals,
        proposalId
      ]);
    }
  };

  // --- Actions
  const onProposalCheckboxClick = (proposalId: string): () => void => {
    return () => {
      toggleSelectedProposal(proposalId);
    };
  };

  const onCreateBatchPayout = () => {
    router.push({
      pathname: '/payouts/create/batch',
      query: {
        selectedProposals
      }
    });
  };

  // --- Transformers

  const transformFundingRequestForTable = (data: GetPayoutsPageDataQueryResult) => {
    const { proposals } = data.data;

    return proposals.map((proposal) => ({
      checkbox: (
        <Centered onClick={onProposalCheckboxClick(proposal.id)}>
          {isSelectedProposal(proposal.id) ? (
            <CheckInCircleFill size={20} color={theme.palette.success}/>
          ) : (
            <Circle size={20}/>
          )}
        </Centered>
      ),

      title: proposal.description.title,

      funding: (proposal.fundingRequest.amount / 100)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),

      actions: (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip text="See user's profile" enterDelay={1000}>
            <Link to={`/users/details/${proposal.proposerId}`} Icon={User}/>
          </Tooltip>

          <Tooltip text="See commons's profile" enterDelay={1000}>
            <Link to={`/commons/details/${proposal.commonId}`} Icon={Home}/>
          </Tooltip>

          <Tooltip text="See proposal's details" enterDelay={1000}>
            <Link to={`/proposals/details/${proposal.id}`} Icon={ExternalLink}/>
          </Tooltip>
        </div>
      )
    }));
  };

  return (
    <React.Fragment>
      {/* --- Header --- */}
      <React.Fragment>
        <Text h1>Payouts</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Link to="/payouts">Payouts</Link>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>

      {data.data && (
        <React.Fragment>
          <React.Fragment>
            <Text h3>Payouts in a nutshell</Text>

            <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1 type="error">
                    12
                  </Text>
                  <Text p>Pending payouts</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={12}>
                <Card hoverable>
                  <Text h1>
                    {data.data.proposals.length}
                  </Text>
                  <Text p>Funding request for payout</Text>
                </Card>
              </Grid>
            </Grid.Container>

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Funding request ready for payout</Text>

            <Table data={transformFundingRequestForTable(data)}>
              <HasPermission permission="admin.payouts.create">
                <Table.Column prop="checkbox" width={70}/>
              </HasPermission>

              <Table.Column prop="title" label="Title"/>
              <Table.Column prop="funding" label="Requested funding"/>

              <Table.Column prop="actions" width={100}>
                <Centered>
                  <Text>Actions</Text>
                </Centered>
              </Table.Column>
            </Table>

            {data.data.proposals.length ? (
              <HasPermission permission="admin.payouts.create">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Text p style={{ marginRight: 10 }}>
                    {selectedProposals.length} selected ({calculateSelectedProposalsSum()})
                  </Text>

                  <Button
                    disabled={isCreatePayoutBatchButtonDisabled()}
                    onClick={onCreateBatchPayout}
                    type="success"
                    size="small"
                  >
                    Create payout
                  </Button>
                </div>
              </HasPermission>
            ) : (
              <Centered>
                <Text>No funding proposals need funding</Text>
              </Centered>
            )}
          </React.Fragment>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withPermission('admin.payouts.*', {
  redirect: true
})(PayoutsPage);