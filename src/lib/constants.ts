export const tripFallbackUrl = "https://utfs.io/f/7835a843-9efb-493d-adef-a8a3bf87e177-m8y5iu.png";
export const eventFallbackUrl = "https://utfs.io/f/ab0352db-44ca-4874-b68f-cc78c6dd19c8-ang3v.png";

export const accountUrl =
  process.env.NODE_ENV === "production"
    ? "https://accounts.kolumbus.app/user"
    : "https://tender-gelding-62.accounts.dev/user";

export const unknownError = "An unknown error occurred. Please try again later.";
export const inviteError = {
  title: {
    0: "Invalid Invite",
    1: "Unknown Invite",
    2: "Membership Limit",
  },
  message: {
    0: "The invite link doesn't seem right.\n It might be a bit off.",
    1: "The invite seems to have disappeared.\n It might have ended its journey.",
    2: "You're already part of 20 trips. That's the limit!",
  },
};
