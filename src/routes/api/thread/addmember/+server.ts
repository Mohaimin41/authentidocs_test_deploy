import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
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
  const member_info = await request.json();
  // console.log("inside add key",key_info);
  let uid_list = member_info.uid_list;
  let sign_serial=0;
  let given_threadid=member_info.threadid;
  for(let i=0;i<uid_list.len();i++)
  {
    let given_signing_serial=sign_serial++;
    let given_user_role="member";
    let given_userid=uid_list[i];
  
    let { data:result, error:_error } = await supabase
    .rpc('add_thread_member', {
      given_signing_serial, 
      given_threadid, 
      given_user_role, 
      given_userid
    })


  // console.log("add key rps result",result)
  if (_error) {
    console.log("ERROR @api/user/addkey:33: supabase add user publickey error\n", _error)
    return new Response(JSON.stringify("internal server error while adding user key: " + _error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}

  let response: Response = new Response(JSON.stringify(sign_serial), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
