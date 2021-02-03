import React from "react";
import { useSelector } from "react-redux";
import { getLoading } from "../../../../shared/store/selectors";
import { RegistrationForm } from "../../components/RegistrationContainer";

const RegistrationContainer = () => {
  //const dispatch = useDispatch();
  const loading = useSelector(getLoading());

  const createLead = () => {};

  return (
    <div className="box">
      <RegistrationForm loading={loading} submitHandler={createLead} />
    </div>
  );
};

export default RegistrationContainer;
