// m2k
import './RepAuditPage.css';
import RepShowPage from "./Report/RepShowPage";
import AuditEditPage from "./Audit/AuditEditPage";

const RepAuditPage = (props) => {
  const { prjId } = props;

  return (
    <div className="m2k-container">
      <div className="m2k-left">
        <RepShowPage prjId={prjId} />
      </div>
      <div className="m2k-right">
        <AuditEditPage prjId={prjId} kbn="report" />
      </div>
    </div>
  );
}
export default RepAuditPage;