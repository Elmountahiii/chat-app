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
import { ConversationService } from "../services/conversatioService";
import { ConversationRepository } from "../repository/conversationRepository";
import { FriendshipRepository } from "../repository/friendshipRepository";
import { FriendshipService } from "../services/friendsipService";
import { FriendshipController } from "../controllers/friendshipController";
import { ConversationController } from "../controllers/conversationController";
import { AuthRepository } from "../repository/authRepository";

export enum ObjectsName {
	// repositories
	AuthRepository = "AuthRepository",
	UserRepository = "UserRepository",
	MessageRepository = "MessageRepository",
	ConversationRepository = "ConversationRepository",
	FriendshipRepository = "FriendshipRepository",

	// services
	AuthService = "AuthService",
	JwtService = "JwtService",
	SocketService = "SocketService",
	UserService = "UserService",
	MessageService = "MessageService",
	ConversationService = "ConversationService",
	FriendshipService = "FriendshipService",
	// controllers
	AuthController = "AuthController",
	UserController = "UserController",
	MessageController = "MessageController",
	ConversationController = "ConversationController",
	FriendshipController = "FriendshipController",
	// validators
	AuthValidator = "AuthValidator",
	UserValidator = "UserValidator",
	MessageValidator = "MessageValidator",
	ConversationValidator = "ConversationValidator",
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

	getAuthRepository() {
		return this.getOrCreate(
			ObjectsName.AuthRepository,
			() => new AuthRepository(),
		);
	}
	getUserRepository() {
		return this.getOrCreate(
			ObjectsName.UserRepository,
			() => new UserRepository(),
		);
	}

	getMessageRepository() {
		return this.getOrCreate(
			ObjectsName.MessageRepository,
			() => new MessageRepository(),
		);
	}

	getConversationRepository() {
		return this.getOrCreate(
			ObjectsName.ConversationRepository,
			() => new ConversationRepository(),
		);
	}

	getFriendshipRepository() {
		return this.getOrCreate(
			ObjectsName.FriendshipRepository,
			() => new FriendshipRepository(),
		);
	}

	// services
	getAuthService() {
		return this.getOrCreate(
			ObjectsName.AuthService,
			() => new AuthService(this.getAuthRepository()),
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
					this.getFriendshipService(),
					this.getConversationService(),
					this.getMessageService(),
				),
		);
	}

	getUserService() {
		return this.getOrCreate(
			ObjectsName.UserService,
			() => new UserService(this.getUserRepository()),
		);
	}

	getMessageService() {
		return this.getOrCreate(
			ObjectsName.MessageService,
			() =>
				new MessageService(
					this.getMessageRepository(),
					this.getConversationService(),
					this.getFriendshipService(),
				),
		);
	}

	getConversationService() {
		return this.getOrCreate(
			ObjectsName.ConversationService,
			() =>
				new ConversationService(
					this.getConversationRepository(),
					this.getFriendshipService(),
				),
		);
	}

	getFriendshipService() {
		return this.getOrCreate(
			ObjectsName.FriendshipService,
			() => new FriendshipService(this.getFriendshipRepository()),
		);
	}

	// controllers
	getAuthController() {
		return this.getOrCreate(ObjectsName.AuthController, () => {
			return new AuthController(this.getAuthService(), this.getAuthValidator());
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
					this.getMessageValidator(),
				),
		);
	}

	getFriendshipController() {
		return this.getOrCreate(
			ObjectsName.FriendshipController,
			() => new FriendshipController(this.getFriendshipService()),
		);
	}

	getConversationController() {
		return this.getOrCreate(
			ObjectsName.ConversationController,
			() => new ConversationController(this.getConversationService()),
		);
	}

	// validators
	getAuthValidator() {
		return this.getOrCreate(ObjectsName.AuthValidator, () => {
			return new AuthValidator();
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
			() => new MessageValidator(),
		);
	}
}
