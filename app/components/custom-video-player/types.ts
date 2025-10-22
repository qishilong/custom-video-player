export interface CustomVideoPlayerProps {
  /** 视频源地址 */
  src: string;
  /** 视频封面图片 */
  poster?: string;
  /** 自定义样式类名 */
  className?: string;
  /**
   * 自定义视频元素样式类名
   */
  videoClassName?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
  /** 视频播放结束回调 */
  onEnded?: () => void;
  /** 视频开始播放回调 */
  onPlay?: () => void;
  /** 视频暂停回调 */
  onPause?: () => void;
  /** 视频时间更新回调 */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否静音 */
  muted?: boolean;
  /** 预加载策略 */
  preload?: "none" | "metadata" | "auto";
  /** 控制条自动隐藏延迟时间（毫秒） */
  controlsHideDelay?: number;
  /** 是否允许拖拽进度条调整播放进度 */
  allowProgressDrag?: boolean;
}