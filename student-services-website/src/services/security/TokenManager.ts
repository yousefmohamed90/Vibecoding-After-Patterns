import { User } from '../../entities/User';

export interface AuthToken {
  token: string;
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

export class TokenManager {
  generateToken(user: User): AuthToken {
    const payload = {
      userId: user.userID,
      email: user.email,
      role: user.role,
      exp: Date.now() + 3600000 // 1 hour from now
    };

    const token = btoa(JSON.stringify(payload));
    
    console.log('🎫 TokenManager: Token generated for user:', user.email);
    
    return {
      token,
      userId: user.userID,
      email: user.email,
      role: user.role,
      expiresAt: payload.exp
    };
  }

  validateToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      const isValid = payload.exp > Date.now();
      console.log('🎫 TokenManager: Token validation:', isValid);
      return isValid;
    } catch (error) {
      console.log('🎫 TokenManager: Invalid token');
      return false;
    }
  }

  decodeToken(token: string): { userId: string; email: string; role: string; exp: number } | null {
    try {
      const payload = JSON.parse(atob(token));
      return payload;
    } catch (error) {
      return null;
    }
  }

  refreshToken(oldToken: string): AuthToken | null {
    const decoded = this.decodeToken(oldToken);
    if (!decoded) return null;

    // Check if token is still valid for refresh (within 30 days)
    if (Date.now() - decoded.exp > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    const user = new User(decoded.userId, decoded.email, '', decoded.role);
    return this.generateToken(user);
  }
}
