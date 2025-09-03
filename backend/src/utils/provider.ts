import { Server } from "http";
import { FriendshipRepository } from "../repository/friendshipRepository";
import { UserRepository } from "../repository/userRepository";
import { AuthService } from "../services/authService";
import { FriendshipService } from "../services/friendshipService";
import { JwtService } from "../services/jwtService";
import { SocketService } from "../services/socketService";
import { UserService } from "../services/userService";
import { AuthValidator } from "../validators/authValidator";
import { UserValidator } from "../validators/userValidator";
import { AuthController } from "../controllers/authController";
import { FriendshipController } from "../controllers/friendshipController";
import { UserController } from "../controllers/userController";
import { FriendshipValidator } from "../validators/friendshipValidator";
import { MessageRepository } from "../repository/messageRepository";
import { MessageService } from "../services/messageService";
import { MessageController } from "../controllers/messageController";
import { MessageValidator } from "../validators/messageValidator";

export enum ObjectsName {
  // repositories
  "UserRepository",
  "FriendshipRepository",
  "MessageRepository",
  // services
  "AuthService",
  "FriendshipService",
  "JwtService",
  "SocketService",
  "UserService",
  "MessageService",
  // controllers
  "AuthController",
  "FriendshipController",
  "UserController",
  "MessageController",
  // validators
  "AuthValidator",
  "UserValidator",
  "FriendshipValidator",
  "MessageValidator",
}

export class Provider {
  private static instance: Provider;
  private objects = new Map<ObjectsName, unknown>();

  private constructor() {}

  static getInstance(): Provider {
    if (!Provider.instance) {
      Provider.instance = new Provider();
    }
    return Provider.instance;
  }

  private getOrCreate<T>(key: ObjectsName, factory: () => T): T {
    if (!this.objects.has(key)) {
      this.objects.set(key, factory());
    }
    return this.objects.get(key) as T;
  }

  // repositories
  getUserRepository() {
    return this.getOrCreate(
      ObjectsName.UserRepository,
      () => new UserRepository()
    );
  }
  getFriendshipRepository() {
    return this.getOrCreate(
      ObjectsName.FriendshipRepository,
      () => new FriendshipRepository(this.getUserRepository())
    );
  }

  getMessageRepository() {
    return this.getOrCreate(
      ObjectsName.MessageRepository,
      () => new MessageRepository(this.getFriendshipRepository())
    );
  }

  // services
  getAuthService() {
    return this.getOrCreate(
      ObjectsName.AuthService,
      () => new AuthService(this.getUserRepository())
    );
  }
  getFriendshipService() {
    return this.getOrCreate(
      ObjectsName.FriendshipService,
      () => new FriendshipService(this.getFriendshipRepository())
    );
  }
  getJwtService() {
    return this.getOrCreate(ObjectsName.JwtService, () => new JwtService());
  }
  getSocketService(server: Server) {
    return this.getOrCreate(
      ObjectsName.SocketService,
      () =>
        new SocketService(
          server,
          this.getUserService(),
          this.getJwtService(),
          this.getMessageService()
        )
    );
  }

  getUserService() {
    return this.getOrCreate(
      ObjectsName.UserService,
      () => new UserService(this.getUserRepository())
    );
  }

  getMessageService() {
    return this.getOrCreate(
      ObjectsName.MessageService,
      () => new MessageService(this.getMessageRepository())
    );
  }

  // controllers
  getAuthController() {
    return this.getOrCreate(ObjectsName.AuthController, () => {
      return new AuthController(
        this.getAuthService(),
        this.getJwtService(),
        this.getAuthValidator()
      );
    });
  }
  getFriendshipController() {
    return this.getOrCreate(ObjectsName.FriendshipController, () => {
      return new FriendshipController(
        this.getFriendshipService(),
        this.getUserService(),
        this.getFriendshipValidator()
      );
    });
  }
  getUserController() {
    return this.getOrCreate(ObjectsName.UserController, () => {
      return new UserController(this.getUserService(), this.getUserValidator());
    });
  }

  getMessageController() {
    return this.getOrCreate(
      ObjectsName.MessageController,
      () =>
        new MessageController(
          this.getMessageService(),
          this.getMessageValidator()
        )
    );
  }

  // validators
  getAuthValidator() {
    return this.getOrCreate(ObjectsName.AuthValidator, () => {
      return new AuthValidator(this.getAuthService());
    });
  }
  getUserValidator() {
    return this.getOrCreate(ObjectsName.UserValidator, () => {
      return new UserValidator();
    });
  }

  getFriendshipValidator() {
    return this.getOrCreate(ObjectsName.FriendshipValidator, () => {
      return new FriendshipValidator();
    });
  }

  getMessageValidator() {
    return this.getOrCreate(
      ObjectsName.MessageValidator,
      () => new MessageValidator()
    );
  }
}
