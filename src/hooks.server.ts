import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from '@auth/core/providers/credentials'
import { supabase } from "$lib/server/supabase_client.server";
async function getUserFromDb(email:string,password:string)
{
  let given_email=email
  let given_pwd_hash=password

    let { data:result, error } = await supabase
    .rpc('can_log_in_user', {
      given_email, 
      given_pwd_hash
    })
    if (error) console.error(error)
    else console.log(result)
  if(result.userid == null)
  {
    return {errors:'fked up'};
  }
  else
  {
    return {uid:result.userid,name:result.username,email:result.email,image:result.pfp_url}
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
        console.log(credentials)
        // logic to salt and hash password
        const pwHash = credentials.password
        // logic to verify if user exists
        user = await <User>getUserFromDb(<string>credentials.email,<string>credentials.password)
        
        if(!user.errors)
        {
          return user;
        }
        else
        {
          throw new Error(JSON.stringify({errors:user.error,status:false}))
        }

        // return json object with the user data

      }
    })
  ],
  pages:{
    //error: '/login?error=1', // Error code passed in query string as ?error=
  }
})