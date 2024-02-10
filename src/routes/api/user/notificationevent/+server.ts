// src/routes/custom-event/+server.js
import { events } from "sveltekit-sse";
import { supabase } from "$lib/server/supabase_client.server";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

/**
 * @param {number} milliseconds
 * @returns
 */
function delay(milliseconds: number) {
  return new Promise(function run(resolve) {
    setTimeout(resolve, milliseconds);
  });
}

export function POST({ request, locals }: RequestEvent) {
  return events({
    request,
    async start({ emit }) {
    //   let header_info = await request.
      let given_userid = await request.json().userid;
      if (given_userid === undefined || given_userid === null) {
        console.log("ERROR @api/user/notificationevent:31: invalid input");
        emit("error", JSON.stringify({ message: "invalid inputs" }));
      }
      while (true) {
        let { data: result1, error: error1 } = await supabase.rpc(
          "are_there_notifications",
          {
            given_userid,
          }
        );
        if (error1) {
          console.log(
            "ERROR @api/user/notificationevent:43: supabase checking user notification error\n",
            error1
          );

          emit("error", JSON.stringify({message: "Internal server error while checking notification"}))
        }
        if (result1) {
            let { data: result2, error: _error } = await supabase.rpc(
                "get_user_live_notifications",
                {
                  given_userid,
                }
              );
          
              if (_error) {
                console.log(
                  "ERROR @api/user/getnotifications:40: supabase getting user notification error\n",
                  _error
                );
                return new (error as any)(
                  500,
                  "Internal Server Error, while getting user notifications."
                );
              }
              emit("notifications", JSON.stringify(result2))
        }else {
            emit("notifications", JSON.stringify([]))
        }
        await delay(1000);
      }
    },
  });
}
