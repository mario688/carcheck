import React from "react";

import ProgressBar from "@atlaskit/progress-bar";

const ProgressBarDefaultExample = (props) => {
  console.log(props.value);
  return <ProgressBar value={props.value} />;
};

export default ProgressBarDefaultExample;
