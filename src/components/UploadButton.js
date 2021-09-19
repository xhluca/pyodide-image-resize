import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});


const UploadButton = props => {
  const {onChange, ...btnProps} = props;
  return (
    <>
      <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file" type="file" onChange={onChange}/>
        <Button variant="contained" component="span" {...btnProps}>
          Upload
        </Button>
      </label>
    </>
  )
}

export default UploadButton;