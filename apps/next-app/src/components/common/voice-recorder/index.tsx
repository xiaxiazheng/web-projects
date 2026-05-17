import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";

const serverUrl =
    process.env.NEXT_PUBLIC_IS_LOCAL === "YES"
        ? "http://localhost:300/api"
        : "https://www.xiaxiazheng.cn/api";

interface Props {
    onRecognized: (text: string) => void;
}

enum RecordingState {
    idle,
    recording,
    recognizing,
}

const VoiceRecorder: React.FC<Props> = ({ onRecognized }) => {
    const [state, setState] = useState<RecordingState>(RecordingState.idle);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioLevelsRef = useRef<number[]>(Array(20).fill(0.05));
    const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0.05));

    const MAX_DURATION = 60;

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // 设置音频分析
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 64;

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                stream.getTracks().forEach((track) => track.stop());
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }

                if (!isCancelled) {
                    setState(RecordingState.recognizing);
                    await sendAudio();
                }
            };

            mediaRecorderRef.current.start(100);
            startTimeRef.current = new Date();
            setState(RecordingState.recording);
            setIsLongPressing(true);

            // 开始计时
            timerRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const duration = (Date.now() - startTimeRef.current.getTime()) / 1000;
                    setRecordingDuration(duration);

                    if (duration >= MAX_DURATION) {
                        stopRecording();
                    }
                }
            }, 100);

            // 开始更新音频波形
            updateAudioLevels();
        } catch (error: any) {
            setErrorMessage("无法访问麦克风：" + error.message);
        }
    };

    const updateAudioLevels = () => {
        if (analyserRef.current && state === RecordingState.recording) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const level = Math.min(1, avg / 128);

            audioLevelsRef.current.shift();
            audioLevelsRef.current.push(level * 10);
            setAudioLevels([...audioLevelsRef.current]);

            animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
        }
    };

    const stopRecording = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }

        setIsLongPressing(false);
    };

    const cancelRecording = () => {
        setIsCancelled(true);
        stopRecording();
        setTimeout(() => {
            setIsCancelled(false);
            setState(RecordingState.idle);
            setRecordingDuration(0);
            audioLevelsRef.current = Array(20).fill(0.05);
            setAudioLevels(Array(20).fill(0.05));
        }, 100);
    };

    const sendAudio = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(",")[1];

            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${serverUrl}/speech/recognize`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({
                        audio: base64,
                        dataLen: audioBlob.size,
                    }),
                });

                const data = await res.json();

                if (data.resultsCode === "success" && data.data?.text) {
                    onRecognized(data.data.text);
                } else {
                    setErrorMessage(data.message || "识别失败");
                }
            } catch (error: any) {
                setErrorMessage("识别请求失败：" + error.message);
            } finally {
                setState(RecordingState.idle);
                setRecordingDuration(0);
                audioLevelsRef.current = Array(20).fill(0.05);
                setAudioLevels(Array(20).fill(0.05));
            }
        };

        reader.readAsDataURL(audioBlob);
    };

    const formatDuration = (duration: number) => {
        const remaining = MAX_DURATION - Math.floor(duration);
        return `00:${String(remaining).padStart(2, "0")}`;
    };

    const handleTouchStart = () => {
        startRecording();
    };

    const handleTouchEnd = () => {
        if (state === RecordingState.recording) {
            if (isCancelled) {
                cancelRecording();
            } else {
                stopRecording();
            }
        }
    };

    const handleTouchCancel = () => {
        cancelRecording();
    };

    return (
        <div className={styles.container}>
            {/* 录音状态覆盖层 */}
            {state === RecordingState.recording && (
                <div className={styles.overlay}>
                    <div className={styles.recordingBox}>
                        {isCancelled ? (
                            <div className={styles.cancelBox}>
                                <div className={styles.cancelIcon}>✕</div>
                                <div className={styles.cancelText}>松开取消</div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.waveform}>
                                    {audioLevels.map((level, index) => (
                                        <div
                                            key={index}
                                            className={styles.bar}
                                            style={{ height: `${20 + level * 60}px` }}
                                        />
                                    ))}
                                </div>
                                <div className={styles.micIcon}>🎤</div>
                                <div className={styles.duration}>{formatDuration(recordingDuration)}</div>
                                <div className={styles.hint}>松开发送，上滑取消</div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {state === RecordingState.recognizing && (
                <div className={styles.overlay}>
                    <div className={styles.recognizingBox}>
                        <div className={styles.spinner} />
                        <div className={styles.recognizingText}>识别中...</div>
                    </div>
                </div>
            )}

            {/* 麦克风按钮 */}
            <div
                className={`${styles.micButton} ${isLongPressing ? styles.active : ""}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchCancel}
            >
                <div className={styles.micIcon}>🎤</div>
            </div>

            {/* 错误提示 */}
            {errorMessage && (
                <div className={styles.error} onClick={() => setErrorMessage("")}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
