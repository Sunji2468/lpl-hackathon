import jwt from 'jsonwebtoken';

export function requireAuth(jwtSecret) {
  return (req, res, next) => {
    const authorization = req.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    const token = authorization.slice(7);

    try {
      const payload = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'],
        issuer: 'lpl-server',
        audience: 'lpl-client',
      });

      req.user = {
        id: payload.sub,
      };

      next();
    } catch {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }
  };
}