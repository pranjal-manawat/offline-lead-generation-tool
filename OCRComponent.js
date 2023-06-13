import { useEffect } from "react";
import { createWorker } from "tesseract.js";

const OCRComponent = () => {
  const handleImageDetection = async () => {
    const worker = await createWorker({
      logger: (m) => console.log(m),
    });

    try {
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize('https://dezyre.gumlet.io/images/blog/how-to-train-tesseract-ocr-python/image_15999261891668430103318.png?w=360&dpr=2.6');
      console.log(text);
      await worker.terminate();
    } catch (err) {
      console.log("ERROR ", err);
    }
  };

  useEffect(() => {
    handleImageDetection();
  }, []);

  return <div />;
};

export default OCRComponent;
