import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function generateInviteCode( length: number ) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let inviteCode = '';

  for(let i = 0; i < length; i++) {
    inviteCode += characters.charAt(Math.floor(Math.random() * characters.length ))
  }
  return inviteCode;
};

export function snakeCaseToTitle(str: string) {
  return str.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}