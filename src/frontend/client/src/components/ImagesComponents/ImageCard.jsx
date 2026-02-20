import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Badge} from "@/components/ui/badge.js";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.js";
import {Button} from "@/components/ui/button.js";
import {Eye, Info, Trash2} from "lucide-react";
import React, { useState} from "react";
import {useTranslation} from "react-i18next";
import {Spinner} from "@/components/ui/spinner.js";

function ImageCard({keyVal, item, index, onHandleShowImage, onHandleConvertTimestamp, onHandleShowDetails, onSetSelectedItem, onSetSelectedIndex, onSetShowConfirmation}) {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    return(
        <Card key={keyVal}
              className="group w-58 relative bg-gradient-to-br from-emerald-200/90 via-sky-200/70 to-amber-100/60 dark:from-blue-950/50 dark:via-slate-950/50 dark:to-violet-950/50 backdrop-blur-md border-2 border-slate-200/md dark:border-slate-700/60
                                    rounded-2xl shadow-sm transition-all hover:translate-y-1 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-slate-700/30
                                    gap-3 pt-0 pb-2 pl-0 pr-0">

            <div className="relative w-full h-36">
                {loading && <div className="absolute inset-0 flex justify-center items-center gap-2">
                                <p className="text-slate-500 dark:text-slate-300">{t("loadingImage")}</p>
                                <Spinner className="text-slate-500 dark:text-slate-300" />
                            </div>}

                <img src={`/api/image-info/${item.id}/get-thumbnail/`}
                     alt={item.filename}
                     className="w-full h-36 object-cover rounded-2xl cursor-pointer"
                     onClick={onHandleShowImage}
                     onLoad={() => setLoading(false)}
                     onError={() => setLoading(false)}
                     loading="lazy"/>
            </div>


            <CardHeader>
                <CardTitle className="truncate">{item.filename}</CardTitle>
                <CardDescription className="flex flex-col gap-2 flex-wrap">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    {item.is_processed ? (
                        <Badge>{t("processed")}</Badge>
                    ) : (
                        <Badge variant="destructive">{t("notProcessed")}</Badge>
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col justify-start items-start gap-2">
                <span className="text-xs text-slate-500">ID: {item.id}</span>
                <span className="text-xs text-slate-500">{t("date")}: {onHandleConvertTimestamp()}</span>
                <div className="flex self-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="hover:cursor-pointer"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onHandleShowImage()}><Eye className="size-4"></Eye>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>{t("imagesListShowImage")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="hover:cursor-pointer"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onHandleShowDetails()}><Info className="size-4"></Info>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>{t("imagesListShowDetails")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="hover:cursor-pointer"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => {
                                            onSetSelectedItem();
                                            onSetSelectedIndex();
                                            onSetShowConfirmation();
                                        }}><Trash2 className="size-4"></Trash2>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>{t("imagesListDelete")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}

export default ImageCard;