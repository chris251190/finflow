import { useEffect, useState } from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    _id: string;
    originalName: string;
  };
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, document }) => {
  const [imageUrl, setImageUrl] = useState<string>(''); // Hinzufügen des useState-Hooks

  useEffect(() => {
    fetch(`/api/image/${document._id}`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url); // Jetzt wird `setImageUrl` korrekt definiert und verwendet
      });
  }, [document._id]);

  if (!isOpen || !document) return null;

  // Verwenden Sie `imageUrl` aus dem State, anstatt es neu zu definieren
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{document.originalName}</h2>
        <img src={imageUrl} alt={document.originalName} />
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};