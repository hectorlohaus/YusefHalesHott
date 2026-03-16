import crypto from 'crypto';

export function generateGetnetAuth() {
  const login = process.env.GETNET_LOGIN!;
  const secretKey = process.env.GETNET_SECRET_KEY!;

  // nonce should be a random string, base64 encoded for the payload, 
  // but raw for the hash.
  const rawNonce = crypto.randomBytes(16);
  const nonceBase64 = rawNonce.toString('base64');
  
  const seed = new Date().toISOString(); 
  
  // tranKey = Base64(SHA-256(nonce + seed + secretkey))
  // where nonce is raw bytes. By documentation: "The nonce within the operation is the original, ie the one not encoded in Base64"
  // Wait, concatenating bytes and strings in Node.js:
  const hash = crypto.createHash('sha256');
  hash.update(rawNonce);
  hash.update(Buffer.from(seed, 'utf-8'));
  hash.update(Buffer.from(secretKey, 'utf-8'));
  
  const tranKey = hash.digest('base64');

  return {
    login,
    tranKey,
    nonce: nonceBase64,
    seed
  };
}
