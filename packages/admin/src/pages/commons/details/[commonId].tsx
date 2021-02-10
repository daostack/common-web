import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import { gql } from '@apollo/client';
import { Spacer, Text, Grid, Card, Breadcrumbs, Table, Tag, Pagination, Tooltip, Divider } from '@geist-ui/react';

import { useGetCommonDetailsQuery, GetCommonDetailsQueryResult } from '@graphql';
import { Link } from 'components/Link';
import { ChevronLeftCircleFill, ChevronRightCircleFill, ExternalLink } from '@geist-ui/react-icons';

const GetCommonDetailsQuery = gql`
  query getCommonDetails($commonId: ID!) {
    common(commonId: $commonId) {
      name
      
      createdAt
      updatedAt

      balance
      raised

      metadata {
        byline
        description
        
        founderId
        contributionType
      }

      members {
        userId
        joinedAt
      }
    }
  }
`;

const CommonDetailsPage: NextPage = () => {
  // State
  const [membersPage, setMembersPage] = React.useState<number>(0);

  // Hooks
  const router = useRouter();
  const data = useGetCommonDetailsQuery({
    variables: {
      commonId: router.query.commonId as string
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
      userId: member.userId,
      joinedAt: member.joinedAt
        ? new Date(member.joinedAt).toLocaleDateString()
        : 'No data available',
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
        <React.Fragment>
          <Tooltip text={'Go to user\'s profile'} enterDelay={1000}>
            <Link to={``} Icon={ExternalLink}/>
          </Tooltip>
        </React.Fragment>
      )
    }));
  };

  // Actions

  const onMembersPageChange = (val: number): void => {
    setMembersPage(val);
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

            <Spacer x={1} />

            <Tag >{data.data.common.metadata.contributionType}</Tag>
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
                    todo
                  </Text>
                  <Text p>Open join request</Text>
                </Card>
              </Grid>

              <Grid sm={24} md={8}>
                <Card hoverable>
                  <Text h1>
                    todo
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
              { item: 'Founder', value: data.data.common.metadata.founderId },
            ]}>
              <Table.Column prop="item" label="Property" width={200}/>
              <Table.Column prop="value" label="Value" />
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
              <Table.Column prop="userId" label="Member ID"/>
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

            <Table data={transformMembersForTable(data)}>
              <Table.Column prop="userId" label="Member ID"/>
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
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CommonDetailsPage;