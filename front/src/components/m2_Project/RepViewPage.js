// m2j
import './RepViewPage.css';
import ShowPage from "./Report/RepShowPage";
import AuditShowPage from "./Audit/AuditShowPage";

const RepViewPage = (props) => {
  const { prjId } = props;

  return (
    <div className="m2j-container">
      <div className="m2j-left">
        <ShowPage prjId={prjId} />
      </div>
      <div className="m2j-right">
        <div className="m2j-right-title">{"監査結果"}</div>       
        <AuditShowPage prjId={prjId} kbn="report" />
      </div>
    </div>
  );
}
export default RepViewPage;