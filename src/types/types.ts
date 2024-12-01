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