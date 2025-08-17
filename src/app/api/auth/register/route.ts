import { NextRequest } from "next/server";
import {connectToDB} from "@/utils/db"
import User from "@/models/User";
import apiResponse from "../../../../utils/apiResponse";

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
        return apiResponse(false, 400, "Email, password and name are required");
    }

    await connectToDB();
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return apiResponse(false,409,"User already exists.")
        }

        await User.create({ email, password, name });

        return apiResponse(true, 201, "User registered successfully");
    } catch{
        return apiResponse(false, 500, "Internal Server Error.")
    }
}
