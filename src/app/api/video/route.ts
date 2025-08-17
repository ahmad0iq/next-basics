import { NextRequest } from "next/server";
import { connectToDB } from "../../../utils/db";
import Video, { IVideo, VIDEO_DIMENSIONS } from "../../../models/Video";
import apiResponse from "../../../utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../utils/auth";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDB()

        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        if (!videos || videos.length === 0) {
            return apiResponse(false, 404, "No videos found");
        }

        return apiResponse(true, 200, "Videos retrieved successfully", videos);
    } catch {
        return apiResponse(false, 500, "Internal Server Error");
    }
}

export async function POST(request: NextRequest) {
    
    try {
        
        const session = await getServerSession(authOptions);
        if(!session){
            return apiResponse(false, 401, "Unauthorized");
        }

        await connectToDB();

        const body : IVideo = await request.json();

        if( !body.title || !body.description || !body.thumbnail || !body.url ){
            return apiResponse(false, 400, "Invalid request body");
        }

        const videoData : IVideo = {
            ...body,
            user: new mongoose.Types.ObjectId(session.user.id),
            controls: body?.controls ?? true,
            transformation: body?.transformation ?? {
                height: VIDEO_DIMENSIONS.height,
                width: VIDEO_DIMENSIONS.width,
                quality: body?.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData)

        return apiResponse(true, 201, "Video created successfully", newVideo);

    } catch (error) {
        return apiResponse(false, 500, "Internal Server Error");
    }

}