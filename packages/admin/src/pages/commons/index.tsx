import { NextPage } from 'next';
import React from 'react';
import { Spacer, Text, Table, Pagination } from '@geist-ui/react';
import { Link } from '../../components/Link';
import { ExternalLink, Edit, Trash2, ChevronRightCircleFill, ChevronLeftCircleFill } from '@geist-ui/react-icons';


const CommonsHomepage: NextPage = () => {
  const goToCommon = (
    <React.Fragment>
      <Link to="/commons/details/id" Icon={ExternalLink} />
      <Link to="" Icon={Edit} />
      <Link to="" Icon={Trash2} />
    </React.Fragment>
  );

  const commons = [
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon },
    { name: "Common", byline: "This is common's byline or whateva", action: goToCommon }
  ]

  return (
    <React.Fragment>
      <Spacer y={1} />

      <Text h1>Commons</Text>

      <Text h3>Commons, created today</Text>

      <Table data={commons}>
        <Table.Column prop="name" label="Display Name" />
        <Table.Column prop="byline" label="Byline" />
        <Table.Column prop="action" label="Actions" />
      </Table>

      <Spacer y={2} />

      <Text h3>All commons</Text>

      <Table data={commons}>
        <Table.Column prop="name" label="Display Name" />
        <Table.Column prop="byline" label="Byline" />
        <Table.Column prop="action" label="Actions" />
      </Table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <Pagination count={5}>
          <Pagination.Next><ChevronRightCircleFill /></Pagination.Next>
          <Pagination.Previous><ChevronLeftCircleFill /></Pagination.Previous>
        </Pagination>
      </div>

    </React.Fragment>
  );
};

export default CommonsHomepage;