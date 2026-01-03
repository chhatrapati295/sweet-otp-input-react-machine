import { useEffect, useRef, useState } from "react";

interface IOtp {
  length?: number;
}

const Otp = ({ length = 6 }: IOtp) => {
  // Holds OTP digits as an array (controlled inputs)
  const [otpData, setOtpData] = useState<string[]>(() =>
    Array(length).fill("")
  );

  // Store refs for each input to control focus
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Focus first input on mount or length change
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [length]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;
    const copy = [...otpData];

    // Handle Backspace:
    // - Clear current box if it has value
    // - Otherwise move focus to previous box
    if (key === "Backspace") {
      e.preventDefault();

      if (otpData[index]) {
        copy[index] = "";
        setOtpData(copy);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Move focus left
    if (key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    // Move focus right
    if (key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }

    // Allow only single digit input
    if (!/^\d$/.test(key)) return;

    e.preventDefault();
    copy[index] = key;
    setOtpData(copy);

    // Auto move to next input after digit entry
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Simple paste: fills OTP from start
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Get only digits and limit to OTP length
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!paste) return;

    const copy = Array(length).fill("");

    // Fill OTP boxes sequentially
    for (let i = 0; i < paste.length; i++) {
      copy[i] = paste[i];
    }

    setOtpData(copy);

    // Focus last filled input
    inputRefs.current[paste.length - 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {otpData.map((value, index) => (
        <input
          key={index}
          ref={(el) => void (inputRefs.current[index] = el)}
          type="tel"
          inputMode="numeric"
          value={value}
          maxLength={1}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="border border-black rounded-md h-12 w-12 text-center"
        />
      ))}
    </div>
  );
};

export default Otp;
