// m23
import './PrjCreatePage.css';
import PrjUpdatePage from './Project/PrjUpdatePage';
import AuditShowPage from './Audit/AuditShowPage';

const PrjCreatePage = (props) => {
  const { prjId } = props;

  return (
    <div className="m23-container">
      <div className="m23-left">
        <PrjUpdatePage prjId={prjId} kbn="cre" />
      </div>
      <div className="m23-right">
        <div className="m23-right-title">{"監査結果"}</div>       
        <AuditShowPage prjId={prjId} kbn="plan" />
      </div>
    </div>
  );
}
export default PrjCreatePage;
