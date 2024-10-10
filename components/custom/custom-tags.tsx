import React from 'react';
import { Badge } from "@/components/ui/badge";

type TagsProps = {
    tags: string[];
};

const Tags: React.FC<TagsProps> = ({ tags }) => {
    return (
        <div className='flex flex-wrap gap-2 pt-6 pb-6 overflow-x-auto'>
            {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className='h-7 whitespace-nowrap'>{tag}</Badge>
            ))}
        </div>
    );
};

export default Tags;