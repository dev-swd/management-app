// m28
import './PrjAuditPage.css';
import PrjShowPage from "./Project/PrjShowPage";
import AuditEditPage from "./Audit/AuditEditPage";

const PrjAuditPage = (props) => {
  const { prjId } = props;

  return (
    <div className="m28-container">
      <div className="m28-left">
        <PrjShowPage prjId={prjId} />
      </div>
      <div className="m28-right">
        <AuditEditPage prjId={prjId} kbn="plan" />
      </div>
    </div>
  );
}
export default PrjAuditPage;