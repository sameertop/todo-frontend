import React from 'react';
import { SquarePen, Trash } from 'lucide-react';

function Todocard({todo}) {

    const { title , description} = todo
    return (
        <div>
            <div className="rounded-2xl  shadow-xl  bg-white p-5 sm:p-6">
                <div className="flex items-start gap-5">
                    <input
                        type="checkbox"
                        className="mt-1 h-5 w-5  cursor-pointer accent-teal-700"
                    />

                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold font-sans text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-1 text-md leading-relaxed text-slate-800">
                            {description}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-md font-medium text-slate-800 transition hover:bg-slate-50 cursor-pointer">
                                <SquarePen size={16} strokeWidth={1.75} />
                                Edit
                            </button>

                            <button className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-md font-medium text-red-600 transition hover:bg-red-100 cursor-pointer">
                                <Trash size={16} strokeWidth={1.75} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Todocard