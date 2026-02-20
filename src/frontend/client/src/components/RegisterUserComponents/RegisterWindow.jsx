import ErrorWindow from "../UniversalComponents/ErrorWindow.jsx";
import React, {useState} from "react";
import api from "../UniversalComponents/api.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Label} from "@/components/ui/label.js";
import {Input} from "@/components/ui/input.js";
import {Button} from "@/components/ui/button.js";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.js";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.js";
import {LuArrowLeft} from "react-icons/lu";
import {useNavigate} from "react-router-dom";

function RegisterWindow() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState(false);
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
        setPasswordError(false);

        if(password !== passwordConfirm) {
            setPassword("");
            setPasswordConfirm("");
            setError("Passwords do not match");
            setPasswordError(true);
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

    const handleCloseError = () => {
        setError("");
        setShowError(false);
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-6">
            <Card className="w-full max-w-xl rounded-3xl border-border/40 bg-background/70 backdrop-blur-xl shadow-2xl bg-gradient-to-br from-emerald-200/30
            via-sky-200/30 to-amber-100/30 dark:from-blue-950/30 dark:via-slate-950/30 dark:to-violet-950/30">

                <CardHeader className="space-y-1 text-center">
                    <Button size="icon"
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="absolute left-4 top-4 rounded-full"><LuArrowLeft className="size-4" />
                    </Button>

                    <CardTitle className="text-2xl font-semibold">{t("registerTitle")}</CardTitle>
                    <CardDescription>{t("registerDesc")}</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label>{t("username")}</Label>
                            <Input value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t("enterUsername")}
                                required/>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t("firstName")}</Label>
                                <Input value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder={t("enterFirstName")}/>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("lastName")}</Label>
                                <Input value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={t("enterLastName")}/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("email")}</Label>
                            <Input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("enterEmail")}
                                required/>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t("password")}</Label>
                                <Input type="password"
                                    aria-invalid={!!passwordError}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("enterPassword")}
                                    required/>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("confirmPassword")}</Label>
                                <Input type="password"
                                    aria-invalid={!!passwordError}
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder={t("confirmPassword")}
                                    required/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("phoneNum")}</Label>
                            <Input value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={t("enterPhoneNum")}/>
                        </div>

                        {localStorage.getItem("role") === "sup" && (
                            <div className="space-y-2">
                                <Label>{t("role")}</Label>
                                <Select value={role}
                                        onValueChange={(value) => setRole(value)}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder={t("role")} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="user">{t("user")}</SelectItem>
                                            <SelectItem value="admin">{t("admin")}</SelectItem>
                                            <SelectItem value="sup">{t("sup")}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>)}

                        <div className="space-y-2 flex items-center justify-center w-full">
                            <Button type="submit"
                                    className="w-2/5 mt-4 "
                                    disabled={loading}>
                                {loading ? t("registerButtonInProgress") : t("registerButton")}
                                {loading && <Spinner/>}
                            </Button>
                        </div>


                        {showRegisterConfirmation && (
                            <div className="mt-4 text-center text-green-600 font-medium hover:cursor-pointer hover:underline" onClick={() => setShowRegisterConfirmation(false)}>
                                User has been registered successfully
                            </div>
                        )}

                        {error && (
                            <div className="mt-2 text-center text-destructive font-medium hover:cursor-pointer hover:underline" onClick={() => {
                                setError(null); 
                                setPasswordError(false);}}>{error}</div>)}

                    </form>
                </CardContent>
            </Card>

            {showError && (
                <ErrorWindow message={error} onClose={handleCloseError} />
            )}
        </div>
    );
}

export default RegisterWindow;