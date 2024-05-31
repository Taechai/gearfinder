// contexts/FileContext.tsx
import React from "react";

interface FileContextProps {
  selectedFile: { fileId: string; fileName: string }; // Replace 'any' with the type of your data, e.g., IMyDataType
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the same type as your data
}

// Create a context with a default value or undefined
const FileContext = React.createContext<FileContextProps>({
  selectedFile: { fileId: "", fileName: "" },
  setSelectedFile: () => {},
});

export default FileContext;
