
function MainPageCard({Icon, description, onClick}) {

    return (
        <div className="flex flex-col items-center justify-center text-center size-48 gap-3 p-6 bg-cyan-50 backdrop-blur-md rounded-2xl
            shadow-xl cursor-pointer transition transform hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:bg-slate-700 dark:hover:bg-slate-800"
            onClick={onClick}
        >
            <Icon size={40} className="text-cyan-400 dark:text-white" />
            <h2 className="text-lg font-semibold text-cyan-400 dark:text-white">{description}</h2>
        </div>
    );
}

export default MainPageCard;