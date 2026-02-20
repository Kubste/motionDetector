import { BiSolidErrorAlt } from "react-icons/bi";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.js";
import {Button} from "@/components/ui/button.js";
import {useTranslation} from "react-i18next";

function ErrorWindow({message, onClose}) {
    const { t } = useTranslation();

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-mdrounded-3xl bg-gradient-to-br from-emerald-200/80 via-sky-200/80 to-amber-100/80
            dark:from-blue-950 dark:via-slate-950 dark:to-violet-950
                backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.45)]">
                <DialogHeader className="items-center text-center space-y-4">

                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/30 text-red-500 text-2xl animate-pulse"><BiSolidErrorAlt /></div>

                    <DialogTitle className="text-xl font-semibold tracking-tight">{t("error")}</DialogTitle>

                    <DialogDescription className="text-sm text-slate-600 dark:text-slate-400"><span className="font-medium">{message}</span>.</DialogDescription>

                </DialogHeader>

                <DialogFooter className="gap-3 sm:justify-center mt-4">

                    <Button variant="secondary" onClick={onClose}>{t("close")}</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ErrorWindow;