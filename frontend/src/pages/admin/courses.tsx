import CoursePart from "../../components/admin/courses-part";
import FooterPart from "../../components/admin/footer";
import NavbarPart from "../../components/admin/navbar";

const Courses = () => {
    return (
        <div>
            <NavbarPart />
            <div className="pt-20">
                <CoursePart />
            </div>
            <FooterPart />
        </div>
    )
}

export default Courses;