import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({
  request,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.auth();
  if (!session?.user) {
    return new (error as any)(
      401,
      "You must be logged in to mark notifications as read"
    );
  }
  const noti_info = await request.json();

  let given_userid = noti_info.user_id;
  if (given_userid === undefined || given_userid === null) {
    console.error(
      "ERROR @api/user/readallnotifications:21: invalid user input error:\n",
      noti_info
    );
    return new (error as any)(
      422,
      "Invalid inputs, while setting user notification as read."
    );
  }

  let { data: result, error: _error } = await supabase.rpc(
    "set_user_all_notification_seen",
    {
      given_userid,
    }
  );
  if (_error) {
    console.error(
      "ERROR @api/user/readallnotifications:38: supabase setting notification as read error\n",
      _error
    );
    return new (error as any)(
      500,
      "Internal Server Error, while setting user notification as read."
    );
  }

  let response: Response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
