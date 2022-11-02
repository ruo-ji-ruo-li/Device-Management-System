import request from '@/utils/request'


/*export function getList (params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}*/
export function queryContractList (Data) {
  console.log(Data)
  Data={data:Data}  //给Data一个名字叫做data，方便后端Param解析
  return request({
    url: '/contract/queryContract',
    method: 'get',
    params:Data
  })
}

export function updateContract (Data) {
  return request({
    url: '/contract/updateContract',
    method: 'post',
    data:Data
  })
}

export function deleteContract (Data) {
  // console.log(Data)
  return request({
    url: '/contract/deleteContract',
    method: 'post',
    params: {id:Data}
  })
}





