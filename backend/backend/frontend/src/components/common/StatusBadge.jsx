import {
  FaCodePullRequest,
  FaCodeMerge,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";

function StatusBadge({ status }) {
  const config = {
    OPEN: {
      className: "badge badge-open",
      icon: <FaCodePullRequest />,
      label: "Open",
    },
    MERGED: {
      className: "badge badge-merged",
      icon: <FaCodeMerge />,
      label: "Merged",
    },
    APPROVED: {
      className: "badge badge-approved",
      icon: <FaCircleCheck />,
      label: "Approved",
    },
    REJECTED: {
      className: "badge badge-rejected",
      icon: <FaCircleXmark />,
      label: "Rejected",
    },
    CLOSED: {
      className: "badge badge-closed",
      icon: <FaCircleXmark />,
      label: "Closed",
    },
  };

  const current = config[status] || {
    className: "badge badge-open",
    icon: null,
    label: status,
  };

  return (
    <span className={current.className}>
      {current.icon}
      {current.label}
    </span>
  );
}

export default StatusBadge;
