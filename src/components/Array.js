import React from "react";
import styled from 'styled-components';
import DynamicTable from "@atlaskit/dynamic-table";

const caption = "Result for your image";

const Container = styled.div`
  justifyContent: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

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
  <Container style={{ maxWidth: 800 }}>
    <DynamicTable
      caption={caption}
      head={head}
      rows={props.rows}
      isFixedSize
      defaultSortKey="number"
      defaultSortOrder="DESC"
    />
  </Container>
);

export default Array;
