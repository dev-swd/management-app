// m2g
import './RepCreatePage.css';
import RepEditPage from './Report/RepEditPage';
import AuditShowPage from './Audit/AuditShowPage';

const RepCreatePage = (props) => {
  const { prjId } = props;

  return (
    <div className="m2g-container">
      <div className="m2g-left">
        <RepEditPage prjId={prjId} />
      </div>
      <div className="m2g-right">
        <div className="m2g-right-title">{"監査結果"}</div>       
        <AuditShowPage prjId={prjId} kbn="report" />
      </div>
    </div>
  );
}
export default RepCreatePage;