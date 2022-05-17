import RepShowPage from "./Report/RepShowPage";
import AuditEditPage from "./Audit/AuditEditPage";

const RepAuditPage = (props) => {
  const { prj_id } = props;

  return (
    <>
      <RepShowPage prj_id={prj_id} />
      <AuditEditPage prj_id={prj_id} kbn="report" />
    </>
  );
}

export default RepAuditPage;