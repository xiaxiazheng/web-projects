import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import { message } from "antd";

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
    failed,
    confirmed,
}

const VoiceRecorder: React.FC<Props> = ({ onRecognized }) => {
    const [state, setState] = useState<RecordingState>(RecordingState.idle);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioLevelsRef = useRef<number[]>(Array(20).fill(0.05));
    const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0.05));
    const audioBlobRef = useRef<Blob | null>(null);
    const isCancelledRef = useRef(false);
    const recognizedTextRef = useRef("");

    const MAX_DURATION = 60;

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const resetState = () => {
        setState(RecordingState.idle);
        setRecordingDuration(0);
        audioLevelsRef.current = Array(20).fill(0.05);
        setAudioLevels(Array(20).fill(0.05));
        audioChunksRef.current = [];
        audioBlobRef.current = null;
        recognizedTextRef.current = "";
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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

                if (isCancelledRef.current) {
                    isCancelledRef.current = false;
                    resetState();
                    return;
                }

                audioBlobRef.current = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setState(RecordingState.recognizing);
                await sendAudio();
            };

            mediaRecorderRef.current.start(100);
            startTimeRef.current = new Date();
            setState(RecordingState.recording);

            timerRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const duration = (Date.now() - startTimeRef.current.getTime()) / 1000;
                    setRecordingDuration(duration);

                    if (duration >= MAX_DURATION) {
                        stopRecording();
                    }
                }
            }, 100);

            updateAudioLevels();
        } catch (error: any) {
            message.error("无法访问麦克风：" + error.message);
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
    };

    const cancelRecording = () => {
        if (state === RecordingState.failed || state === RecordingState.confirmed) {
            resetState();
            return;
        }
        isCancelledRef.current = true;
        stopRecording();
    };

    const handleConfirmAddTodo = () => {
        if (recognizedTextRef.current) {
            onRecognized(recognizedTextRef.current);
        }
        resetState();
    };

    const retrySendAudio = async () => {
        if (!audioBlobRef.current) return;
        setState(RecordingState.recognizing);
        await sendAudio();
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
                    message.success("识别成功");
                    recognizedTextRef.current = data.data.text;
                    setState(RecordingState.confirmed);
                } else {
                    message.error(data.message || "识别失败");
                    setState(RecordingState.failed);
                }
            } catch (error: any) {
                message.error("识别请求失败：" + error.message);
                setState(RecordingState.failed);
            }
        };

        reader.readAsDataURL(audioBlob);
    };

    const formatDuration = (duration: number) => {
        const remaining = MAX_DURATION - Math.floor(duration);
        return `00:${String(remaining).padStart(2, "0")}`;
    };

    const handleMicClick = () => {
        if (state === RecordingState.idle) {
            startRecording();
        }
    };

    return (
        <div className={styles.container}>
            {/* 录音状态覆盖层 */}
            {(state === RecordingState.recording || state === RecordingState.recognizing || state === RecordingState.failed || state === RecordingState.confirmed) && (
                <div className={styles.overlay}>
                    <div className={styles.recordingBox}>
                        {state === RecordingState.recording && (
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
                            </>
                        )}

                        {state === RecordingState.recognizing && (
                            <>
                                <div className={styles.spinner} />
                                <div className={styles.recognizingText}>识别中...</div>
                            </>
                        )}

                        {state === RecordingState.failed && (
                            <>
                                <div className={styles.errorIcon}>!</div>
                                <div className={styles.errorText}>识别失败</div>
                            </>
                        )}

                        {state === RecordingState.confirmed && (
                            <>
                                <div className={styles.successIcon}>✓</div>
                                <div className={styles.recognizedText}>{recognizedTextRef.current}</div>
                            </>
                        )}

                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.cancelBtn}
                                onClick={cancelRecording}
                            >
                                取消
                            </button>
                            {state === RecordingState.recording && (
                                <button
                                    className={styles.endBtn}
                                    onClick={stopRecording}
                                >
                                    结束
                                </button>
                            )}
                            {state === RecordingState.failed && (
                                <button
                                    className={styles.retryBtn}
                                    onClick={retrySendAudio}
                                >
                                    重试
                                </button>
                            )}
                            {state === RecordingState.confirmed && (
                                <button
                                    className={styles.addBtn}
                                    onClick={handleConfirmAddTodo}
                                >
                                    新增 todo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 麦克风按钮 */}
            {state === RecordingState.idle && (
                <div
                    className={styles.micButton}
                    onClick={handleMicClick}
                >
                    <div className={styles.micIcon}>🎤</div>
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;