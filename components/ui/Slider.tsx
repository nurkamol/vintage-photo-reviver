import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const internalValue = value ? value[0] : 0;
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange([Number(event.target.value)]);
      }
    };
    
    return (
      <input
        type="range"
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        className={cn(
          'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-500',
          className
        )}
        {...props}
      />
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
