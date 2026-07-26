import { Suspense } from "react";
import ResetPassword from "@/components/auth/ResetPassword";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Reset Password"),
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
