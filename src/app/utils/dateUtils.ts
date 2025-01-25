export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  export const formatTime = (dateString: string | Date): string =>{
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US',{
      hour: 'numeric',
      minute: 'numeric',
      second:'numeric'
    }).format(date)
  }