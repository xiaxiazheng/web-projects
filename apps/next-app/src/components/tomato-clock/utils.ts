export const calculateTime = (time: number) => {
    const s = time / 1000;
    const second = s % 60;
    const minute = Math.floor(s / 60) % 60;
    const hour = Math.floor(s / 60 / 60);
    return {
        second,
        minute,
        hour,
    };
};

export const playAudio = (count = 0) => {
    // 发出的声音频率数据，表现为音调的高低
    const arrFrequency = [
        196.0, 220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 698.46,
        783.99, 880.0, 987.77, 1046.5,
    ];

    if (count < arrFrequency.length) {
        playFrequency(arrFrequency[count]);
        setTimeout(() => {
            playAudio(count + 1);
        }, 200);
    }
};

// 这么写是为了缓存 Audio 实例，
let audioCtx: AudioContext | null = null;
const getAudio = () => {
    if (audioCtx) return audioCtx;
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // 创建新的音频上下文接口
    audioCtx = new AudioContext();
};

const playFrequency = (frequency: number) => {
    if (!audioCtx) {
        getAudio();
    }
    if (!audioCtx) {
        return;
    }

    // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
    var oscillator = audioCtx.createOscillator();
    // 创建一个GainNode,它可以控制音频的总音量
    var gainNode = audioCtx.createGain();
    // 把音量，音调和终节点进行关联
    oscillator.connect(gainNode);
    // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
    gainNode.connect(audioCtx.destination);
    // 指定音调的类型，其他还有square|triangle|sawtooth
    oscillator.type = "sine";
    // 设置当前播放声音的频率，也就是最终播放声音的调调
    oscillator.frequency.value = frequency;
    // 当前时间设置音量为0
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // 0.01秒后音量为1
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    // 音调从当前时间开始播放
    oscillator.start(audioCtx.currentTime);
    // 1秒内声音慢慢降低，是个不错的停止声音的方法
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    // 1秒后完全停止声音
    oscillator.stop(audioCtx.currentTime + 1);
};
