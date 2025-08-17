import { NextResponse } from "next/server";
import { IResponse } from "../types/api";

export default function apiResponse(success: boolean, status: number, message: string, data: unknown = []) : NextResponse<IResponse>{
    return NextResponse.json({
        success: success,
        status: status,
        message: message,
        data: data
    }, {status: status})
}