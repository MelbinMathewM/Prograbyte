import { Request, Response, NextFunction } from "express";

export const attachFilesToCourse = (req: Request, res: Response, next: NextFunction) => {

    if (Array.isArray(req.files)) {

        const groupedFiles: { [key: string]: Express.Multer.File[] } = {};

        req.files.forEach((file) => {
            if (!groupedFiles[file.fieldname]) {
                groupedFiles[file.fieldname] = [];
            }
            groupedFiles[file.fieldname].push(file);
        });

        req.files = groupedFiles;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (files?.poster) {
        req.body.poster_url = files.poster[0]?.path || "";
    }

    if (files?.preview_video) {
        req.body.preview_video_urls = files.preview_video.map((file) => file.path);
    } else {
        req.body.preview_video_urls = [];
    }

    next();
};

export const attachFilesToTopics = (req: Request, res: Response, next: NextFunction) => {

    const files = req.files as Express.Multer.File[];

    if (Array.isArray(req.body.topics)) {
        req.body.topics.forEach((topic: any, index: number) => {
            const videoFile = files.find(file => file.fieldname === `topics[${index}][video]`);
            const notesFile = files.find(file => file.fieldname === `topics[${index}][notes]`);
    
            topic.video_url = videoFile?.path || "";
            topic.notes_url = notesFile?.path || "";
        });
    } else {
        const videoFile = files.find(file => file.fieldname === "video");
        const notesFile = files.find(file => file.fieldname === "notes");
        
        req.body.video_url = videoFile?.path || req.body.video_url || "";
        req.body.notes_url = notesFile?.path || req.body.notes_url || "";
    }

    console.log(req.body,'rq.bd')

    next();
};


