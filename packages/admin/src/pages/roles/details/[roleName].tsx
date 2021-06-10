import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { set } from 'lodash';
import { gql } from '@apollo/client';
import { Text, Breadcrumbs, Table, Spacer, Avatar, Card, Tree } from '@geist-ui/react';

import { FullWidthLoader } from '@components/FullWidthLoader';
import { useRoleDetailsQuery } from '@core/graphql';
import { Centered } from '@components/Centered';
import { Link } from '@components/Link';

const RoleDetails = gql`
  query roleDetails($roleName: String!) {
    role(
      where: {
        name: $roleName
      }
    ) {
      id

      name
      displayName

      description
      permissions

      users {
        id
        photo
        displayName
        email
      }
    }
  }
`;

const RecursiveTree = ({ value }) => ((typeof value === 'object' && value !== null) ? (
  <>
    {Object.keys(value).map((k) => (
      <>
        {console.log(k, value[k])}

        <Tree.Folder name={k}>
          <RecursiveTree
            value={value[k]}
          />
        </Tree.Folder>
        {/*{!voided && (<RecursiveTree*/}
        {/*    value={value[k]}*/}
        {/*    key={k}*/}
        {/*    voided={true}*/}
        {/*  />*/}

        {/*)}*/}
      </>

    ))}</>
) : (
  <Tree.File name={value}/>
));

const RoleDetailsPage: NextPage = () => {
  const router = useRouter();
  const { data, loading } = useRoleDetailsQuery({
    variables: {
      roleName: router.query.roleName as string
    }
  });

  const getUserTableData = () => {
    if (!data) {
      return Array(10).fill({
        photo: FullWidthLoader,
        name: FullWidthLoader,
        email: FullWidthLoader
      });
    }

    return data.role.users.map((u) => ({
      id: u.id,
      photo: (
        <Centered>
          <Avatar src={u.photo}/>
        </Centered>
      ),
      name: u.displayName,
      email: u.email
    }));
  };

  const convertPermissions = (permissions: string[]) => {
    const tree = {};

    for (const permission of permissions) {
      set(tree, permission, 'end');
    }

    return tree;
  };

  const onRow = async (data) => {
    if (data.id) {
      await router.push(`/users/details/${data.id}`);
    }
  };

  return (
    <div>
      <Text h1>Role Details</Text>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Link to="/roles">Roles</Link>
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          Details
        </Breadcrumbs.Item>

        <Breadcrumbs.Item>
          <Link to={router.pathname}>[{data ? data.role.displayName : router.query.roleName}]</Link>
        </Breadcrumbs.Item>
      </Breadcrumbs>

      <Spacer/>

      <Card>
        <Text h5>
          Role Name: {data?.role?.name}
        </Text>
        <Text h5>
          Role Description: {data?.role?.description}
        </Text>
        {/*<Text h5>Role Permissions:</Text> {data?.role?.permissions?.map(x => <Text>{x}</Text>)}*/}

      </Card>
      <Spacer/>

      <React.Fragment>
        <Text h3>Users in role</Text>

        <Table data={getUserTableData()} onRow={onRow}>
          <Table.Column prop="photo" label="" width={50}/>
          <Table.Column prop="name" label="Name"/>
          <Table.Column prop="email" label="Email"/>
        </Table>
      </React.Fragment>


    </div>
  );
};

export default RoleDetailsPage;