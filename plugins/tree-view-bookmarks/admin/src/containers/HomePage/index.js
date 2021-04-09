/*
 *
 * HomePage
 *
 */
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import * as StrapiHelper from "strapi-helper-plugin";

import React, { memo, Component } from "react";
// import PropTypes from 'prop-types';

import Block from "../../components/Block";

const mapFolderTreeItem = (item) => {
  const title = item.name;
  let children = [];
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

const changeTree = (treeData, comp) => {
  comp.setState({ treeData });
};

class HomePage extends Component {
  componentDidMount() {
    StrapiHelper.request("/folders/tree").then((res) => {
      const foldersTree = res.map((item) => {
        return mapFolderTreeItem(item);
      });
      this.setState({
        treeData: foldersTree,
      });
    });
  }
  state = {
    treeData: [],
  };
  render() {
    const treeData = this.state.treeData;
    return (
      <StrapiHelper.ContainerFluid>
        <StrapiHelper.PluginHeader
          title={"Tree viewer"}
          description={
            "Drag and drop nodes to sort and move bookmarks / folders"
          }
        />
        <div className="row">
          <Block
            title="General"
            description="Let's drag and drop"
            style={{ marginBottom: 12, height: 700 }}
          >
            <SortableTree
              treeData={treeData}
              onChange={(treeData) => changeTree(treeData, this)}
            />
          </Block>
        </div>
      </StrapiHelper.ContainerFluid>
    );
  }
}

export default memo(HomePage);
