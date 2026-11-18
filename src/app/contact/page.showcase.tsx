import Footer from "../_components/footer";
import TopNav from "../_components/top-nav";
import ContactDetails from "./_components/contact-details";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <TopNav />
      <main className="min-h-[65vh] pt-16">
        <ContactDetails />
      </main>
      <Footer />
    </>
  );
}
