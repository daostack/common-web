import styled from "styled-components";

const SocialButtonWrapper = styled.div`
  width: 100%;
  button {
    width: 100%;
    outline: none;
    border-radius: 9px;
    letter-spacing: 0.04em;
    color: white;
    font-weight: bold;
    font-size: 13px;
    line-height: 13px;
    border: 0;
    height: 40px;
    cursor: pointer;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img {
      margin-right: 24px;
    }
    &.google {
      background: #dd4b39;
    }
    &.facebook {
      background: #3b5998;
    }
  }
`;

export { SocialButtonWrapper };
