import {Field, FieldLabel} from "@/components/ui/field.js";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.js";
import {Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious} from "@/components/ui/pagination.js";
import {useTranslation} from "react-i18next";

function PaginationBar({page, onPrevClick, onNextClick, totalPages, onChange, selectedOption, type}) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between gap-4">
            <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">{t("paginationTitle")}</FieldLabel>
                <Select defaultValue="5"
                    value={selectedOption.value === -0.25 ? "-1" : String(selectedOption.value)}
                    onValueChange={(value) =>
                            onChange({name: Number(value), value: Number(value)})}>
                    <SelectTrigger className="w-20" id="select-rows-per-page">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                        <SelectGroup>
                            {type === "rows" && (
                                <>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="-1">All</SelectItem>
                                </>
                            )}

                            {type === "items" && (
                                <>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="200">200</SelectItem>
                                    <SelectItem value="500">500</SelectItem>
                                    <SelectItem value="-1">All</SelectItem>
                                </>
                            )}

                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            {totalPages > 0 && (
                <>
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious aria-disabled={page === 1}
                                                    className={page === 1 ? "pointer-events-none opacity-50" : "hover:cursor-pointer"}
                                                    onClick={() => {
                                                        if(page > 1) onPrevClick();
                                                    }}/>
                            </PaginationItem>

                            <PaginationItem>
                        <span className="px-3 text-sm text-muted-foreground">
                        {t("paginationPages")} <strong>{page}</strong> {t("paginationOf")} <strong>{totalPages}</strong>
                        </span>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext aria-disabled={page === totalPages}
                                                className={page === totalPages ? "pointer-events-none opacity-50" : "hover:cursor-pointer"}
                                                onClick={() => {
                                                    if(page < totalPages) onNextClick();
                                                }}/>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}

export default PaginationBar;