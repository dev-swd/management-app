import "./ProfilePage.css";
import { useContext } from "react";
import { AuthContext } from "../../App";

const ProfilePage = () => {
  const { isSignedIn, empInfo } = useContext(AuthContext)

  return (
    <div className="profile-container">
      {
        isSignedIn ? (
          <div className="profile-area">
            <div className="data">{empInfo.number}</div>
            <div className="data">{empInfo.name}</div>
            <div className="data">{empInfo.dep_name}</div>
            <div className="data">{empInfo.div_name}</div>
          </div>
        ) : (
          <div className="message">Not Signed In</div>
        )
      }
    </div>
  );
}

export default ProfilePage;