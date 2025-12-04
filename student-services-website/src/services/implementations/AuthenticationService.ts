import { IAuthenticationService, RegisterDTO } from '../interfaces/IAuthenticationService';
import { IRepository } from '../../repositories/IRepository';
import { PasswordHasher } from '../security/PasswordHasher';
import { TokenManager, AuthToken } from '../security/TokenManager';
import { User } from '../../entities/User';
import { Student } from '../../entities/Student';
import { Admin } from '../../entities/Admin';

export class AuthenticationService implements IAuthenticationService {
  private passwordHasher: PasswordHasher;
  private tokenManager: TokenManager;

  constructor(private userRepository: IRepository) {
    this.passwordHasher = new PasswordHasher();
    this.tokenManager = new TokenManager();
    console.log('🔐 AuthenticationService: Created');
  }

  async login(username: string, password: string): Promise<string> {
    console.log('🔐 AuthenticationService: Login for user:', username);
    // Delegate to authenticate and return token
    const authToken = this.authenticate(username, password);
    return authToken.token;
  }

  authenticate(email: string, password: string): AuthToken {
    console.log('🔐 AuthenticationService: Authenticating user:', email);

    // Find user by email
    const users = this.userRepository.findByQuery({ email }, 'users');
    
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    if (!this.passwordHasher.verify(password, user.passwordHash)) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.tokenManager.generateToken(user);
    
    console.log('✅ AuthenticationService: User authenticated successfully');
    return token;
  }

  register(userData: RegisterDTO): User {
    console.log('🔐 AuthenticationService: Registering new user:', userData.email);

    // Check if user already exists
    const existingUsers = this.userRepository.findByQuery(
      { email: userData.email },
      'users'
    );

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = this.passwordHasher.hash(userData.password);

    // Create user ID
    const userID = `${userData.role.toLowerCase()}_${Date.now()}`;

    // Create user entity
    const user = new User(
      userID,
      userData.email,
      passwordHash,
      userData.role
    );

    // Save to users table
    this.userRepository.save(user, 'users');

    // Also save to role-specific table
    if (userData.role === 'STUDENT') {
      const student = new Student(
        userID,
        userData.name,
        userData.email,
        passwordHash
      );
      this.userRepository.save(student, 'students');
    } else if (userData.role === 'ADMIN') {
      const admin = new Admin(
        userID,
        userData.name,
        userData.email,
        passwordHash,
        'ADMIN',
        ['*:*'] // Admin has all permissions
      );
      this.userRepository.save(admin, 'admins');
    }

    console.log('✅ AuthenticationService: User registered successfully');
    return user;
  }

  validateToken(token: string): boolean {
    return this.tokenManager.validateToken(token);
  }

  async logout(): Promise<void> {
    console.log(`🔐 AuthenticationService: Logging out user`);
    // Blacklist token logic would go here
  }

  changePassword(userID: string, oldPassword: string, newPassword: string): boolean {
    console.log('🔐 AuthenticationService: Changing password for user:', userID);

    const user = this.userRepository.findById(userID, 'users');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    if (!this.passwordHasher.verify(oldPassword, user.passwordHash)) {
      throw new Error('Incorrect old password');
    }

    // Hash new password
    const newPasswordHash = this.passwordHasher.hash(newPassword);
    user.passwordHash = newPasswordHash;

    // Update user
    this.userRepository.update(user, 'users', 'userID');

    console.log('✅ AuthenticationService: Password changed successfully');
    return true;
  }

  resetPassword(email: string): void {
    console.log('🔐 AuthenticationService: Password reset requested for:', email);
    // In production, send reset email
    // For now, just log it
    console.log('📧 Password reset email would be sent to:', email);
  }
}
