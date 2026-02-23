import { NavLink } from "react-router-dom";
import "./ProfileTabs.css";

const ProfileTabs = () => {
  return (
    <div className="profile-tabs">

      <NavLink to="/" end className="tab-link">
        Home
      </NavLink>

      <NavLink to="/teaching" className="tab-link">
        Teaching
      </NavLink>

      <NavLink to="/research" className="tab-link">
        Research
      </NavLink>

      <NavLink to="/publication" className="tab-link">
        Publications
      </NavLink>

      <NavLink to="/gallery" className="tab-link">
        Gallery
      </NavLink>

      <NavLink to="/other" className="tab-link">
        Other
      </NavLink>

    </div>
  );
};

export default ProfileTabs;
