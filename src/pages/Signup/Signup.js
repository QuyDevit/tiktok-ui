import Auth from "../Auth";

function Signup({ isModal = false }) {
  return (
     <Auth isModal={isModal} isFormLogin={false} />
  );
}

export default Signup;