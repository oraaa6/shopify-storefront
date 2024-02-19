import qa from '@site/json/q&a.json';
import DisclosureList from '@site/snippets/DisclosureList';

type PrivacyPolicySectionProps = {
  privacyPolicyBody: string;
  title: string;
};

export function PrivacyPolicySection({ privacyPolicyBody, title }: PrivacyPolicySectionProps) {
  return (
    <div>
      <h2 className="py-4 text-center text-4xl font-bold md:py-7">{`Check out ${title}`}</h2>
      <div className="m-auto" dangerouslySetInnerHTML={{ __html: privacyPolicyBody }} />

      <h3 className="py-4 text-center text-4xl font-bold md:py-5">Q&A</h3>
      <DisclosureList data={JSON.parse(JSON.stringify(qa))} />
    </div>
  );
}
