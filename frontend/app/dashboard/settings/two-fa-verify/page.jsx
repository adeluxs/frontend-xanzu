import TwoFaVerify from "@/components/dashboard/AllDashboardComponent/Settings/TwoFaVerify";

export const metadata = {
  title: "2FA Settings",
};

const page = () => {
  return (
    <>
      <TwoFaVerify />
    </>
  );
};

export default page;
