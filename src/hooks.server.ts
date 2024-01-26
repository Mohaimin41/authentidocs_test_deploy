import { SvelteKitAuth,type User } from "@auth/sveltekit"
import Credentials from '@auth/core/providers/credentials'
import { supabase } from "$lib/server/supabase_client.server";
async function getUserFromDb(email:string,password:string)
{
  let given_email=email
  let given_pwd_hash=password

  let { data:result, error } = await supabase
  .rpc('can_log_in_user_boolean', {
    given_email, 
    given_pwd_hash
  })
  // if (error) console.error(error)
  // else console.log("dbresult:"+result)
  if(result == false)
  {
    return {user:{error:'fked up'}, success:false};
  }
  else
  {
    
    let { data:result, error } = await supabase
    .rpc('get_user_details_email', {
      given_email
    })


    return {user:{name:result.userid,email:result.email,image:result.pfp_url},success:true}
  }
}
   
export const handle = SvelteKitAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        password: {},
        email:{}
      },
      authorize: async (credentials) => {
        let user = null
        //console.log(credentials)
        // logic to salt and hash password
        const pwHash = credentials.password
        // logic to verify if user exists
        let response_from_db = await getUserFromDb(<string>credentials.email,<string>credentials.password)
        
        if(response_from_db.success)
        {
          return <User>response_from_db.user;
        }
        else
        {
          throw new Error(JSON.stringify({errors:<User>response_from_db.user,status:false}))
        }

        // return json object with the user data

      }
    })
  ],
  pages:{
    error: '/login', // Error code passed in query string as ?error=
  },
  trustHost:true,
})