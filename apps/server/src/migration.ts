import { NodeContext } from "@effect/platform-node";
import { PgClient, PgMigrator } from "@effect/sql-pg";
import { Config, Layer } from "effect";
import { fileURLToPath } from "node:url";

const PgLive = PgClient.layerConfig({
  password: Config.redacted("POSTGRES_PW"),
  username: Config.succeed("postgres"),
  database: Config.succeed("postgres"),
  host: Config.succeed("localhost"),
  port: Config.succeed(5435),
});

const MigratorLive = PgMigrator.layer({
  // Where to put the `_schema.sql` file
  schemaDirectory: "src/migrations",
  loader: PgMigrator.fromFileSystem(
    fileURLToPath(new URL("migrations", import.meta.url))
  ),
}).pipe(Layer.provide(PgLive));

export const DatabaseLive = Layer.mergeAll(PgLive, MigratorLive).pipe(
  Layer.provide(NodeContext.layer)
);
