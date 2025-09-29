import styles from './UserInfo.module.css';
import ChangeBox from "../../UniversalComponents/ChangeBox/ChangeBox.jsx";
import ErrorWindow from "../../UniversalComponents/ErrorWindow/ErrorWindow.jsx";
import {useEffect, useState} from "react";
import api from "../../UniversalComponents/api.jsx";

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
        const user_id = sessionStorage.getItem('user_id');

        api.get(`/auth/auth-manager/${user_id}/`
        ).then(response => {
            setDetails(response.data);
        }).catch(error => {
            setError(error.response?.data?.error || "Failed to load cameras details.");
            setShowError(true);
        })

    }, [userName, firstName, lastName, email, phoneNumber]);

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter) => {
        const token = sessionStorage.getItem('token');
        const user_id = sessionStorage.getItem('user_id');

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
            setError(error.response?.data?.error || "Failed to change field");
            setShowError(true);
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem('token');

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
                setNewFirstName("");
                setConfirmPassword("");
            });

        } catch(error) {
            setError(error.response?.data?.error || "Failed to change field");
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
        <div className={styles.InfoContainer}>
            <h2>My account information</h2>
            <div className={styles.ChangeContainer}>
                <ChangeBox nameStr="User Name"
                           nameValue={details?.username}
                           show={showUsernameChange}
                           onShowClick={() => setShowUsernameChange(true)}
                           showChange={showUsernameChange}
                           value={newUsername}
                           showDropdown={false}
                           onConfirmClick={() => handlePatch("username", newUsername, setUsername, setShowUsernameChangeConfirmation)}
                           onCancelClick={() => {setShowUsernameChange(false); setShowUsernameChangeConfirmation(false);}}
                           showConfirmation={showUsernameChangeConfirmation}
                           onInputChange={(e) => setNewUsername(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="First name"
                           nameValue={details?.first_name}
                           show={showFirstNameChange}
                           onShowClick={() => setShowFirstNameChange(true)}
                           showChange={showFirstNameChange}
                           value={newFirstName}
                           showDropdown={false}
                           onConfirmClick={() => handlePatch("first_name", newFirstName, setFirstName, setShowFirstNameChangeConfirmation)}
                           onCancelClick={() => {setShowFirstNameChange(false); setShowFirstNameChangeConfirmation(false);}}
                           showConfirmation={showFirstNameChangeConfirmation}
                           onInputChange={(e) => setNewFirstName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Last name"
                           nameValue={details?.last_name}
                           show={showLastNameChange}
                           onShowClick={() => setShowLastNameChange(true)}
                           showChange={showLastNameChange}
                           value={newLastName}
                           showDropdown={false}
                           onConfirmClick={() => handlePatch("last_name", newLastName, setLastName, setShowLastNameChangeConfirmation)}
                           onCancelClick={() => {setShowLastNameChange(false); setShowLastNameChangeConfirmation(false);}}
                           showConfirmation={showLastNameChangeConfirmation}
                           onInputChange={(e) => setNewLastName(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="E-mail"
                           nameValue={details?.email}
                           show={showEmailChange}
                           onShowClick={() => setShowEmailChange(true)}
                           showChange={showEmailChange}
                           value={newEmail}
                           showDropdown={false}
                           onConfirmClick={() => handlePatch("email", newEmail, setEmail, setShowEmailChangeConfirmation)}
                           onCancelClick={() => {setShowEmailChange(false); setShowEmailChangeConfirmation(false);}}
                           showConfirmation={showEmailChangeConfirmation}
                           onInputChange={(e) => setNewEmail(e.target.value)}></ChangeBox>

                <ChangeBox nameStr="Phone Number"
                           nameValue={details?.phone_number}
                           show={showPhoneNumberChange}
                           onShowClick={() => setShowPhoneNumberChange(true)}
                           showChange={showPhoneNumberChange}
                           value={newPhoneNumber}
                           showDropdown={false}
                           onConfirmClick={() => handlePatch("phone_number", newPhoneNumber, setPhoneNumber, setShowPhoneNumberChangeConfirmation)}
                           onCancelClick={() => {setShowPhoneNumberChange(false); setShowPhoneNumberChangeConfirmation(false);}}
                           showConfirmation={showPhoneNumberChangeConfirmation}
                           onInputChange={(e) => setNewPhoneNumber(e.target.value)}></ChangeBox>

                <p className={styles.RoleParagraph}>
                    Role: {details?.role}
                </p>

                <div className={styles.PasswordContainer}>
                    <form onSubmit={handleSubmit}>
                        <p>Change your password</p>
                        <input type="password" placeholder="Old password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required={true}/>
                        <input type="password" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required={true}/>
                        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required={true}/>
                        <button className={styles.SubmitButton} type="submit" disabled={loading}>{loading ? "Submitting" : "Submit"}</button>
                        {showPasswordChangeConfirmation && <p className={styles.PasswordChangeConfirmation}>Password has been changed</p>}
                    </form>
                </div>
            </div>
            {showError && <ErrorWindow message={error} onClose={handleCloseError}></ErrorWindow>}
        </div>
    );
}

export default UserInfo;