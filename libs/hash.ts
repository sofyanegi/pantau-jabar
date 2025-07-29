import { SHA256 as sha256 } from 'crypto-js';

export default async function hashPassword(input: string): Promise<string> {
  return sha256(input).toString();
}
