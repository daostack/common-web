import { queryField, nonNull } from 'nexus';

export const GetSettingsQuery = queryField('settings', {
  type: nonNull('Settings'),
  resolve: () => ({})
});