import SignIn from "@/components/auth/SignIn";
import { buildPageTitle } from "@/utils/serverUtils";

export async function generateMetadata() {
  return {
    title: await buildPageTitle("Login"),
  };
}

const page = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default page;
