import { DYNAMIC_LINK_URI_PREFIX, DynamicLinkType } from "@/shared/constants";
import { SharedStateType } from "@/shared/interfaces";
import { buildShareLink, startLoading, stopLoading } from "./actions";
import { SharedReducer as reducer } from "./reducer";

describe("shared reducer", () => {
  it("should correctly update loading state", () => {
    let state: SharedStateType = reducer(undefined, startLoading());
    expect(state).toEqual(
      expect.objectContaining({
        loading: true,
      })
    );
    state = reducer(state, stopLoading());
    expect(state).toEqual(
      expect.objectContaining({
        loading: false,
      })
    );
  });

  it("should correctly update built share links state on success", () => {
    const successPayload = {
      key: `${DynamicLinkType.Common}/1`,
      linkInfo: {
        link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.Common}/1`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
      },
    };
    const successLink = "https://www.example.com/success";

    let state: SharedStateType = reducer(
      undefined,
      buildShareLink.request({
        payload: successPayload,
      })
    );
    expect(state).toEqual(
      expect.objectContaining({
        loadingShareLinks: {
          [successPayload.key]: true,
        },
      })
    );

    state = reducer(
      state,
      buildShareLink.success({
        key: successPayload.key,
        link: successLink,
      })
    );
    expect(state).toEqual(
      expect.objectContaining({
        shareLinks: {
          [successPayload.key]: successLink,
        },
        loadingShareLinks: {
          [successPayload.key]: false,
        },
      })
    );
  });

  it("should correctly update built share links state on failure", () => {
    const failurePayload = {
      key: `${DynamicLinkType.Common}/2`,
      linkInfo: {
        link: `${DYNAMIC_LINK_URI_PREFIX}/${DynamicLinkType.Common}/2`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
      },
    };

    let state: SharedStateType = reducer(
      undefined,
      buildShareLink.request({
        payload: failurePayload,
      })
    );
    expect(state).toEqual(
      expect.objectContaining({
        loadingShareLinks: {
          [failurePayload.key]: true,
        },
      })
    );

    state = reducer(
      state,
      buildShareLink.failure({
        key: failurePayload.key,
        error: new Error("Error during link creation"),
      })
    );
    expect(state).toEqual(
      expect.objectContaining({
        shareLinks: {},
        loadingShareLinks: {
          [failurePayload.key]: false,
        },
      })
    );
  });
});
