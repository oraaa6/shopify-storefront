import { ReactNode } from '@site/utilities/deps';
import { HeaderSection } from '@site/sections/HeaderSection';
import { FooterSection } from '@site/sections/FooterSection';

interface Props {
  children: ReactNode;
}

export function StoreLayout(props: Props) {
  return (
    <div className="flex h-full flex-col justify-between">
      <HeaderSection />
      <main className="m-auto w-full max-w-7xl flex-1 p-6 lg:px-8">{props.children}</main>
      <FooterSection />
    </div>
  );
}
