import React, { useRef, useState } from 'react';
import { Camera, Mic, StopCircle, CheckCircle } from 'lucide-react';

export default function CapturePanel({ onAttach }) {
  const fileInputRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handlePickPhoto = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAttach({ type: 'photo', file, url: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onAttach({ type: 'audio', file: blob, url });
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-3 bg-white/80 backdrop-blur rounded-xl shadow border border-gray-200 flex items-center gap-3">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <button
        onClick={handlePickPhoto}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
      >
        <Camera className="w-4 h-4" /> Photo
      </button>

      {!recording ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        >
          <Mic className="w-4 h-4" /> Record
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border text-red-600 bg-white hover:bg-red-50 border-red-200"
        >
          <StopCircle className="w-4 h-4" /> Stop
        </button>
      )}

      {audioUrl && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" /> Audio captured
          <audio src={audioUrl} controls className="h-8" />
        </div>
      )}
    </div>
  );
}
