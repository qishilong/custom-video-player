"use client";

import CustomVideoPlayer from "@/app/components/custom-video-player";
import SimpleVideoPlayer from "@/app/components/simple-video-player";
import { useState } from "react";

export default function VideoPlayerDemo() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          自定义视频播放器演示
        </h1>

        {/* 主要演示区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 完整功能播放器 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">完整功能播放器</h2>
            <CustomVideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop"
              className="aspect-video rounded-lg border"
              onEnded={() => {
                // 视频播放结束回调
              }}
              onPlay={() => {
                // 视频开始播放回调
              }}
              onPause={() => {
                // 视频暂停回调
              }}
              onTimeUpdate={(time, dur) => {
                setCurrentTime(time);
                setDuration(dur);
              }}
              allowProgressDrag={false}
            />
          </div>

          {/* 简化版播放器 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">简化版播放器</h2>
            <SimpleVideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              poster="https://images.unsplash.com/photo-1516834474-48c0abc2a902?w=800&h=450&fit=crop"
              className="aspect-video rounded-lg border"
            />
          </div>
        </div>

        {/* 功能对比演示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibent mb-4 text-gray-700">功能对比演示</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 支持拖拽的播放器 */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-600">支持拖拽进度条</h3>
              <CustomVideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                className="aspect-video rounded-lg border"
                allowProgressDrag={true}
                controlsHideDelay={1000}
              />
              <p className="text-sm text-gray-500 mt-2">✅ 可以拖拽进度条、显示预览时间</p>
            </div>

            {/* 禁用拖拽的播放器 */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-600">禁用拖拽功能</h3>
              <CustomVideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                className="aspect-video rounded-lg border"
                allowProgressDrag={false}
                controlsHideDelay={1000}
              />
              <p className="text-sm text-gray-500 mt-2">❌ 只能点击跳转，无拖拽点和时间预览</p>
            </div>
          </div>
        </div>

        {/* 自动播放演示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">自动播放演示（静音 + 循环）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomVideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
              className="aspect-video rounded-lg border"
              autoPlay
              loop
              muted
              controlsHideDelay={1000}
            />
            <CustomVideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
              className="aspect-video rounded-lg border"
              autoPlay
              loop
              muted
              allowProgressDrag={false}
              controlsHideDelay={1500}
            />
          </div>
        </div>

        {/* 播放信息 */}
        {duration > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">播放信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">当前时间</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">总时长</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {duration > 0 ? Math.round((currentTime / duration) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">播放进度</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(duration - currentTime)}s
                </div>
                <div className="text-sm text-gray-600">剩余时间</div>
              </div>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        {/* UI状态说明 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">UI状态说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">状态1：未播放</h3>
              <p className="text-sm text-blue-600">显示中央播放按钮，点击开始播放</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">状态2：暂停/完成</h3>
              <p className="text-sm text-green-600">中央播放按钮 + 左下角小播放按钮</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">状态3：播放悬停</h3>
              <p className="text-sm text-yellow-600">显示控制条（进度条、时间、全屏）</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">状态4：播放移出</h3>
              <p className="text-sm text-purple-600">控制条平滑隐藏，视频正常播放</p>
            </div>
          </div>
        </div>

        {/* 进度条功能说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🎛️ 进度条交互功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🖱️ 点击跳转</h3>
              <p className="text-sm text-gray-600">点击进度条任意位置快速跳转到对应时间点</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🖐️ 拖拽控制</h3>
              <p className="text-sm text-gray-600">可选启用/禁用拖拽进度条功能</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">👁️ 实时预览</h3>
              <p className="text-sm text-gray-600">启用拖拽时显示时间预览和拖拽点</p>
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">功能特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-600">播放控制</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 点击任意位置播放/暂停</li>
                <li>• 未播放状态：仅显示中央播放按钮</li>
                <li>• 暂停/完成状态：中央 + 左下角播放按钮</li>
                <li>• 支持自动播放和循环播放</li>
                <li>• 播放完成后可重新播放</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-600">用户界面</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 播放时鼠标悬停显示控制条</li>
                <li>• 鼠标移出时控制条平滑隐藏</li>
                <li>• 进度条支持点击跳转</li>
                <li>• 可选启用拖拽控制和时间预览</li>
                <li>• 实时显示播放时间和总时长</li>
                <li>• 全屏播放支持（ESC + 空格键）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">使用说明</h2>
          <div className="space-y-2 text-blue-700">
            <p><strong>播放/暂停：</strong>点击视频任意位置</p>
            <p><strong>进度控制：</strong>点击进度条跳转到指定时间点</p>
            <p><strong>全屏播放：</strong>点击右下角全屏按钮，按ESC键退出</p>
            <p><strong>悬停效果：</strong>鼠标移入视频区域查看控制条</p>
          </div>
        </div>
      </div>
    </div>
  );
}