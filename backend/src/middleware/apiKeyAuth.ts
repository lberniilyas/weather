import { Request, Response, NextFunction } from 'express';

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const configured = process.env.API_KEY;

  // If no key is configured (dev / test environment), allow all requests through
  if (!configured) {
    next();
    return;
  }

  const provided = req.headers['x-api-key'];
  if (provided !== configured) {
    res.status(401).json({ success: false, error: 'Unauthorized — invalid or missing API key.' });
    return;
  }

  next();
}
