import clsx from 'clsx';
import { InputHTMLAttributes, useState } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function SearchInput({ name, label, ...props }: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:w-[200px] lg:w-full">
        <label className="text-base" htmlFor={name}>
          {label}
        </label>

        <div className={clsx('relative mt-1 rounded-lg p-1.5 shadow-md', focus && 'shadow-lg')}>
          <BookOpenIcon className="absolute right-2.5 z-10 h-5 text-gray-400"></BookOpenIcon>
          <input
            autoComplete="off"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="border-transparent bg-transparent focus:outline-none"
            name={name}
            type="text"
            id={name}
            {...props}
          />
        </div>
      </div>
    </>
  );
}
