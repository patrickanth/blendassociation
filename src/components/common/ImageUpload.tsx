import React, { useCallback, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UploadContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const DropZone = styled.div<{ isDragging: boolean; hasFiles: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  padding: ${props => props.hasFiles ? '20px' : '40px'};
  text-align: center;
  background: ${props => props.isDragging ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: ${props => props.hasFiles ? 'auto' : '150px'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UploadText = styled.div`
  color: white;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 10px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PreviewItem}:hover & {
    opacity: 1;
  }
`;

const RemoveButton = styled.button`
  background: rgba(220, 53, 69, 0.9);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 53, 69, 1);
    transform: scale(1.05);
  }
`;

interface FileWithPreview extends File {
  preview?: string;
}

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  existingImages = [],
  onRemoveExisting,
  disabled = false
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const createPreview = (file: File): FileWithPreview => {
    const fileWithPreview = file as FileWithPreview;
    fileWithPreview.preview = URL.createObjectURL(file);
    return fileWithPreview;
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo di file non supportato. Usa: ${acceptedTypes.join(', ')}`;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return `File troppo grande. Massimo ${maxFileSize}MB`;
    }

    return null;
  };

  const handleFiles = useCallback((newFiles: File[]) => {
    if (disabled) return;

    const validFiles: FileWithPreview[] = [];
    const totalFiles = files.length + existingImages.length + newFiles.length;

    if (totalFiles > maxFiles) {
      alert(`Massimo ${maxFiles} file consentiti`);
      return;
    }

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (!error) {
        const fileWithPreview = createPreview(file);
        validFiles.push(fileWithPreview);
      } else {
        alert(error);
      }
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, existingImages.length, maxFiles, disabled, onFilesChange, maxFileSize, acceptedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;
    
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    
    // Reset input
    e.target.value = '';
  }, [handleFiles, disabled]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_file, i) => i !== index);
    setFiles(updatedFiles);
    
    // Cleanup preview URL
    if (files[index].preview) {
      URL.revokeObjectURL(files[index].preview!);
    }
    
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  const removeExistingImage = useCallback((url: string) => {
    if (onRemoveExisting) {
      onRemoveExisting(url);
    }
  }, [onRemoveExisting]);

  const hasFiles = files.length > 0 || existingImages.length > 0;

  return (
    <UploadContainer>
      <DropZone
        isDragging={isDragging}
        hasFiles={hasFiles}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <UploadText>
          <h3>
            {isDragging ? 'Rilascia i file qui' : 'Carica Immagini'}
          </h3>
          <p>
            Trascina le immagini qui o clicca per selezionare<br />
            Massimo {maxFiles} file, {maxFileSize}MB ciascuno
          </p>
        </UploadText>
        
        <HiddenInput
          id="file-input"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          disabled={disabled}
        />
      </DropZone>

      {hasFiles && (
        <PreviewGrid>
          {/* Immagini esistenti */}
          {existingImages.map((url, index) => (
            <PreviewItem key={`existing-${index}`}>
              <PreviewImage src={url} alt={`Existing ${index}`} />
              <PreviewOverlay>
                <RemoveButton onClick={() => removeExistingImage(url)}>
                  Rimuovi
                </RemoveButton>
              </PreviewOverlay>
            </PreviewItem>
          ))}

          {/* Nuovi file */}
          {files.map((file, index) => (
            <PreviewItem key={`new-${index}`}>
              <PreviewImage src={file.preview!} alt={file.name} />
              <PreviewOverlay>
                <RemoveButton onClick={() => removeFile(index)}>
                  Rimuovi
                </RemoveButton>
              </PreviewOverlay>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </UploadContainer>
  );
};

export default ImageUpload;