import { filemap } from "$lib/server/stores";
import { json, type RequestEvent } from "@sveltejs/kit";
import fs from "fs";
import { get } from "svelte/store";

export async function POST({request, cookies, locals}: RequestEvent): Promise<Response>
{
    let url: URL = new URL(request.url);
    let filename: string | null = url.searchParams.get("filename");

    if(filename === null)
    {
        return json({success: false});
    }

    let file_array: number[] | undefined = get(filemap).get(filename);

    if(file_array === undefined)
    {
        return json({success: false});
    }

    let file_uint8: Uint8Array = new Uint8Array(file_array);

    console.log(file_array);

    // flush
    fs.writeFileSync("/home/siam11651/" + filename, file_uint8);

    return json({sucess: true});
}