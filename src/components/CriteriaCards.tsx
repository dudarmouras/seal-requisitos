import Md from "../lib/md";
import type { AcceptanceCriterion } from "../lib/types";

export default function CriteriaCards({ criteria }: { criteria: AcceptanceCriterion[] }) {
  return (
    <div className="criteria-grid">
      {criteria.map((c, i) => (
        <div key={c.id || i} className="criterion-card">
          <p className="criterion-name">
            {c.id && <span className="criterion-id">{c.id}</span>}
            <Md text={c.scenario} />
          </p>
          <div className="gwt">
            {c.given && (
              <div className="gwt-row">
                <span className="gwt-key given">Dado</span>
                <span className="gwt-text">
                  <Md text={c.given} />
                </span>
              </div>
            )}
            {c.when && (
              <div className="gwt-row">
                <span className="gwt-key when">Quando</span>
                <span className="gwt-text">
                  <Md text={c.when} />
                </span>
              </div>
            )}
            {c.then && (
              <div className="gwt-row">
                <span className="gwt-key then">Então</span>
                <span className="gwt-text">
                  <Md text={c.then} />
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
