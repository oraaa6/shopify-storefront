import clsx from "clsx";
import { InputHTMLAttributes, useState } from "react";
import { BookOpenIcon } from '@heroicons/react/24/outline';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function SearchInput({
  name,
  label,
  ...props
}: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div className="m-auto flex w-full flex-col">
        <label
          className="text-base"
          htmlFor={name}
        >
          {label}
        </label>

        <div
          className={clsx("relative w-full rounded-lg p-1.5 shadow-md", focus && 'shadow-lg')}
        >
           <BookOpenIcon className="absolute right-2.5 z-50 size-5 text-gray-400"></BookOpenIcon>
          <input
            autoComplete="off"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="w-10/12 border-transparent bg-transparent focus:outline-none"
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