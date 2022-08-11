import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('area', table => {
        table.increments('id').primary();
        table.float('deliveryFee', 2).notNullable();
        table.string('name', 255).notNullable();
        table.specificType('polygon', 'geometry(POLYGON, 4326)');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('area');
}
