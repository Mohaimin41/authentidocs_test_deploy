import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";
import { json, error } from "@sveltejs/kit";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    throw error(401, "You must sign in to add file signatures.");
  }

  const file_info = await request.json();

  let ret_text;
  let given_fileid = file_info.fileid;
  // console.log("getfilesigns 19:", given_fileid);

  let { data:result } = await supabase.rpc("get_file_signatures_fileid", {
    given_fileid
  });
  // if (error) console.log("getfilesigns 24: ",error.toString());
  // console.log("getfilesigns 25: ", result);

  ret_text = result;

  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
