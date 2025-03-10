import WishlistPage from "../../components/students/wishlist-part"
import StudentNavbar from "../../components/students/navbar"

const Wishlist = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <WishlistPage />
            </div>
        </div>
    )
}

export default Wishlist;