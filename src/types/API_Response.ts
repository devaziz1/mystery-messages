import { Message } from "@/models/User";

export interface API_Response{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
    

}