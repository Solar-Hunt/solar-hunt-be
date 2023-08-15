import { formatDBParamsToStr } from "../../utils";
import DB from "../DB"
import _ from "lodash";
import * as monsterController from './monsterController';
import { fillableColumns } from '../Models/hunt';

const table = 'hunts';

// init entry for user
export const init = async() => { }

// create
export const create = async(insertParams: any): Promise<{[id: string]: number}> => {
    const filtered = _.pick(insertParams, fillableColumns);
    const params = formatDBParamsToStr(filtered, ', ', true);

    // put quote
    const insertColumns = Object.keys(filtered);

    const query = `INSERT INTO ${table} (${_.join(insertColumns, ', ')}) VALUES (${params}) RETURNING id`;

    const db = new DB();
    const result = await db.executeQueryForSingleResult(query);

    return result;
}

// view (single - id)
export const view = async(id: number): Promise<any> => {
    const query = `SELECT ${fillableColumns.join(",")} FROM ${table} WHERE id = ${id} LIMIT 1`;

    const db = new DB();
    const result = await db.executeQueryForSingleResult(query);
    result.monster = await monsterController.find({ "monster_id": result.monster_id });

    return result ?? {};
}

// find (all match)
export const find = async(whereParams: {[key: string]: any}): Promise<any[]> => {
    const params = formatDBParamsToStr(whereParams, ' AND ');
    const query = `SELECT * FROM ${table} WHERE ${params}`;

    const db = new DB();
    let result = await db.executeQueryForResults(query);

    if(!result) {
        return [];
    }

    for(const [res, index] of result) {
        result[index].monster =  await monsterController.find({'monster_id': res.monster_id});
    }

    return result as any[] ?? [];
}

// list (all)
export const list = async(): Promise<any[]> => {
    const query = `SELECT * FROM ${table}`;

    const db = new DB();
    const result = await db.executeQueryForResults(query);

    return result as any[] ?? [];
}

// update
export const update = async(id: number, updateParams: {[key: string]: any}): Promise<void> => {
    // filter
    const filtered = _.pick(updateParams, fillableColumns);
    const params = formatDBParamsToStr(filtered, ', ');

    const query = `UPDATE ${table} SET ${params} WHERE id = ${id}`;

    const db = new DB();
    await db.executeQueryForSingleResult(query);
}

// delete (soft delete?)
// export const delete = async(userId: number) => {
//     const query = `DELETE FROM ${table} WHERE user_id = ${userId}`;

//     const db = new DB();
//     await db.executeQueryForSingleResult(query);

//     return result;
// }