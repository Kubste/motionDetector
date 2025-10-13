import DropBar from "./DropBar.jsx";

function PaginationBar({page, onPrevClick, onNextClick, totalPages, onChange, selectedOption}) {

    return(
        <div className="flex flex-col items-center justify-between gap-4 w-[200px]">
            <div className="flex justify-center mt-6 space-x-3">
                <button className="button px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-800 disabled:opacity-50"
                        disabled={page === 1}
                        onClick={onPrevClick}
                >&lt;</button>

                <span className="text-lg font-semibold">Page {page} of {totalPages}</span>

                <button className="button px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-800 disabled:opacity-50"
                        disabled={page === totalPages}
                        onClick={onNextClick}
                >&gt;</button>
            </div>

            <div className="w-[50px]">
                <DropBar label="Page size"
                         options={[{name: 1, value: 1}, {name: "5", value: 5}, {name: "10", value: 10}, {name: "20", value: 20}, {name: "50", value: 50}, {name: "100", value: 100}]}
                         onChange={onChange}
                         selectedOption={selectedOption}
                ></DropBar>
            </div>
        </div>
    );
}

export default PaginationBar;