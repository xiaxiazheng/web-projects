/** 并发发送 n 个请求
 * 函数版本
 * 原子任务 task 和调度器 runTask 的实现
 */
export const ConcurrentN = (n: number) => {
    let list: (() => void)[] = [];
    let running: number = 0;

    /** 并发发送 n 个请求 */
    const add = async (fn: () => Promise<any>): Promise<any> => {
        return new Promise((resolve, reject) => {
            // 创建原子任务，并代理 fn 的 promise 行为
            const task = () => {
                running++;
                // console.log('start, runningCount:', running, ',task length:', list.length);
                fn().then(resolve).catch(reject).finally(() => {
                    running--;
                    runTask(); // 触发调度器，执行下一个 task
                    // console.log('end, runningCount:', running, ',task length:', list.length);
                });
            }

            list.push(task);
            runTask(); // 触发调度器，尝试立即执行 task
        });

        // 只负责调度执行 task
        function runTask() {
            if (running >= n || list.length === 0) {
                return;
            }
            list.shift()?.();
        }
    }

    return { add };
}

/** 并发发送 n 个请求
 * class 版本
 */
export class ConcurrentNClass {
    n: number;
    list: ((value: unknown) => void)[];
    running: number;
    constructor(n: number) {
        this.n = n;
        this.list = [];
        this.running = 0;
        console.log('ConcurrentNClass constructor', n);
    }

    /** 并发发送 n 个请求 */
    add = async (fn: () => Promise<any>): Promise<any> => {
        let p = new Promise((resolve) => {
            this.list.push(resolve);
        });

        this.running++; // 计算当前进入队列的，等待完成的请求的总数
        if (this.running <= this.n) {
            this.list.shift()?.(undefined);
        }

        await p;
        //  this.running - this.list.length 才是当前正在运行的请求的数量
        // 所以 this.list.length 是指当前等待开始的，还在排队中的请求的数量
        // console.log('start:', 'total', this.running, ',running', this.running - this.list.length, ',waiting', this.list.length);
        try {
            return await fn();
        } finally {
            this.running--;
            this.list?.shift()?.(undefined);
            // console.log('end:', 'total', this.running, ',running', this.running - this.list.length, ',waiting', this.list.length);
        }
    }
}

/** 并发发送 n 个请求
 * 不用额外函数，直接实现的版本
 */
export const ConcurrentNFn1 = (n: number) => {
    let list: ((value: unknown) => void)[] = [];
    let running: number = 0;

    /** 并发发送 n 个请求 */
    const add = async (fn: () => Promise<any>): Promise<any> => {
        console.log('ConcurrentRequestN add', running, n);
        let p = new Promise((resolve) => {
            list.push(resolve);
        });

        running++;
        if (running < n) {
            list.shift()?.(undefined);
        }

        await p;
        //  this.running - this.list.length 才是当前正在运行的请求的数量
        // 所以 this.list.length 是指当前等待开始的，还在排队中的请求的数量
        // console.log('start:', 'total', this.running, ',running', this.running - this.list.length, ',waiting', this.list.length);
        try {
            return await fn();
        } finally {
            running--;
            // console.log('start:', 'total', running, ',running', running - list.length, ',waiting', list.length);
            list.shift()?.(undefined);
        }
    }

    return { add };
}