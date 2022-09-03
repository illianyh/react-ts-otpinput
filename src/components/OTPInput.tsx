import React, { useMemo } from "react";
import { REGEX_DIGIT } from "../constants";
import "./OTPInput.css";

export type OTPInputProps = {
    value: string;
    numOfInputs: number;
    onChange: (value: string) => void;
};
export default function OTPInput({
    value,
    numOfInputs,
    onChange
}: OTPInputProps) {
    const inputItems = useMemo(() => {
        const valueArray = value.split("");
        const items: Array<string> = [];

        for (let i = 0; i < numOfInputs; i++) {
            const char = valueArray[i];

            if (REGEX_DIGIT.test(char)) {
                items.push(char);
            } else {
                items.push("");
            }
        }

        return items;
    }, [value, numOfInputs]);

    const focusNextInput = (target: HTMLElement) => {
        const nextEl = target.nextElementSibling as HTMLInputElement | null;
        if (nextEl) {
            nextEl.focus();
        }
    };

    const focusPreviousInput = (target: HTMLInputElement) => {
        const prevEl = target.previousElementSibling as HTMLInputElement | null;
        if (prevEl) {
            prevEl.focus();
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const target = e.target;
        let targetValue = target.value.trim(); // removing any empty space
        const isDigitValue = REGEX_DIGIT.test(targetValue);

        if (!isDigitValue && targetValue !== "") {
            return;
        }

        targetValue = isDigitValue ? targetValue : " ";

        // handle pasting otp code or trying to
        // replace a single value in any of the
        // input boxes
        const targetValueLength = targetValue.length;

        if (targetValueLength === 1) {
            const newValue =
                value.substring(0, index) +
                targetValue +
                value.substring(index + 1);

            onChange(newValue);

            if (!isDigitValue) {
                return;
            }

            focusNextInput(target);
        } else if (targetValueLength === numOfInputs) {
            onChange(targetValue);

            target.blur();
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;
        const target = e.target as HTMLInputElement;
        const targetValue = target.value;

        // handle using arrow keys
        if (key === "ArrowRight" || key === "ArrowDown") {
            e.preventDefault();
            return focusNextInput(target);
        }
        if (key === "ArrowLeft" || key === "ArrowUp") {
            e.preventDefault();
            return focusPreviousInput(target);
        }

        // keep selected input range position
        target.setSelectionRange(0, targetValue.length);

        if (key !== "Backspace" || targetValue !== "") {
            return;
        }

        focusPreviousInput(target);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { target } = e;

        // keep selected input range position
        target.setSelectionRange(0, target.value.length);
    };
    return (
        <div className="otp-group">
            {inputItems.map((digit, index) => (
                <input
                    className="otp-input"
                    key={index}
                    type={"text"}
                    inputMode={"numeric"}
                    value={digit}
                    autoComplete={"one-time-code"}
                    pattern={`\d{1}`}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleInputFocus}
                    maxLength={numOfInputs}
                />
            ))}
        </div>
    );
}
