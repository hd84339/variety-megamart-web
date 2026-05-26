import React from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileMenu from "./components/ProfileMenu";
import ProfileDangerZone from "./components/ProfileDangerZone";

const Profile = () => {
  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans overflow-x-hidden relative py-12 px-5">
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFF5F6] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[10%] -right-20 w-[400px] h-[400px] bg-red-50/60 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[40%] -left-20 w-[300px] h-[300px] bg-blue-50/40 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        <ProfileHeader />
        <ProfileMenu />
        <ProfileDangerZone />
      </div>
    </div>
  );
};

export default Profile;
