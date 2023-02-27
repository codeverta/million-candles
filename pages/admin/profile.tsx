import AdminLayout from "components/layout/AdminLayout";
import React from "react";

function Profile() {
  return <div></div>;
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Profile;
