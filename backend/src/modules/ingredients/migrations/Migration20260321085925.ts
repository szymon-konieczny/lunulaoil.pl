import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260321085925 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ingredient" add column if not exists "hide_in_lexicon" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "ingredient" drop column if exists "hide_in_lexicon";`);
  }

}
