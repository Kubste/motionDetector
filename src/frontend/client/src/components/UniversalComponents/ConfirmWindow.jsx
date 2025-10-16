
function ConfirmWindow({message, onClose, onConfirm}) {

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="bg-cyan-50 dark:bg-slate-700 dark:text-white backdrop-blur-3xl rounded-3xl shadow-2xl p-6 max-w-sm text-black flex flex-col items-center">
                <p className="text-center text-lg font-semibold mb-4">Are you sure you want to {message}?</p>
                <div className="flex justify-around w-full">
                    <button className="confirm-button px-3 py-2" onClick={onConfirm}>Confirm</button>
                    <button className="close-button px-3 py-2" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmWindow