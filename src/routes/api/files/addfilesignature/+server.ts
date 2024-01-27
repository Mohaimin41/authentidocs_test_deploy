import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to add files"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);

  const file_signature_info = await request.json();
  // console.log(file_signature_info);

  let given_fileid = file_signature_info.fileid,
    given_signature = file_signature_info.signature,
    given_signing_key = file_signature_info.key,
    given_signing_userid = file_signature_info.userid;

  let { data: result, error:_error } = await supabase.rpc("add_personal_file_signature", {
    given_fileid,
    given_signature,
    given_signing_key,
    given_signing_userid,
  });
  if (_error) {
    return new Response(JSON.stringify("internal server error while adding signature: "+_error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  //  console.log("signing"+result);

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
