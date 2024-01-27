import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";
import { json, error } from "@sveltejs/kit";



export async function POST({
  request,
  cookies,
  locals,
}: RequestEvent): Promise<Response> {
  const session = await locals.getSession();
  if (!session?.user) {
    throw error(401, "You must sign in to add file signatures.");
  }
  const file_info = await request.json();
  // console.log(key_info);
  let given_fileid=file_info.fileid
  let given_userid=file_info.user_id

    
let { data:result1, error: _error } = await supabase
.rpc('get_single_filedata_fileid', {
  given_fileid, 
  given_userid
})

const { data:result2} = await supabase
  .storage
  .from("user_personal_files")
  .createSignedUrl(result1.file_url, 24*60*60)

  const { data:result3} = await supabase
  .storage
  .from("user_personal_files")
  .createSignedUrl(result1.file_url, 24*60*60, {
    download: result1.filename,
  })

  let response_obj = {file_link_preview:result2?.signedUrl,file_link_download:result3?.signedUrl,file_data:result1}
  let response: Response = new Response(JSON.stringify(response_obj), {
  headers: {
    "Content-Type": "application/json",
  },
});


  return response;
}
