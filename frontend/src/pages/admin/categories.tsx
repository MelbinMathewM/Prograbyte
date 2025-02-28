import CategoriesPart from "../../components/admin/categories-part";
import FooterPart from "../../components/admin/footer";
import NavbarPart from "../../components/admin/navbar";

const Categories = () => {
    return (
        <div>
            <NavbarPart />
            <div className="pt-15">
                <CategoriesPart />
            </div>
            <FooterPart />
        </div>
    )
}

export default Categories;