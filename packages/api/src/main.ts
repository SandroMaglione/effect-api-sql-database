import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  created_at: Schema.DateFromSelf,
}) {}

class UserGroup extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.post("create-user")`/user/create`
      .setPayload(Schema.Struct({ name: Schema.String }))
      .addError(Schema.String)
      .addSuccess(User)
  )
  .add(
    HttpApiEndpoint.get(
      "get-user"
    )`/user/get/${HttpApiSchema.param("id", Schema.NumberFromString)}`
      .addError(Schema.String)
      .addSuccess(User)
  ) {}

export class ServerApi extends HttpApi.make("server-api").add(UserGroup) {}
