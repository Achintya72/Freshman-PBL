import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./styles.module.css";
import CloseIcon from "../Assets/Close.svg"
const WebcamComponent = () => <Webcam />

const videoConstraints = {
    width: 400,
    height: 225,
};

export const WebcamCapture = ({ closeSelf, finishPic }) => {
    const [image, setImage] = useState('');
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(webcamRef.current)
        setImage(imageSrc);
    })
    return (
        <div className={styles.container}>
            <div className={styles.image}>
                {image == "" ?
                    <Webcam
                        audio={false}
                        height={200}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={400}
                        videoConstraints={videoConstraints}
                    /> : <img src={image} />
                }
                <img src={CloseIcon} onClick={closeSelf} />
            </div>
            <div>
                {image != "" ?
                    <>
                        <a onClick={(e) => {
                            e.preventDefault();
                            setImage('')
                        }}
                            className="button">
                            Retake Image

                        </a>
                        <a onClick={() => finishPic(image)} className="button">Done</a>
                    </> :
                    <a onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="button">Capture</a>
                }
            </div>
        </div>
    )
}