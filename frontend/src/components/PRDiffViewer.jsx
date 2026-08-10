import { useEffect, useState } from "react";
import { FaXmark, FaPlus, FaMinus, FaPen } from "react-icons/fa6";
import API from "../api/axios";

// Simple line-based diff using LCS (Longest Common Subsequence)
function diffLines(oldText = "", newText = "") {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const m = oldLines.length;
  const n = newLines.length;

  // Build LCS length table
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result = [];
  let i = 0;
  let j = 0;

  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      result.push({ type: "equal", line: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "remove", line: oldLines[i] });
      i++;
    } else {
      result.push({ type: "add", line: newLines[j] });
      j++;
    }
  }

  while (i < m) {
    result.push({ type: "remove", line: oldLines[i] });
    i++;
  }

  while (j < n) {
    result.push({ type: "add", line: newLines[j] });
    j++;
  }

  return result;
}

function DiffBlock({ change }) {
  const { filename, type, oldContent, newContent } = change;

  const badgeConfig = {
    ADDED: { color: "text-green-400", icon: <FaPlus />, label: "Added" },
    MODIFIED: { color: "text-yellow-400", icon: <FaPen />, label: "Modified" },
    DELETED: { color: "text-red-400", icon: <FaMinus />, label: "Deleted" },
  };

  const badge = badgeConfig[type] || badgeConfig.MODIFIED;

  let lines = [];

  if (type === "ADDED") {
    lines = (newContent || "")
      .split("\n")
      .map((line) => ({ type: "add", line }));
  } else if (type === "DELETED") {
    lines = (oldContent || "")
      .split("\n")
      .map((line) => ({ type: "remove", line }));
  } else {
    lines = diffLines(oldContent, newContent);
  }

  return (
    <div className="border border-[#30363d] rounded-lg overflow-hidden mb-5">
      <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-[#30363d]">
        <span className={badge.color}>{badge.icon}</span>
        <span className="font-mono text-sm text-white">{filename}</span>
        <span className={`text-xs ml-auto ${badge.color}`}>{badge.label}</span>
      </div>

      <div className="bg-[#0d1117] overflow-x-auto">
        {lines.map((l, idx) => (
          <div
            key={idx}
            className={`font-mono text-sm px-4 py-0.5 whitespace-pre ${
              l.type === "add"
                ? "bg-green-950 text-green-300"
                : l.type === "remove"
                  ? "bg-red-950 text-red-300"
                  : "text-gray-400"
            }`}
          >
            <span className="inline-block w-4 select-none opacity-70">
              {l.type === "add" ? "+" : l.type === "remove" ? "-" : " "}
            </span>
            {l.line}
          </div>
        ))}
      </div>
    </div>
  );
}

function PRDiffViewer({ pullRequestId, onClose }) {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDiff();
  }, [pullRequestId]);

  const fetchDiff = async () => {
    try {
      const res = await API.get(`/pullrequests/diff/${pullRequestId}`);
      setChanges(res.data.data || []);
    } catch (err) {
      console.log("DIFF FETCH ERROR:", err.response?.data || err.message);
      setError("Failed to load diff.");
    } finally {
      setLoading(false);
    }
  };

  const added = changes.filter((c) => c.type === "ADDED").length;
  const modified = changes.filter((c) => c.type === "MODIFIED").length;
  const deleted = changes.filter((c) => c.type === "DELETED").length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
          <div>
            <h2 className="text-xl font-bold text-white">Pull Request Diff</h2>
            <p className="text-sm text-gray-400 mt-1">
              <span className="text-green-400">{added} added</span>
              {"  ·  "}
              <span className="text-yellow-400">{modified} modified</span>
              {"  ·  "}
              <span className="text-red-400">{deleted} deleted</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            <FaXmark />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-gray-400">Loading diff...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : changes.length === 0 ? (
            <p className="text-gray-400">
              No file changes found for this pull request.
            </p>
          ) : (
            changes.map((change, idx) => (
              <DiffBlock key={idx} change={change} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PRDiffViewer;
