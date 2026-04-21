import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260421120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "ig_trigger" ("id" text not null, "ig_post_id" text not null, "pattern_type" text check ("pattern_type" in ('keyword', 'regex', 'exact')) not null default 'keyword', "pattern" text not null, "product_handle" text not null, "dm_template" text not null, "is_active" boolean not null default true, "rate_limit_hours" integer not null default 24, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ig_trigger_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ig_trigger_ig_post_id" ON "ig_trigger" ("ig_post_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ig_trigger_deleted_at" ON "ig_trigger" ("deleted_at") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "ig_dm_log" drop constraint if exists "ig_dm_log_ig_comment_id_unique";`
    )
    this.addSql(
      `create table if not exists "ig_dm_log" ("id" text not null, "trigger_id" text null, "ig_user_id" text not null, "ig_username" text null, "ig_comment_id" text not null, "comment_text" text not null, "product_handle" text not null, "product_url" text not null, "dm_message_id" text null, "status" text check ("status" in ('sent', 'failed', 'rate_limited', 'duplicate', 'opted_out', 'no_match')) not null, "error" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ig_dm_log_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ig_dm_log_ig_comment_id_unique" ON "ig_dm_log" ("ig_comment_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ig_dm_log_user_trigger_created" ON "ig_dm_log" ("ig_user_id", "trigger_id", "created_at") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ig_dm_log_deleted_at" ON "ig_dm_log" ("deleted_at") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "ig_opt_out" drop constraint if exists "ig_opt_out_ig_user_id_unique";`
    )
    this.addSql(
      `create table if not exists "ig_opt_out" ("id" text not null, "ig_user_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ig_opt_out_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ig_opt_out_ig_user_id_unique" ON "ig_opt_out" ("ig_user_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ig_opt_out_deleted_at" ON "ig_opt_out" ("deleted_at") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ig_dm_log" cascade;`)
    this.addSql(`drop table if exists "ig_opt_out" cascade;`)
    this.addSql(`drop table if exists "ig_trigger" cascade;`)
  }
}
