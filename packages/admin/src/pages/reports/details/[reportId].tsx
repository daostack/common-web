import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { gql } from '@apollo/client';

import { useReportDetailsLazyQuery, ReportAction, useActOnReportMutation } from '@core/graphql';
import React from 'react';
import {
  Text,
  Breadcrumbs,
  Loading,
  User,
  Spacer,
  Description,
  Button,
  useToasts,
  Note,
  useTheme
} from '@geist-ui/react';
import { Link } from '@components/Link';
import { HasPermission } from '@components/HasPermission';

const ReportDetailsQuery = gql`
  query reportDetails($reportId: ID!) {
    report(id: $reportId) {
      id

      createdAt

      type
      action
      status

      for
      note

      reviewedOn
      reviewAuthority

      reporter {
        id

        photo

        firstName
        lastName
      }

      reviewer {
        id

        photo

        firstName
        lastName
      }

      message {
        message

        owner {
          id

          photo

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

            photo

            firstName
            lastName
          }
        }
      }
    }
  }
`;

const ActOnReport = gql`
  mutation actOnReport($input: ActOnReportInput!) {
    actOnReport(input: $input) {
      id
    }
  }
`;

const Separator = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '2px',
          height: '5rem',
          backgroundColor: theme.palette.border
        }}
      />
    </div>

  );
};

const ReportDetails: NextPage = () => {
  const router = useRouter();
  const [, setToasts] = useToasts();

  const [actOnReport, { loading: acting }] = useActOnReportMutation();
  const [loadReportData, { data, loading, refetch }] = useReportDetailsLazyQuery();
  const { report } = data || {};

  React.useEffect(() => {
    if (router.query.reportId && !data) {
      loadReportData({
        variables: {
          reportId: router.query.reportId as string
        }
      });
    }
  }, [router.query.reportId]);

  const onActOnReport = (action: ReportAction): () => Promise<void> => {
    return async () => {
      await actOnReport({
        variables: {
          input: {
            reportId: report.id,
            action
          }
        }
      });

      setToasts({
        type: 'success',
        text: 'Successfully acted on report'
      });

      await refetch();
    };
  };

  const getContentType = () =>
    report.type === 'ProposalReport' ? 'proposal' : 'message';

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

      {!data && (
        <Loading/>
      )}

      {data && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text>
              On <b>{new Date(report.createdAt).toDateString()}</b>{' '}
              {getContentType()} was reported by
            </Text>

            <User
              name={`${report.reporter.firstName} ${report.reporter.lastName}`}
              src={report.reporter.photo}
            />

            <Text>
              for <b>{report.for}</b>
            </Text>
          </div>

          <Note
            label="User's note"
            style={{
              margin: '1rem 0'
            }}
          >
            {report.note}
          </Note>

          <Separator/>

          <div style={{ margin: '1rem 0' }}>
            <Text h3 style={{ textAlign: 'center' }}>
              The content of the {getContentType()} was
            </Text>

            <Spacer/>

            {report.type === 'ProposalReport' && (
              <Description
                title={report.proposal.title}
                content={report.proposal.description}
              />
            )}
          </div>

          {report.status !== 'Active' ? (
            <>
              <Separator/>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                  On <b>{new Date(report.reviewedOn).toDateString()}</b>{' '}
                  {getContentType()} was reviewed by
                </Text>

                <User
                  name={`${report.reviewer.firstName} ${report.reviewer.lastName}`}
                  src={report.reviewer.photo}
                />

                <Text>
                  ending with <b>{report.action}</b> action taken
                </Text>
              </div>
            </>
          ) : (
            <HasPermission permission={'admin.report.act'}>
              <Spacer y={2}/>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  onClick={onActOnReport('Dismissed')}
                  loading={loading || acting}
                >
                  Dismiss
                </Button>

                <Spacer x={1}/>

                <Button
                  type="success"
                  onClick={onActOnReport('Respected')}
                  loading={loading || acting}
                >
                  Respect
                </Button>
              </div>
            </HasPermission>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportDetails;