/*
 *
 * HomePage
 *
 */
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import * as strapiHelper from "strapi-helper-plugin";

import React, { memo, Component } from "react";
// import PropTypes from 'prop-types';

const mapFolderTreeItem = (item) => {
  const title = item.name;
  let children = [];
  console.log(item.name);
  if (item.children) children = item.children.map(mapFolderTreeItem);
  if (item.bookmarks && item.bookmarks.length > 0) {
    const bookmarksTree = item.bookmarks.map((bookmark) => ({
      title: bookmark.title,
    }));
    children.push(...bookmarksTree);
  }
  return {
    title,
    children,
  };
};

class HomePage extends Component {
  componentDidMount() {
    strapiHelper.request("/folders/tree").then((res) => {
      console.log(res);
      const foldersTree = res.map((item) => {
        return mapFolderTreeItem(item);
      });
      this.setState({
        treeData: foldersTree,
      });
    });
  }
  state = {
    treeData: [
      { title: "Chicken", children: [{ title: "Egg" }, { title: "dazdaz" }] },
      { title: "coucou" },
    ],
  };
  render() {
    // console.log(strapi.plugins)\; // Is there an helper for getting Tree ?
    // const globalContext = strapiHelper.useGlobalContext();
    // console.log(globalContext);

    const treeData = this.state.treeData;
    return (
      <div style={{ height: 800 }}>
        <h1>Tree modifier</h1>
        <SortableTree
          treeData={treeData}
          onChange={(treeData) => this.setState({ treeData })}
        />
      </div>
    );
  }
}

export default memo(HomePage);
