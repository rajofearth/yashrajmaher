export function generateMetadata({ title, description }) {
    const baseName = "Yashraj Maher";
    const baseDescription = "A Personal Website of Yashraj Maher";
    
    return {
      title: title ? `${title} - ${baseName}` : baseName,
      description: description || baseDescription,
    };
  }