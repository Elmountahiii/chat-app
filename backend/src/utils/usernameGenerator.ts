import { UserRepository } from "../repository/userRepository";
import { AppError } from "../types/common";

export class UsernameGenerator {
  constructor(
    private firstName: string,
    private lastName: string,
    private userRepo: UserRepository
  ) {
    if (!firstName || !lastName) {
      throw new AppError(
        "First name and last name are required for username generation",
        400
      );
    }
    this.firstName = this.sanitizeInput(firstName);
    this.lastName = this.sanitizeInput(lastName);
  }

  async generate(maxLength: number = 15) {
    const baseUsername = this.firstName.charAt(0) + this.lastName;
    const userName = baseUsername.substring(0, maxLength);
    if (!(await this.userRepo.findByUserName(userName))) {
      return userName;
    }
    const maxAttempts = 100;
    for (let i = 1; i <= maxAttempts; i++) {
      const candidate =
        baseUsername.substring(0, maxLength - i.toString().length) + i;
      if (!(await this.userRepo.findByUserName(candidate))) {
        return candidate;
      }
    }
    return await this.generateRandomUserName(maxLength);
  }
  async generateRandomUserName(maxLength: number = 15) {
    const prefix = this.firstName.charAt(0) + this.lastName;
    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
      const randomNum = Math.floor(Math.random() * 999999);
      const randomUsername = `${prefix}${randomNum}`.substring(0, maxLength);

      if (!(await this.userRepo.findByUserName(randomUsername))) {
        return randomUsername;
      }
    }

    return `user${Date.now().toString().slice(-6)}`;
  }
  
  private sanitizeInput(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }
}
