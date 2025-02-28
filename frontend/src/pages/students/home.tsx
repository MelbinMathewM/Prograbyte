import HomePart from "../../components/students/home";
import StudentNavbar from "../../components/students/navbar"

const Home = () => {
    return (
        <>
            <StudentNavbar />
            <div className="pt-15">
                <HomePart />
            </div>
        </>
    )
}

export default Home;