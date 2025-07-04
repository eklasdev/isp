
import React from 'react';

const WhatsappIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.433-9.886-9.888-9.886-5.448 0-9.886 4.434-9.889 9.886-.001 2.269.655 4.505 1.905 6.447l-1.342 4.905 5.025-1.31z"/>
    </svg>
);

const PhoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
);


interface SupportLinksProps {
    currentUser: string;
}

export const SupportLinks: React.FC<SupportLinksProps> = ({ currentUser }) => {
    if (!currentUser) return null;

    const whatsappNumber = "8801975982759";
    const callNumber = "+8801746896318";
    const whatsappMessage = `আমার ইউজার আইডি: ${currentUser}, এতে এখন সমস্যা হচ্ছে। একটু দেখবেন?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const callUrl = `tel:${callNumber}`;

    return (
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-4">
            <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                title="Contact via WhatsApp"
                aria-label="Contact support via WhatsApp"
            >
                <WhatsappIcon />
                <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a 
                href={callUrl} 
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Call Support"
                aria-label="Call support directly"
            >
                <PhoneIcon />
                <span className="hidden sm:inline">Call Support</span>
            </a>
        </div>
    );
};
