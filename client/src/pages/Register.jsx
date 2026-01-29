import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useState } from "react";

export default function Register() {
    const dispatch = useDispatch();
    const [data, setData] = useState({});

    const submit = (e) => {
        e.preventDefault();
        dispatch(register(data));
    };

    return (
        <form onSubmit={submit} className="p-6 max-w-md mx-auto mt-10 bg-white">
            <input
                className="border p-2 mb-2 w-full"
                placeholder="Name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
                className="border p-2 mb-2 w-full"
                placeholder="Email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
                type="password"
                className="border p-2 mb-2 w-full"
                placeholder="Password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button className="bg-indigo-500 text-white p-2 w-full">
                Register
            </button>
        </form>
    );
}
