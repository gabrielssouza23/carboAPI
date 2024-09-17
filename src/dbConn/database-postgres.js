import { randomUUID } from "node:crypto"
import { sql } from "./db.js"

export class DatabasePostgres{


    async list (){
        const items = await sql`SELECT * FROM items`

        return items
    }

   
}