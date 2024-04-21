import { inviteError } from "~/lib/constants";

export default function InvalidError({ code }: { code: 0 | 1 | 2 }) {
  return (
    <div className="scale-75 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5">
      <div className="flex w-96 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-lg bg-gray-700 p-4 text-gray-300">
        <p className="text-center text-xs font-bold">YOU RECEIVED INVITE, BUT...</p>
        <h1 className="text-2xl font-semibold text-red-500">{inviteError.title[code]}</h1>
        <p className="text-center text-sm">{inviteError.message[code]}</p>
      </div>
    </div>
  );
}
