import url from 'url';
const fetch = require('node-fetch');
const debug = require('debug')('data');

export async function getDataResources(user, path, {sortField="", sortDir="", limit=500, offset=0}) {
  let datainfo = new URL(process.env.DATA_INFO || "http://data-info");

  const zone = process.env.DATA_INFO_ZONE || "iplant";
  const fixedPath = (path.startsWith("/")) ? path.slice(1) : path;

  datainfo.pathname = `/data/path/${zone}/${fixedPath}`;
  datainfo.searchParams.set('limit', limit);
  datainfo.searchParams.set('offset', offset);
  datainfo.searchParams.set('user', user);

  if (sortField !== "") {
    datainfo.searchParams.set('sort-field') = sortField;

    if (sortDir === "") {
      datainfo.searchParams.set('sort-dir', 'ASC');
    } else {
      datainfo.searchParams.set('sort-dir', sortDir);
    }
  }
  
  return fetch(datainfo.toString());
}
