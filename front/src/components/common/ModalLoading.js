import CircularProgress from '@mui/material/CircularProgress';

const ModalLoading = (props) => {
  const { loading } = props;

  return (
    <>
      { loading ? (
        <div className="overlay">
          <CircularProgress />
        </div>
    ) : (
      <></>
    )}
    </>
  )
}
export default ModalLoading;