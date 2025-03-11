'use client';
import { cn } from '@/lib/utils';
import {
    AnimatePresence,
    motion,
    TargetAndTransition,
    Variants,
} from 'framer-motion';
import React, { useMemo } from 'react';

/**
 * Available animation presets for text effects
 */
type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide';

/**
 * Props for the TextEffect component
 */
type TextEffectProps = {
    children: React.ReactNode;
    per?: 'word' | 'char' | 'line';
    as?: keyof React.JSX.IntrinsicElements;
    variants?: {
        container?: Variants;
        item?: Variants;
    };
    className?: string;
    preset?: PresetType;
    delay?: number;
    trigger?: boolean;
    onAnimationComplete?: () => void;
    segmentWrapperClassName?: string;
};

/**
 * Default stagger times for different animation granularities
 */
const defaultStaggerTimes: Record<'char' | 'word' | 'line', number> = {
    char: 0.03,
    word: 0.05,
    line: 0.1,
};

/**
 * Default container animation variants
 */
const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
    exit: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

/**
 * Default item animation variants
 */
const defaultItemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
    },
    exit: { opacity: 0 },
};

/**
 * Predefined animation presets
 */
const presetVariants: Record<
    PresetType,
    { container: Variants; item: Variants }
> = {
    blur: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(12px)' },
            visible: { opacity: 1, filter: 'blur(0px)' },
            exit: { opacity: 0, filter: 'blur(12px)' },
        },
    },
    shake: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: 0 },
            visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
            exit: { x: 0 },
        },
    },
    scale: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0 },
        },
    },
    fade: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 },
        },
    },
    slide: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
        },
    },
};

/**
 * Component that animates individual segments (characters, words, or lines)
 */
const AnimationComponent: React.FC<{
    segment: React.ReactNode;
    variants: Variants;
    per: 'line' | 'word' | 'char';
    segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
    // Render different content based on animation granularity
    const content = useMemo(() => {
        if (per === 'line') {
            return (
                <motion.span variants={variants} className='block'>
                    {segment}
                </motion.span>
            );
        } 
        
        if (per === 'word') {
            return (
                <motion.span
                    aria-hidden='true'
                    variants={variants}
                    className='inline-block whitespace-pre'
                >
                    {segment}
                </motion.span>
            );
        }
        
        // Character-level animation
        return (
            <motion.span className='inline-block whitespace-pre'>
                {Array.from(segment as string).map((char, charIndex) => (
                    <motion.span
                        key={`char-${charIndex}`}
                        aria-hidden='true'
                        variants={variants}
                        className='inline-block whitespace-pre'
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.span>
        );
    }, [segment, variants, per]);

    // Apply wrapper class if provided
    if (!segmentWrapperClassName) {
        return content;
    }

    const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

    return (
        <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
            {content}
        </span>
    );
});

AnimationComponent.displayName = 'AnimationComponent';

/**
 * TextEffect component that animates text with various effects
 * 
 * Features:
 * - Character, word, or line-level animation
 * - Multiple animation presets
 * - Custom animation variants
 * - Configurable delay and staggering
 * - Trigger control for animation start
 */
export function TextEffect({
    children,
    per = 'word',
    as = 'p',
    variants,
    className,
    preset,
    delay = 0,
    trigger = true,
    onAnimationComplete,
    segmentWrapperClassName,
}: TextEffectProps) {
    // Split content into segments based on animation granularity
    const segments = useMemo(() => {
        return React.Children.toArray(children).flatMap(
            (child) => {
                if (typeof child === 'string') {
                    if (per === 'line') {
                        return child.split('\n');
                    } else if (per === 'word') {
                        return child.split(/(\s+)/);
                    } else {
                        return child.split('');
                    }
                }
                return child;
            }
        );
    }, [children, per]);

    // Get the appropriate motion component
    const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
    
    // Select animation variants based on preset or defaults
    const selectedVariants = useMemo(() => {
        return preset
            ? presetVariants[preset]
            : { container: defaultContainerVariants, item: defaultItemVariants };
    }, [preset]);
    
    const containerVariants = variants?.container || selectedVariants.container;
    const itemVariants = variants?.item || selectedVariants.item;
    
    // For accessibility, provide an aria-label when animating at character or word level
    const ariaLabel = per === 'line' ? undefined : segments.join('');

    // Get the appropriate stagger timing
    const stagger = defaultStaggerTimes[per];

    // Create container variants with delay
    const delayedContainerVariants = useMemo(() => {
        return {
            hidden: containerVariants.hidden,
            visible: {
                ...containerVariants.visible,
                transition: {
                    ...(containerVariants.visible as TargetAndTransition)?.transition,
                    staggerChildren:
                        (containerVariants.visible as TargetAndTransition)?.transition
                            ?.staggerChildren || stagger,
                    delayChildren: delay,
                },
            },
            exit: containerVariants.exit,
        };
    }, [containerVariants, stagger, delay]);

    return (
        <AnimatePresence mode='popLayout'>
            {trigger && (
                <MotionTag
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    aria-label={ariaLabel}
                    variants={delayedContainerVariants}
                    className={cn('whitespace-pre-wrap', className)}
                    onAnimationComplete={onAnimationComplete}
                >
                    {segments.map((segment, index) => (
                        <AnimationComponent
                            key={`${per}-${index}-${segment}`}
                            segment={segment}
                            variants={itemVariants}
                            per={per}
                            segmentWrapperClassName={segmentWrapperClassName}
                        />
                    ))}
                </MotionTag>
            )}
        </AnimatePresence>
    );
}
