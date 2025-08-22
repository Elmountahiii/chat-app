import { uuidSchema } from "../schema/friendship/frinedshipCommonSchema";

export class FriendshipValidator {
  constructor() {}

  validateUUID(uuid: unknown) {
    // const id = uuidSchema.parse(uuid);
    return uuid as string;
  }
}
