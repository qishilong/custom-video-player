"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import cn from "classnames";
import {
  CustomVideoPlayIcon,
  CustomVideoPauseIcon,
  CustomVideoMaximizeIcon,
  CustomVideoMinimizeIcon
} from '@/app/components/svg-group';
import { CustomVideoPlayerProps } from "./types";

export default function CustomVideoPlayer({
  src,
  poster,
  className,
  videoClassName,
  style,
  onEnded,
  onPlay,
  onPause,
  onTimeUpdate,
  autoPlay = false,
  loop = false,
  muted = false,
  preload = "metadata",
  controlsHideDelay = 200,
  allowProgressDrag = false,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewPosition, setPreviewPosition] = useState(0);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 格式化时间显示
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // 处理视频播放
  const handlePlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        if (onPlay) {
          onPlay();
        }
      } catch (error) {
        console.error("播放视频时出错:", error);
      }
    }
  }, [onPlay]);

  // 处理视频暂停
  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
      if (onPause) {
        onPause();
      }
    }
  }, [onPause]);

  // 处理视频点击（播放/暂停切换）
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 强制重置可能卡住的拖拽状态
    if (isDragging) {
      setIsDragging(false);
      setShowPreview(false);
    }

    // 正常的播放/暂停逻辑
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePlay, handlePause, isDragging]);

  // 处理播放按钮直接点击（独立于视频容器点击）
  const handlePlayButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 强制重置拖拽状态，确保播放功能正常
    if (isDragging) {
      setIsDragging(false);
      setShowPreview(false);
    }

    // 播放按钮点击不受拖拽状态影响
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePlay, handlePause, isDragging]);

  // 处理进度条悬停预览
  const handleProgressMouseEnter = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleProgressMouseLeave = useCallback(() => {
    if (!isDragging) {
      setShowPreview(false);
    }
  }, [isDragging]);

  const handleProgressMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    const time = percentage * duration;

    setPreviewTime(time);
    setPreviewPosition(percentage * 100);
  }, [duration]);

  // 处理进度条点击和拖拽
  const calculateTimeFromPosition = useCallback((clientX: number) => {
    if (!progressBarRef.current || duration <= 0) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    return percentage * duration;
  }, [duration]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && duration > 0) {
      const newTime = calculateTimeFromPosition(e.clientX);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration, calculateTimeFromPosition]);

  // 处理进度条拖拽开始
  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // 如果不允许拖拽，直接返回
    if (!allowProgressDrag) return;

    e.stopPropagation();
    e.preventDefault(); // 防止默认的拖拽行为
    setIsDragging(true);

    // 立即更新拖拽时间，确保UI即时响应
    const newTime = calculateTimeFromPosition(e.clientX);
    setDragTime(newTime);

    // 立即更新视频时间
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, [allowProgressDrag, calculateTimeFromPosition]);

  // 处理全屏切换
  const handleFullscreenToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // 处理鼠标进入
  const handleMouseEnter = useCallback(() => {
    if (isPlaying) {
      setIsHovered(true);
      setShowControls(true);
      // 清除任何待执行的隐藏操作
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    }
  }, [isPlaying]);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setIsHovered(false);
      // 使用ref来管理延迟隐藏，确保平滑过渡
      hideControlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying)
          setShowControls(false);

      }, controlsHideDelay);
    }
  }, [isPlaying, controlsHideDelay]);

  // 监听容器级鼠标事件用于拖拽
  useEffect(() => {
    if (isDragging && containerRef.current) {
      const container = containerRef.current;

      // 监听容器和其父级的鼠标事件，减少全局污染
      const handleContainerMouseMove = (e: MouseEvent) => {
        // 使用 requestAnimationFrame 确保 UI 更新的流畅性
        requestAnimationFrame(() => {
          const newTime = calculateTimeFromPosition(e.clientX);
          setDragTime(newTime);

          // 延迟更新视频时间，避免频繁的视频帧更新影响UI流畅度
          if (videoRef.current) {
            videoRef.current.currentTime = newTime;
          }
        });
      };

      const handleContainerMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          setShowPreview(false);

          // 确保最终时间同步
          requestAnimationFrame(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = dragTime;
              setCurrentTime(dragTime);
            }
          });
        }
      };

      // 监听窗口失焦事件，确保拖拽状态在切换窗口时也能正确重置
      const handleWindowBlur = () => {
        setIsDragging(false);
        setShowPreview(false);
      };

      // 仅在容器及文档级别添加必要的监听器
      container.addEventListener('mousemove', handleContainerMouseMove, { passive: true });
      container.addEventListener('mouseup', handleContainerMouseUp);
      container.addEventListener('mouseleave', handleContainerMouseUp); // 鼠标离开容器时也结束拖拽
      document.addEventListener('mouseup', handleContainerMouseUp); // 保留文档级mouseup作为兜底
      window.addEventListener('blur', handleWindowBlur);

      // 添加安全定时器，防止拖拽状态卡住
      const safetyTimer = setTimeout(() => {
        setIsDragging(false);
        setShowPreview(false);
      }, 5000); // 5秒后强制重置

      return () => {
        container.removeEventListener('mousemove', handleContainerMouseMove);
        container.removeEventListener('mouseup', handleContainerMouseUp);
        container.removeEventListener('mouseleave', handleContainerMouseUp);
        document.removeEventListener('mouseup', handleContainerMouseUp);
        window.removeEventListener('blur', handleWindowBlur);
        clearTimeout(safetyTimer);
      };
    }
  }, [isDragging, calculateTimeFromPosition, dragTime]);

  // 监听视频时间更新
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime, video.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, onTimeUpdate]);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 监听键盘事件（ESC键退出全屏，空格键播放/暂停）
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC键退出全屏
      if (e.key === "Escape") {
        e.preventDefault();
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }

      // 空格键播放/暂停（仅在全屏时生效，且不在输入框等元素中）
      if (e.code === "Space") {
        const target = e.target as HTMLElement;
        const isInputElement = target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInputElement) {
          e.preventDefault(); // 防止页面滚动
          if (isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
        }
      }
    };

    // 全屏时使用文档级监听，不干扰焦点管理
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, isPlaying, handlePlay, handlePause]);

  // 控制条显示/隐藏动画效果
  useEffect(() => {
    if (showControls) {
      setControlsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 300); // 与CSS过渡时间匹配
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  const progress = duration > 0 ? ((isDragging ? dragTime : currentTime) / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-black overflow-hidden cursor-pointer",
        className
      )}
      style={style}
      onClick={handleVideoClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={cn("w-full h-full object-contain", videoClassName)}
        playsInline
        preload={preload}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
      />
      {/* 未播放状态的播放按钮 */}
      {!isPlaying && isLoaded && !isFullscreen && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
          onClick={handlePlayButtonClick}
        >
          <CustomVideoPlayIcon
            // className='text-white hover:scale-110 transition-all duration-200 shadow-lg'
            className='text-white w-[1.75rem] h-[1.75rem]'
          />
        </div>
      )}

      {/* 暂停状态的播放按钮 - 中央播放按钮 */}
      {!isPlaying && currentTime > 0 && isLoaded && !isFullscreen && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
          onClick={handlePlayButtonClick}
        >
          <CustomVideoPlayIcon
            // className='text-white hover:scale-110 transition-all duration-200 shadow-lg'
            className='text-white w-[1.75rem] h-[1.75rem]'
          />
        </div>
      )}

      {/* 播放控制条 - 鼠标悬停时或者展示控件时显示 */}
      {(isPlaying || showControls) && isLoaded && (
        <div
          className={cn(
            "absolute w-full bottom-0 left-0 right-0 box-border transition-all duration-500 ease-in-out",
            showControls
              ? "opacity-100 translate-y-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"
              : "opacity-0 translate-y-4 pointer-events-none",
            isFullscreen ? "py-[1.5rem] px-[1.5rem] space-y-[1.25rem]" : "py-[0.5rem] px-[0.75rem] space-y-[0.5rem]"
          )}
        >
          {/* 进度条 */}
          <div
            ref={progressBarRef}
            className={cn(
              "w-full bg-[rgba(255,255,255,0.40)] rounded-[0.125rem] transition-all duration-200 relative cursor-pointer box-border",
              allowProgressDrag
                ? "hover:h-1.5"
                : "",
              isFullscreen ? "h-[0.25rem]" : "h-[0.1875rem]"
            )}
            onClick={handleProgressClick}
            onMouseDown={allowProgressDrag ? handleProgressMouseDown : undefined}
            onMouseEnter={allowProgressDrag ? handleProgressMouseEnter : undefined}
            onMouseLeave={allowProgressDrag ? handleProgressMouseLeave : undefined}
            onMouseMove={allowProgressDrag ? handleProgressMouseMove : undefined}
          >
            {/* 时间预览提示 */}
            {allowProgressDrag && showPreview && (
              <div
                className="absolute bottom-full mb-2 px-2 py-1 bg-black bg-opacity-80 text-white text-xs rounded whitespace-nowrap transform -translate-x-1/2 pointer-events-none"
                style={{ left: `${previewPosition}%` }}
              >
                {formatTime(isDragging ? dragTime : previewTime)}
              </div>
            )}

            <div
              className={cn(
                "h-full bg-white rounded-[0.125rem] relative box-border",
                // 拖拽时禁用过渡动画，确保丝滑拖拽体验
                isDragging ? "" : "transition-all duration-200"
              )}
              style={{ width: `${progress}%` }}
            >
              {/* 进度条拖拽点 */}
              {allowProgressDrag && (
                <div
                  className={cn(
                    "absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-200 -mr-1.5 cursor-grab shadow-lg",
                    isDragging ? "opacity-100 scale-125 cursor-grabbing shadow-xl" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              )}
            </div>
          </div>

          {/* 控制按钮区域 */}
          <div
            className={cn(
              "flex items-center justify-between w-full box-border",
              isFullscreen ? "px-[1rem]" : "px-[0.75rem]"
            )}
          >
            <div className={cn(
              "flex items-center justify-start w-full",
              isFullscreen ? "gap-[1rem]" : "gap-[0.5rem]"
            )}>
              {/* 播放/暂停按钮 */}
              <div
                onClick={handlePlayButtonClick}
                className={cn(
                  "text-white cursor-pointer",
                  isFullscreen ? "w-[1.5rem] h-[1.5rem]" : "w-[0.875rem] h-[0.875rem]"
                )}
              >
                {isPlaying ? (
                  <CustomVideoPauseIcon
                    className='w-full h-full'
                  />
                ) : (
                  <CustomVideoPlayIcon
                    className='w-full h-full'
                  />
                )}
              </div>

              {/* 时间显示 */}
              <div
                className={cn(
                  "text-white not-italic",
                  isFullscreen ? "text-sm font-medium" : "text-xs font-normal"
                )}
              >
                {formatTime(isDragging ? dragTime : currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* 全屏按钮 */}
            <div
              onClick={handleFullscreenToggle}
              className={cn(
                "text-white",
                isFullscreen ? "w-[1.5rem] h-[1.5rem]" : "w-[0.875rem] h-[0.875rem]"
              )}
            >
              {isFullscreen ? (
                <CustomVideoMinimizeIcon className="w-full h-full" />
              ) : (
                <CustomVideoMaximizeIcon className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}