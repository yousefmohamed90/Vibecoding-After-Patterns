import { IAuthorizationService } from '../interfaces/IAuthorizationService';
import { IRepository } from '../../repositories/IRepository';

export class AuthorizationService implements IAuthorizationService {
  private permissions = {
    STUDENT: [
      'accommodation:book',
      'accommodation:cancel',
      'transport:book',
      'transport:cancel',
      'meal:order',
      'meal:cancel',
      'club:join',
      'club:leave',
      'profile:view',
      'profile:edit',
      'notifications:view'
    ],
    ADMIN: ['*:*'] // All permissions
  };

  constructor(private permissionRepository: IRepository) {
    console.log('🔒 AuthorizationService: Created');
  }

  checkPermission(userID: string, resource: string, action: string): boolean {
    console.log(`🔒 AuthorizationService: Checking permission for ${userID}: ${resource}:${action}`);

    const user = this.permissionRepository.findById(userID, 'users');
    
    if (!user) {
      console.log('❌ User not found');
      return false;
    }

    const userPerms = this.permissions[user.role as keyof typeof this.permissions] || [];
    const hasPermission = userPerms.includes(`${resource}:${action}`) || userPerms.includes('*:*');

    console.log(`${hasPermission ? '✅' : '❌'} Permission ${hasPermission ? 'granted' : 'denied'}`);
    return hasPermission;
  }

  async hasRole(userID: string, role: string): Promise<boolean> {
    console.log(`🔒 AuthorizationService: Checking role for ${userID}: ${role}`);

    const user = this.permissionRepository.findById(userID, 'users');
    
    if (!user) {
      console.log('❌ User not found');
      return false;
    }

    const hasRole = user.role === role;
    console.log(`${hasRole ? '✅' : '❌'} Role ${hasRole ? 'match' : 'mismatch'}`);
    return hasRole;
  }
}
