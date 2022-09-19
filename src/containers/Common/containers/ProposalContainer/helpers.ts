import { Circles, Governance, User } from "@/shared/models";
import {
  AssignCircle,
  BaseProposal,
  DeleteCommon,
  FundsAllocation,
  MemberAdmittance,
  RemoveCircle,
} from "@/shared/models/governance/proposals";
import { formatPrice, getUserName } from "@/shared/utils";
import { ProposalDetailsItem } from "./types";
import { calculateVoters } from "@/containers/Common/components/CommonDetailContainer/CommonWhitepaper/utils";

const getVotersString = (
  weights: BaseProposal["global"]["weights"],
  circles: Circles
): string => {
  const voters =
    calculateVoters(
      circles.map((circle) => circle.name),
      weights
    ) || [];

  return voters.join("/");
};

export const getFundsAllocationDetails = (
  proposal: FundsAllocation,
  proposer: User,
  governance: Governance
): ProposalDetailsItem[] => [
  {
    title: "Fund allocation",
    value: formatPrice(proposal.data.args.amount || 0, {
      shouldRemovePrefixFromZero: false,
    }),
  },
  {
    title: "Recipient",
    value: getUserName(proposer).split(" ")[0],
  },
  {
    title: "Recurring",
    value: "One Time",
  },
  {
    title: "Voters",
    value: getVotersString(proposal.global.weights, governance.circles),
  },
];

export const getAssignCircleDetails = (
  proposal: AssignCircle,
  member: User | null,
  governance: Governance
): ProposalDetailsItem[] => {
  const circleToBeAssigned = governance.circles.find(
    (circle) => circle.id === proposal.data.args.circleId
  );

  return [
    {
      title: "Name of member",
      value: getUserName(member) || "--//--",
    },
    {
      title: "Circle to be assigned",
      value: circleToBeAssigned?.name || "",
    },
    {
      title: "Voters",
      value: getVotersString(proposal.global.weights, governance.circles),
    },
  ];
};

export const getRemoveCircleDetails = (
  proposal: RemoveCircle,
  member: User | null,
  governance: Governance
): ProposalDetailsItem[] => {
  const circleToBeRemoved = governance.circles.find(
    (circle) => circle.id === proposal.data.args.circleId
  );

  return [
    {
      title: "Name of member",
      value: getUserName(member) || "--//--",
    },
    {
      title: "Circle to be removed",
      value: circleToBeRemoved?.name || "",
    },
    {
      title: "Voters",
      value: getVotersString(proposal.global.weights, governance.circles),
    },
  ];
};

export const getMemberAdmittanceDetails = (
  proposal: MemberAdmittance,
  proposer: User,
  governance: Governance
): ProposalDetailsItem[] => [
  {
    title: "Name of member",
    value: getUserName(proposer),
  },
  {
    title: "Voters",
    value: getVotersString(proposal.global.weights, governance.circles),
  },
];

export const getDeleteCommonDetails = (
  proposal: DeleteCommon,
  proposer: User,
  governance: Governance
): ProposalDetailsItem[] => [
  {
    title: "Creator",
    value: getUserName(proposer),
  },
  {
    title: "Voters",
    value: getVotersString(proposal.global.weights, governance.circles),
  },
];
