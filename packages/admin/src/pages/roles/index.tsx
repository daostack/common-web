import React from 'react';
import { NextPage } from 'next';

import { gql } from '@apollo/client';
import { Sliders } from '@geist-ui/react-icons';

import { Link } from '@components/Link';
import { useRolesQuery } from '@core/graphql';
import { FullWidthLoader } from '@components/FullWidthLoader';
import { Table, Text, Breadcrumbs, Spacer } from '@geist-ui/react';

const GetRolesQuery = gql`
  query roles {
    roles {
      id

      name
      displayName
      description
    }
  }
`;

const RolesPage: NextPage = () => {
  const { data, loading } = useRolesQuery();

  const getRolesForTable = () => {
    if (!data) {
      return Array(10).fill({
        name: FullWidthLoader,
        description: FullWidthLoader,
        actions: FullWidthLoader
      });
    }

    return data.roles.map((r) => ({
      name: r.displayName,
      description: r.description,

      actions: (
        <React.Fragment>
          <Link to={`/roles/details/${r.name}`}>
            <Sliders/>
          </Link>
        </React.Fragment>
      )
    }));
  };

  return (
    <div>
      <Text h1>Roles</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/roles">Roles</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer y={2}/>

      <Table data={getRolesForTable()}>
        <Table.Column width={100} prop="name" label="Role name"/>
        <Table.Column prop="description" label="Description"/>
        <Table.Column width={100} prop="actions" label="Actions"/>
      </Table>
    </div>
  );
};

export default RolesPage;