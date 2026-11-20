import Footer from "../_components/footer";
import TopNav from "../_components/top-nav";
import ContactDetails from "./_components/contact-details";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the creator of Kolumbus by email or Discord.",
};

export default function Contact() {
  return (
    <>
      <TopNav />
      <main className="min-h-[65vh] px-4 pt-16">
        <ContactDetails />
      </main>
      <div className="px-4">
        <Footer />
      </div>
    </>
  );
}
