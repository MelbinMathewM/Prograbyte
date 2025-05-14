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

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface Course {
    _id: string;
    title: string;
    description: string;
    category_id: { _id: string, name: string };
    tutor_id: string;
    price: number;
    originalPrice?: number;
    rating: number | null;
    preview_video_urls: [string];
    poster_url: string;
    approval_status: ApprovalStatus;
    progress?: number;
    offer: IOffer
}

export interface Category {
    _id:  string | number,
    name: string,
    type: string
}

export interface CoursePurchaseProps {
    course: Course;
    enrolledCourses: EnrolledCourses;
    isDark: boolean;
    isInWishlist: boolean;
    handleWishlistClick: () => void;
}

export interface EnrolledCourse {
    courseId: Course;
    paymentAmount: number;
    completionStatus: number;
}

export interface EnrolledCourses {
    _id: string;
    userId: string;
    courses: EnrolledCourse[];
}

export interface PDFViewerProps {
    notesUrl: string;
    isDark: boolean;
}

export interface AddCourse {
    title: string;
    description: string;
    category_id: string;
    tutor_id: string;
    price: string;
    poster: File | null;
    preview_video: File | null;
};

export interface AddTopic {
    course_id: string;
    title: string;
    level: string;
    video: File | null;
    notes: File | null;
    videoPreview?: string | null;
}

export interface IReview {
    _id: string;
    userId: string;
    rating: number;
    review?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
  
export interface IRating {
    courseId: string;
    reviews: IReview[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICoupon {
    _id: string;
    code: string;
    discount: number;
    isLiveStream: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IOffer {
    _id: string;
    title: string;
    description: string;
    discount: number;
    expiryDate: string;
    createdAt?: string;
    updatedAt?: string;
}
  