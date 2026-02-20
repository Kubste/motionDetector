import {Label} from "@/components/ui/label.js";
import {CardDescription} from "@/components/ui/card.js";
import {Input} from "@/components/ui/input.js";
import {FieldDescription} from "@/components/ui/field.js";
import {Button} from "@/components/ui/button.js";
import {Check, Pencil, X} from "lucide-react";
import React from "react";

function ChangeBox({name, val, newVal, setNewVal, showChangeConfirmation, setShowChangeConfirmation, confirmationLabel, showChange, setShowChange, error, setError, setShowError, onConfirm, placeholder}) {

    return (
        <div className={`group relative gap-5 flex items-center justify-between rounded-xl border bg-transparent px-6 py-4 shadow-sm transition-all hover:shadow-md
        ${showChangeConfirmation && "border-green-600"} ${error && "border-red-600"}`}>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">{name}</Label>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-base font-medium ${showChangeConfirmation ? "text-green-600" : ""}`}>{val}</span>

                    {showChangeConfirmation && (
                        <CardDescription className="text-xs text-green-600 hover:underline cursor-pointer"
                                         onClick={() => setShowChangeConfirmation(false)}
                        >{confirmationLabel}</CardDescription>
                    )}
                </div>
            </div>

            {showChange ? (
                <div className="flex items-start gap-3 w-3/5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex flex-col gap-1 flex-1">
                        <Input value={newVal}
                               aria-invalid={!!error}
                               onChange={(e) => setNewVal(e.target.value)}
                               placeholder={placeholder}
                               className={`h-9 transition-all ${
                                error
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                        />

                        {error && (
                            <FieldDescription className="text-xs text-red-500 hover:underline cursor-pointer"
                                              onClick={() => {
                                                  setError(null);
                                                  setShowError(false);
                                              }}
                            >{error}</FieldDescription>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Button size="icon" onClick={onConfirm}>
                            <Check className="size-4" />
                        </Button>

                        <Button size="icon"
                                variant="ghost"
                                onClick={() => {
                                    setShowChange(false);
                                    setError(null);
                                }}
                        ><X className="size-4" /></Button>

                    </div>
                </div>
            ) : (
                <Button variant="ghost"
                        size="sm"
                        onClick={() => {
                            setShowChange(true);
                            setShowChangeConfirmation(false);
                        }}
                ><Pencil className="size-4" />Change</Button>
            )}
        </div>
    );

}
export default ChangeBox;