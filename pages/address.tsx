// import { useRef, useEffect } from 'react'
import dynamic from "next/dynamic";
import Layout from "components/layout/Landing";
const DynamicMap = dynamic(() => import("components/Map"), {
  ssr: false,
});

function Address(props: any) {
  return (
    <main>
      <DynamicMap {...props} />
    </main>
  );
}

Address.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Address;
