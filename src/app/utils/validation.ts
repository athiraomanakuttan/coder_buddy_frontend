import { basicType } from "@/types/types";

export const signupValidation = (data: basicType) => {
    const { email, password } = data
    const emailPattern = /^(?!.\.\d)(?=[a-zA-Z0-9._%+-][a-zA-Z]{3,}\d*@)[a-zA-Z0-9._%+-]+@[a-z]{3,}\.[a-z]{2,}$/i
    const passwordPattern = /^(?=(.*[A-Za-z]){3,})(?=.*\d).{6,}$/
    if (!email.trim() || email.trim() === "" || !emailPattern.test(email))
        return { status: false, message: "email is not in required format" }
    else if (!password.trim() || password.trim() === "" || !passwordPattern.test(password))
        return { status: false, message: "password is not in required format" }
    else
        return { status: true }

}