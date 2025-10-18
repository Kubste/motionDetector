import DropBar from "./DropBar.jsx";

function ChangeBox({nameStr, nameValue, show, onShowClick, showChange, value, onConfirmClick, onCancelClick,
                       showConfirmation, onInputChange, showDropdown, label, options, onChange}) {

    return(
        <div className="w-full">
            <div className="flex w-full justify-between items-center gap-4">
                <p>
                    <span className="font-semibold">{nameStr}</span>:
                    {nameValue === true ? " enabled"
                    : nameValue === false ? " disabled"
                    : nameValue !== null ? " " + nameValue
                    : "N/A"}
                </p>
                {!show && <button className="button px-4 py-1 rounded-full bg-cyan-600 hover:bg-cyan-800 text-white font-medium shadow-lg"
                                  onClick={onShowClick}>Change</button>}
            </div>
            {showChange && (
                <div className="flex items-center w-full gap-2 flex-nowrap">
                    {!showDropdown ? (
                        nameStr === "Confidence Threshold" ?
                            <input className="input px-2 py-1"
                                type="number"
                                value={value}
                                placeholder={`Enter new ${nameStr}`}
                                onChange={onInputChange}
                                min="0"
                                max="1"
                                step="0.01"/>

                            : <input className="input px-2 py-1"
                                   type="text"
                                   value={value}
                                   placeholder={`Enter new ${nameStr}`}
                                   onChange={onInputChange}/>) :
                        <DropBar label={label} options={options} onChange={onChange} selectedOption={value}></DropBar>
                    }
                    <button className="confirm-button px-2 py-1 text-white" onClick={onConfirmClick}>Confirm</button>
                    <button className="close-button px-2 py-1 text-white" onClick={onCancelClick}>Cancel</button>
                </div>
            )}
            {showConfirmation && <p className="mb-4 text-green-400 font-medium">{nameStr} was changed</p>}
        </div>
    );
}

export default ChangeBox;