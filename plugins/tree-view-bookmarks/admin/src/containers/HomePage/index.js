/*
 *
 * HomePage
 *
 */
import React, { memo, Component } from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import * as StrapiHelper from "strapi-helper-plugin";

import { Action } from "./component";
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

const notif = (type) => {
  if (type === "success") {
    strapi.notification.toggle({
      type: "success",
      message: {
        id: "tree-view-bookmarks.notification.success",
        defaultMessage: "Saved!",
      },
    });
  } else {
    strapi.notification.toggle({
      type: "warning",
      message: {
        id: "tree-view-bookmarks.notification.error",
        defaultMessage: "Error!",
      },
    });
  }
};

const onMoveNode = (e) => {
  // console.log(e);
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
        notif("success");
      })
      .catch((e) => {
        notif("error");
      });
  } else if (e.node.type === "folder") {
    StrapiHelper.request("/folders/" + e.node.id, {
      method: "PUT",
      body: {
        parent: e.nextParentNode.id,
      },
    })
      .then((resp) => {
        notif("success");
      })
      .catch((e) => {
        notif("error");
      });
  }
};

const getButtons = (node, comp) => {
  let buttons = [
    <Action
      onClick={() => {
        window.location.href = node.url;
      }}
    >
      ✏️
      <br />
      Edit
    </Action>,
    <Action
      onClick={() => {
        const path = node.type === "folder" ? "/folders" : "/bookmarks";
        StrapiHelper.request(`${path}/${node.id}`, {
          method: "DELETE",
        })
          .then(async (resp) => {
            notif("success");
            comp.refreshAllData();
          })
          .catch((e) => {
            notif("error");
          });
      }}
    >
      ❌<br />
      Remove
    </Action>,
  ];
  if (node.type === "folder") {
    buttons.push(
      <Action
        onClick={() => {
          const title = window.prompt("Name of the link?");
          if (!title) return;
          const url = window.prompt("Url of the link?");
          if (title && title !== "" && url && url != "") {
            StrapiHelper.request("/bookmarks", {
              method: "POST",
              body: {
                title,
                url,
                folders: [node.id],
              },
            })
              .then(async (resp) => {
                notif("success");
                comp.refreshAllData();
              })
              .catch((e) => {
                notif("error");
              });
          }
        }}
      >
        📌
        <br />
        New
      </Action>
    );
    buttons.push(
      <Action
        onClick={() => {
          const name = window.prompt("Name of the folder?");
          if (name && name !== "") {
            StrapiHelper.request("/folders", {
              method: "POST",
              body: {
                name,
                parent: [node.id],
              },
            })
              .then(async (resp) => {
                notif("success");
                comp.refreshAllData();
              })
              .catch((e) => {
                notif("error");
              });
          }
        }}
      >
        🗂
        <br />
        New
      </Action>
    );
  }
  return buttons;
};

class HomePage extends Component {
  refreshAllData() {
    StrapiHelper.request("/folders/tree").then((res) => {
      const foldersTree = res.map((item) => {
        return mapFolderTreeItem(item);
      });
      this.setState({
        treeData: foldersTree,
      });
    });
  }
  componentDidMount() {
    this.refreshAllData();
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
              generateNodeProps={({ node }) => ({
                buttons: getButtons(node, this),
              })}
            />
          </Block>
        </div>
      </StrapiHelper.ContainerFluid>
    );
  }
}

export default memo(HomePage);
