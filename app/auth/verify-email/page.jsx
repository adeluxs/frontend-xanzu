import VerifyEmail from "@/components/auth/VerifyEmail";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Verify Email"),
  };
}

const page = () => {
  return (
    <>
      <VerifyEmail />
    </>
  );
};

export default page;
