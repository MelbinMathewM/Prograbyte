import CartPage from "../../components/students/cart-part"
import StudentNavbar from "../../components/students/navbar"

const Cart = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <CartPage />
            </div>
        </div>
    )
}

export default Cart;