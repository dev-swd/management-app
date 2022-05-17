import PrjShowPage from "./Project/PrjShowPage";
import AuditEditPage from "./Audit/AuditEditPage";

const PrjAuditPage = (props) => {
  const { prj_id } = props;

  return (
    <>
      <PrjShowPage prj_id={prj_id} />
      <AuditEditPage prj_id={prj_id} kbn="plan" />
    </>
  );
}

export default PrjAuditPage;