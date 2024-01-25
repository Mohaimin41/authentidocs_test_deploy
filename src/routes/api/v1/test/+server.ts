import { supabase } from "$lib/server/supabase_client.server";

export async function POST(): Promise<Response> {
  let ret_text;
  ret_text = {
    ret_text: "Hello from AuthentiDocs team. The server is alive still .",
  };
  // const { data } = await supabase.from("user_data").select();
  // console.log(data);
  // let given_email=''
  // let given_pfp_url=''
  // let given_publickey=''
  // let given_pwd_hash=''
  // let given_username=''

  // let { data:result, error } = await supabase
  // .rpc('add_user', {
  // given_email,
  // given_pfp_url,
  // given_publickey,
  // given_pwd_hash,
  // given_username
  // })
  // if (error) console.error(error)
  // else console.log(result)
  return new Response(JSON.stringify(ret_text), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
