import { Server } from "http";
import { UserRepository } from "../repository/userRepository";
import { AuthService } from "../services/authService";
import { JwtService } from "../services/jwtService";
import { SocketService } from "../services/socketService";
import { UserService } from "../services/userService";
import { AuthValidator } from "../validators/authValidator";
import { UserValidator } from "../validators/userValidator";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";
import { MessageRepository } from "../repository/messageRepository";
import { MessageService } from "../services/messageService";
import { MessageController } from "../controllers/messageController";
import { MessageValidator } from "../validators/messageValidator";
import { TypedEventEmitter } from "../validators/events";

export enum ObjectsName {
  // repositories
  UserRepository = "UserRepository",
  MessageRepository = "MessageRepository",
  // services
  AuthService = "AuthService",
  JwtService = "JwtService",
  SocketService = "SocketService",
  UserService = "UserService",
  MessageService = "MessageService",
  // controllers
  AuthController = "AuthController",
  UserController = "UserController",
  MessageController = "MessageController",
  // validators
  AuthValidator = "AuthValidator",
  UserValidator = "UserValidator",
  MessageValidator = "MessageValidator",
  // events
  MessageEventEmitter = "MessageEventEmitter",
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

  getMessageRepository() {
    return this.getOrCreate(
      ObjectsName.MessageRepository,
      () => new MessageRepository()
    );
  }

  // services
  getAuthService() {
    return this.getOrCreate(
      ObjectsName.AuthService,
      () => new AuthService(this.getUserRepository())
    );
  }

  getJwtService() {
    return this.getOrCreate(ObjectsName.JwtService, () => new JwtService());
  }
  getSocketService(server: Server) {
    return this.getOrCreate(
      ObjectsName.SocketService,
      () => new SocketService(server, this.getMessageEventEmitter())
    );
  }

  getUserService() {
    return this.getOrCreate(
      ObjectsName.UserService,
      () =>
        new UserService(this.getUserRepository(), this.getMessageEventEmitter())
    );
  }

  getMessageService() {
    return this.getOrCreate(
      ObjectsName.MessageService,
      () =>
        new MessageService(this.getMessageRepository(), this.getUserService())
    );
  }

  // controllers
  getAuthController() {
    return this.getOrCreate(ObjectsName.AuthController, () => {
      return new AuthController(
        this.getAuthService(),
        this.getAuthValidator(),
        this.getMessageEventEmitter()
      );
    });
  }

  getUserController() {
    return this.getOrCreate(ObjectsName.UserController, () => {
      return new UserController(
        this.getUserService(),
        this.getUserValidator(),
        this.getMessageEventEmitter()
      );
    });
  }

  getMessageController() {
    return this.getOrCreate(
      ObjectsName.MessageController,
      () =>
        new MessageController(
          this.getMessageService(),
          this.getUserService(),
          this.getMessageValidator(),
          this.getMessageEventEmitter()
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

  getMessageValidator() {
    return this.getOrCreate(
      ObjectsName.MessageValidator,
      () => new MessageValidator()
    );
  }

  getMessageEventEmitter() {
    return this.getOrCreate(ObjectsName.MessageEventEmitter, () => {
      return new TypedEventEmitter();
    });
  }
}
