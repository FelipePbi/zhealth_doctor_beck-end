import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.currentDoctor = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid Token' });
  }
};
