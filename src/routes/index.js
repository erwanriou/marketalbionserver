// REQUIRES FONCTION
const requires = (paths) => {
  return Object.entries(paths)?.map((type) => {
    return Object.entries(type?.[1])?.map((folder) =>
      folder?.[1]?.map(
        (path) =>
          require(`../routes/${type?.[0]}/${folder?.[0]}/${path}/${path}`) ??
          [],
      ),
    );
  });
};

const paths = {
  public: {
    item: ["filters", "list"],
  },
};

// APPLY REQUIRES
const routes = requires(paths).flat();
module.exports = routes;
