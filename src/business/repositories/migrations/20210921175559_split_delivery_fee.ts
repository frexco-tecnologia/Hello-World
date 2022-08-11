import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('area', table => {
        table.renameColumn('deliveryFee', 'businessDeliveryFee');
        table.float('individualDeliveryFee', 2).notNullable().defaultTo(14);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('area', table => {
        table.renameColumn('businessDeliveryFee', 'deliveryFee');
        table.dropColumn('individualDeliveryFee');
    });
}
