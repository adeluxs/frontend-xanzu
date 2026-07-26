import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/settings/account-settings");
};

export default page;
