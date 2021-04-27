import React from 'react';

import { gql } from '@apollo/client';
import { Tooltip, Row, useToasts, Spacer } from '@geist-ui/react';
import { Settings, Award, RefreshCcw, Edit, Trash2 } from '@geist-ui/react-icons';

import { Centered } from '@components/Centered';
import { useWhitelistCommonMutation } from '@core/graphql';

interface ICommonSettingsProps {
  commonId: string;
}

const WhitelistCommonMutation = gql`
  mutation whitelistCommon($commonId: ID!) {
    whitelistCommon(commonId: $commonId)
  }
`;

export const CommonSettings: React.FC<ICommonSettingsProps> = ({ commonId }) => {
  const [, setToast] = useToasts();

  // - Networking
  const [whitelistCommon, { data }] = useWhitelistCommonMutation();

  // - Actions
  const onCommonWhitelisted = async () => {
    await whitelistCommon({
      variables: {
        commonId
      }
    });
  };

  // - Effects
  React.useEffect(() => {
    if (data?.whitelistCommon) {
      setToast({
        text: 'Common whitelisted!'
      });
    }
  }, [data]);

  return (
    <Tooltip
      placement="bottomEnd"
      trigger="click"
      text={(
        <div style={{ width: '250px', margin: '.7rem 0' }}>
          <Row style={{ cursor: 'pointer' }} onClick={onCommonWhitelisted}>
            <Award/>
            <Spacer x={.5} />
            Whitelist Common
          </Row>

          <Spacer y={.7} />

          <Row style={{ cursor: 'pointer' }}>
            <RefreshCcw/>
            <Spacer x={.5} />
            Refresh Common Members
          </Row>

          <Spacer y={.7} />

          <Row style={{ cursor: 'pointer' }}>
            <Edit/>
            <Spacer x={.5} />
            Edit Common Details
          </Row>

          <Spacer y={.7} />

          <Row style={{ cursor: 'pointer', color: 'red' }}>
            <Trash2 />
            <Spacer x={.5} />
            Delete Common
          </Row>
        </div>
      )}
    >
      <div style={{ width: 40 }}>
        <Centered>
          <Settings/>
        </Centered>
      </div>
    </Tooltip>
  );
};