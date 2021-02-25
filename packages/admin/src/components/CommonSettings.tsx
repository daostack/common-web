import React from 'react';

import { Tooltip, Row } from '@geist-ui/react';
import { Settings, Award } from '@geist-ui/react-icons';
import { Centered } from '@components/Centered';

interface ICommonSettingsProps {
  commonId: string;
}

export const CommonSettings: React.FC<ICommonSettingsProps> = ({ commonId }) => {
  const onCommonWhitelisted = () => {

  }

  return (
    <Tooltip
      placement="bottomEnd"
      trigger="click"
      text={(
        <div style={{ width: "250px" }}>
          <Row style={{ cursor: 'pointer' }}>
            <Award />{'  '}
            Whitelist common
          </Row>

        </div>
      )}
    >
      <div style={{ width: 40 }}>
        <Centered>
          <Settings />
        </Centered>
      </div>
    </Tooltip>
  );
};