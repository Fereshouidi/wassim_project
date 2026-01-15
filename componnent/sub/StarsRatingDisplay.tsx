import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '@/contexts/themeProvider';

type StarsRatingDisplayProps = {
    rating: number;   
    maxStars?: number; 
    totalOpinions?: number; 
    interactive?: boolean; 
    onRate?: (num: number) => void; 
    size?: "sm" | "md" | "lg";
}

const StarsRatingDisplay = ({ 
    rating, 
    maxStars = 5, 
    totalOpinions, 
    interactive = false, 
    onRate,
    size = "md"
}: StarsRatingDisplayProps) => {
    
    const { colors } = useTheme();

    const iconSize = size === "sm" ? "text-xs" : size === "lg" ? "text-2xl" : "text-lg";

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= maxStars; i++) {
            let icon = regularStar;
            let color = "FFD700";

            if (i <= rating) {
                icon = solidStar;
                color = "#FFD700";
            } else if (i - 0.5 <= rating && !interactive) {
                icon = faStarHalfAlt;
                color = "#FFD700";
            }

            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={icon}
                    className={`${iconSize} ${interactive ? 'cursor-pointer transition-transform active:scale-90' : ''}`}
                    style={{ color: color }}
                    onClick={() => interactive && onRate && onRate(i)}
                />
            );
        }
        return stars;
    };

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-3'>
                <div className='flex flex-row gap-1'>
                    {renderStars()}
                </div>

                <div className='flex items-center gap-2'>
                    <h4 className='font-bold' style={{ color: colors.dark[100], fontSize: size === "lg" ? '1.5rem' : '1rem' }}>
                        {Number.isInteger(rating) ? `${rating}.0` : rating}
                    </h4>
                    
                    {totalOpinions !== undefined && (
                        <p className='text-xs opacity-50 italic'>
                            ({totalOpinions} opinion)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StarsRatingDisplay;