import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { Schema } from "effect";

export class Example extends Schema.Class<Example>("Example")({
  id: Schema.UUID,
  name: Schema.String,
}) {}

class RestGroup extends HttpApiGroup.make("rest").add(
  HttpApiEndpoint.get("example")`/example`
    .addError(Schema.String)
    .addSuccess(Example)
) {}

export class ServerApi extends HttpApi.make("server-api").add(RestGroup) {}
