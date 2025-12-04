export interface IAuthorizationService {
  hasRole(userId: string, role: string): Promise<boolean>
}
