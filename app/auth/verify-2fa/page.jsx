import VerifyTwoFa from "@/components/auth/VerifyTwoFa";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Verify 2FA"),
  };
}

const page = () => {
  return (
    <>
      <VerifyTwoFa />
    </>
  );
};

export default page;
