# Bookmarks Strapi

The goal of this project is a self hosted server for bookmarks sharing. You can share with your teams or family a collection of bookmarks.

This Strapi application provides an API and backoffice for handling your bookmarks. Users needs a client to consume this API (cf Clients).

Models :

- Bookmarks : a title and an url. Can affect to several tags. The bookmark data.
- Tags : a title. Can be affected to a unique category. Tags are categorization of bookmarks
- Tag categories : a title. Categories are a group of tags.

## Testing on Heroku

Demo site : https://bookmarks-cms.herokuapp.com/

- Login : testuser@gmail.com
- Password : wtrePgDQXy3smZ

## Clients

- chrome extension : https://chrome.google.com/webstore/detail/strapi-bookmarks/oobifkfbojcheinmoejdhgllgennkjpe?hl=fr
- Confluence : todo
- Firefox extension : todo
- ...
