import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useState, useEffect} from "react";
import api from "../UniversalComponents/api.jsx";

function ForgotPasswordWindow({onClose}) {

    const [loading, setLoading] = useState(false);
    const [showPasswordChangeConfirmation, setShowPasswordChangeConfirmation] = useState(false);
    const [showSendCodeConfirmation, setShowSendCodeConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const [codeError, setCodeError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showSendCode, setShowSendCode] = useState(false);

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if(newPassword !== confirmPassword) {
            setNewPassword("");
            setConfirmPassword("");
            setError("Passwords don't match");
            setLoading(false);
            setShowError(true);
            return;
        }

        try {
            await api.post('/auth/reset-password/', {email: email, code: code, new_password: newPassword}, {
            }).then(() => {
                setShowPasswordChangeConfirmation(true)
                setNewPassword("");
                setEmail("");
                setConfirmPassword("");
            });

        } catch(error) {
            console.log(error);
            setError(error.response?.data?.error || "Failed to reset password");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    }

    const handleSendCode = async () => {
        setShowError(false);

        try {
            await api.post('/auth/send-code/', {email: email}, {}).then(() => {
                setShowSendCodeConfirmation(true);
            });

        } catch (error) {
            console.log(error);
            setCodeError(error.response?.data?.error || "Failed to reset password");
        }
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
            <div className="bg-cyan-50 dark:bg-slate-700 rounded-3xl p-6 min-w-[500px] max-h-[90vh] shadow-2xl text-black dark:text-white
            flex flex-col items-start justify-center gap-3 mb-4">

                {!showSendCode && <button className="button px-3 py-2 rounded-3xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 hover:cursor-pointer transition
                        disabled:cursor-not-allowed w-[150px] mt-2 self-center"
                                          onClick={() => setShowSendCode(true)}
                >Send new code</button>}

                {showSendCode && <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row w-full gap-2">
                        <input className="input px-3 py-2"
                        type="text"
                        placeholder="E-mail address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}/>

                        <button className="button px-3 py-2 rounded-3xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 hover:cursor-pointer transition
                                disabled:cursor-not-allowed w-[150px]"
                                onClick={handleSendCode}
                        >Send</button>
                    </div>

                    {showSendCodeConfirmation && <p className="text-green-500 text-center font-medium mt-2 mb-2">Code has been sent</p>}
                    {codeError && <p className="text-red-600 text-center font-medium mt-2 mb-2">{codeError}</p>}

                    <button className="close-button block self-center px-6 py-2"
                            onClick={() => {setShowSendCode(false); setCodeError("")}}>Close</button>

                </div>}

                <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
                    <p className="font-semibold text-xl text-black dark:text-white text-center mb-4">Reset your password</p>
                    <input
                        className="input px-3 py-2"
                        type="text"
                        placeholder="E-mail address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required/>

                    <input
                        className="input px-3 py-2"
                        type="text"
                        placeholder="Reset code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        required/>

                    <input
                        className="input px-3 py-2"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required/>

                    <input
                        className="input px-3 py-2"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required/>

                    <button
                        className="px-3 py-2 rounded-3xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 hover:cursor-pointer transition
                        disabled:cursor-not-allowed w-[150px] mt-2 self-center"
                        type="submit"
                        disabled={loading}>{loading ? "Submitting ..." : "Submit"}</button>

                    {showPasswordChangeConfirmation && <p className="text-green-600 font-semibold text-center">Password has been changed</p>}
                    {error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}
                </form>


                <button className="close-button block self-center px-6 py-2"
                        onClick={onClose}>Close</button>
            </div>
            {/*{showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}*/}
        </div>
    );
} export default ForgotPasswordWindow;