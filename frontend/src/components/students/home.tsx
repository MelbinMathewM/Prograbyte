import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";

const HomePart = () => {
  return (
    <div className="bg-green-100 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold">Roadmap to success - <em>Prograbtye</em></h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg">
          Prograbtye offers a wide variety of courses for you to upskill and be a pro in the industry. We also provide a blog for posting your progress and letting the community know about you.
        </p>
        <Button variant="contained" color="error" className="mt-4">Join for free</Button>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {[
          { title: "20+ Courses", icon: "📖" },
          { title: "Blogs", icon: "✍️" },
          { title: "Online classes", icon: "💻" },
        ].map((feature, index) => (
          <Card key={index} className="p-4 text-center shadow-lg">
            <Typography variant="h6" className="mb-2">{feature.icon} {feature.title}</Typography>
          </Card>
        ))}
      </section>

      {/* Courses Section */}
      <section className="text-center py-12">
        <Typography variant="h5" className="italic">Our Courses</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-6">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardMedia
                component="img"
                height="140"
                image="/path/to/javascript.jpg"
                alt="JavaScript Course"
              />
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Programming Language</Typography>
                <Typography variant="h6">JavaScript</Typography>
                <Typography variant="body2" color="textSecondary">
                  A course that molds you from beginner to pro. Learn JavaScript from the basics to advanced topics.
                </Typography>
                <Button variant="outlined" className="mt-2">View Course</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-red-200 p-4 shadow-lg">
          <Typography variant="h6" className="font-semibold">Post your Ideas</Typography>
          <Typography variant="body2">Share your vision to the public and expand your connections.</Typography>
        </Card>
        <Card className="bg-green-200 p-4 shadow-lg">
          <Typography variant="h6" className="font-semibold">Make friends and chat with them</Typography>
          <Typography variant="body2">Chat with people you are interested in and expand your network.</Typography>
        </Card>
      </section>

      {/* Live Classes Section */}
      <section className="py-12 px-6 text-center">
        <Typography variant="h5" className="italic">Interviews and Live Classes</Typography>
        <Card className="p-6 bg-orange-200 shadow-lg mt-4">
          <Typography variant="body1">
            We have a dedicated platform for conducting interviews and attending online classes seamlessly.
          </Typography>
          <Button variant="contained" color="primary" className="mt-4">Video Chat</Button>
        </Card>
      </section>

      {/* Footer */}
      {/* <footer className="bg-blue-900 text-white py-8 px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Typography variant="h6">PROGRABYTE</Typography>
            <Typography variant="body2">The most futuristic coding tutorials and blog. Everything you need in a single place.</Typography>
          </div>
          <div>
            <Typography variant="h6">Our Solutions</Typography>
            <Typography variant="body2">Programming courses, Blogs, Interview coaching, Live classes</Typography>
          </div>
          <div>
            <Typography variant="h6">Support</Typography>
            <Typography variant="body2">Contact, Newsletter, Design pattern, Help & support</Typography>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePart;
