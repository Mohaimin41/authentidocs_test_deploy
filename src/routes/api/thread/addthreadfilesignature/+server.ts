import type { RequestEvent } from "./$types";
import { supabase } from "$lib/server/supabase_client.server";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(JSON.stringify("you must be logged in to add file signatures"), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);

  const file_signature_info = await request.json();
  //  console.log("inside file signature api: ",file_signature_info);

  let given_fileid = file_signature_info.fileid,
    given_signature = file_signature_info.signature,
    given_signing_key = file_signature_info.key,
    given_signing_userid = file_signature_info.userid,
    given_current_userid = session.user.name;

    let { data:result, error:_error } = await supabase
    .rpc('make_threadfile_viewed_signed', {
      given_current_userid, 
      given_fileid, 
      given_signature, 
      given_signing_key
    })
  // console.log("error @33: ", _error)
  if (_error) {
    console.log("ERROR @api/thread/addthreadfilesignature:36: supabase file signatuer insert error\n", _error)
    return new Response(JSON.stringify("internal server error while adding signature: "+_error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }

  //  console.log("signing @42: "+result);

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
