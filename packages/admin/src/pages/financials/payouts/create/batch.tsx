import { gql } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withPermission } from '../../../../helpers/hoc/withPermission';
import { useGetProposalsSelectedForBatchQuery, Wire, useExecutePayoutMutation } from '@graphql';
import { Link } from '@components/Link';
import React from 'react';
import {
  Breadcrumbs,
  Button,
  Card,
  Divider,
  Grid,
  Note,
  Select,
  Spacer,
  Text,
  Tooltip,
  useTheme,
  useToasts
} from '@geist-ui/react';
import { Trash2 as Trash } from '@geist-ui/react-icons';

const BatchQuery = gql`
  query getProposalsSelectedForBatch($ids: [String!]!) {
    proposals(
      ids: $ids
    ) {
      id

      state
      fundingState

      proposer {
        firstName
        lastName
      }

      description {
        title
        description
      }

      common {
        name
      }

      fundingRequest {
        amount
      }
    }

    wires {
      id

      description

      billingDetails {
        city
        country
        name
      }
    }
  }
`;


const executePayout = gql`
  mutation ExecutePayout($input: ExecutePayoutInput!) {
    executePayouts(input: $input) {
      id
    }
  }
`;

const CreateBatchPayoutPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const [toasts, setToast] = useToasts();
  const [executePayout, { data: executionData, loading }] = useExecutePayoutMutation();
  const data = useGetProposalsSelectedForBatchQuery({
    pollInterval: 5 * 1000,
    variables: {
      ids: router.query.selectedProposals
    }
  });


  // --- State
  const [selectedWire, setSelectedWire] = React.useState<string>();
  const [removedProposals, setRemovedProposals] = React.useState<string[]>([]);

  // --- Actions
  const onWireSelected = (wireId: string): void => {
    setSelectedWire(wireId);
  };

  // --- Helper
  const getSelectedWire = (): Wire => {
    return data.data.wires.find((wire) => wire.id === selectedWire);
  };

  const getSelectedProposals = () => {
    return data.data.proposals.filter(p => !removedProposals.includes(p.id)) || [];
  };

  const getTotalPayoutAmount = (): string => {
    let sum = 0;

    getSelectedProposals().forEach((proposal) => {
      sum += proposal.fundingRequest.amount;
    });

    return (sum ? sum / 100 : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const isExecuteDisabled = (): boolean => {
    return !selectedWire || data.data.proposals.some(p => p.fundingState !== 'available');
  };

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
      const res = await executePayout({
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

      router.push({
        pathname: `/financials/payouts/details/${res.data.executePayouts.id}`
      })
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

            <Select width="100%" onChange={onWireSelected}>
              {data.data.wires.map((wire) => (
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
                      {(proposal.fundingRequest.amount / 100).toLocaleString('en-US', {
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


                <Text p>{proposal.description.description}</Text>

                {proposal.fundingState !== 'available' && (
                  <Note type="error">
                    The funding proposal is not longer eligible for payout. The current funding state of the proposal
                    is{' '}
                    <b>{proposal.fundingState}</b>
                  </Note>
                )}
              </Card>
            ))}

            <Spacer y={2}/>
          </React.Fragment>

          <React.Fragment>
            <Text h3>Payout overview</Text>

            <Grid.Container gap={4}>
              <Grid xs={24} md={12}>
                <Text h5>Numbers</Text>

                <Divider style={{ marginTop: 0 }}/>

                <Text p style={{ margin: '5px 0' }}>
                  <b>Number of proposals:</b> {getSelectedProposals().length}
                </Text>

                <Text p style={{ margin: '5px 0' }}>
                  <b>Total payout amount:</b> {getTotalPayoutAmount()}
                </Text>
              </Grid>

              <Grid xs={24} md={12}>
                <Text h5>Bank Account</Text>

                <Divider style={{ marginTop: 0 }}/>

                {selectedWire && (
                  <React.Fragment>
                    <Text p style={{ margin: '5px 0' }}>
                      <b>Description:</b> {getSelectedWire()?.description}
                    </Text>

                    <Text p style={{ margin: '2px 0' }}>
                      <b>Account Holder:</b> {getSelectedWire()?.billingDetails?.name}
                    </Text>

                    <Text p style={{ margin: '2px 0' }}>
                      <b>Account Country:</b> {getSelectedWire()?.billingDetails?.country}
                    </Text>

                    <Text p style={{ margin: '2px 0' }}>
                      <b>Account City:</b> {getSelectedWire()?.billingDetails?.city}
                    </Text>
                  </React.Fragment>
                )}
              </Grid>

              <Spacer y={1}/>
            </Grid.Container>

            <Note type="warning">
              When clicking execute the payout is no longer reversible. Though if not approved in timely manner it will
              be aborted
            </Note>

            <Spacer y={1}/>
          </React.Fragment>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" disabled={isExecuteDisabled()} loading={loading} onClick={onExecute}>
              Create payout
            </Button>
          </div>
        </React.Fragment>
      )}

    </React.Fragment>
  );
};

export default withPermission('admin.payouts.create', {
  redirect: true
})(CreateBatchPayoutPage);