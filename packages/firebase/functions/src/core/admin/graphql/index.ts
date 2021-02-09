import { Kind } from 'graphql';
import { scalarType } from 'nexus';

import { StatisticsType, StatisticsTypeQueryExtension } from './statistics';
import { EventTypeEnum, EventType, EventTypeQueryExtensions } from './events';
import {
  CommonMemberType,
  CommonMetadataType,
  CommonType,
  CommonTypeQueryExtension,
  CommonContributionTypeEnum
} from './commons';

// Scalars

const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    return null;
  }
});


// Schema types

export const types = [
  DateScalar,

  StatisticsType,
  StatisticsTypeQueryExtension,

  EventType,
  EventTypeEnum,
  EventTypeQueryExtensions,

  CommonType,
  CommonMemberType,
  CommonMetadataType,
  CommonTypeQueryExtension,
  CommonContributionTypeEnum
];