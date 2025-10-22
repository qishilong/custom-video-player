"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import cn from "classnames";
import { Play, Pause, Maximize, Minimize } from "lucide-react";

interface SimpleVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  onEnded?: () => void;
}

export default function SimpleVideoPlayer({
  src,
  poster,
  className,
  onEnded,
}: SimpleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("播放控制错误:", error);
    }
  }, [isPlaying]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // 计算进度条位置对应的时间
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

  // 处理拖拽开始
  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    const newTime = calculateTimeFromPosition(e.clientX);
    setDragTime(newTime);

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, [calculateTimeFromPosition]);

  // 处理拖拽中
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newTime = calculateTimeFromPosition(e.clientX);
    setDragTime(newTime);

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, [isDragging, calculateTimeFromPosition]);

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (videoRef.current) {
        videoRef.current.currentTime = dragTime;
        setCurrentTime(dragTime);
      }
    }
  }, [isDragging, dragTime]);

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen?.();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const progress = duration > 0 ? ((isDragging ? dragTime : currentTime) / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black cursor-pointer overflow-hidden", className)}
      onClick={togglePlay}
      onMouseEnter={() => isPlaying && setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
      />

      {/* 未播放/暂停状态的播放按钮 */}
      {!isPlaying && (
        <>
          {/* 中央播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg">
              <Play className="w-8 h-8 text-black ml-1" fill="black" />
            </div>
          </div>

          {/* 左下角小播放按钮（仅暂停状态） */}
          {currentTime > 0 && (
            <div className="absolute bottom-4 left-4">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 shadow-md">
                <Play className="w-4 h-4 text-black ml-0.5" fill="black" />
              </div>
            </div>
          )}
        </>
      )}

      {/* 控制条 */}
      {isPlaying && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300",
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* 进度条 */}
          <div
            ref={progressBarRef}
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 hover:h-1.5 transition-all duration-200 group relative"
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors duration-200 relative"
              style={{ width: `${progress}%` }}
            >
              {/* 拖拽点 */}
              <div
                className={cn(
                  "absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-200 -mr-1.5 cursor-grab shadow-lg",
                  isDragging ? "opacity-100 scale-125 cursor-grabbing" : "opacity-0 group-hover:opacity-100"
                )}
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="w-8 h-8 text-white hover:text-blue-400 transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-full h-full" fill="white" />
                ) : (
                  <Play className="w-full h-full" fill="white" />
                )}
              </button>
              <div className="text-white text-sm font-medium bg-black/20 px-2 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="w-6 h-6 text-white hover:text-blue-400 transition-colors duration-200"
            >
              {isFullscreen ? (
                <Minimize className="w-full h-full" />
              ) : (
                <Maximize className="w-full h-full" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}