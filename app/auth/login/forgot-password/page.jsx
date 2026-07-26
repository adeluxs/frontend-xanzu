import ForgotPassword from "@/components/auth/ForgotPassword";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Forgot Password"),
  };
}

const page = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default page;
