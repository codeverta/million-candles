import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import ProfileSection from "components/organism/ProfileSection";

function Profile() {
  return <ProfileSection />;
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Profile;
