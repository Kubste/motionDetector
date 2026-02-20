
function MainPageCard({Icon, description, onClick}) {

    return (
        <div onClick={onClick}
            className="
        group relative flex flex-col items-center justify-start h-55
        text-center size-48 gap-6 p-6 rounded-2xl
        bg-cyan-100 dark:bg-white/5
        backdrop-blur-xl
        shadow-lg dark:shadow-xl
        cursor-pointer
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl hover:bg-cyan-200 dark:hover:bg-white/10
        before:absolute before:inset-0 before:rounded-2xl before:p-[1px]
        before:bg-gradient-to-br
        before:from-emerald-200/20 before:via-sky-200/30 before:to-amber-100/10
        dark:before:from-blue-950/95 dark:before:via-slate-950/95 dark:before:to-violet-950/95
        before:opacity-60 dark:before:opacity-40 before:pointer-events-none

        after:absolute after:inset-[1px] after:rounded-2xl after:border after:border-white/20
        dark:after:border-white/10 after:pointer-events-none">

            <div className="
          flex items-center justify-center size-14 rounded-full
          bg-gradient-to-br from-emerald-200/90 via-sky-200/70 to-amber-100/60
          dark:bg-gradient-to-br dark:from-blue-950/50 dark:via-slate-450/50 dark:to-violet-650/50
          border border-white/20 dark:border-white/10
          transition-transform duration-300
          group-hover:scale-110 group-hover:rotate-6">

                <Icon size={30} className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.25)] dark:text-cyan-300 dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]"/>
            </div>

            <h2 className="text-lg font-semibold tracking-wide text-slate-700 dark:text-cyan-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
                {description}
            </h2>
        </div>
    );
}

export default MainPageCard;