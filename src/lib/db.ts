import Dexie, { type PromiseExtended, type Table } from "dexie";

export interface PriveKey
{
    id: string;
    key: CryptoKey;
}

export class PrivKeyDB extends Dexie {

    priv_key!: Table<PriveKey>;

    constructor()
    {
        super('myData.db');
        this.version(1).stores(
        {
            priv_key: '&id, key'
        });
    }
}

export let db: PrivKeyDB = new PrivKeyDB();