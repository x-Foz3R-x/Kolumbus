import { z } from "zod";

const regex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function isEmail(email: string): boolean {
  if (!email) return false;

  const emailSplit = email.split("@");
  if (emailSplit.length !== 2) return false;

  const [local, domain] = emailSplit;
  if (local.length > 64) return false;
  if (domain.length > 255) return false;

  const domainSplit = domain.split(".");
  if (domainSplit.some((part) => part.length > 63)) return false;

  return regex.test(email) && z.string().email().safeParse(email).success;
}
