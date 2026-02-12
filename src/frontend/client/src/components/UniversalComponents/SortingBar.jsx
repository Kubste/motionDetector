import DropBar from "./DropBar.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {useTranslation} from "react-i18next";

function SortingBar({onChangeField, onChangeOrder, selectedOptionName, selectedOptionOrder, options, onClose}) {
    const { t } = useTranslation();

    return (
        <Card className="w-100 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md p-2">
            <CardHeader className="flex flex-col gap-3">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("orderTitle")}</CardTitle>

                <div className="flex flex-row gap-3 items-center">
                    <Select value={selectedOptionName.value}
                        onValueChange={(value) => onChangeField({ name: value, value })}>

                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Field name" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.name}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={selectedOptionOrder.name}
                        onValueChange={(value) =>
                            onChangeOrder({ name: value === "ascending" ? "ascending" : "descending", value: value === "ascending" ? "" : "-" })}>

                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ascending">{t("asc")}</SelectItem>
                                <SelectItem value="descending">{t("desc")}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="flex justify-center">
                <Button className="hover:cursor-pointer" variant="outline" onClick={onClose}>{t("close")}</Button>
            </CardContent>
        </Card>
    );

} export default SortingBar;