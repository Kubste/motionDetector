import ChangeBox from "../UniversalComponents/ChangeBox.jsx";
import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";

function UserInfo() {
    const [details, setDetails] = useState({});
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordChangeConfirmation, setShowPasswordChangeConfirmation] = useState(false);

    const [userName, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [showUsernameChange, setShowUsernameChange] = useState(false);
    const [showUsernameChangeConfirmation, setShowUsernameChangeConfirmation] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [showFirstNameChange, setShowFirstNameChange] = useState(false);
    const [showFirstNameChangeConfirmation, setShowFirstNameChangeConfirmation] = useState(false);


    const [lastName, setLastName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [showLastNameChange, setShowLastNameChange] = useState(false);
    const [showLastNameChangeConfirmation, setShowLastNameChangeConfirmation] = useState(false);


    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [showEmailChange, setShowEmailChange] = useState(false);
    const [showEmailChangeConfirmation, setShowEmailChangeConfirmation] = useState(false);


    const [phoneNumber, setPhoneNumber] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [showPhoneNumberChange, setShowPhoneNumberChange] = useState(false);
    const [showPhoneNumberChangeConfirmation, setShowPhoneNumberChangeConfirmation] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        api.get(`/auth/auth-manager/${user_id}/`
        ).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load cameras details.");
            setShowError(true);
        })

    }, [userName, firstName, lastName, email, phoneNumber]);

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter) => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');

        if(field === 'confidence_threshold' && (Number(fieldValue) < 0 || Number(fieldValue) > 1)) {
            setError("Confidence threshold must be a number in range [0, 1]");
            setShowError(true);
            return;
        }

        api.patch(`/auth/auth-manager/${user_id}/`, {
            [field]: fieldValue
        }, {headers: {
                Authorization: `Token ${token}`
            }
        }).then(() => {
            //window.location.reload();
            valueSetter(fieldValue);
            confirmationSetter(true);
        }).catch(error => {
            const errorData = error.response?.data;

            if(errorData.non_field_errors?.[0]) setError(errorData.non_field_errors?.[0]);
            else {
                // finding the right key in errorData - finding sublist with length is greater than 0
                const fieldKey = Object.keys(errorData).find(key => Array.isArray(errorData[key]) && errorData[key].length > 0);
                if(fieldKey) setError(errorData[fieldKey][0] || "Failed to change field");
            }
            setShowError(true);
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if(newPassword !== confirmPassword) {
            setNewPassword("");
            setConfirmPassword("");
            setError("Passwords don't match");
            setLoading(false);
            setShowError(true);
            return;
        }

        try {
            await api.put('/auth/password-change/', {old_password: oldPassword, new_password: newPassword}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            }).then(() => {
                setShowPasswordChangeConfirmation(true)
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            });

        } catch(error) {
            const errorData = error.response?.data;
            if(errorData.non_field_errors) setError(errorData.non_field_errors[0]);         // receiving error message from django password validation
            else setError(error.response?.data?.error || "Failed to change field");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    }

    const handleCloseError = () => {
        setShowError(false);
        setError(null);
    }

    return (
        <div className="flex flex-col gap-5 p-6 my-5 mx-auto bg-cyan-50 dark:bg-slate-700 rounded-3xl shadow-2xl min-w-[600px] max-w-[90%] text-black dark:text-white">
            <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white self-center">My account information</h2>

            <div className="flex flex-col py-3 gap-4">
                <ChangeBox
                    nameStr="User Name"
                    nameValue={details?.username}
                    show={showUsernameChange}
                    onShowClick={() => setShowUsernameChange(true)}
                    showChange={showUsernameChange}
                    value={newUsername}
                    showDropdown={false}
                    onConfirmClick={() => {handlePatch("username", newUsername, setUsername, setShowUsernameChangeConfirmation);setNewUsername("");}}
                    onCancelClick={() => {setShowUsernameChange(false);setShowUsernameChangeConfirmation(false);}}
                    showConfirmation={showUsernameChangeConfirmation}
                    onInputChange={(e) => setNewUsername(e.target.value)}/>

                <ChangeBox
                    nameStr="First name"
                    nameValue={details?.first_name}
                    show={showFirstNameChange}
                    onShowClick={() => setShowFirstNameChange(true)}
                    showChange={showFirstNameChange}
                    value={newFirstName}
                    showDropdown={false}
                    onConfirmClick={() => {handlePatch("first_name", newFirstName, setFirstName, setShowFirstNameChangeConfirmation);setNewFirstName("");}}
                    onCancelClick={() => {setShowFirstNameChange(false);setShowFirstNameChangeConfirmation(false);}}
                    showConfirmation={showFirstNameChangeConfirmation}
                    onInputChange={(e) => setNewFirstName(e.target.value)}/>

                <ChangeBox
                    nameStr="Last name"
                    nameValue={details?.last_name}
                    show={showLastNameChange}
                    onShowClick={() => setShowLastNameChange(true)}
                    showChange={showLastNameChange}
                    value={newLastName}
                    showDropdown={false}
                    onConfirmClick={() => {handlePatch("last_name", newLastName, setLastName, setShowLastNameChangeConfirmation);setNewLastName("");}}
                    onCancelClick={() => {setShowLastNameChange(false);setShowLastNameChangeConfirmation(false);}}
                    showConfirmation={showLastNameChangeConfirmation}
                    onInputChange={(e) => setNewLastName(e.target.value)}/>

                <ChangeBox
                    nameStr="E-mail"
                    nameValue={details?.email}
                    show={showEmailChange}
                    onShowClick={() => setShowEmailChange(true)}
                    showChange={showEmailChange}
                    value={newEmail}
                    showDropdown={false}
                    onConfirmClick={() => {handlePatch("email", newEmail, setEmail, setShowEmailChangeConfirmation);setNewEmail("");}}
                    onCancelClick={() => {setShowEmailChange(false);setShowEmailChangeConfirmation(false);}}
                    showConfirmation={showEmailChangeConfirmation}
                    onInputChange={(e) => setNewEmail(e.target.value)}/>

                <ChangeBox
                    nameStr="Phone Number"
                    nameValue={details?.phone_number}
                    show={showPhoneNumberChange}
                    onShowClick={() => setShowPhoneNumberChange(true)}
                    showChange={showPhoneNumberChange}
                    value={newPhoneNumber}
                    showDropdown={false}
                    onConfirmClick={() => {handlePatch("phone_number", newPhoneNumber, setPhoneNumber, setShowPhoneNumberChangeConfirmation);setNewPhoneNumber("");}}
                    onCancelClick={() => {setShowPhoneNumberChange(false);setShowPhoneNumberChangeConfirmation(false);}}
                    showConfirmation={showPhoneNumberChangeConfirmation}
                    onInputChange={(e) => setNewPhoneNumber(e.target.value)}/>

                <p className="m-0 font-extrabold">Role: {details?.role}</p>

                <div className="mt-15 flex flex-col items-center gap-3">
                    <form className="flex flex-col gap-2 w-full max-w-[350px]" onSubmit={handleSubmit}>
                        <p className="font-semibold text-xl text-black dark:text-white text-center">Change your password</p>
                        <input
                            className="input px-3 py-2"
                            type="password"
                            placeholder="Old password"
                            value={oldPassword}
                            onChange={(event) => setOldPassword(event.target.value)}
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
                            className="w-full px-3 py-2 rounded-3xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 hover:cursor-pointer transition disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}>{loading ? "Submitting ..." : "Submit"}</button>

                        {showPasswordChangeConfirmation && <p className="text-base font-semibold">Password has been changed</p>}
                        {error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;