import { basicType, UserProfileType } from "@/types/types";
const emailPattern = /^(?!.\.\d)(?=[a-zA-Z0-9._%+-][a-zA-Z]{3,}\d*@)[a-zA-Z0-9._%+-]+@[a-z]{3,}\.[a-z]{2,}$/i
const passwordPattern = /^(?=(.*[A-Za-z]){3,})(?=.*\d).{6,}$/
const namePattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/

export const signupValidation = (data: basicType) => {
    const { email, password } = data
    
    if (!email.trim() || email.trim() === "" || !emailPattern.test(email))
        return { status: false, message: "email is not in required format" }
    else if (!password.trim() || password.trim() === "" || !passwordPattern.test(password))
        return { status: false, message: "password is not in required format" }
    else
        return { status: true }

}

export const userProfileValidation = (data: UserProfileType) => {
    const today = new Date();
    if (!data.firstName?.trim() || !namePattern.test(data.firstName.trim())) {
        return { status: false, message: "First name cannot be empty" };
    } else if (!data.qualification?.trim()) {
        return { status: false, message: "Qualification cannot be empty" };
    } else if (!data.college?.trim()) {
        return { status: false, message: "School/college cannot be empty" };
    } else if (!data.address?.trim() || data.address?.trim().length < 10) {
        return { status: false, message: "Address not in required format" };
    } else if (!data.startDate || isNaN(Date.parse(data.startDate))) {
        return { status: false, message: "Start date is invalid or missing" };
    } else if (!data.endDate || isNaN(Date.parse(data.endDate))) {
        return { status: false, message: "End date is invalid or missing" };
    } else if (new Date(data.startDate) > new Date(data.endDate)) {
        return { status: false, message: "Start date must be before end date" };
    } else if (new Date(data.startDate) >= today) {
        return { status: false, message: "Start date must be before today" };
    } else if (new Date(data.endDate) >= today) {
        return { status: false, message: "End date must be before today" };
    }
    else if(!data.skills)
        return { status: false, message: "skills is not in the required format" };

    else
    return { status: true};
};
