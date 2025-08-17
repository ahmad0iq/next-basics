import { toast } from "sonner";
import { IResponse } from "../types/api";


class ApiCall{
    async post(url: string, data: unknown, verbose: boolean = false) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const res : IResponse = await response.json();
        if (verbose){
            if(res.success){
                toast.success(res.message)
            }
            else{
                toast.error(res.message)
            }
        }
        return res;
    }

    async get(url: string, verbose: boolean = false) {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res : IResponse = await response.json();
        if (verbose){
            if(res.success){
                toast.success(res.message)
            }
            else{
                toast.error(res.message)
            }
        }
        return res;
    }
}

const api = new ApiCall();
export default api;