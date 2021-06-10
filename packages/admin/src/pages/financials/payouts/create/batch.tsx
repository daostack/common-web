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
  Input,
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

import {
  useGetProposalsSelectedForBatchQuery,
  useAvailableWiresLazyQuery,
  useCreatePayoutMutation,
  useCreateUserWireMutation
} from '@core/graphql';
import { useForm } from 'react-hook-form';

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

const CreateUserWire = gql`
  mutation CreateUserWire($input: CreateWireInput!) {
    createWire(input: $input) {
      id
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

    const [createWire, { loading: creatingWire }] = useCreateUserWireMutation();
    const [createPayout, { loading: creatingPayout }] = useCreatePayoutMutation();
    const [getWires, { data: wires, refetch, loading: loadingAvailableWires }] = useAvailableWiresLazyQuery();
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

    const { register, setValue, getValues } = useForm<{
      wire: {
        userId: string;
        iban: string;

        createBillingDetails: {
          name: string;
          line1: string;
          city: string;
          postalCode: string;
          district: string;
          country: string;
        }

        createWireBankDetails: {
          bankName: string;
          line1: string;
          city: string;
          postalCode: string;
          district: string;
          country: string;
        }
      }
    }>();


    // --- State
    const [users, setUsers] = React.useState<any[]>([]);
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
        setUsers(Array.from(new Set(data.data.proposals.map(x => x.user))));
      }
    }, [data]);

    React.useEffect(() => {
      if (users.length) {
        getWires({
          variables: {
            where: {
              userId: {
                in: users.map(u => u.id)
              }
            }
          }
        });
      }
    }, [users]);

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

    const onCreateWire = async () => {
      const input = getValues();

      try {
        const createdWire = await createWire({
          variables: {
            input: input.wire
          }
        });

        await refetch();

        setSelectedWire(createdWire.data.createWire.id);

        setToast({
          text: 'Wire created successfully'
        });
      } catch (e) {
        setToast({
          type: 'error',
          text: 'An error occurred while creating the wire, please check the form values and make sure that they are correct!'
        });
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
              <Link to="/financials/payouts">Payouts</Link>
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
            </React.Fragment>


            {selectedWire === 'create' && (
              <div>
                <div>
                  <Text>Bank account owner</Text>

                  <Select
                    width="100%"
                    placeholder="Please select who will own the created wire"
                    onChange={(v) => setValue('wire.userId', v as string)}
                  >
                    {users.map(u => (
                      <Select.Option
                        value={u.id}
                      >
                        {u.firstName} {u.lastName}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <Text h4>Wire details</Text>

                <Text
                  style={{ margin: 0 }}
                >
                  IBAN
                </Text>

                <Input
                  width="100%"
                  placeholder="IBAN"
                  onChange={(v) => setValue('wire.iban', v.target.value)}
                />

                <div style={{ margin: '20px 0' }}>
                  <Text h4>User Billing Details</Text>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'stretch'
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        marginRight: 10
                      }}
                    >
                      <Text
                        style={{ margin: 0 }}
                      >
                        Full User Name
                      </Text>

                      <Input
                        width="100%"
                        placeholder="Full Name"
                        onChange={(v) => setValue('wire.createBillingDetails.name', v.target.value)}
                      />
                    </div>
                  </div>

                  <Text
                    style={{ margin: 0 }}
                  >
                    Address
                  </Text>

                  <Input
                    width="100%"
                    placeholder="Address"
                    onChange={(v) => setValue('wire.createBillingDetails.line1', v.target.value)}
                  />

                  <div
                    style={{
                      margin: '10px 0',
                      display: 'flex',
                      justifyContent: 'stretch'
                    }}
                  >
                    <div
                      style={{
                        flex: 1
                      }}
                    >
                      <Text
                        style={{ margin: 0 }}
                      >
                        City
                      </Text>

                      <Input
                        width="100%"
                        placeholder="City"
                        onChange={(v) => setValue('wire.createBillingDetails.city', v.target.value)}
                      />
                    </div>

                    <div
                      style={{
                        flex: 1,
                        margin: '0 10px'
                      }}
                    >
                      <Text
                        style={{ margin: 0 }}
                      >
                        District
                      </Text>

                      <Input
                        width="100%"
                        placeholder="District"
                        onChange={(v) => setValue('wire.createBillingDetails.district', v.target.value)}
                      />
                    </div>

                    <div
                      style={{
                        flex: .5
                      }}
                    >
                      <Text
                        style={{ margin: 0 }}
                      >
                        Postal Code
                      </Text>

                      <Input
                        width="100%"
                        placeholder="Postal Code"
                        onChange={(v) => setValue('wire.createBillingDetails.postalCode', v.target.value)}
                      />
                    </div>
                  </div>

                  <Text
                    style={{ margin: 0 }}
                  >
                    Country
                  </Text>

                  <Input
                    width="100%"
                    placeholder="Country"
                    onChange={(v) => setValue('wire.createBillingDetails.country', v.target.value)}
                  />

                </div>

                <div style={{ margin: '20px 0' }}>
                  <Text h4>User Bank Details</Text>


                  <Text
                    style={{ margin: 0 }}
                  >
                    Bank Name
                  </Text>

                  <Input
                    width="100%"
                    placeholder="Bank Name"
                    onChange={(v) => setValue('wire.createWireBankDetails.bankName', v.target.value)}
                  />
                </div>


                <Text
                  style={{ margin: 0 }}
                >
                  Address
                </Text>

                <Input
                  width="100%"
                  placeholder="Address"
                  onChange={(v) => setValue('wire.createWireBankDetails.line1', v.target.value)}
                />

                <div
                  style={{
                    margin: '10px 0',
                    display: 'flex',
                    justifyContent: 'stretch'
                  }}
                >
                  <div
                    style={{
                      flex: 1
                    }}
                  >
                    <Text
                      style={{ margin: 0 }}
                    >
                      City
                    </Text>

                    <Input
                      width="100%"
                      placeholder="City"
                      onChange={(v) => setValue('wire.createWireBankDetails.city', v.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      margin: '0 10px'
                    }}
                  >
                    <Text
                      style={{ margin: 0 }}
                    >
                      District
                    </Text>

                    <Input
                      width="100%"
                      placeholder="District"
                      onChange={(v) => setValue('wire.createWireBankDetails.district', v.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      flex: .5
                    }}
                  >
                    <Text
                      style={{ margin: 0 }}
                    >
                      Postal Code
                    </Text>

                    <Input
                      width="100%"
                      placeholder="Postal Code"
                      onChange={(v) => setValue('wire.createWireBankDetails.postalCode', v.target.value)}
                    />
                  </div>
                </div>

                <Text
                  style={{ margin: 0 }}
                >
                  Country
                </Text>

                <Input
                  width="100%"
                  placeholder="Country"
                  onChange={(v) => setValue('wire.createWireBankDetails.country', v.target.value)}
                />


                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1rem'
                  }}
                >
                  <Button
                    onClick={onCreateWire}
                    loading={loadingAvailableWires || creatingWire}
                  >
                    Create Wire
                  </Button>
                </div>
              </div>
            )}

            <Spacer y={2}/>

            <React.Fragment>
              <Text h3>Selected proposals for payout</Text>

              {getSelectedProposals().map((proposal) => (
                <Card key={proposal.id} style={{ margin: '20px 0' }}>
                  <Grid.Container>
                    <Grid xs={20}>
                      <Text h3 style={{ marginBottom: 0 }}>{proposal.title}</Text>
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

            {users.length > 1 && (
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
  }
;

export default withPermission('admin.financials.payouts.create',
  {
    redirect: true
  }
)(CreateBatchPayoutPage);