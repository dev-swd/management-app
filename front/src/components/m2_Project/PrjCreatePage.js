// m23
import './PrjCreatePage.css';
import { useState } from 'react';
import PrjUpdatePage from './Project/PrjUpdatePage';
import AuditShowPage from './Audit/AuditShowPage';

const PrjCreatePage = (props) => {
  const { prjId } = props;
  const [inputErr, setInputErr] = useState(null);

  // エラー表示クローズ時の処理
  const handleClose = () => {
    setInputErr(null);
  }

  return (
    <div className="m23-container">
      <div className="m23-left">
        <PrjUpdatePage prjId={prjId} kbn="cre" setInputErr={setInputErr} />
      </div>
      <div className="m23-right">
        { inputErr ? (
          <>
            <div className="m23-err-header">
              <div className="m23-err-title">{"入力エラー"}</div>
              <button 
                className="link-style-btn m23-link-close" 
                type="button" 
                onClick={() => handleClose()}>
                {"[閉じる]"}
              </button>
            </div>
            <div className="m23-err-frame">
              <ul className="m23-err-list">
                { inputErr.map((e,i) => 
                  <li>{e.msg}</li>
                )}
              </ul>              
            </div>
          </>
        ) : (
          <>
            <div className="m23-right-title">{"監査結果"}</div>       
            <AuditShowPage prjId={prjId} kbn="plan" />
          </>          
        )}
      </div>
    </div>
  );
}
export default PrjCreatePage;
