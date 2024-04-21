import TravelersBackground from "~/components/artwork/travelers-background";
import InvalidError from "./_components/invalid-invite";

export default function Invalid() {
  return (
    <>
      <TravelersBackground />

      <div className="absolute inset-0 flex size-full min-h-fit items-center justify-center sm:p-4">
        <div className="flex max-w-4xl flex-col gap-6 bg-white p-8 shadow-2xl sm:rounded-xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">Invalid Invite Links</h1>
            <p>
              Let me innnnn! Got your invite but error message is blocking da wae? Let’s decipher
              these error messages and get you on board.
            </p>
          </div>

          <div className="space-y-6 rounded-lg bg-gray-100 p-6">
            <h2 className="text-center text-xl font-semibold">Error Messages</h2>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Invalid Invite</h3>
                <p className="text-gray-600">
                  You may not have a legitimate invite code. Please verify your invite link or ask
                  for a new one.
                </p>
              </div>

              <InvalidError code={0} />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Unknown Invite</h3>
                <p className="text-gray-600">
                  Your invite link might have expired. In this case, please ask for a new invite
                  link.
                </p>
              </div>

              <InvalidError code={1} />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Membership Limit</h3>
                <p className="text-gray-600">
                  There’s a limit of 20 memberships per user. If you’ve reached this limit, you’ll
                  need to leave a trip before joining a new one.
                </p>
              </div>
              <InvalidError code={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
