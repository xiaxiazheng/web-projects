import { useRef, useEffect, useState, useCallback } from 'react';

/** 尝试使用手势库，暂时失败了
 * ref 的 touch-event 要设置为 none
 */
export function useHammer(onPinch: (scale: number) => void) {
  const elementRef = useRef<any>(null);
  const hammerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // 使用 useCallback 来稳定 onPinch 引用
  const stableOnPinch = useCallback(onPinch, []); // 确保依赖数组正确

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 只在客户端环境中初始化Hammer.js，且确保实例不存在
    if (!isClient || !elementRef.current || hammerRef.current) return;

    const initHammer = async () => {
      const Hammer = (await import('hammerjs')).default;
      
      const hammer = new Hammer.Manager(elementRef.current);
      
      // 启用捏合识别器
      hammer.add(new Hammer.Pinch({ enable: true }));

      // 监听捏合事件
      hammer.on('pinchstart pinchmove', (event: any) => {
        event.preventDefault();
        stableOnPinch(event.scale); // 使用稳定的回调
      });

      hammerRef.current = hammer;
    };

    initHammer();

    // 清理函数：在组件卸载或依赖变化时销毁
    return () => {
      if (hammerRef.current) {
        hammerRef.current.destroy();
        hammerRef.current = null; // 重要：将引用置为 null
      }
    };
  }, [isClient, stableOnPinch]); // 依赖项变为 isClient 和 stableOnPinch

  return elementRef;
}