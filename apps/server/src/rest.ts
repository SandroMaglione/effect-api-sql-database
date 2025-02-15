import { HttpApiBuilder } from "@effect/platform";
import { Example, ServerApi } from "@local/api";
import { Effect } from "effect";

export const RestApiLive = HttpApiBuilder.group(ServerApi, "rest", (handlers) =>
  handlers.handle("example", () =>
    Effect.gen(function* () {
      return new Example({ id: crypto.randomUUID(), name: "example" });
    })
  )
);
