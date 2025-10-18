import DropBar from "./DropBar.jsx";

function SortingBar({onChangeField, onChangeOrder, selectedOptionName, selectedOptionOrder, options, onClose}) {

    return(
        <div className="flex flex-col gap-2 items-center">
            <div className="flex flex-col gap-2 min-w-[320px]">
                <p>Select order:</p>
                <div className="flex flex-row gap-2 items-center">
                    <DropBar label="Field name"
                             options={options}
                             onChange={onChangeField}
                             selectedOption={selectedOptionName}
                    ></DropBar>

                    <DropBar label="Order"
                             options={[{name: "ascending", value: ""}, {name: "descending", value: "-"}]}
                             onChange={onChangeOrder}
                             selectedOption={selectedOptionOrder}
                    ></DropBar>
                </div>
            </div>
            <button className="close-button px-2 py-1 w-[80px]"
                    onClick={onClose}>Close</button>
        </div>
    );
} export default SortingBar;