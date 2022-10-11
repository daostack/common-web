import { Circles } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";
import { calculateVoters } from "./utils";

describe("calculateVoters", () => {
  it("should calculate voters correctly", () => {
    const circles: Circles = {
      0: {
        reputation: {},
        id: "f0e718e5-c613-4f06-a7a7-4782647de3f8",
        name: "Supporters",
        allowedActions: {},
        allowedProposals: {},
        hierarchy: null,
      },
      1: {
        id: "1b42d7c9-fe5a-4d48-aa6a-133f81812204",
        allowedActions: {},
        reputation: {},
        allowedProposals: {},
        name: "Contributors",
        hierarchy: {
          tier: 0,
          exclusions: [],
        },
      },
      2: {
        id: "f8e3529b-c4fa-4f3e-9ad0-f788e80967f5",
        name: "Seniors",
        allowedProposals: {},
        allowedActions: {},
        reputation: {},
        hierarchy: {
          tier: 10,
          exclusions: [],
        },
      },
      3: {
        name: "Leader",
        id: "1c1d2b5e-f9ac-4e9c-8872-4ceaa6b1a543",
        allowedProposals: {},
        reputation: {},
        allowedActions: {},
        hierarchy: {
          tier: 20,
          exclusions: [],
        },
      },
      4: {
        allowedProposals: {},
        name: "Project",
        allowedActions: {},
        reputation: {},
        id: "6df2148b-0142-4976-a3d5-656d52f77984",
        hierarchy: null,
      },
    };
    const weights: BaseProposal["global"]["weights"] = [
      {
        circles: {
          bin: 3758096384,
          map: {
            0: "f0e718e5-c613-4f06-a7a7-4782647de3f8",
            1: "1b42d7c9-fe5a-4d48-aa6a-133f81812204",
            2: "f8e3529b-c4fa-4f3e-9ad0-f788e80967f5",
            3: "1c1d2b5e-f9ac-4e9c-8872-4ceaa6b1a543",
          },
        },
        value: 100,
      },
    ];

    expect(calculateVoters(weights, circles)).toEqual([
      "Supporters",
      "Contributors",
    ]);
  });
});
