export const parseSkills = (skillsInput: string): string[] => {
  console.log(skillsInput)
  console.log(typeof skillsInput)
    const trimmedInput = skillsInput.trim();
    const skillsArray = trimmedInput
      .split(/[,\s]+/)
      .filter(skill => skill.trim() !== '')
      .map(skill => skill.startsWith('#') ? skill : `#${skill}`);
      console.log("skillsArray",skillsArray)
    return [...new Set(skillsArray)];
  };