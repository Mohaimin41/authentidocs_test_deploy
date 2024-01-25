import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    throw error(401, "You must sign in to add file signatures.");
  }
  // console.log(session);

  const file_signature_info = await request.json();
  // console.log(file_signature_info);

  let given_fileid = file_signature_info.fileid,
    given_signature = file_signature_info.signature,
    given_signing_key = file_signature_info.key,
    given_signing_userid = file_signature_info.userid;

  let { data: result } = await supabase.rpc("add_personal_file_signature", {
    given_fileid,
    given_signature,
    given_signing_key,
    given_signing_userid,
  });

  // console.log(result);

  let ret_text = result;
  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
