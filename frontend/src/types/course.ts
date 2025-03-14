export interface Topics {
    _id: string;
    course_id: string;
    topics: Topic[];
}

export interface Topic {
    _id: string;
    title: string;
    level: "Basic" | "Intermediate" | "Advanced";
    video_url: string;
    notes_url: string;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    category_id: { _id: string, name: string };
    price: number;
    rating: number | null;
    preview_video_urls: [string];
    poster_url: string;
    approval_status: "Pending" | "Approved" | "Rejected";
}

export interface Category {
    _id: string,
    name: string,
    type: string
}