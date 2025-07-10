import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

function generateToken(appID, serverSecret, userID, effectiveTimeInSeconds = 3600, payload = '') {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const effectiveTime = effectiveTimeInSeconds;

  const nonce = uuidv4().replace(/-/g, '');

  const msg = Buffer.concat([
    Buffer.from(appID.toString()),
    Buffer.from(userID),
    Buffer.from(nonce),
    Buffer.from(currentTimestamp.toString()),
    Buffer.from(effectiveTime.toString()),
    Buffer.from(payload)
  ]);

  const hash = crypto.createHmac('sha256', Buffer.from(serverSecret, 'hex')).update(msg).digest();

  const token = Buffer.concat([
    Buffer.from(appID.toString()),
    Buffer.from(userID),
    Buffer.from(nonce),
    Buffer.from(currentTimestamp.toString()),
    Buffer.from(effectiveTime.toString()),
    hash,
    Buffer.from(payload)
  ]).toString('base64');

  return token;
}

export default generateToken;
