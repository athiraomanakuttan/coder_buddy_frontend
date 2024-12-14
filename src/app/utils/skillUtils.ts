export const parseSkills = (skillsInput: string): string[] => {
    const trimmedInput = skillsInput.trim();
    const skillsArray = trimmedInput
      .split(/[,\s]+/)
      .filter(skill => skill.trim() !== '')
      .map(skill => skill.startsWith('#') ? skill : `#${skill}`);
    return [...new Set(skillsArray)];
  };