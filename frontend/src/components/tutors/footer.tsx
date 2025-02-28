const TutorFooter = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} <span className="fond-bold italic">Prograbyte</span>. All Rights Reserved.</p>
          <nav className="mt-2">
            <a href="/tutor/dashboard" className="text-gray-400 hover:text-white mx-2">Dashboard</a>
            <a href="/tutor/courses" className="text-gray-400 hover:text-white mx-2">My Courses</a>
            <a href="/tutor/profile" className="text-gray-400 hover:text-white mx-2">Profile</a>
          </nav>
        </div>
      </footer>
    );
  };
  
  export default TutorFooter;
  