import { useState } from "react";
import "./App.css";
import OTPInput from "./components/OTPInput";

export default function App() {
    const [otpValue, setOtpValue] = useState("");
    const onChange = (value: string) => setOtpValue(value);

    return (
        <div className="container">
            <h1>OTP Input</h1>
            <p>Functionalites:</p>
            <ul>
                <li>
                    Pasting value that has the same length as the OTP inputs
                </li>
                <li>
                    Using arrow keys: <i>up</i>, <i>down</i>, <i>left</i>,{" "}
                    <i>up</i>
                </li>
                <li>Change single input value without changing other inputs</li>
            </ul>
            <OTPInput value={otpValue} numOfInputs={6} onChange={onChange} />
        </div>
    );
}
