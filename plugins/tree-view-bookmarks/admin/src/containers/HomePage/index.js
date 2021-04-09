/*
 *
 * HomePage
 *
 */
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import * as strapiHelper from "strapi-helper-plugin";

import React, { memo, useState } from "react";
// import PropTypes from 'prop-types';

const HomePage = () => {
  console.log(strapiHelper); // Is there an helper for getting Tree ?
  const treeDataInit = [
    { title: "Chicken", children: [{ title: "Egg" }, { title: "dazdaz" }] },
    { title: "coucou" },
  ];
  const [treeData, setTreeData] = useState(treeDataInit);
  return (
    <div style={{ height: 400 }}>
      <h1>Tree modifier</h1>
      <SortableTree
        treeData={treeData}
        onChange={(treeData) => setTreeData(treeData)}
      />
    </div>
  );
};

export default memo(HomePage);
