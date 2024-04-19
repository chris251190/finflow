import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface UploadsContextType {
    uploads: any[];
    fetchUploads: () => Promise<void>;
}

const UploadsContext = createContext<UploadsContextType | undefined>(undefined);

export const UploadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [uploads, setUploads] = useState<any[]>([]);

    const fetchUploads = useCallback(async () => {
        const response = await fetch(`/api/files`);
        if (response.ok) {
            const data = await response.json();
            setUploads(data);
        }
    }, []); // Removed dependency on uploads as it's no longer needed for fetching

    return (
        <UploadsContext.Provider value={{ uploads, fetchUploads }}>
            {children}
        </UploadsContext.Provider>
    );
};

export const useUploads = () => {
    const context = useContext(UploadsContext);
    if (context === undefined) {
        throw new Error('useUploads must be used within an UploadsProvider');
    }
    return context;
};