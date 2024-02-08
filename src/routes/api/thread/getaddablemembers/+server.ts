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
  const thread_info = await request.json();
  // console.log("inside add key",key_info);
  let given_threadid = thread_info.given_threadid;





  let { data, error } = await supabase
  .rpc('get_thread_addable_member_list', { 
    given_threadid
  })
if (error) console.error(error)
else console.log(data)



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

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
