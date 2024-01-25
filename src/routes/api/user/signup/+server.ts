import { supabase } from "$lib/server/supabase_client.server";
import type { RequestEvent } from "./$types";


export async function POST({
  request,
  cookies,
}: RequestEvent): Promise<Response> {
  const provider = await request.json();
  console.log(provider);
  let given_email=''
   let { data:result, error } = await supabase
   .rpc('can_signup_user', {
   given_email
   })
   if (error) console.error(error)
   else console.log(result)
   if(result == true)
   {
    let given_email='' 
    let given_pfp_url='' 
    let given_publickey='' 
    let given_pwd_hash=''  
    let given_username=''

        let { data:result, error } = await supabase
        .rpc('add_user', {
        given_email, 
        given_pfp_url, 
        given_publickey, 
        given_pwd_hash,  
        given_username
        })
        if (error) console.error(error)
        else console.log(result)

   }
   else
   {
    console.log("user Already Exists")
   }


  let ret_text;
  let response: Response = new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });


  return response;
}
