export interface Blog {
    _id: string;
    user_id: string;
    title: string;
    content: string;
    image?: string;
    username: string;
    likes: string[];
    comments: number;
}

export interface Comment {
    _id: string;
    content: string;
    user_id: string;
    username: string;
    likes: string[];
}

export interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogId: string;
    userId: string;
    username: string;
    isDark: boolean;
    blogOwnerId: string;
}

export interface AddBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    newTitle: string;
    setNewTitle: (value: string) => void;
    newContent: string;
    setNewContent: (value: string) => void;
    setNewImage: (file: File | null) => void;
    handleAddBlog: () => void;
    isDark: boolean;
    isLoading: boolean;
}

export interface BlogListProps {
    userId: string;
    username: string;
    isDark: boolean;
    blogs: Blog[];
    setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>
}