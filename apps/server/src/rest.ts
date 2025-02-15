import { HttpApiBuilder } from "@effect/platform";
import { SqlClient, SqlResolver } from "@effect/sql";
import { ServerApi, User } from "@local/api";
import { Effect, Layer, Schema } from "effect";
import { DatabaseLive } from "./database";

export const RestApiLive = HttpApiBuilder.group(ServerApi, "rest", (handlers) =>
  handlers.handle("create-user", ({ payload }) =>
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;

      const InsertPerson = yield* SqlResolver.ordered("InsertPerson", {
        Request: User.pipe(Schema.omit("id", "created_at")),
        Result: User,
        execute: (requests) =>
          sql`
        INSERT INTO "user"
        ${sql.insert(requests)}
        RETURNING *
      `,
      });

      return yield* InsertPerson.execute({ name: payload.name });
    }).pipe(
      Effect.tapError(Effect.logError),
      Effect.mapError((error) => error.message)
    )
  )
).pipe(Layer.provide(DatabaseLive));
