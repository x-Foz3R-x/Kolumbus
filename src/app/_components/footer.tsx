import { Divider, Link } from "~/components/ui";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col justify-center whitespace-nowrap bg-kolumblue-500 fill-white pt-24 text-white">
      <div className="flex justify-evenly">
        <ul>
          <h3 className="text-d-2xl">Links</h3>
          <Link.Arrow href="" size="dxl" className="fill-white">
            Home
          </Link.Arrow>
          <Link.Arrow href="" size="dxl" className="fill-white">
            About
          </Link.Arrow>
          <Link.Arrow href="" size="dxl" className="fill-white">
            Contact
          </Link.Arrow>
          <Link.Arrow href="" size="dxl" className="fill-white">
            Invalid Invite
          </Link.Arrow>
        </ul>

        <ul>
          <h3 className="text-d-2xl">Social</h3>
          <Link.Arrow href="" size="dxl" className="fill-white">
            Youtube
          </Link.Arrow>
          <Link.Arrow href="" size="dxl" className="fill-white">
            Instagram
          </Link.Arrow>
          <Link.Arrow href="" size="dxl" className="fill-white">
            X
          </Link.Arrow>
        </ul>
      </div>

      <div className="flex justify-between px-4 py-2 text-sm text-kolumblue-300">
        <div className="flex gap-1">
          <p className="whitespace-nowrap">Copyright &copy; 2024 Kolumbus. All rights reserved.</p>

          <div className="flex">
            <Link.UnderLine href="/privacy-policy" className="text-sm text-kolumblue-300">
              Privacy
            </Link.UnderLine>

            <Divider orientation="vertical" className="my-auto h-4 bg-kolumblue-400" />

            <Link.UnderLine href="/terms-of-service" className="text-sm text-kolumblue-300">
              Terms
            </Link.UnderLine>

            <Divider orientation="vertical" className="my-auto h-4 bg-kolumblue-400" />

            <Link.UnderLine href="/faq" className="text-sm text-kolumblue-300">
              FAQ
            </Link.UnderLine>
          </div>
        </div>

        <div>Site by Foz3R</div>
      </div>
    </footer>
  );
}
