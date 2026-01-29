import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useState } from "react";

export default function Login() {
    const dispatch = useDispatch();
    const [data, setData] = useState({ email: "", password: "" });

    const submit = (e) => {
        e.preventDefault();
        dispatch(login(data));
    };

    return (
        <div className="flex justify-center mt-20">
            <form onSubmit={submit} className="bg-white p-6 shadow rounded">
                <input
                    className="border p-2 mb-3 w-full"
                    placeholder="Email"
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <input
                    type="password"
                    className="border p-2 mb-3 w-full"
                    placeholder="Password"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <button className="bg-indigo-500 text-white p-2 w-full">
                    Login
                </button>
            </form>
        </div>
    );
}
