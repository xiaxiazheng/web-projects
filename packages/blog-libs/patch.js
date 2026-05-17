import fs from 'fs';
import { exec } from 'child_process';
console.log('开始监听 dist，用于用 yalc push 推送 patch');

fs.watch('./dist', (eventType, filename) => {
    console.log('监听到 /dist 变化');
    exec('yalc push --watch', (error, stdout, stderr) => {
        if (error) {
            console.error(`执行出错: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`标准错误输出: ${stderr}`);
            return;
        }
        console.log(`标准输出: \n ${stdout}`);
        console.log('yalc push 的 patch 成功');
    });
});