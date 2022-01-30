import ConfidencesBar from "./components/ConfidencesBar";
import { v4 as uuid } from "uuid";
import GoogleLogin from "react-google-login";
import Button from "@atlaskit/button";
import Array from "./components/Array";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Spinner from '@atlaskit/spinner';

const responseGoogle = (response) => {
  console.log(response);
};

const Container = styled.div`
  text-align: center;
  position: relative;
`;

const LoginDiv = styled.div`
  text-align: center;
  position: relative;
  bottom: 150px;
`;

export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [imageBase64, setImageBase64] = useState();
  const [infoAboutCar, setInfoAboutCar] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const setAccessTokenState = (response) => {
    setAccessToken(response.tokenObj.access_token);
  };

  const myImage = {
    instances: [
      {
        content: imageBase64,
      },
    ],
    parameters: {
      confidenceThreshold: 0,
      maxPredictions: 5,
    },
  };

  async function postData(
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/930816262472/locations/us-central1/endpoints/4466101882816823296:predict",
    data = myImage
  ) {
    setInfoAboutCar('');
    setIsLoading(true);
    console.log("wysyłam");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseJson = await response.json();
    let confidences = [];
    let partsNames = [];
    let rows = [];

    confidences = [...responseJson.predictions[0].confidences];
    partsNames = [...responseJson.predictions[0].displayNames];

    for (let i = 0; i < partsNames.length; i++) {
      rows.push([partsNames[i], confidences[i]]);
    }

    rows = rows.map(([part, conf]) => ({
      key: uuid(),
      cells: [
        {
          key: part,
          content: part,
        },
        {
          key: conf,
          content: <ConfidencesBar value={conf} />,
        },
        {
          key: conf,
          content: conf,
        },
      ],
    }));

    setInfoAboutCar(rows);
  }

  const sendPhotoForm = (
    <>
      <input type="file" style={{ display: 'none' }} id="select-image" onChange={(e) => encodeImageFileAsURL(e.target)} />
      <label htmlFor="select-image">
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>
      <Button
        appearance="primary"
        onClick={() => postData()}
        isDisabled={!imageBase64}
      >
        Check Car
      </Button>
    </>
  );

  function encodeImageFileAsURL(element) {
    setSelectedImage(element.files[0])
    const file = element.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      setImageBase64(reader.result.replace("data:", "").replace(/^.+,/, ""));
    };
    reader.readAsDataURL(file);
  }

  const GoogleLoginButton = (
      <LoginDiv>
        <h1>Please Sign in!</h1>
    <GoogleLogin
      clientId="930816262472-soqcqsgkaqf4t6e94hecl3il2ubgbhis.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={setAccessTokenState}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      scope="https://www.googleapis.com/auth/cloud-platform"
    />
      </LoginDiv>
  );

  return (
    <>
      {imageUrl && selectedImage ? (
          <Box mt={2} textAlign="center">
            <img src={imageUrl} alt={selectedImage.name} height="600px" />
          </Box>
      ) :
          <div style={{height: '600px', width: '200px'}}/>
      }
     <Container >
        {accessToken ? sendPhotoForm : GoogleLoginButton}
        {infoAboutCar && <Array rows={infoAboutCar} />}
        {isLoading && !infoAboutCar && <div style={{paddingTop: '50px'}}><Spinner appearance="inherit" size={"xlarge"} /></div> }
      </Container>
    </>
  );
}