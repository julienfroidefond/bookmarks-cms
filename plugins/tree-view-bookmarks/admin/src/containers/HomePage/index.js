/*
 *
 * HomePage
 *
 */
import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import * as StrapiHelper from "strapi-helper-plugin";

import React, { memo, Component } from "react";

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
      url: `/admin/plugins/content-manager/collectionType/application::bookmarks.bookmarks/${bookmark.id}`,
      type: "bookmark",
    }));
    children.push(...bookmarksTree);
  }
  return {
    title,
    children,
    url: `/admin/plugins/content-manager/collectionType/application::folders.folders/${id}`,
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
    })
      .then((resp) => {
        strapi.notification.success("tree-view-bookmarks.notification.success");
      })
      .catch((e) => {
        strapi.notification.error("tree-view-bookmarks.notification.error");
      });
  } else if (e.node.type === "folder") {
    StrapiHelper.request("/folders/" + e.node.id, {
      method: "PUT",
      body: {
        parent: e.nextParentNode.id,
      },
    })
      .then((resp) => {
        strapi.notification.success("tree-view-bookmarks.notification.success");
      })
      .catch((e) => {
        strapi.notification.error("tree-view-bookmarks.notification.error");
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
            <button
              onClick={() => {
                console.log(treeData);
                const res = toggleExpandedForAll(treeData);
                console.log(res);
              }}
            >
              Expand
            </button>
            <SortableTree
              treeData={treeData}
              onChange={(treeData) => changeTree(treeData, this)}
              canDrop={(tree) =>
                !(tree.nextParent && tree.nextParent.type === "bookmark")
              }
              onMoveNode={onMoveNode}
              generateNodeProps={({ node }) => ({
                buttons: [
                  <button
                    onClick={() => {
                      window.location.href = node.url;
                    }}
                  >
                    Go to link
                  </button>,
                ],
              })}
            />
          </Block>
        </div>
      </StrapiHelper.ContainerFluid>
    );
  }
}

export default memo(HomePage);
