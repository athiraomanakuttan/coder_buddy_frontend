import { basicType, concernFormDataType, experienceType, ExpertType, formDataType, NewMeetingType, PostType, QualificationType, UserProfileType } from "@/types/types";
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
    
    if (!qualifications || qualifications.length === 0) {
      return { status: false, message: "At least one qualification is required" };
    }
  
    for (let index = 0; index < qualifications.length; index++) {
      const qual = qualifications[index];
  
      if (!qual.qualification?.trim()) {
        return { status: false, message: `Qualification ${index + 1} is required` };
      }
  
      if (!qual.university?.trim()) {
        return { status: false, message: `University for qualification ${index + 1} is required` };
      }
  
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
  
    if (!jobs || jobs.length === 0) {
      return { status: false, message: "At least one experience entry is required" };
    }
  
    for (let index = 0; index < jobs.length; index++) {
      const job = jobs[index];
  
      if (!job.occupation?.trim()) {
        return { status: false, message: `Occupation for experience ${index + 1} is required` };
      }
  
      if (!job.employer?.trim()) {
        return { status: false, message: `Employer for experience ${index + 1} is required` };
      }
  
      if (!job.startDate) {
        return { status: false, message: `Start date for experience ${index + 1} is required` };
      }
      const startDate = new Date(job.startDate)
      if (startDate > today) {
        return { status: false, message: `Start date for experience ${index + 1} cannot be in the future` };
      }
      if (job.endDate) {
        const endDate = new Date(job.endDate);
        
        if (endDate > today) {
          return { status: false, message: `End date for experience ${index + 1} cannot be in the future` };
        }
  
        if (startDate > endDate) {
          return { status: false, message: `Start date cannot be after end date for experience ${index + 1}` };
        }
      }
  
      if (job.startDate && job.endDate && new Date(job.startDate) > new Date(job.endDate)) {
        return { status: false, message: `Start date cannot be after end date for experience ${index + 1}` };
      }
    }

  
    const parsedSkills = parseSkills(skills);
    if (!parsedSkills || parsedSkills.length === 0) {
      return { status: false, message: "At least one skill is required" };
    }
  
    
    if (!formData.profilePicture) {
      return { status: false, message: "Profile picture is required" };
    }
  
    return { status: true };
  };
  export const expertProfileValidationFirstHalf = (formData:ExpertType)=>{
    if (!formData.first_name?.trim() || !namePattern.test(formData.first_name?.trim())) {
      return { status: false, message: "First name is required" };
    }
  
    if (!formData.last_name?.trim() || !namePattern.test(formData.last_name?.trim())) {
      return { status: false, message: "Last name is required" };
    }
  
    if (!formData.primary_contact) {
      return { status: false, message: "Primary contact number is required" };
    } 
    
    if (!/^\d{10}$/.test(formData.primary_contact.toString())) {
      return { status: false, message: "Primary contact must be a 10-digit number" };
    }
  
    if (formData.secondary_contact && !/^\d{10}$/.test(formData.secondary_contact.toString())) {
      return { status: false, message: "Secondary contact must be a 10-digit number" };
    }
  
    if (!formData.address?.trim()) {
      return { status: false, message: "Address is required" };
    }
  return { status : true, message:"sucess"}
  }
  


  export const postValidation = (data: PostType)=>{
    console.log("data", data)
    if(!data.title || data.title===""){
      return {status: false , message : "post title is requied"}
    }
    if(!namePattern.test(data.title))
      return {status: false , message : "post title is not in requied format"}
    if(!data.description || data.description===""){
      return {status: false , message : "post description is requied"}
    }
    else if(!data.technologies || data.technologies.length<1){
      return {status: false , message : "Add the technologied used"}
    }
    else
    return { status: true}
  }
  export const meetingValidation = (data : NewMeetingType)=>{
    const today =  new Date()
    const {title , meetingDate} = data
    if(!title || title.trim()==="")
      return { status: false, message :  "Meeting Title is required"} 
    else if(!meetingDate || isNaN(Date.parse(meetingDate)))
      return { status: false, message :  "please enter a valid date and time"} 
    else if(new Date(meetingDate) < today)
      return { status: false, message :  "The date should be a future date"} 
    else
    return { status :  true , message : "validation successfull"}
  }

  export const paymentValidation = ({title,amount}:formDataType)=>{
      if(!title || title.length < 3)
        return {status:false,message:"title is empty or too short"}

      const isNumeric = !isNaN(Number(amount)) && Number(amount) > 0 && Number(amount) < 10000;

  if (!isNumeric) {
    return { status: false, message: "Amount must be a valid number between 1 and 9999" };
  }

  return { status : true}
      
  }

  export const concernValidation = (data : concernFormDataType)=>{
      if(!data.title.trim())
        return { status: false, message:"title is required"}
      if(!data.description.trim() || data.description.trim().length < 30)
        return { status: false, message:"description should be minimum of 30 charactor"}

      return { status: true}
  }