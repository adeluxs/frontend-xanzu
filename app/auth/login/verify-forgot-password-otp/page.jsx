import VerifyForgotPasswordOtp from "@/components/auth/VerifyForgotPasswordOtp";
import { Suspense } from "react";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Verify OTP"),
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <VerifyForgotPasswordOtp />
    </Suspense>
  );
};

export default page;
