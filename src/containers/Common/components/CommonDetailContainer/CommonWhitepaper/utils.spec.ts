import { BaseProposal } from "@/shared/models/governance/proposals";
import { calculateVoters } from "./utils";

describe("calculateVoters", () => {
  it("should calculate voters correctly", () => {
    const circles = {
      0: {
        reputation: {},
        id: "f0e718e5-c613-4f06-a7a7-4782647de3f8",
        name: "Supporters",
        allowedActions: {},
        allowedProposals: {},
      },
      1: {
        id: "1b42d7c9-fe5a-4d48-aa6a-133f81812204",
        allowedActions: {},
        reputation: {},
        allowedProposals: {},
        name: "Contributors",
      },
      2: {
        id: "f8e3529b-c4fa-4f3e-9ad0-f788e80967f5",
        name: "Seniors",
        allowedProposals: {},
        allowedActions: {},
        reputation: {},
      },
      3: {
        name: "Leader",
        id: "1c1d2b5e-f9ac-4e9c-8872-4ceaa6b1a543",
        allowedProposals: {},
        reputation: {},
        allowedActions: {},
      },
      4: {
        allowedProposals: {},
        name: "Project",
        allowedActions: {},
        reputation: {},
        id: "6df2148b-0142-4976-a3d5-656d52f77984",
      },
    };
    const weights: BaseProposal["global"]["weights"] = [
      {
        circles: {
          bin: 3758096384,
          map: {
            0: "88f9fab4-2d8c-4b13-8df7-206ac970d74a",
            1: "d173c23d-465e-46aa-963a-5463005530db",
            2: "bd8c673c-17f3-42d9-90d6-0bfaa717da97",
          },
        },
        value: 100,
      },
    ];

    expect(calculateVoters(weights, circles)).toEqual([
      "Supporters",
      "Contributors",
      "Seniors",
    ]);
  });
});
