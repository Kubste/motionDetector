import ChangeBox from "./ChangeBox.jsx";
import { LuArrowLeft } from "react-icons/lu";
import React, {useEffect, useState} from "react";
import api from "../UniversalComponents/api.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Label} from "@/components/ui/label.js";
import {Button} from "@/components/ui/button.js";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import ChangePasswordWindow from "@/components/MyAccountComponents/ChangePasswordWindow.jsx";

function UserInfo() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [details, setDetails] = useState({});
    const [error, setError] = useState("");
    const [oldPassError, setOldPassError] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showPasswordChangeConfirmation, setShowPasswordChangeConfirmation] = useState(false);

    const [userName, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [showUsernameChange, setShowUsernameChange] = useState(false);
    const [showUsernameChangeConfirmation, setShowUsernameChangeConfirmation] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    const [firstName, setFirstName] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [showFirstNameChange, setShowFirstNameChange] = useState(false);
    const [showFirstNameChangeConfirmation, setShowFirstNameChangeConfirmation] = useState(false);
    const [firstNameError, setFirstNameError] = useState("");

    const [lastName, setLastName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [showLastNameChange, setShowLastNameChange] = useState(false);
    const [showLastNameChangeConfirmation, setShowLastNameChangeConfirmation] = useState(false);
    const [lastNameError, setLastNameError] = useState("");

    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [showEmailChange, setShowEmailChange] = useState(false);
    const [showEmailChangeConfirmation, setShowEmailChangeConfirmation] = useState(false);
    const [emailError, setEmailError] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [showPhoneNumberChange, setShowPhoneNumberChange] = useState(false);
    const [showPhoneNumberChangeConfirmation, setShowPhoneNumberChangeConfirmation] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState("");

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

    const handlePatch = (field, fieldValue, valueSetter, confirmationSetter, showSetter, errorSetter) => {
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
            showSetter(false);
        }).catch(error => {
            const errorData = error.response?.data;

            if(errorData.non_field_errors?.[0]) setError(errorData.non_field_errors?.[0]);
            else {
                // finding the right key in errorData - finding sublist with length is greater than 0
                const fieldKey = Object.keys(errorData).find(key => Array.isArray(errorData[key]) && errorData[key].length > 0);
                if(fieldKey) errorSetter(errorData[fieldKey][0] || "Failed to change field");
            }
            setShowError(true);
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setShowPasswordChangeConfirmation(false);
        setOldPassError(false);

        if(newPassword !== confirmPassword) {
            setNewPassword("");
            setConfirmPassword("");
            setError(t("passwordsDontMatch"));
            setOldPassError(false);
            setLoading(false);
            setShowError(true);
            return;
        }

        try {
            await api.put('/auth/password-change/', {old_password: oldPassword, new_password: newPassword}, {
            }).then(() => {
                setShowPasswordChangeConfirmation(true)
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            });

        } catch(error) {
            const errorData = error.response?.data;
            if(errorData.non_field_errors && errorData.non_field_errors[0] === "Old password incorrect") {
                setError(t("oldPassIncorrect"));
                setOldPassError(true);
            }
            else if(errorData.non_field_errors && errorData.non_field_errors[0] === "This password is too short. It must contain at least 8 characters.") setError(t("passTooShort"));
            else if(errorData.non_field_errors && errorData.non_field_errors[0] === "This password is too common.") setError(t("passTooCommon"));
            else if(errorData.non_field_errors) setError(errorData.non_field_errors[0]);
            else setError(error.response?.data?.error || "Failed to change field");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    }

    const handleClosePasswordChange = () => {
        setShowPasswordChange(false);
        setNewPassword(null);
        setConfirmPassword(null);
        setOldPassword(null);
        setError(null);
        setOldPassError(false);
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-6">
            <Card className="w-full max-w-6xl min-w-2xl rounded-4xl border-border/40 bg-background/70 backdrop-blur-xl shadow-2xl bg-gradient-to-br from-white/80
                via-white/60 to-white/40 dark:from-cyan-800/10 dark:via-indigo-600/10 dark:to-violet-900/20">

                <CardHeader className="space-y-1 text-center">

                    <Button size="icon"
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="absolute left-4 top-4 rounded-full"><LuArrowLeft className="size-4" />
                    </Button>

                    <CardTitle className="text-2xl font-semibold">{t("accountTitle")}</CardTitle>
                    <CardDescription>{t("accountDesc")}</CardDescription>

                </CardHeader>

                <CardContent className="space-y-4">

                    <ChangeBox
                        name={t("username")}
                        val={details?.username}
                        newVal={newUsername}
                        setNewVal={setNewUsername}
                        placeholder={t("newUsername")}
                        showChangeConfirmation={showUsernameChangeConfirmation}
                        setShowChangeConfirmation={setShowUsernameChangeConfirmation}
                        confirmationLabel={t("usernameConf")}
                        showChange={showUsernameChange}
                        setShowChange={setShowUsernameChange}
                        error={usernameError}
                        setError={setUsernameError}
                        setShowError={setShowError}
                        onConfirm={() => {
                            handlePatch("username", newUsername, setUsername, setShowUsernameChangeConfirmation, setShowUsernameChange, setUsernameError);
                            setNewUsername("");
                            setUsernameError(null);
                            setShowError(false);
                        }}
                    />

                    <ChangeBox
                        name={t("firstName")}
                        val={details?.first_name}
                        newVal={newFirstName}
                        setNewVal={setNewFirstName}
                        placeholder={t("newFirstName")}
                        showChangeConfirmation={showFirstNameChangeConfirmation}
                        setShowChangeConfirmation={setShowFirstNameChangeConfirmation}
                        confirmationLabel={t("firstNameConf")}
                        showChange={showFirstNameChange}
                        setShowChange={setShowFirstNameChange}
                        error={firstNameError}
                        setError={setFirstNameError}
                        setShowError={setShowError}
                        onConfirm={() => {
                            handlePatch("first_name", newFirstName, setFirstName, setShowFirstNameChangeConfirmation, setShowFirstNameChange, setFirstNameError);
                            setNewFirstName("");
                            setFirstNameError(null);
                            setShowError(false);
                        }}
                    />

                    <ChangeBox
                        name={t("lastName")}
                        val={details?.last_name}
                        newVal={newLastName}
                        setNewVal={setNewLastName}
                        placeholder={t("newLastName")}
                        showChangeConfirmation={showLastNameChangeConfirmation}
                        setShowChangeConfirmation={setShowLastNameChangeConfirmation}
                        confirmationLabel={t("lastNameConf")}
                        showChange={showLastNameChange}
                        setShowChange={setShowLastNameChange}
                        error={lastNameError}
                        setError={setLastNameError}
                        setShowError={setShowError}
                        onConfirm={() => {
                            handlePatch("last_name", newLastName, setLastName, setShowLastNameChangeConfirmation, setShowLastNameChange, setLastNameError);
                            setNewLastName("");
                            setLastNameError(null);
                            setShowError(false);
                        }}
                    />

                    <ChangeBox
                        name={t("email")}
                        val={details?.email}
                        newVal={newEmail}
                        setNewVal={setNewEmail}
                        placeholder={t("newEmail")}
                        showChangeConfirmation={showEmailChangeConfirmation}
                        setShowChangeConfirmation={setShowEmailChangeConfirmation}
                        confirmationLabel={t("emailConf")}
                        showChange={showEmailChange}
                        setShowChange={setShowEmailChange}
                        error={emailError}
                        setError={setEmailError}
                        setShowError={setShowError}
                        onConfirm={() => {
                            handlePatch("email", newEmail, setEmail, setShowEmailChangeConfirmation, setShowEmailChange, setEmailError);
                            setNewEmail("");
                            setEmailError(null);
                            setShowError(false);
                        }}
                    />

                    <ChangeBox
                        name={t("phoneNum")}
                        val={details?.phone_number}
                        newVal={newPhoneNumber}
                        setNewVal={setNewPhoneNumber}
                        placeholder={t("newPhoneNum")}
                        showChangeConfirmation={showPhoneNumberChangeConfirmation}
                        setShowChangeConfirmation={setShowPhoneNumberChangeConfirmation}
                        confirmationLabel={t("phoneNumConf")}
                        showChange={showPhoneNumberChange}
                        setShowChange={setShowPhoneNumberChange}
                        error={phoneNumberError}
                        setError={setPhoneNumberError}
                        setShowError={setShowError}
                        onConfirm={() => {
                            handlePatch("phone_number", newPhoneNumber, setPhoneNumber, setShowPhoneNumberChangeConfirmation, setShowPhoneNumberChange, setPhoneNumberError);
                            setNewPhoneNumber("");
                            setPhoneNumberError(null);
                            setShowError(false);
                        }}
                    />

                    <div className="group relative flex items-center justify-between rounded-xl border bg-card bg-transparent px-6 py-4 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-muted-foreground">{t("role")}</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-base font-medium">{details?.role === "sup" ? t("sup") : details?.role === "admin" ? t("admin") : t("user")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 flex items-center justify-center w-full">
                        <Button className="w-2/5 mt-4"
                                onClick={() => {setShowPasswordChange(true)}}>
                            {t("changePassword")}
                        </Button>
                    </div>

                </CardContent>
            </Card>

            {showPasswordChange && <ChangePasswordWindow handleSubmit={handleSubmit}
                                                         oldPassword={oldPassword}
                                                         newPassword={newPassword}
                                                         setOldPassword={setOldPassword}
                                                         setNewPassword={setNewPassword}
                                                         confirmPassword={confirmPassword}
                                                         setConfirmPassword={setConfirmPassword}
                                                         loading={loading}
                                                         error={error}
                                                         showPasswordChangeConfirmation={showPasswordChangeConfirmation}
                                                         setShowPasswordChangeConfirmation={setShowPasswordChangeConfirmation}
                                                         setError={setError}
                                                         oldPassError={oldPassError}
                                                         onClose={handleClosePasswordChange}/>}
        </div>
    );
}

export default UserInfo;