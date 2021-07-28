import { ReportAuditor, CommonMemberRole } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { authorizationService } from '../../authorization';

export const getUserReportActingAuthority = async (userId: string, reportId: string): Promise<ReportAuditor> => {
  // Check if the user is moderator
  const commonMemberWithRoles = await prisma.commonMember
    .findFirst({
      where: {
        userId,
        common: {
          reports: {
            some: {
              id: reportId
            }
          }
        }
      },
      select: {
        roles: true
      }
    });

  if (commonMemberWithRoles && commonMemberWithRoles.roles.includes(CommonMemberRole.Moderator)) {
    return ReportAuditor.CommonModerator;
  }

  // Check if the user is admin
  if (await authorizationService.can(userId, 'admin.report.act')) {
    return ReportAuditor.SystemAdmin;
  }

  throw new CommonError('User does not have report authority!');
};