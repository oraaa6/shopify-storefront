import { NextImage, NextLink } from '@site/utilities/deps';
import Diamond from '@site/assets/diamond.svg';

export function FooterSection() {
  return (
    <footer className="shadow-2xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 p-6 sm:flex-row lg:px-8">
        <NextLink href="/">
          <NextImage
            src={Diamond}
            alt="Best Shop Ever logo"
            width={100}
            height={100}
            className="object-cover object-center"
          />
          <p className="italic">Best Shop Ever</p>
        </NextLink>
        <div className="text-center">
          <p className="text-base font-semibold">Best Shop Ever</p>
          <p className="text-sm">ul. Wiejska 11, 02-123 Warsaw</p>
          <a href="tel:+48123123123">tel. 123-123-123</a>
        </div>
      </div>
    </footer>
  );
}
