import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FiAlertTriangle } from "react-icons/fi"
import {useTranslation} from "react-i18next";

function ConfirmWindow({message, onClose, onConfirm}) {
    const { t } = useTranslation();

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-mdrounded-3xl bg-gradient-to-br from-emerald-200/80 via-sky-200/80 to-amber-100/80
            dark:from-blue-950/30 dark:via-slate-950/30 dark:to-violet-950/30
                backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.45)]">
                <DialogHeader className="items-center text-center space-y-4">

                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/30 text-red-500 text-2xl animate-pulse"><FiAlertTriangle /></div>

                    <DialogTitle className="text-xl font-semibold tracking-tight">{t("uSure")}</DialogTitle>

                    <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                        {t("action")} <span className="font-medium">{message}</span>.
                        <br />
                        {t("cantUndone")}.
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter className="gap-3 sm:justify-center mt-4">

                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>

                    <Button variant="destructive" onClick={onConfirm}>{t("confirm")}</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmWindow