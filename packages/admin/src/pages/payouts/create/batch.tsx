import { gql } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withPermission } from '../../../helpers/hoc/withPermission';
import { useGetProposalsSelectedForBatchQuery } from '@graphql';
import { Link } from '@components/Link';
import React from 'react';
import { Breadcrumbs, Spacer } from '@geist-ui/react';
import { Text } from '@geist-ui/react';

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

      common {
        name
      }

      fundingRequest {
        amount
      }
    }
  }
`;

const CreateBatchPayoutPage: NextPage = () => {
  const router = useRouter();
  const data = useGetProposalsSelectedForBatchQuery({
    variables: {
      ids: router.query.selectedProposals
    }
  });

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

      {/*{data.data && (*/}
      {/*  */}
      {/*)}*/}

    </React.Fragment>
  );
};

export default withPermission('admin.payouts.create', {
  redirect: true
})(CreateBatchPayoutPage);