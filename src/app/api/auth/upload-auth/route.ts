import { getUploadAuthParams } from "@imagekit/next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../utils/auth"
import apiResponse from "../../../../utils/apiResponse"

export async function GET() {
    
   try {
     const session =  await getServerSession(authOptions)
     if(!session?.user){
        return apiResponse(false,401,"Unauthorized")
      }
      return apiResponse(true, 200, "session", session)
 
     const uploadAuthParams = getUploadAuthParams({
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
         publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
     })
     
     return apiResponse(true, 200, "Upload auth params retrieved successfully", {...uploadAuthParams, publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY})
   } catch {
     return apiResponse(false, 500, "Authentication for upload failed.")
   }
}