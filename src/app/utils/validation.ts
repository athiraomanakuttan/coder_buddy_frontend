import { basicType, experienceType, ExpertType, QualificationType, UserProfileType } from "@/types/types";
import {parseSkills} from '@/app/utils/skillUtils'
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

export const passwordValidation = (password: string, conform_password :  string)=>{
    if(!password || !conform_password)
        return { status: false , message:"password and confirm password is required"}
    else if(!password.match(passwordPattern))
        return { status: false , message:"password is not in required format"}
    else if (password !== conform_password)
        return { status: false , message:"password and confirm password is not matching"}
    else 
        return { status : true}
}

export const expertProfileValidation = (
    formData: ExpertType, 
    qualifications: QualificationType[], 
    jobs: experienceType[], 
    skills: string
  ) => {
    const today = new Date();
    // Validate First Name
    if (!formData.first_name?.trim()) {
      return { status: false, message: "First name is required" };
    }
  
    // Validate Last Name
    if (!formData.last_name?.trim()) {
      return { status: false, message: "Last name is required" };
    }
  
    // Validate Primary Contact
    if (!formData.primary_contact) {
      return { status: false, message: "Primary contact number is required" };
    } 
    
    if (!/^\d{10}$/.test(formData.primary_contact.toString())) {
      return { status: false, message: "Primary contact must be a 10-digit number" };
    }
  
    // Validate Secondary Contact (if provided)
    if (formData.secondary_contact && !/^\d{10}$/.test(formData.secondary_contact.toString())) {
      return { status: false, message: "Secondary contact must be a 10-digit number" };
    }
  
    // Validate Address
    if (!formData.address?.trim()) {
      return { status: false, message: "Address is required" };
    }
  
    // Validate Qualifications
    if (!qualifications || qualifications.length === 0) {
      return { status: false, message: "At least one qualification is required" };
    }
  
    for (let index = 0; index < qualifications.length; index++) {
      const qual = qualifications[index];
  
      // Validate Qualification
      if (!qual.qualification?.trim()) {
        return { status: false, message: `Qualification ${index + 1} is required` };
      }
  
      // Validate University
      if (!qual.university?.trim()) {
        return { status: false, message: `University for qualification ${index + 1} is required` };
      }
  
      // Validate Passout Year
      if (!qual.year?.trim()) {
        return { status: false, message: `Passout year for qualification ${index + 1} is required` };
      }
  
      const yearNum = parseInt(qual.year);
      const currentYear = new Date().getFullYear();
  
      if (isNaN(yearNum)) {
        return { status: false, message: `Passout year for qualification ${index + 1} must be a number` };
      }
  
      if (yearNum < 1900 || yearNum > currentYear) {
        return { status: false, message: `Passout year for qualification ${index + 1} must be between 1900 and ${currentYear}` };
      }
    }
  
    // Validate Jobs/Experience
    if (!jobs || jobs.length === 0) {
      return { status: false, message: "At least one experience entry is required" };
    }
  
    for (let index = 0; index < jobs.length; index++) {
      const job = jobs[index];
  
      // Validate Occupation
      if (!job.occupation?.trim()) {
        return { status: false, message: `Occupation for experience ${index + 1} is required` };
      }
  
      // Validate Employer
      if (!job.employer?.trim()) {
        return { status: false, message: `Employer for experience ${index + 1} is required` };
      }
  
      // Validate Start Date
      if (!job.startDate) {
        return { status: false, message: `Start date for experience ${index + 1} is required` };
      }
      const startDate = new Date(job.startDate)
      if (startDate > today) {
        return { status: false, message: `Start date for experience ${index + 1} cannot be in the future` };
      }
      if (job.endDate) {
        const endDate = new Date(job.endDate);
        
        // Check if end date is in the future
        if (endDate > today) {
          return { status: false, message: `End date for experience ${index + 1} cannot be in the future` };
        }
  
        // Check if start date is before end date
        if (startDate > endDate) {
          return { status: false, message: `Start date cannot be after end date for experience ${index + 1}` };
        }
      }
  
      // Validate Start and End Date
      if (job.startDate && job.endDate && new Date(job.startDate) > new Date(job.endDate)) {
        return { status: false, message: `Start date cannot be after end date for experience ${index + 1}` };
      }
    }
  
    // Validate Skills
    const parsedSkills = parseSkills(skills);
    if (!parsedSkills || parsedSkills.length === 0) {
      return { status: false, message: "At least one skill is required" };
    }
  
    
    if (!formData.profilePicture) {
      return { status: false, message: "Profile picture is required" };
    }
  
    return { status: true };
  };
  
  