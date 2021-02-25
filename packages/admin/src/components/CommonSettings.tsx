import React from 'react';

import { gql } from '@apollo/client';
import { Tooltip, Row, useToasts } from '@geist-ui/react';
import { Settings, Award } from '@geist-ui/react-icons';

import { Centered } from '@components/Centered';
import { useWhitelistCommonMutation } from '@graphql';

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
        <div style={{ width: '250px' }}>
          <Row style={{ cursor: 'pointer' }} onClick={onCommonWhitelisted}>
            <Award/>{'  '}
            Whitelist common
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