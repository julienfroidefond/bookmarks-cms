"use strict";

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async tree(ctx) {
    let entities = await strapi.services.folders.find();
    entities = entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.folders })
    );
    let tree = [];
    for (const i in entities) {
      const entity = entities[i];
      tree[entity.id] = entity;
    }
    for (const i in entities) {
      const entity = entities[i];
      const { parent } = entity;
      if (parent) {
        if (!tree[parent.id].children) tree[parent.id].children = [];
        tree[parent.id].children.push(entity);
      }
    }
    let result = [];
    for (const i in tree) {
      const branch = tree[i];
      if (!branch.parent) result.push(branch);
    }
    return result;
  },
};
