import styled from "styled-components";

const AuthWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #7786ff;
  .inner-wrapper {
    background-color: white;
    width: 250px;
    height: 400px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .button-wrapper {
    }
  }
`;

export { AuthWrapper };
