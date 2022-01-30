import React, { useState } from "react";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import Button from "@atlaskit/button";

const responseGoogle = (response) => {
  console.log(response);
};

export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [imageBase64, setImageBase64] = useState();

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
      confidenceThreshold: 0.5,
      maxPredictions: 5,
    },
  };

  async function postData(
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/930816262472/locations/us-central1/endpoints/4466101882816823296:predict",
    data = myImage
  ) {
    console.log("wysyłam");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response.json());
    // return response.json();
  }

  const sendPhotoForm = (
    <>
      <input type="file" onChange={(e) => encodeImageFileAsURL(e.target)} />
      <Button
        appearance="primary"
        onClick={() => postData()}
        isDisabled={!imageBase64}
      >
        Sprawdz zdjęcie
      </Button>
    </>
  );

  function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImageBase64(reader.result.replace("data:", "").replace(/^.+,/, ""));
    };
    reader.readAsDataURL(file);
  }

  const GoogleLoginButton = (
    <GoogleLogin
      clientId="930816262472-soqcqsgkaqf4t6e94hecl3il2ubgbhis.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={setAccessTokenState}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      scope="https://www.googleapis.com/auth/cloud-platform"
    />
  );

  return accessToken ? sendPhotoForm : GoogleLoginButton;
}
