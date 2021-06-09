import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';

import { useReportDetailsLazyQuery } from '@core/graphql';
import React from 'react';
import { Text, Breadcrumbs } from '@geist-ui/react';
import { Link } from '@components/Link';

const ReportDetailsQuery = gql`
  query reportDetails($reportId: ID!) {
    report(id: $reportId) {
      id

      type
      status

      message {
        message

        owner {
          id

          firstName
          lastName
        }
      }

      proposal {
        title
        description

        files
        images

        member {
          user {
            id

            firstName
            lastName
          }
        }
      }
    }
  }
`;

const ReportDetails: NextPage = () => {
  const router = useRouter();

  const [loadReportData, { data }] = useReportDetailsLazyQuery();

  React.useEffect(() => {
    if (router.query.reportId && !data) {
      loadReportData({
        variables: {
          reportId: router.query.reportId as string
        }
      });
    }
  }, [router.query.reportId]);

  return (
    <div>
      <Text h1>Report Details</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/reports">Reports</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>Details</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  );
};

export default ReportDetails;