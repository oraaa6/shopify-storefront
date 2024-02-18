import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type DisclosureData = {
  question: string;
  answer: string;
};

type DisclosureListProps = {
  data: DisclosureData[];
};

export default function DisclosureList({ data }: DisclosureListProps) {
  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full rounded-2xl bg-white p-2">
        {data.map(({ question, answer }) => (
          <>
            <Disclosure key={question}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary-200 px-4 py-2 text-left text-sm font-medium text-primary-600 hover:bg-primary-300 focus:outline-none focus-visible:ring ">
                    <span>{question}</span>
                    <ChevronUpIcon className={`${open ? 'rotate-180' : ''} size-5 text-primary-700`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">{answer}</Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-2"></Disclosure>
          </>
        ))}
      </div>
    </div>
  );
}
