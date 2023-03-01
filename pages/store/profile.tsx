import StoreLayout from "components/layout/StoreLayout";
import React from "react";
import ProfileSection from "components/organism/ProfileSection";

function Profile() {
  return <ProfileSection />;
}

Profile.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Profile;
