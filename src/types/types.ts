import { Profile } from "next-auth";

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
    skills?: string | string[];
    profilePicture ?: string | File;
  }

export interface ProfileType extends Profile {
  name: string,
  email:string,
  sub:string
  picture:string
}

  
 

  export type QualificationType = {
    qualification?: string;
    college?: string;
    university?:string;
    year_of_passout?: string;
    year?:string;
  };
  
  export type experienceType = {
    job_role?: string;
    employer?: string;
    start_date?: string;
    end_date?: string;
    occupation?:string;
    startDate?:string;
    endDate?:string;
  };
  

  export type ExpertType = {
    _id: string;
    first_name: string;
    last_name: string;
    email ?:string;
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
    profilePicture: File | string | undefined;
    address ?: string;
  };

  export type CommentType = {
    expertId?:string,
    comment:string,
    date?:string,
    status?: number,
    expertName ?:string
    expert_image_url ?: string,
    _id?:string
  }

  export interface PostType{
    _id ?:string,
    userId ?:  string,
    title:string,
    description: string,
    technologies:string[],
    uploads ?: string | File | null,
    comments ?: CommentType[],
    status ?: number
  }

  export type NewMeetingType = { title: string, meetingDate : string , expertId : string}

  export type ExpertMeetingType = {
    dateTime : string,
    meetingId :  string,
    status : number,
    title : string,
    userId: string,
    _id : string
  }