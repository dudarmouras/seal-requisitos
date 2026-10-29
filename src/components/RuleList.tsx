import Md from "../lib/md";
import { MdInline } from "../lib/mdblock";
import type { BusinessRule } from "../lib/types";

export default function RuleList({ rules }: { rules: BusinessRule[] }) {
  return (
    <div className="rule-list">
      {rules.map((rule) => (
        <div key={rule.num} className="rule-item" id={rule.num.toLowerCase()}>
          <a className="rule-num" href={`#${rule.num.toLowerCase()}`}>
            {rule.num}
          </a>
          <div className="rule-body">
            <p>
              <Md text={rule.text} />
            </p>
            {rule.catalog && (
              <p className="rule-note">
                Catálogo do sistema: <MdInline text={rule.catalog} />
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
