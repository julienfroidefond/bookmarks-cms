"use strict";

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async tree(ctx) {
    let foldersEntities = await strapi.services.folders.find();

    foldersEntities = foldersEntities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.folders })
    );

    const { tag_id_in, no_empty_folders } = ctx.query;
    const bookmarksFilteredIds = new Set();
    if (tag_id_in) {
      const tags = tag_id_in.split(",");
      let tagsEntities = await strapi.services.tags.find({ id_in: tags });
      tagsEntities = tagsEntities.map((entity) =>
        sanitizeEntity(entity, { model: strapi.models.tags })
      );
      tagsEntities.forEach((tagEntity) => {
        tagEntity.bookmarks.forEach((bookmark) => {
          bookmarksFilteredIds.add(bookmark.id);
        });
      });
    }
    foldersEntities = foldersEntities.map((entity) => {
      entity.bookmarks = entity.bookmarks.filter(
        (bookmark) => !bookmarksFilteredIds.has(bookmark.id)
      );
      return entity;
    });

    let tree = [];
    foldersEntities.forEach((entity) => {
      entity.children = [];
      tree[entity.id] = entity;
    });
    foldersEntities.forEach((entity) => {
      const { parent } = entity;
      if (
        parent &&
        ((no_empty_folders && entity.bookmarks.length > 0) || !no_empty_folders)
      ) {
        tree[parent.id].children.push(entity);
      }
    });

    //Orphans : SELECT * from bookmarks left join bookmarks_folders__folders_bookmarks as folder on folder.bookmark_id = bookmarks.id where folder_id IS NULL
    const knex = strapi.connections.default;
    let orphans = await knex("bookmarks")
      .leftJoin(
        "bookmarks_folders__folders_bookmarks",
        "bookmarks_folders__folders_bookmarks.bookmark_id",
        "bookmarks.id"
      )
      .whereNull("bookmarks_folders__folders_bookmarks.folder_id")
      .select("*");

    let result = [];
    tree.forEach((entity) => {
      if (!entity.parent) result.push(entity);
    });
    result.push(...orphans);
    return result;
  },
};
