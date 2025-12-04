export class PasswordHasher {
  hash(password: string): string {
    // Simple hash simulation (in production, use bcrypt)
    const salt = 'student_services_salt';
    const combined = password + salt;
    const hash = btoa(combined);
    console.log('🔐 PasswordHasher: Password hashed');
    return hash;
  }

  verify(password: string, hash: string): boolean {
    const computedHash = this.hash(password);
    const isValid = computedHash === hash;
    console.log('🔐 PasswordHasher: Password verification:', isValid);
    return isValid;
  }
}
