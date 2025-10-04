
function ErrorWindow({message, onClose}) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="bg-cyan-50 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 max-w-sm text-black flex flex-col items-center">
                <p className="text-center text-lg font-semibold mb-4">{message}</p>
                <button className="close-button px-6 py-2" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ErrorWindow;