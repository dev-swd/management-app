
import "./ModalMessage.css";
import Button from "@mui/material/Button";

const ModalMessage = (props) => {
  const { modalMsg, handleOk } = props;

  return (
    <>
      { modalMsg ? (
        <div className="overlay">
          <div className="message-container">
            <div className="message">{modalMsg}</div>
            <div className="button-area">
              <Button size="small" variant="contained" onClick={(e) => handleOk()}>OK</Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ModalMessage;