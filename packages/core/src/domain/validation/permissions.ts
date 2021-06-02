export const allPermissions = [
  'admin.report.read',
  'admin.report.act',

  'admin.roles.read',
  'admin.roles.create',
  'admin.roles.update',

  'admin.roles.assign',
  'admin.roles.unassign',

  'admin.events.read',

  'admin.financials.payments.read',

  'admin.financials.payouts.read',
  'admin.financials.payouts.create',
  'admin.financials.payouts.approve',
  'admin.financials.payouts.confirm',

  'admin.proposals.read',
  'admin.proposals.read.ipAddress',

  'admin.commons.read',
  'admin.commons.update',
  'admin.commons.delist',
  'admin.commons.whitelist',

  'admin.notification.read',

  'admin.notification.setting.event.create',
  'admin.notification.setting.event.read',
  'admin.notification.setting.event.update',
  'admin.notification.setting.event.delete',

  'admin.notification.setting.create',
  'admin.notification.setting.read',
  'admin.notification.setting.update',
  'admin.notification.setting.delete',

  'admin.notification.setting.template.create',
  'admin.notification.setting.template.read',
  'admin.notification.setting.template.update',
  'admin.notification.setting.template.delete',

  'admin.users.read',
  'admin.users.update',

  'admin.users.billingDetails.read',
  'admin.users.billingDetails.update',
  'admin.users.billingDetails.delete',

  'user.permissions.read',

  'admin.wire.read',
  'admin.wire.create',
  'admin.wire.update',

  'admin.wire.bank.read',
  'admin.wire.bank.create',
  'admin.wire.bank.update'
];


export type AllPermission = (typeof allPermissions[number]);