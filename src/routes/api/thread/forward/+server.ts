import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    return new Response(
      JSON.stringify("you must be logged in to forward threads"),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }
  // console.log(session);
  const file_info = await request.json();
  // console.log("inside add key",key_info);

  let given_src_userid=session.user.name;
  let given_target_userid; 
  let given_threadid = file_info.threadid;
  let { data: result1, error: _error1 } = await supabase.rpc(
    "get_thread_member_list",
    {
      given_threadid,
    }
  );

  // console.log("add key rps result",result)
  if (_error1) {
    console.log(
      "ERROR @api/thread/getmembers:33: supabase get thread user list error\n",
      _error1
    );
    return new Response(
      JSON.stringify("internal server error while getting thread member list: " + _error1),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
  console.log(result1);
  for(let i=0;i<result1.length;i++)
  {
    if(result1[i].f_userid == given_src_userid )
    {
      if(i!=(result1.length-1))
      {
        given_target_userid=result1[i+1].f_signing_serial;
      }
    }
  }

  let { data: result, error: _error } = await supabase.rpc("forward_thread", {
    given_src_userid,
    given_target_userid,
    given_threadid,
  });

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thead/forward:35: supabase forward thread error\n",
      _error
    );
    return new Response(
      JSON.stringify(
        "internal server error while forwarding thread: " + _error
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
