import DropBar from "../UniversalComponents/DropBar.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useState} from "react";
import api from "../UniversalComponents/api.jsx";

function RegisterWindow() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showRegisterConfirmation, setShowRegisterConfirmation] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== passwordConfirm) {
            setPassword("");
            setPasswordConfirm("");
            setError("Passwords do not match");
            setShowError(true);
            setLoading(false);
            return;
        }

        await api.post(`/auth/register/`, {
            "username": username,
            "password": password,
            "email": email,
            "first_name": firstName,
            "last_name": lastName,
            "phone_number": phoneNumber,
            "role": role.value || "user",
        }).then(() => {
            setShowRegisterConfirmation(true);
        }).catch(error => {
            const errorData = error.response?.data;

            if(errorData.non_field_errors?.[0]) setError(errorData.non_field_errors?.[0]);
            else {
                // finding the right key in errorData - finding sublist with length is greater than 0
                const fieldKey = Object.keys(errorData).find(key => Array.isArray(errorData[key]) && errorData[key].length > 0);
                if(fieldKey) setError(errorData[fieldKey][0] || "Failed to change field");
            }
            setShowError(true);
        }).finally(() => setLoading(false));
    }

    const handleRoleChange = (option) => {
        setRole(option);
    }

    const handleCloseError = () => {
        setError("");
        setShowError(false);
    }

    return (
        <div className="flex justify-center items-center">
            <div className="bg-cyan-50 dark:bg-slate-700 flex flex-col justify-center items-center rounded-3xl p-6 min-w-[500px] max-w-[90%] shadow-3xl gap-4">
                <h2 className="text-2xl font-semibold">Input new User parameters</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col items-center gap-3 w-full">
                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter username"
                               value={username}
                               onChange={(event) => setUsername(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="password" placeholder="Enter password"
                               value={password}
                               onChange={(event) => setPassword(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="password"
                               placeholder="Confirm Password"
                               value={passwordConfirm}
                               onChange={(event) => setPasswordConfirm(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter E-mail"
                               value={email}
                               onChange={(event) => setEmail(event.target.value)} required/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter first name"
                               value={firstName}
                               onChange={(event) => setFirstName(event.target.value)}/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter last name"
                               value={lastName}
                               onChange={(event) => setLastName(event.target.value)}/>

                        <input className="input px-4 py-2"
                               type="text"
                               placeholder="Enter phone number"
                               value={phoneNumber}
                               onChange={(event) => setPhoneNumber(event.target.value)}/>

                        {sessionStorage.getItem("role") === "sup" &&
                            <DropBar label={"Role"}
                                     options={[{name: "User", value: "user"}, {name: "Admin", value: "admin"}, {name: "Superuser", value: "sup"}]}
                                     onChange={handleRoleChange}
                                     selectedOption={role}/>
                        }

                        <button className="confirm-button px-3 py-2"
                                type="submit"
                                disabled={loading}>{loading ? "User registration ..." : "Register user"}</button>
                    </div>
                </form>
                {showRegisterConfirmation && <p className="text-green-600 text-center font-medium mt-2">User has been registered</p>}
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default RegisterWindow;