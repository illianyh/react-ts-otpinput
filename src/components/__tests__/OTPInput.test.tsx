import { faker } from "@faker-js/faker";
import { fireEvent, render, screen } from "@testing-library/react";
import OTPInput, { OTPInputProps } from "../OTPInput";

describe("<OTPInput />", () => {
    const renderComponent = (props: OTPInputProps) =>
        render(<OTPInput {...props} />);

    it("should accept value and numOfInputs props", () => {
        const value = faker.datatype.number({ min: 0, max: 999999 }).toString();
        const valueArr = value.split("");
        const numOfInputs = value.length;

        renderComponent({
            value,
            numOfInputs,
            onChange: jest.fn()
        });

        const inputs = screen.queryAllByRole("textbox");
        expect(inputs).toHaveLength(numOfInputs);

        inputs.forEach((inputEl, index) => {
            expect(inputEl).toHaveValue(valueArr[index]);
        });
    });

    it("should allow digit chars and focus next input", () => {
        const numOfInputs = faker.datatype.number({ min: 2, max: 6 });
        const onChange = jest.fn();

        renderComponent({
            value: "",
            numOfInputs,
            onChange
        });

        const inputs = screen.queryAllByRole("textbox");
        expect(inputs).toHaveLength(numOfInputs);

        inputs.forEach((inputEl, index) => {
            const digit = faker.datatype.number({ min: 0, max: 9 }).toString();
            fireEvent.change(inputEl, {
                target: { value: digit }
            });

            expect(onChange).toBeCalledTimes(1);
            expect(onChange).toBeCalledWith(digit);

            const focusedInput = inputs[index + 1] || inputEl;
            expect(focusedInput).toHaveFocus();

            onChange.mockReset();
        });
    });

    it("should not allow non-digit chars", () => {
        const numOfInputs = faker.datatype.number({ min: 2, max: 6 });
        const onChange = jest.fn();

        renderComponent({
            value: "",
            numOfInputs,
            onChange
        });

        const inputs = screen.queryAllByRole("textbox");

        inputs.forEach((inputEl) => {
            const nonDigit = faker.random.alpha();
            fireEvent.change(inputEl, {
                target: { value: nonDigit }
            });

            expect(onChange).not.toBeCalled();
            onChange.mockReset();
        });
    });

    it("should allow deleting value", () => {
        const value = faker.datatype
            .number({ min: 10, max: 999999 })
            .toString();
        const numOfInputs = value.length;
        const lastInputIndex = numOfInputs - 1;
        const onChange = jest.fn();

        renderComponent({
            value,
            numOfInputs,
            onChange
        });

        const inputs = screen.queryAllByRole("textbox");

        for (let index = lastInputIndex; index > -1; index--) {
            const inputEl = inputs[index];
            const target = { value: "" };

            fireEvent.change(inputEl, {
                target
            });
            fireEvent.keyDown(inputEl, {
                target,
                key: "Backspace"
            });

            const valueArr = value.split("");
            valueArr[index] = " ";
            const expectedValue = valueArr.join("");

            expect(onChange).toBeCalledTimes(1);
            expect(onChange).toBeCalledWith(expectedValue);

            const focusedInput = inputs[index - 1] || inputEl;
            expect(focusedInput).toHaveFocus();

            onChange.mockReset();
        }
    });

    it("should stay on current element after deleting value", () => {
        const value = faker.datatype
            .number({ min: 10, max: 999999 })
            .toString();
        const valueArr = value.split("");
        const numOfInputs = value.length;
        const lastInputIndex = numOfInputs - 1;
        const onChange = jest.fn();

        renderComponent({
            value,
            numOfInputs,
            onChange
        });

        const inputs = screen.queryAllByRole("textbox");

        for (let index = lastInputIndex; index > 0; index--) {
            const inputEl = inputs[index];
            const target = { value: "" };

            fireEvent.keyDown(inputEl, {
                target: { value: valueArr[index] },
                key: "Backspace"
            });

            const prevEl = inputs[index - 1] || inputEl;
            expect(prevEl).not.toHaveFocus();
        }
    });

    it("should allow pasting inputs when it is the same of numOfInputs", () => {
        const value = faker.datatype
            .number({ min: 10, max: 999999 })
            .toString();

        const numOfInputs = value.length;
        const onChange = jest.fn();
        console.log({ value, numOfInputs });

        renderComponent({
            value: "",
            numOfInputs,
            onChange
        });

        const inputs = screen.queryAllByRole("textbox");
        const randomInputIndex = faker.datatype.number({
            min: 0,
            max: numOfInputs - 1
        });

        // pasting value on any of the input boxes
        const randomEl = inputs[randomInputIndex];
        fireEvent.change(randomEl, { target: { value } });
        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith(value);
        expect(randomEl).not.toHaveFocus();
    });

    it("should NOT allow pasting of value (less than numOfInputs)", () => {
        const value = faker.datatype.number({ min: 10, max: 99999 }).toString(); // 2-5 digits
        const numOfInputs = faker.datatype.number({ min: 6, max: 10 });
        const onChange = jest.fn();

        renderComponent({
            numOfInputs,
            onChange,
            value: ""
        });

        const inputEls = screen.queryAllByRole("textbox");
        const randomIdx = faker.datatype.number({
            min: 0,
            max: numOfInputs - 1
        });
        const randomEl = inputEls[randomIdx];

        fireEvent.change(randomEl, { target: { value } });

        expect(onChange).not.toBeCalled();
    });

    it("should focus to next input when pressing arrow right/down key", () => {
        renderComponent({
            numOfInputs: 3,
            onChange: jest.fn(),
            value: ""
        });
        const inputEls = screen.queryAllByRole("textbox");
        const firstEl = inputEls[0];
        const secondEl = inputEls[1];
        const thirdEl = inputEls[2];

        fireEvent.keyDown(firstEl, { key: "ArrowRight" });
        expect(secondEl).toHaveFocus();

        fireEvent.keyDown(secondEl, { key: "ArrowDown" });
        expect(thirdEl).toHaveFocus();
    });

    it("should focus to prev input when pressing arrow left/up key", () => {
        renderComponent({
            numOfInputs: 3,
            onChange: jest.fn(),
            value: ""
        });
        const inputEls = screen.queryAllByRole("textbox");
        const firstEl = inputEls[0];
        const secondEl = inputEls[1];
        const thirdEl = inputEls[2];

        fireEvent.keyDown(thirdEl, { key: "ArrowLeft" });
        expect(secondEl).toHaveFocus();

        fireEvent.keyDown(secondEl, { key: "ArrowUp" });
        expect(firstEl).toHaveFocus();
    });
});
