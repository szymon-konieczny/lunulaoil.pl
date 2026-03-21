import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260321004123 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ingredient" drop constraint if exists "ingredient_handle_unique";`);
    this.addSql(`create table if not exists "ingredient" ("id" text not null, "name" text not null, "name_latin" text null, "handle" text not null, "description" text not null, "benefits" text[] not null default '{}', "source" text null, "category" text not null default 'other', "product_handles" text[] not null default '{}', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ingredient_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ingredient_handle_unique" ON "ingredient" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ingredient_deleted_at" ON "ingredient" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ingredient" cascade;`);
  }

}
