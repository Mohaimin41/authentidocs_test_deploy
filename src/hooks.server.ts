import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from '@auth/core/providers/credentials'
async function getUserFromDb(email:string,password:string)
{
    return {uid:'dladlad',name:'johny',email:email,image:null}
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
        
        if (!user) {
          throw new Error('User not found.')
        }

        // return json object with the user data
        console.log(user)
        return user
      }
    })
  ],
})