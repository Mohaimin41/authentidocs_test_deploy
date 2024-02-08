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
      JSON.stringify("you must be logged in to view thread details"),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }
  // console.log(session);
  const thread_info = await request.json();
  // console.log("inside add key",key_info);
  let given_threadid = thread_info.threadid;

  let { data: result, error: _error } = await supabase.rpc(
    "get_thread_details",
    {
      given_threadid,
    }
  );

  // console.log("add key rps result",result)
  if (_error) {
    console.log(
      "ERROR @api/thread/getdetails:33: supabase getting thread details error\n",
      _error
    );
    return new Response(
      JSON.stringify(
        "internal server error while getting thread details: " + _error
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
  //   let result_2 :
  let { data: result_2, error: error_2 } = await supabase.rpc(
    "get_thread_mods_details",
    {
      given_threadid,
    }
  );
  if (error_2) {
    console.log(
      "ERROR @api/thread/getdetails:54: supabase getting thread mod details error\n",
      _error
    );
    return new Response(
      JSON.stringify(
        "internal server error while getting thread mod details: " + error_2
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
  let result_mod;
  let result_custodian;
  for (let i = 0; i < result_2.length; i++) {
    let element = result_2[i];
    if (element.f_current_custodian) {
      result_custodian = element;
    }

    if (element.f_role === "admin") {
      result_mod = element;
    }
  }

  let result_3 = {
    thread_detail: result,
    thread_mod_detail: result_mod,
    thread_current_custodian_detail: result_custodian,
  };

  let response: Response = new Response(JSON.stringify(result_3), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
