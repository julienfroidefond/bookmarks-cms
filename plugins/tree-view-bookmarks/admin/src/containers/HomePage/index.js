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
  const title = "🗂 " + item.name;
  const id = item.id;
  let children = [];
  if (item.children) children = item.children.map(mapFolderTreeItem);
  if (item.bookmarks && item.bookmarks.length > 0) {
    const bookmarksTree = item.bookmarks.map((bookmark) => ({
      title: "📌 " + bookmark.title,
      id: bookmark.id,
      type: "bookmark",
    }));
    children.push(...bookmarksTree);
  }
  return {
    title,
    children,
    type: "folder",
    id,
  };
};

const changeTree = (treeData, comp) => {
  comp.setState({ treeData });
};

const onMoveNode = (e) => {
  console.log(e);
  console.log(
    `${e.node.type} with id : ${e.node.id} (${e.node.title}) is moving to folder with id : ${e.nextParentNode.id} (${e.nextParentNode.title})`
  );
  if (e.node.id < 0) return;
  if (e.node.type === "bookmark") {
    StrapiHelper.request("/bookmarks/" + e.node.id, {
      method: "PUT",
      body: {
        folders: [e.nextParentNode.id],
      },
    }).then((response) => {
      console.log(response);
    });
  } else if (e.node.type === "folder") {
    StrapiHelper.request("/folders/" + e.node.id, {
      method: "PUT",
      body: {
        parent: e.nextParentNode.id,
      },
    }).then((response) => {
      console.log(response);
    });
  }
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
              canDrop={(tree) =>
                !(tree.nextParent && tree.nextParent.type === "bookmark")
              }
              onMoveNode={onMoveNode}
            />
          </Block>
        </div>
      </StrapiHelper.ContainerFluid>
    );
  }
}

export default memo(HomePage);