import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Button} from "@/components/ui/button.js";
import React from "react";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.js";
import {Input} from "@/components/ui/input.js";
import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";
import {useTranslation} from "react-i18next";

function ChangePasswordWindow({handleSubmit, oldPassword, newPassword, setOldPassword, setNewPassword, confirmPassword, setConfirmPassword, onClose, loading, error,
                                  showPasswordChangeConfirmation, setShowPasswordChangeConfirmation, setError, oldPassError}) {

    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="animate-in zoom-in-95 fade-in duration-200">
                <Card className={`w-[420px] rounded-3xl border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl bg-gradient-to-br from-white/80 via-white/60
                    to-white/40 dark:from-blue-950/25 dark:via-slate-800/25 dark:to-violet-900/25 
                    ${showPasswordChangeConfirmation && "border-green-600"} ${error && "border-red-600"}`}>

                    <CardHeader className="relative text-center space-y-1">
                        <Button size="icon"
                                variant="ghost"
                                onClick={onClose}
                                className="absolute right-2 top-2 rounded-full">
                            <X className="size-4" />
                        </Button>

                        <CardTitle className="text-xl font-semibold">
                            {t("changePasswordTitle")}
                        </CardTitle>
                        <CardDescription>
                            {t("changePasswordDesc")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <FieldGroup className="space-y-4">

                                <Field>
                                    <FieldLabel htmlFor="old-password">
                                        {t("oldPass")}
                                    </FieldLabel>
                                    <Input id="old-password"
                                           placeholder={t("enterOldPass")}
                                           aria-invalid={!!oldPassError}
                                           type="password"
                                           value={oldPassword}
                                           onChange={(e) => setOldPassword(e.target.value)}
                                           required/>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="new-password">
                                        {t("newPass")}
                                    </FieldLabel>
                                    <Input id="new-password"
                                           placeholder={t("enterNewPass")}
                                           aria-invalid={!!error && !oldPassError}
                                           type="password"
                                           value={newPassword}
                                           onChange={(e) => setNewPassword(e.target.value)}
                                           required/>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        {t("confPass")}
                                    </FieldLabel>
                                    <Input id="confirm-password"
                                           placeholder={t("confPassPlaceholder")}
                                           aria-invalid={!!error && !oldPassError}
                                           type="password"
                                           value={confirmPassword}
                                           onChange={(e) => setConfirmPassword(e.target.value)}
                                           required/>
                                </Field>

                            </FieldGroup>

                            <div className="flex justify-center gap-3 pt-2">
                                <Button type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2">
                                    {loading && <Spinner />}
                                    {loading ? t("updatePassInProgress") : t("updatePass")}
                                </Button>

                                <Button type="button"
                                        variant="outline"
                                        onClick={onClose}>
                                    {t("cancel")}
                                </Button>
                            </div>

                            {showPasswordChangeConfirmation && (
                                <CardDescription className="text-center text-green-600 hover:cursor-pointer hover:underline"
                                                 onClick={() => setShowPasswordChangeConfirmation(false)}>
                                    {t("changePassConf")}
                                </CardDescription>
                            )}

                            {error && (
                                <CardDescription className="text-center text-destructive hover:cursor-pointer hover:underline"
                                                 onClick={() => setError(null)}>{error}
                                </CardDescription>
                            )}

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

} export default ChangePasswordWindow;