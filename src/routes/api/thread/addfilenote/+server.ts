import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to add file notes"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);
  const file_info = await request.json();
  // console.log("inside add key",key_info);

  let given_content=file_info.content;
  let given_fileid=file_info.fileid;
  let given_signature=file_info.sign;
  let given_signing_key=file_info.signing_key;
  let given_signing_userid=file_info.given_signing_userid;



  let { data:result, error:_error } = await supabase
  .rpc('add_file_note', {
    given_content, 
    given_fileid, 
    given_signature, 
    given_signing_key, 
    given_signing_userid
  })



  // console.log("add key rps result",result)
  if (_error) {
    console.log("ERROR @api/thread/addfilenote:43: supabase add file note error\n", _error)
    return new Response(JSON.stringify("internal server error while adding file note: " + _error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
