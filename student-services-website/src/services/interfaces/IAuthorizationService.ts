export interface IAuthorizationService {
  checkPermission(userID: string, resource: string, action: string): boolean;
  hasRole(userID: string, role: string): boolean;
}
