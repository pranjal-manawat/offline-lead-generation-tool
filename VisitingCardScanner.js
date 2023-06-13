import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import { Camera } from "expo-camera";

const VisitingCardScanner = () => {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        console.log("inside if");
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const { uri, width, height } = await cameraRef.current.takePictureAsync(
          options
        );
        console.log("URI ", uri);
        setImageUri(uri);
        processImage(uri);
      } catch (err) {
        console.log("ERROR ", err);
      }
    }
  };

  const processImage = async (uri) => {
    try {
      
      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const data = await Tesseract.recognize('https://dezyre.gumlet.io/images/blog/how-to-train-tesseract-ocr-python/image_15999261891668430103318.png?w=360&dpr=2.6');
      console.log("data ",data);
      await worker.terminate();

      //Extract information using regular expressions
      const nameRegex = /\b[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*\b/;
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
      const mobileRegex = /\b\d{10}\b/;
      const companyRegex = /\b[A-Za-z0-9\s]+\b/;

      const extractedName = recognizedText.data.match(nameRegex)[0];
      const extractedEmail = recognizedText.data.match(emailRegex)[0];
      const extractedMobile = recognizedText.data.match(mobileRegex)[0];
      const extractedCompany = recognizedText.data.match(companyRegex)[0];

      console.log("processImage ran");
      console.log(
        `Name: ${extractedName}\nEmail: ${extractedEmail}\nMobile: ${extractedMobile}\nCompany: ${extractedCompany}`
      );
      // setResult(
      //   `Name: ${extractedName}\nEmail: ${extractedEmail}\nMobile: ${extractedMobile}\nCompany: ${extractedCompany}`
      // );
    } catch (error) {
      console.log("ERR ", error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    processImage("");
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Camera
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        style={{ minWidth: "100%", height: "80%" }}
      ></Camera>

      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}

      <Button title="Take Picture" onPress={takePicture} />

      {result !== "" && <Text>{result}</Text>}
    </View>
  );
};

export default VisitingCardScanner;
