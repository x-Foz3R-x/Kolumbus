import AccountTopNav from "./_components/account-top-nav";
import HomePage from "./_components/home-page";

export default function Page() {
  return <HomePage nav={<AccountTopNav />} />;
}
