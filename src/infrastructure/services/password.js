import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const hash = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
};

const compare = async (storedPass, suppliedPass) => {
  const [hashedPass, salt] = storedPass.split('.');
  const hashedPassBuf = Buffer.from(hashedPass, 'hex');
  const suppliedPassBuf = await scryptAsync(suppliedPass, salt, 64);
  return timingSafeEqual(hashedPassBuf, suppliedPassBuf);
};

export { hash, compare };
