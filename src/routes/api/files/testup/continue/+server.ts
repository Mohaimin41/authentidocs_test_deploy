import { filemap } from "$lib/server/stores";
import { error, json, type RequestEvent } from "@sveltejs/kit";
import { get } from "svelte/store";

export async function POST({request, cookies, locals}: RequestEvent): Promise<Response>
{
    const session = await locals.getSession()
    if (!session?.user) {
      throw error(401, "You must sign in to add files.")
    }
    
    let url: URL = new URL(request.url);
    let filename: string | null = url.searchParams.get("filename");

    if(filename === null)
    {
        return json({success: false});
    }

    let request_obj: any = await request.json();
    let data: number[] = request_obj.data;
    let old_data: number[] | undefined = get(filemap).get(filename);

    if(old_data === undefined)
    {
        old_data = [];
    }

    old_data = old_data.concat(data);

    get(filemap).set(filename, old_data);

    return json({sucess: true});
}