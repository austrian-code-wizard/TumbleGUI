import tumbleWebRepository from "./tumbleWebRepository";

const repositories = {
  tumbleWeb: tumbleWebRepository,
  // other repositories ...
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
