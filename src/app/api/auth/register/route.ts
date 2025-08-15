import { NextRequest, NextResponse } from "next/server";
import {connectToDB} from "@/utils/db"
import User from "@/models/User";

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
        return NextResponse.json({ error: "Email, password and name are required" }, { status: 400 });
    }

    await connectToDB();
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        await User.create({ email, password, name });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
