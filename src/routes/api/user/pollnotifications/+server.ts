import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    
    return new Response(JSON.stringify("you must be logged in to view notifications), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 401,
    });
  }
  // console.log(session);
  const team_info = await request.json();
  // console.log("inside add key",key_info);
  let given_threadid = team_info.given_userid;


  let { data:result, error:_error } = await supabase
  .rpc('are_there_notifications', {
    given_userid
  })

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thread/getmembers:33: supabase checking notification existence error\n",
      _error
    );
    return new Response(
      JSON.stringify("internal server error while polling notification list: " + _error),
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
