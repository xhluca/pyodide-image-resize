import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import UploadButton from './components/UploadButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import './App.css';
import mainPy from './python/main.py';

const getPyodide = async () => {
  if (!('pyodide' in window)) {
    window.pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/"
    });
    await window.pyodide.loadPackage("Pillow");
  }

  return window.pyodide;
}

const runPythonScript = async (code) => {
  const codeText = await (await fetch(code)).text();
  const pyodide = await getPyodide();
  return await pyodide.runPythonAsync(codeText);
}


const App = () => {
  const [originalSrc, setOriginalSrc] = useState();
  const [processedSrc, setProcessedSrc] = useState();
  const [uploadBtnDisabled, setUploadBtnDisabled] = useState(true);
  const [processBtnDisabled, setProcessBtnDisabled] = useState(true);
  const [saveFormat, setSaveFormat] = useState('PNG');
  const ratioRef = useRef(1);
  const imgB64Ref = useRef();
  const mainPyRef = useRef();
  const processImageRef = useRef();

  const handleUpload = async e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      setOriginalSrc(reader.result);
      imgB64Ref.current = reader.result;
      setProcessBtnDisabled(false);
    }
    reader.readAsDataURL(file);
  }

  const handleResize = async (e) => {
    const newRatio = e.target.value / 100;
    ratioRef.current = newRatio;
  }

  const handleProcess = async () => {
    const imgB64 = imgB64Ref.current;
    const ratio = ratioRef.current;
    const processImage = processImageRef.current;

    console.log("imgB64", imgB64);
    console.log("ratio", ratio);
    console.log("processImage", processImage);

    setProcessedSrc(processImage(imgB64, ratio, saveFormat));
  }

  useEffect(() => {
    (async () => {
      if (!mainPyRef.current) {
        console.log('Loading main.py');
        await runPythonScript(mainPy);
        mainPyRef.current = true;
        processImageRef.current = window.pyodide.globals.get('process_image');
        setUploadBtnDisabled(false);
      }
    })();
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Typography>New Size</Typography>
                    <Slider
                      defaultValue={100}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                      ]}
                      onChange={handleResize}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Save Format</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={saveFormat}
                        label="save-format"
                        onChange={e => setSaveFormat(e.target.value)}
                      >
                        <MenuItem value="PNG">PNG</MenuItem>
                        <MenuItem value="JPEG">JPEG</MenuItem>
                        <MenuItem value="BMP">BMP</MenuItem>
                        <MenuItem value="GIF">GIF</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <UploadButton onChange={handleUpload} disabled={uploadBtnDisabled} />
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={processBtnDisabled}
                      onClick={handleProcess}
                    >
                      Process
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <img src={originalSrc} alt="Click on 'Upload' to start" style={{ maxWidth: "100%" }} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <img src={processedSrc} alt="Processed img will appear here" style={{ maxWidth: "100%" }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
