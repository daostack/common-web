import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';
import { Trash2 as Trash } from '@geist-ui/react-icons';
import {
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Note,
  Select,
  Spacer,
  Text,
  Tooltip,
  useTheme,
  useToasts
} from '@geist-ui/react';

import { Link } from '@components/Link';
import { withPermission } from '../../../../helpers/hoc/withPermission';
import { CreateBankAccount } from '@components/modals/CreateBankAccountModal';
import {
  useGetProposalsSelectedForBatchQuery,
  useAvailableWiresLazyQuery,
  useCreatePayoutMutation
} from '@core/graphql';

const BatchQuery = gql`
  query getProposalsSelectedForBatch($where: ProposalWhereInput!) {
    proposals(
      where: $where
    ) {
      id

      state

      user {
        id
        firstName
        lastName
      }

      title
      description

      common {
        name
      }

      funding {
        fundingState
        amount
      }
    }
  }
`;

const AvailableWiresQuery = gql`
  query availableWires($where: WireWhereInput!) {
    wires(where: $where) {
      id
      description
    }
  }
`;

const CreatePayout = gql`
  mutation createPayout($input: CreatePayoutInput!) {
    createPayout(input: $input) {
      id
    }
  }
`;

const CreateBatchPayoutPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const [toasts, setToast] = useToasts();

  const [createPayout, { loading: creatingPayout }] = useCreatePayoutMutation();
  const [getWires, { data: wires }] = useAvailableWiresLazyQuery();
  const data = useGetProposalsSelectedForBatchQuery({
    pollInterval: 5 * 1000,
    variables: {
      where: {
        id: {
          in: router.query.selectedProposals as string[]
        }
      }
    }
  });


  // --- State
  const [userIds, setUserIds] = React.useState<string[]>([]);
  const [selectedWire, setSelectedWire] = React.useState<string>();
  const [removedProposals, setRemovedProposals] = React.useState<string[]>([]);

  // --- Actions
  const onWireSelected = (wireId: string): void => {
    setSelectedWire(wireId);
  };

  // --- Helper
  const getSelectedProposals = () => {
    return data?.data?.proposals?.filter(p => !removedProposals.includes(p.id)) || [];
  };

  const isExecuteDisabled = (): boolean => {
    return (!selectedWire || selectedWire === 'create') || data.data.proposals.some(p => p.funding.fundingState !== 'Eligible');
  };

  // --- Effects
  React.useEffect(() => {
    if (data.data) {
      const temp: string[] = [];

      data.data.proposals.map(x => temp.push(x.user?.id));

      setUserIds(Array.from(new Set(temp)));
    }
  }, [data]);

  React.useEffect(() => {
    if (userIds.length) {
      getWires({
        variables: {
          where: {
            userId: {
              in: userIds
            }
          }
        }
      });
    }
  }, [userIds]);

  // --- Actions

  const onRemoveProposal = (proposalId: string): () => void => {
    return () => {
      setRemovedProposals((prev) => {
        if (data.data.proposals.filter(p => !prev.includes(p.id)).length === 1) {
          setToast({
            text: 'Cannot remove the last proposal!'
          });

          return prev;
        }

        if (prev.includes(proposalId)) {
          return (prev.filter(p => p !== proposalId));
        } else {
          return [
            ...prev,
            proposalId
          ];
        }
      });
    };
  };

  const onExecute = async () => {
    try {
      const res = await createPayout({
        variables: {
          input: {
            wireId: selectedWire,
            proposalIds: getSelectedProposals().map(p => p.id)
          }
        }
      });

      setToast({
        text: 'Payout executed',
        delay: 4000
      });

      await router.push({
        pathname: `/financials/payouts/details/${res.data.createPayout.id}`
      });
    } catch (e) {
      setToast({
        type: 'error',
        text: 'An error occurred and the payout was not executed'
      });

      console.error(e);
    }
  };

  return (
    <React.Fragment>
      <CreateBankAccount
        open={selectedWire === 'create'}
        onAbondon={() => setSelectedWire(null)}
      />

      {/* --- Header --- */}
      <React.Fragment>
        <Text h1>Create batch payout</Text>
        <Breadcrumbs>
          <Breadcrumbs.Item>
            Home
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            <Link to="/payouts">Payouts</Link>
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            Create
          </Breadcrumbs.Item>

          <Breadcrumbs.Item>
            Batch
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <Spacer y={2}/>
      </React.Fragment>

      {data.data && (
        <React.Fragment>
          <React.Fragment>
            <Text h3>Bank details</Text>

            <Select
              width="100%"
              value={selectedWire}
              onChange={onWireSelected}
              placeholder="Please, select bank account"
            >
              {wires ? (
                <Select.Option value="create">
                  Create new bank account
                </Select.Option>
              ) : (
                <Select.Option disabled>
                  Loading...
                </Select.Option>
              )}

              {wires && wires.wires.map((wire) => (
                <Select.Option value={wire.id} key={wire.id}>
                  {wire.description}
                </Select.Option>
              ))}
            </Select>

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Selected proposals for payout</Text>

            {getSelectedProposals().map((proposal) => (
              <Card key={proposal.id} style={{ margin: '20px 0' }}>
                <Grid.Container>
                  <Grid xs={20}>
                    <Text h3 style={{ marginBottom: 0 }}>{proposal.description.title}</Text>
                    <Text b>
                      {(proposal.funding.amount / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })}
                    </Text>
                  </Grid>

                  <Grid xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {data.data.proposals.filter(p => !removedProposals.includes(p.id)).length > 1 ? (
                      <Tooltip text="Remove the selected proposal from the payout">
                        <div style={{ cursor: 'pointer' }} onClick={onRemoveProposal(proposal.id)}>
                          <Trash/>
                        </div>
                      </Tooltip>
                    ) : (
                      <div style={{ cursor: 'not-allowed' }} onClick={onRemoveProposal(proposal.id)}>
                        <Trash/>
                      </div>
                    )}
                  </Grid>
                </Grid.Container>


                <Text p>{proposal.description}</Text>

                {proposal.funding.fundingState !== 'Eligible' && (
                  <Note type="error">
                    The funding proposal is not longer eligible for payout. The current funding state of the proposal
                    is{' '}
                    <b>{proposal.funding.fundingState}</b>
                  </Note>
                )}
              </Card>
            ))}

            <Spacer y={2}/>
          </React.Fragment>

          {userIds.length > 1 && (
            <Note type="warning">
              There are proposals from more than one user in the current payout!
            </Note>
          )}

          <Spacer y={.5}/>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={onExecute}
              loading={creatingPayout}
              disabled={isExecuteDisabled()}
            >
              Create payout
            </Button>
          </div>
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default withPermission('admin.financials.payouts.create', {
  redirect: true
})(CreateBatchPayoutPage);