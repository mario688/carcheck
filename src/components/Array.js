import React from "react";

import { v4 as uuid } from "uuid";

import DynamicTable from "@atlaskit/dynamic-table";

const caption = "Result for your image";

const head = {
  cells: [
    {
      key: "string",
      content: "Part",
      isSortable: true,
    },
    {
      key: "string",
      content: "",
      isSortable: false,
    },
    {
      key: "number",
      content: "confidences",
      isSortable: true,
    },
  ],
};

const Array = (props) => (
  <div style={{ maxWidth: 800 }}>
    <DynamicTable
      caption={caption}
      head={head}
      rows={props.rows}
      isFixedSize
      defaultSortKey="number"
      defaultSortOrder="ASC"
    />
  </div>
);

export default Array;
