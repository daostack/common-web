import React from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Breadcrumbs, Text, Spacer, Table, Tooltip, Button, useTheme, Grid, Card } from '@geist-ui/react';
import { Circle, Home, User, ExternalLink, CheckInCircleFill } from '@geist-ui/react-icons';

import { Link } from '@components/Link';
import { Centered } from '@components/Centered';
import { HasPermission } from '@components/HasPermission';
import { withPermission } from '../../../helpers/hoc/withPermission';
import { gql } from '@apollo/client';
import { usePayoutsPageDataQuery, PayoutsPageDataQueryResult } from '@core/graphql';
import Skeleton from 'react-loading-skeleton';
import { FullWidthLoader } from '@components/FullWidthLoader';


const PayoutDueProposals = gql`
  query PayoutsPageData {
    proposals(
      fundingWhere: {
        fundingState: Eligible
      }
    ) {
      id

      userId
      commonId

      title
      description

      funding {
        amount
      }
    }

    payouts(where: {
      status: {
        in: [
          PendingApproval
          CirclePending
        ]
      }
    }) {
      id

      amount

      createdAt
      updatedAt

      description
    }
  }
`;

const PayoutsPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();

  const { data, loading } = usePayoutsPageDataQuery();

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
    const proposals = data?.proposals || [];

    let sum = 0;

    proposals.forEach((proposal) => {
      if (selectedProposals.includes(proposal.id)) {
        sum += proposal?.funding?.amount;
      }
    });

    return (sum ? sum / 100 : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const toggleSelectedProposal = (proposalId: string, showUserMismatch: boolean = false): void => {
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
      pathname: '/financials/payouts/create/batch',
      query: {
        selectedProposals
      }
    });
  };

  // --- Transformers

  const transformFundingRequestForTable = (data: PayoutsPageDataQueryResult['data']) => {
    if (!data) {
      return Array(10).fill({
        checkbox: FullWidthLoader,
        title: FullWidthLoader,
        funding: FullWidthLoader,
        actions: FullWidthLoader
      });
    }

    const { proposals } = data;

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

      title: proposal.title,

      funding: (proposal.funding.amount / 100)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),

      actions: (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip text="See user's profile" enterDelay={1000}>
            <Link to={`/users/details/${proposal.userId}`} Icon={User}/>
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

  const transformPayoutsForTable = (data: PayoutsPageDataQueryResult['data']) => {
    if (!data) {
      return Array(10).fill({
        id: FullWidthLoader,
        amount: FullWidthLoader,
        status: FullWidthLoader,
        actions: FullWidthLoader
      });
    }

    const { payouts } = data;

    return payouts.map((p) => ({
      id: p.id,

      amount: (p.amount / 100)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),

      status: p.status,

      actions: (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip text="See payout's details" enterDelay={1000}>
            <Link to={`/financials/payouts/details/${p.id}`} Icon={ExternalLink}/>
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
            <Link to="/financials">Financials</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/financials/payouts">Payouts</Link>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>

      <React.Fragment>
        <Text h3>Payouts in a nutshell</Text>

        <Grid.Container gap={2} alignItems="stretch" style={{ display: 'flex' }}>
          <Grid sm={24} md={12}>
            <Card hoverable>
              {data && (
                <Text h1>
                  {data.payouts.length}
                </Text>
              )}

              {!data && (
                <Skeleton height={75}/>
              )}

              <Text p>Pending payouts</Text>
            </Card>
          </Grid>

          <Grid sm={24} md={12}>
            <Card hoverable>
              {data && (
                <Text h1>
                  {data.proposals.length}
                </Text>
              )}

              {!data && (
                <Skeleton height={75}/>
              )}

              <Text p>Funding request for payout</Text>
            </Card>
          </Grid>
        </Grid.Container>

        <Spacer y={2}/>
      </React.Fragment>


      <React.Fragment>
        <Text h3>Funding request ready for payout</Text>

        <Table data={transformFundingRequestForTable(data)}>
          <HasPermission permission="admin.financials.payouts.create">
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


        {!loading && (
          <React.Fragment>
            {data?.proposals?.length ? (
              <HasPermission permission="admin.financials.payouts.create">
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

                <Spacer y={5}/>
              </Centered>
            )}
          </React.Fragment>
        )}
      </React.Fragment>

      <Spacer/>

      <React.Fragment>
        <Text h3>Payouts</Text>

        <Table data={transformPayoutsForTable(data)}>
          <Table.Column prop="id" label="Payout ID" width={350}/>
          <Table.Column prop="amount" label="Payout amount"/>
          <Table.Column prop="status" label="Status"/>
          <Table.Column prop="actions" width={100}>
            <Centered>
              <Text>Actions</Text>
            </Centered>
          </Table.Column>
        </Table>

        {(!data?.payouts?.length && !loading) && (
          <Centered>
            <Text>No payouts found</Text>
          </Centered>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};

export default withPermission('admin.financials.payouts.*', {
  redirect: true
})(PayoutsPage);