import { JdService } from "./jd.service";
import * as multer from "multer";
export declare class JdController {
    private readonly jdService;
    constructor(jdService: JdService);
    static getJdTextById(id: string): string | undefined;
    uploadJd(file: multer.File): Promise<{
        id: string;
        text: string;
    }>;
}
