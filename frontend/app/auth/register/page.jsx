import SignUp from "@/components/auth/SignUp";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Register"),
  };
}

const page = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default page;
