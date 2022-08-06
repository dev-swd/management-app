import "./ModalConfirm.css";
import Button from "@mui/material/Button";

const ModalConfirm = (props) => {
  const {confirm, handleOk, handleCancel} = props;

  return (
    <>
      { confirm.msg ? (
        <div className="overlay">
          <div className="confirm-container">
            <div className="confirm-message">{confirm.msg}</div>
            <div className="confirm-button-area">
              <Button size="small" variant="contained" onClick={(e) => handleOk(confirm.tag)}>OK</Button>{"　"}
              <Button size="small" variant="contained" onClick={(e) => handleCancel()} color="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ModalConfirm;