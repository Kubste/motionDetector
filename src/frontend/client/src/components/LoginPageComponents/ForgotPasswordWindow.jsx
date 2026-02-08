import React, {useState, useEffect, useRef} from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "../UniversalComponents/api.jsx";
import {Spinner} from "@/components/ui/spinner.js";
import {useTranslation} from "react-i18next";

function ForgotPasswordWindow({onClose}) {
    const modalRef = useRef(null);
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);
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

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                setCode("");
            });
        } catch(error) {
            if(window.RUNTIME_CONFIG?.DEBUG) console.log(error);
            setError(error.response?.data?.error || "Failed to reset password");
            setShowError(true);

        } finally {
            setLoading(false);
        }
    }

    const handleSendCode = async () => {
        setShowError(false);
        setLoadingCode(true);

        try {
            await api.post('/auth/send-code/', {email: email}, {}).then(() => {
                setShowSendCodeConfirmation(true);
                setLoadingCode(false);
            });

        } catch (error) {
            if(window.RUNTIME_CONFIG?.DEBUG) console.log(error);
            setCodeError(error.response?.data?.error || "Failed to reset password");
            setLoadingCode(false);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div ref={modalRef}
                className="p-0 min-w-[450px]">
            <Card className="w-full max-w-md p-6 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-center">{t("resetPasswordTitle")}</CardTitle>
                    <CardDescription className="text-center">
                        {t("resetPasswordDesc")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <FieldGroup className="flex flex-col gap-2">
                            <Field>
                                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder={t("email")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="code">{t("resetCode")}</FieldLabel>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder={t("resetCode")}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="new-password">{t("newPassword")}</FieldLabel>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder={t("newPassword")}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirm-password">{t("confirmPassword")}</FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder={t("confirmPassword")}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Field>

                            <div className="flex justify-center gap-2 mt-4">
                                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                    {loading && <span className="spinner" />}
                                    {loading ? t("submitInProgress") : t("submit")}
                                </Button>

                                <Button variant="outline" onClick={onClose}>{t("close")}</Button>
                            </div>

                            {showPasswordChangeConfirmation && (
                                <CardDescription className="text-center text-green-500 hover:cursor-pointer hover:underline"
                                                 onClick={() => setShowPasswordChangeConfirmation(false)}>
                                    {t("passwordConfirmation")}
                                </CardDescription>
                            )}
                            {error && <CardDescription className="text-center text-red-600 hover:cursor-pointer hover:underline"
                                                       onClick={() => {setShowError(false); setError(null)}}>
                                    {error}
                                </CardDescription>}
                        </FieldGroup>
                    </form>

                    {!showSendCode && (
                        <Button variant="default" onClick={() => setShowSendCode(true)} className="self-center">
                            {t("sendNewCode")}
                        </Button>
                    )}

                    {showSendCode && (
                        <div className="flex flex-col gap-2">
                            <FieldGroup className="flex flex-col gap-2">
                                <Field>
                                    <FieldLabel htmlFor="send-email">{t("email")}</FieldLabel>
                                    <Input
                                        id="send-email"
                                        type="text"
                                        placeholder={t("email")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Field>

                                <div className="flex justify-center gap-2 mt-4">
                                    <Button onClick={handleSendCode} className="self-center">
                                        {loadingCode && <Spinner/>}
                                        {loadingCode ? t("sendInProgress") : t("send")}
                                    </Button>

                                    <Button variant="outline" onClick={() => { setShowSendCode(false); setCodeError(""); }} className="self-center">
                                        {t("close")}
                                    </Button>
                                </div>
                            </FieldGroup>

                            {showSendCodeConfirmation && (
                                <CardDescription className="mt-3 text-center text-green-500 hover:cursor-pointer hover:underline"
                                                 onClick={() => setShowSendCodeConfirmation(false)}>
                                    {t("codeConfirmation")}
                                </CardDescription>
                            )}
                            {codeError && <CardDescription className="mt-3 text-center text-red-600 hover:cursor-pointer hover:underline"
                                                           onClick={() => setCodeError(null)}>
                                    {codeError}
                                </CardDescription>}
                        </div>
                    )}
                </CardContent>
            </Card>
            </div>
        </div>
    );
} export default ForgotPasswordWindow;