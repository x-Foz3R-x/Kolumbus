import Link from "next/link";
import Icon from "@/components/icons";
import GlobalNav from "@/components/layouts/global-nav";
import GlobalFooter from "@/components/layouts/global-footer";
import { Map } from "@/components/map";

export default function Index() {
  return (
    <>
      <GlobalNav />

      <main className="flex h-screen w-screen flex-col justify-center overflow-hidden bg-black text-gray-100">
        <div className="h-28" />
        <Map />
      </main>

      {/* Watermark */}
      <div className="fixed bottom-5 left-5 z-[60] rounded-full bg-red-300/60 p-3 text-center font-inter text-xs font-semibold text-red-700 backdrop-blur-sm">
        <span className="absolute inset-0 -z-10 rounded-full bg-red-400 blur" />
        <p>Found bug?</p>
        <Link href="/contact" className="px-4 hover:underline">
          Contact me
        </Link>
      </div>

      <section className="container mx-auto px-4 py-28">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Plan Your Adventures with Ease</h2>
          <p className="text-lg">Whether you&apos;re a seasoned traveler or a first-time explorer,</p>
          <p className="text-lg">Kolumbus makes itinerary creation a breeze.</p>
        </div>

        <div className="flex h-min gap-1 text-center text-white">
          {/* Feature 1 */}
          <div className="w-1/3 rounded-l-2xl rounded-r-md bg-kolumblue-500 p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold">Intuitive Itinerary Builder</h3>
            <p>Create your dream itinerary with</p>
            <p>easy-to-use drag-and-drop interface.</p>
          </div>

          {/* Feature 2 */}
          <div className="w-1/3 rounded-md bg-orange-600 p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold">Seamless Collaboration</h3>
            <p>Share your travel plans and collaborate with friends and family in real-time.</p>
          </div>

          {/* Feature 3 */}
          <div className="w-1/3 rounded-l-md rounded-r-2xl bg-kolumblue-500 p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold">Offline Access Anywhere</h3>
            <p>Access your itineraries offline on our app, ensuring you have all details anywhere, anytime.</p>
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-100">How It Works</h2>
            <p className="text-lg text-gray-300">Follow these simple steps to plan your next adventure with Kolumbus.</p>
          </div>

          <ol className="grid list-inside list-decimal grid-cols-1 gap-8 text-lg text-gray-300 md:grid-cols-2 lg:grid-cols-2">
            <li className="mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium">Sign Up</p>
                  <p className="text-gray-500">Create your Kolumbus account for free.</p>
                </div>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium">Build, Customize, and Enhance</p>
                  <p className="text-gray-500">
                    Select your travel dates and fine-tune your itinerary by adding activities, landmarks, and dining options.
                  </p>
                </div>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium">Collaborate and Share</p>
                  <p className="text-gray-500">Invite travel companions to join your trip and keep everyone informed.</p>
                </div>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium">Hit the Road</p>
                  <p className="text-gray-500">Embark on a stress-free adventure with your perfectly planned itinerary.</p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-4 py-28 text-center">
        <h2 className="mb-4 text-3xl font-bold">Start Your Journey Today</h2>
        <p className="text-lg">Join Kolumbus and transform the way you plan your trips.</p>
        <div className="mt-4 flex items-center justify-center">
          <Link
            href="/sign-in"
            className="relative flex items-center gap-1 bg-transparent fill-gray-900 px-6 py-3 font-bold before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-full before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:fill-gray-900 hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 focus-visible:text-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
          >
            Sign in
            <Icon.chevronBold className="w-2.5 -rotate-90" />
          </Link>
          <Link
            href="/sign-up"
            className="relative flex items-center gap-1 bg-transparent fill-gray-900 px-6 py-3 font-bold before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-full before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:fill-gray-900 hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 focus-visible:text-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
          >
            Sign up
            <Icon.chevronBold className="w-2.5 -rotate-90" />
          </Link>
          {/* <button className="bg-blue-500 mr-4 rounded-full bg-gray-50 px-6 py-3 font-bold">Get Started</button>
          <button className="rounded-full bg-gray-300 px-6 py-3 font-bold text-gray-700">Learn More</button> */}
        </div>
      </section>

      <GlobalFooter />
    </>
  );
}
