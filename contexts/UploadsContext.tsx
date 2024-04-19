import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface UploadsContextType {
    uploads: Record<string, any[]>;
    fetchUploadsForDate: (date: string) => Promise<void>;
}

const UploadsContext = createContext<UploadsContextType | undefined>(undefined);

export const UploadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [uploads, setUploads] = useState<Record<string, any[]>>({});

    const fetchUploadsForDate = useCallback(async (date: string) => {
        const response = await fetch(`/api/files?date=${date}`);
        if (response.ok) {
            const data = await response.json();
            setUploads(prev => ({ ...prev, [date]: data }));
        }
    }, [uploads]); 


    return (
        <UploadsContext.Provider value={{ uploads, fetchUploadsForDate }}>
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