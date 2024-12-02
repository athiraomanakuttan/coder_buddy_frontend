export type basicType={
    email:string
    password:string
}
export interface UserProfileType {
    _id ?:string;
    firstName?: string;
    lastName?: string;
    qualification?: string;
    college?: string;
    address?: string;
    totalExperience?: string;
    currentJobTitle?: string;
    occupation ?:string;
    employer?: string;
    startDate?: string;
    endDate?: string;
    skills?: string;
    profilePicture ?: string;
  }
 

  export type QualificationType = {
    qualification?: string;
    college?: string;
    year_of_passout?: string;
  };
  
  export type experienceType = {
    job_role?: string;
    employer?: string;
    start_date?: string;
    end_date?: string;
  };
  
  // export interface ExpertType{
  //   _id: string;
  // first_name: string;
  // last_name: string;
  // primary_contact?: string;
  // secondary_contact?: string;
  // qualification: {
  //   qualification: string;
  //   college: string;
  //   year_of_passout: string;
  // }[];
  // experience: {
  //   job_role: string;
  //   employer: string;
  //   start_date: string;
  //   end_date: string;
  // }[];
  // skills?: string[];
  // profilePicture: string;
  // }

  export type ExpertType = {
    _id: string;
    first_name: string;
    last_name: string;
    primary_contact?: string;
    secondary_contact?: string;
    qualification: {
      qualification: string;
      college: string;
      year_of_passout: string;
    }[];
    experience: {
      job_role: string;
      employer: string;
      start_date: string;
      end_date: string;
    }[];
    skills?: string[];
    profilePicture: string;
    address ?: string;
  };