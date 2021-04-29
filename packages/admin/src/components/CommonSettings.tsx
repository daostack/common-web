import React from 'react';
import { Tooltip, Row, useToasts, Spacer } from '@geist-ui/react';
import { Settings, Award, RefreshCcw, Edit, Trash2 } from '@geist-ui/react-icons';

import { Centered } from '@components/Centered';
import { gql } from '@apollo/client';

import { useWhitelistCommonMutation } from '@core/graphql';

interface ICommonSettingsProps {
  commonId: string;
  whitelisted: boolean;
  refetch: () => any;
}

const WhitelistCommonMutation = gql`
  mutation whitelistCommon($commonId: String!) {
    whitelistCommon(commonId: $commonId)
  }
`;

export const CommonSettings: React.FC<ICommonSettingsProps> = ({ commonId, whitelisted, refetch }) => {
  const [, setToast] = useToasts();

  // - Networking
  const [whitelistCommon, { data }] = useWhitelistCommonMutation();

  // - Actions
  const onWhitelistCommon = async () => {
    await whitelistCommon({
      variables: {
        commonId
      }
    });

    if (typeof refetch === 'function') {
      refetch();
    }
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
          {!whitelisted && (
            <React.Fragment>
              <Row style={{ cursor: 'pointer' }} onClick={onWhitelistCommon}>
                <Award/>
                <Spacer x={.5}/>
                Whitelist Common
              </Row>

              <Spacer y={1}/>
            </React.Fragment>
          )}

          <Row style={{ cursor: 'pointer' }}>
            <RefreshCcw/>
            <Spacer x={.5}/>
            Refresh Common Members
          </Row>

          <Spacer y={1}/>

          <Row style={{ cursor: 'pointer' }}>
            <Edit/>
            <Spacer x={.5}/>
            Edit Common Details
          </Row>

          <Spacer y={1}/>

          <Row style={{ cursor: 'pointer', color: 'red' }}>
            <Trash2/>
            <Spacer x={.5}/>
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