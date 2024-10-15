import {columns} from "@/components/data-table/columns";
import {DataTable} from "@/components/data-table/data-table";
import {Shell} from "@/components/shells/shell";
import {taskSchema} from "@/lib/validations/schema";
import {z} from "zod";

export const runtime = 'edge';

async function getTasks() {
    const res = await fetch(
        "https://my.api.mockaroo.com/tasks.json?key=f0933e60"
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();

    const tasks = z.array(taskSchema).parse(
        data.map((task: any) => {
            task.due_date = new Date(Date.parse(task.due_date));
            return task;
        })
    );
    return tasks;
}

export default async function TaskPage() {
    const tasks = await getTasks();
    return (
        <Shell>
            <div>
                <h1 className='text-2xl font-bold text-[#62636c]'>Manage Franchises</h1>
            </div>
            <div className='flex h-full min-h-screen w-full flex-col'>
                <DataTable data={tasks} columns={columns}/>
            </div>
        </Shell>
    );
}
