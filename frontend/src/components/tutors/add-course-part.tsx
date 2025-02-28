import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { TutorContext } from "../../contexts/tutor-context";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";

interface Category {
  _id: string;
  name: string;
  type: string
}

interface Topic {
  title: string;
  level: string;
  video: File | null;
  notes: File | null;
  createdAt: Dayjs;
  videoPreview?: string | null;
}

interface CourseErrors {
  title?: string;
  price?: string;
  description?: string;
  category_id?: string;
  poster?: string;
  preview_video?: string;
  topics?: Array<{ title?: string; level?: string; video?: string }> | string;
}


const AddCoursePart = () => {
  const { tutor } = useContext(TutorContext) || {};
  const { id } = tutor || {};
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category_id: "",
    tutor_id: "",
    price: "",
    preview_video: null as File | null,
    createdAt: dayjs(),
    poster: null as File | null,
  });

  const [topics, setTopics] = useState<Topic[]>([
    { title: "", level: "", video: null, notes: null, createdAt: dayjs(), videoPreview: null },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<CourseErrors>({});


  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosInstance.get('/course/categories');
      setCategories(response.data);
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: any) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (field: "poster" | "preview_video", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourse((prev) => ({ ...prev, [field]: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      if (field === "poster") setPosterPreview(url);
      if (field === "preview_video") setVideoPreview(url);
    }
  };

  const handleTopicChange = (index: number, field: keyof Topic, value: any) => {
    setTopics((prev) =>
      prev.map((topic, i) => (i === index ? { ...topic, [field]: value } : topic))
    );
  };

  const handleTopicFileUpload = (index: number, field: "video" | "notes", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTopics((prev) =>
      prev.map((topic, i) =>
        i === index
          ? {
            ...topic,
            [field]: file,
            ...(field === "video" ? { videoPreview: file ? URL.createObjectURL(file) : null } : {}),
          }
          : topic
      )
    );
  };

  const addTopic = () => {
    setTopics([...topics, { title: "", level: "Basic", video: null, notes: null, createdAt: dayjs(), videoPreview: null }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setCourse(prev => {
      const updatedCourse = { ...prev, tutor_id: id ?? "" };
      console.log("Updated Course Data:", updatedCourse);
      return updatedCourse;
    });
    
    const handleCreateCourse = async () => {
      try {
        const courseResponse = await axiosInstance.post(`/course/courses`, { course }, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(courseResponse.data,'bb')
        const courseId = courseResponse.data._id;
        
        if (courseId && topics.length > 0) {
          const formData = new FormData();
          formData.append("course_id", `${courseId}`);

          topics.forEach((topic, index) => {
            formData.append(`topics[${index}][title]`, topic.title);
            formData.append(`topics[${index}][level]`, topic.level);
            if (topic.video) {
              formData.append(`video_${index}`, topic.video);
            }
    
            if (topic.notes) {
              formData.append(`notes_${index}`, topic.notes);
            }
          });
          await axiosInstance.post(`/course/topics`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
    
        alert("Course and topics created successfully!");
      } catch (error) {
        console.error("Error creating course:", error);
      }
    };

    if(validateForm()){
      handleCreateCourse();
    }

  };


  const validateForm = () => {
    let newErrors: CourseErrors = {};
  
    if (!course.title.trim()) newErrors.title = "Title is required";
    if (!course.price || Number(course.price as string) <= 0) newErrors.price = "Price must be a positive number";
    if (!course.description.trim()) newErrors.description = "Description is required";
    if (!course.category_id) newErrors.category_id = "Category is required";
    if (!posterPreview) newErrors.poster = "Poster image is required";
    if (!videoPreview) newErrors.preview_video = "Preview video is required";
  
    if (topics.length === 0) {
      newErrors.topics = "At least one topic is required";
    } else {
      let topicErrorsArray = topics.map((topic) => {
        let topicErrors: { title?: string; level?: string; video?: string } = {};
        if (!topic.title.trim()) topicErrors.title = "Topic title is required";
        if (!topic.level) topicErrors.level = "Difficulty level is required";
        if (!topic.videoPreview) topicErrors.video = "Video is required";
        return topicErrors;
      });

      if (topicErrorsArray.some((err) => Object.keys(err).length > 0)) {
        newErrors.topics = topicErrorsArray;
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/tutor/courses')
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, backgroundColor: "#f9fafb" }}>
      <Box sx={{ padding: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            Add New Course
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>


        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Course Details */}
            <Grid item xs={12} sm={6}>
              <TextField label="Title" name="title" value={course.title} onChange={handleChange} fullWidth required error={!!errors.title} helperText={errors.title}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={course.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Description"
                name="description"
                value={course.description}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
                required
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select name="category_id" value={course.category_id} onChange={handleSelectChange} label="Category" required>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Poster Upload */}
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label">
                Upload Poster Image
                <input type="file" hidden onChange={(e) => handleFileUpload("poster", e)} accept="image/*" />
              </Button>
              {posterPreview && <img src={posterPreview} alt="Poster Preview" style={{ width: "100%", marginTop: 10 }} />}
            </Grid>

            {/* Preview Video Upload */}
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label">
                Upload Preview Video
                <input type="file" hidden onChange={(e) => handleFileUpload("preview_video", e)} accept="video/*" />
              </Button>
              {videoPreview && (
                <video width="100%" controls style={{ marginTop: 10 }}>
                  <source src={videoPreview} type="video/mp4" />
                </video>
              )}
            </Grid>

            {/* Course Topics */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>Course Topics</Typography>
              {topics.map((topic, index) => (
                <Box key={index} sx={{ border: "2px solid #ccc", padding: "10px", marginBottom: "10px", paddingTop: "20px", paddingBottom: "20px" }}>
                  <Grid container spacing={2}>
                    {/* Topic Title */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Topic Title"
                        value={topic.title}
                        onChange={(e) => handleTopicChange(index, "title", e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>

                    {/* Difficulty Level */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Difficulty Level *</InputLabel>
                        <Select
                          value={topic.level}
                          onChange={(e) => handleTopicChange(index, "level", e.target.value)}
                          label="Difficulty Level"
                          required
                        >
                          <MenuItem value="Basic">Basic</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Video Upload */}
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" component="label" fullWidth>
                        Upload Video
                        <input type="file" hidden onChange={(e) => handleTopicFileUpload(index, "video", e)} accept="video/*" />
                      </Button>
                      {topic.videoPreview && (
                        <video width="100%" controls style={{ marginTop: 10 }}>
                          <source src={topic.videoPreview} type="video/mp4" />
                        </video>
                      )}
                    </Grid>

                    {/* Notes Upload */}
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" component="label" fullWidth>
                        Upload Notes
                        <input type="file" hidden onChange={(e) => handleTopicFileUpload(index, "notes", e)} accept=".pdf" />
                      </Button>
                      {topic.notes && <Typography sx={{ mt: 1 }}>{topic.notes.name}</Typography>}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button variant="outlined" onClick={addTopic}>
                Add Topic
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Add Course
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      </Paper>
    </Container>
  );
};

export default AddCoursePart;
