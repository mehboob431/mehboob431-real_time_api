import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
    const dispatch = useDispatch();

    return (
        <header className="bg-white shadow p-4 flex justify-between">
            <h1 className="font-bold text-xl">TaskFlow</h1>
            <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => dispatch(logout())}
            >
                Logout
            </button>
        </header>
    );
}
