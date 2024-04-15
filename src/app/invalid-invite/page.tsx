import Image from "next/image";

export default function Invalid() {
  return (
    <>
      <div className="fixed inset-0">
        <Image src="/images/asset.svg" alt="asset" className="object-cover object-center" fill />
      </div>

      <div className="relative z-10 flex min-h-screen w-screen items-center justify-center px-4 py-8">
        <div className="flex max-w-4xl flex-col gap-6 rounded-xl bg-white p-8 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">Invalid Invite Links</h1>
            <p>
              Let me innnnn! Got your invite but error message is blocking da wae? Let’s decipher these error messages and get you on board.
            </p>
          </div>

          <div className="space-y-6 rounded-lg bg-gray-100 p-6">
            <h2 className="text-center text-xl font-semibold">Error Messages</h2>
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Unknown Invite</h3>
                <p className="text-gray-600">Your invite link might have expired. In this case, please ask for a new invite link.</p>
              </div>

              <InvalidError code={0} />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Invalid Invite</h3>
                <p className="text-gray-600">
                  You may not have a legitimate invite code. Please verify your invite link or ask for a new one.
                </p>
              </div>
              <InvalidError code={1} />
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Membership Limit</h3>
                <p className="text-gray-600">
                  There’s a limit of 20 memberships per user. If you’ve reached this limit, you’ll need to leave a trip before joining a new
                  one.
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

function InvalidError({ code }: { code: 0 | 1 | 2 }) {
  const error = {
    titles: {
      0: "Unknown Invite",
      1: "Invalid Invite",
      2: "Membership Limit",
    },
    messages: {
      0: "The invite seems to have disappeared. It might have ended its journey.",
      1: "The invite link doesn't seem right. It might be a bit off.",
      2: "You're already part of 20 trips. That's the limit!",
    },
  };

  return (
    <div className="scale-75 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5">
      <div className="flex w-96 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-lg bg-gray-800 p-4 text-gray-300">
        <p className="text-center text-xs font-bold">YOU RECEIVED INVITE, BUT...</p>
        <h1 className="text-2xl font-semibold text-red-500">{error.titles[code]}</h1>
        <p className="text-center text-sm">{error.messages[code]}</p>
      </div>
    </div>
  );
}
