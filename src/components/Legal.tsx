import policy from "../utils/policy.json";
import terms from "../utils/T&C.json";

interface LegalProps {
  type: "policy" | "terms";
}

type Section = {
  title: string;
  data: (string | { title: string; details: string[] })[];
};

// shape of the JSON source items
type SourceSection = {
  section: string;
  content: (string | { title: string; details: string[] })[];
};

export default function Legal({ type }: LegalProps) {
  const sections: Section[] =
    type === "terms"
      ? terms.termsAndConditions.map((item: SourceSection) => ({
          title: item.section,
          data: item.content,
        }))
      : policy.privacyPolicy.map((item: SourceSection) => ({
          title: item.section,
          data: item.content,
        }));

  return (
    <div className="space-y-6">
      {sections.map((section: Section, sectionIdx: number) => (
        <div key={sectionIdx}>
          {/* Section Header */}
          <h2 className="text-lg font-bold mt-6">{section.title}</h2>

          {/* Section Items */}
          <div className="mt-2 space-y-2">
            {section.data.map((item: Section["data"][number], idx: number) =>
              typeof item === "string" ? (
                <p
                  key={idx}
                  className="text-sm leading-6 ml-4 text-gray-800 before:content-['•'] before:mr-2"
                >
                  {item}
                </p>
              ) : (
                <div key={idx} className="mb-3">
                  <h3
                    className={`${
                      item.title.startsWith("MobiPhleb")
                        ? "text-sm text-gray-800 mt-2"
                        : "text-base font-semibold mt-2"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.details.map((d: string, i: number) => (
                    <p
                      key={i}
                      className="text-sm leading-6 ml-4 text-gray-800 before:content-['•'] before:mr-2"
                    >
                      {d}
                    </p>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
