import React from 'react';
import { Tooltip, Row, useToasts, Spacer } from '@geist-ui/react';
import { Award, RefreshCcw, Edit, Trash2, Slash, Settings } from '@geist-ui/react-icons';
import { gql } from '@apollo/client';

import { useWhitelistCommonMutation, useDelistCommonMutation } from '@core/graphql';
import { Hoverable } from '@components/Hoverable';
import { Centered } from '@components/Centered';

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

const DelistCommonMutation = gql`
  mutation delistCommon($commonId: String!) {
    delistCommon(commonId: $commonId)
  }
`;

export const CommonSettings: React.FC<ICommonSettingsProps> = ({ commonId, whitelisted, refetch }) => {
  const [, setToast] = useToasts();

  // - Networking
  const [whitelistCommon, { data: whitelistResult }] = useWhitelistCommonMutation();
  const [delistCommon, { data: delistResult }] = useDelistCommonMutation();

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

  const onCommonDelist = async () => {
    await delistCommon({
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
    if (whitelistResult?.whitelistCommon) {
      setToast({
        text: 'Common whitelisted!'
      });
    }
  }, [whitelistResult]);

  React.useEffect(() => {
    if (delistResult?.delistCommon) {
      setToast({
        text: 'Common delisted!'
      });
    }
  }, [delistResult]);

  return (
    <Tooltip
      placement="bottomEnd"
      trigger="click"
      text={(
        <div style={{ width: '270px', margin: '.3em -0.7em' }}>
          <React.Fragment>
            <Hoverable>
              {whitelisted
                ? (
                  <Row style={{ cursor: 'pointer' }} onClick={onCommonDelist}>
                    <Slash/>
                    <Spacer x={.5}/>
                    Delist Common
                  </Row>
                ) : (
                  <Row style={{ cursor: 'pointer' }} onClick={onWhitelistCommon}>
                    <Award/>
                    <Spacer x={.5}/>
                    Whitelist Common
                  </Row>
                )}
            </Hoverable>

            <Spacer y={.5}/>
          </React.Fragment>

          <Hoverable>
            <Row style={{ cursor: 'pointer' }}>
              <RefreshCcw/>
              <Spacer x={.5}/>
              Refresh Common Members
            </Row>
          </Hoverable>

          <Spacer y={.5}/>

          <Hoverable>
            <Row style={{ cursor: 'pointer' }}>
              <Edit/>
              <Spacer x={.5}/>
              Edit Common Details
            </Row>
          </Hoverable>

          <Spacer y={.5}/>

          <Hoverable>
            <Row style={{ cursor: 'pointer', color: 'red' }}>
              <Trash2/>
              <Spacer x={.5}/>
              Delete Common
            </Row>
          </Hoverable>
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