import { Request, Response, NextFunction } from 'express';
import { verifySupabaseToken } from '../config/supabase';


// Extend Express Request to carry the verified user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];



    const user = await verifySupabaseToken(token);
    req.user = { id: user.id, email: user.email ?? undefined };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
