import { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaXmark } from "react-icons/fa6";
import API from "../api/axios";

function TimeMachine({ repositoryId, onClose }) {
  const [timeline, setTimeline] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTimeline();
  }, [repositoryId]);

  const fetchTimeline = async () => {
    try {
      const res = await API.get(`/commits/timeline/${repositoryId}`);
      const data = res.data.data || [];
      setTimeline(data);
      setIndex(data.length > 0 ? data.length - 1 : 0);

      if (data.length > 0 && data[data.length - 1].files.length > 0) {
        setSelectedFile(data[data.length - 1].files[0].filename);
      }
    } catch (error) {
      console.log(
        "TIMELINE FETCH ERROR:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => {
          if (prev >= timeline.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, timeline.length]);

  const currentSnapshot = timeline[index];

  const currentFileContent =
    currentSnapshot?.files.find((f) => f.filename === selectedFile)?.content ||
    "// File not present at this point in history";

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <p className="text-white">Loading timeline...</p>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">
            No commits yet — nothing to replay.
          </p>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🕰️ Repository Time Machine
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {currentSnapshot?.message} —{" "}
              {currentSnapshot?.branch || "unknown branch"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            <FaXmark />
          </button>
        </div>

        {/* Timeline controls */}
        <div className="px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="btn-primary flex items-center gap-2"
            >
              {playing ? <FaPause /> : <FaPlay />}
              {playing ? "Pause" : "Play"}
            </button>

            <input
              type="range"
              min={0}
              max={timeline.length - 1}
              value={index}
              onChange={(e) => {
                setPlaying(false);
                setIndex(Number(e.target.value));
              }}
              className="flex-1 accent-green-600"
            />

            <span className="text-sm text-gray-400 whitespace-nowrap">
              Commit {index + 1} / {timeline.length}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {currentSnapshot?.createdAt &&
              new Date(currentSnapshot.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Body: file list + content */}
        <div className="flex flex-1 min-h-0">
          {/* File list */}
          <div className="w-56 border-r border-[#30363d] overflow-y-auto p-3 space-y-1">
            {currentSnapshot?.files.length === 0 ? (
              <p className="text-gray-500 text-sm">No files yet</p>
            ) : (
              currentSnapshot?.files.map((f) => (
                <button
                  key={f.filename}
                  onClick={() => setSelectedFile(f.filename)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg truncate ${
                    selectedFile === f.filename
                      ? "bg-[#21262d] text-white"
                      : "text-gray-400 hover:bg-[#161b22]"
                  }`}
                >
                  {f.filename}
                </button>
              ))
            )}
          </div>

          {/* File content */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap">
              {currentFileContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeMachine;
