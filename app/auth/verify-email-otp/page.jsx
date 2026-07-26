import VerifyEmailOtp from "@/components/auth/VerifyEmailOtp";
import { Suspense } from "react";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Verify Email OTP"),
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmailOtp />
    </Suspense>
  );
};

export default page;
