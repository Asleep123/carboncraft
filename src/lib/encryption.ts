import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const generateKey = (password: string, salt: Buffer): Buffer => {
    return scryptSync(password, salt, 32, { N: 1024, r: 8, p: 1 });
  };

export function encrypt(text: string) {
    const salt = randomBytes(16);
    // biome-ignore lint/style/noNonNullAssertion: checking is done earlier (env.js)
    const key = generateKey(process.env.ENCRYPTION_KEY!, salt)
    const iv = randomBytes(16);
  
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`
  }

export function decrypt(text: string | null) {
  if (!text) return null
    // biome-ignore lint/style/noNonNullAssertion: checking is done earlier (env.js)
    const pass = process.env.ENCRYPTION_KEY!
    const [salt, iv, encryptedText] = text.split(':');
    if (!salt || !iv || !encryptedText) throw new Error("Invalid encryption format.")
        
    const key = generateKey(pass, Buffer.from(salt, "hex"));
  
    const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
  }