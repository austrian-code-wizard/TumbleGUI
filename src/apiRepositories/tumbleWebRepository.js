import Repository from "./Repository";

export default {
  get_tumbleweeds() {
    return Repository.get(`/get-tumbleweeds`);
  },
  get_tumbleweed(TumbleweedId) {
    return Repository.get(`/get-tumbleweed/${TumbleweedId}`);
  },
  get_tumbleweed_by_address(address) {
    return Repository.get(`/get-tumbleweed-by-address/${address}`);
  },
  add_tumbleweed(payload) {
    return Repository.post(`/add-tumbleweed`, payload);
  },
  update_tumbleweed(id, payload) {
    return Repository.patch(`/update-tumbleweed/${id}`, payload);
  },
  delete_tumbleweed(id) {
    return Repository.delete(`/delete-tumbleweed/${id}`);
  },
  get_tumblebases() {
    return Repository.get(`/get-tumblebases`);
  },
  delete_tumblebase(id) {
    return Repository.delete(`/delete-tumblebase/${id}`)
  },
  add_tumblebase(payload) {
    return Repository.post(`/add-tumblebase`, payload)
  },
  get_tumblebase(id) {
    return Repository.get(`/get-tumblebase/${id}`)
  },
  update_tumblebase(id, payload) {
    return Repository.patch(`/update-tumblebase/${id}`, payload)
  },
  get_commandTypes() {
    return Repository.get(`/get-commandTypes`);
  },
  get_subsystems_by_tumbleweed_id(id) {
    return Repository.get(`/get-subSystems-by-tumbleweed-id/${id}`);
  },
  add_subsystem(id, payload) {
    return Repository.post(`/add-subSystem/${id}`, payload)
  },
  get_subsystem(id) {
    return Repository.get(`/get-subSystem/${id}`);
  },
  delete_subsystem(id) {
    return Repository.delete(`/delete-subSystem/${id}`);
  },
  update_subsystem(id, payload) {
    return Repository.patch(`/update-subSystem/${id}`, payload)
  },
  get_datasources_by_subsystem_id(id) {
    return Repository.get(`get-dataSources-by-subSystem-id/${id}`);
  },
  add_datasource(id, payload) {
    return Repository.post(`add-dataSource/${id}`, payload)
  },
  get_datasource(id) {
    return Repository.get(`get-dataSource/${id}`)
  },
  delete_datasource(id) {
    return Repository.delete(`/delete-dataSource/${id}`)
  },
  update_datasource(id, payload) {
    return Repository.patch(`/update-dataSource/${id}`, payload)
  }
};