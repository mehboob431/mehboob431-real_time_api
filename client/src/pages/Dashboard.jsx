import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../features/tasks/taskSlice";
import Header from "../components/Header";

export default function Dashboard() {
    const dispatch = useDispatch();
    const tasks = useSelector((s) => s.tasks.tasks);

    useEffect(() => {
        dispatch(getTasks());
    }, []);

    return (
        <>
            <Header />
            <div className="p-6">
                <h2 className="text-xl mb-4">Tasks</h2>
                {tasks.map((t) => (
                    <div key={t._id} className="border p-3 mb-2 rounded">
                        {t.title}
                    </div>
                ))}
            </div>
        </>
    );
}
