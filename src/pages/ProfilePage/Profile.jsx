import React from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileMenu from "./components/ProfileMenu";
import ProfileDangerZone from "./components/ProfileDangerZone";

const Profile = () => {
  return (
    <div className="max-w-[1000px] mx-auto py-12 px-5 font-sans min-h-screen">
      <ProfileHeader />
      <ProfileMenu />
      <ProfileDangerZone />
    </div>
  );
};

export default Profile;
